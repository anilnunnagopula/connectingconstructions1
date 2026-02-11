import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { toast } from "react-hot-toast";
import { MapPin, Navigation, Phone, Mail, Store } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { getNearbySuppliers } from "../../services/customerApiService";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "1rem",
};

const defaultCenter = {
  lat: 17.385, // Hyderabad default
  lng: 78.4867,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

const NearbySuppliers = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(50); // km

  const fetchSuppliers = useCallback(async (lat, lng) => {
    try {
      setLoading(true);
      const response = await getNearbySuppliers(lat, lng, radius);
      if (response.success) {
        setSuppliers(response.data);
        if (response.data.length === 0) {
            toast("No suppliers found nearby", { icon: "🗺️" });
        }
      } else {
        toast.error("Failed to fetch nearby suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error loading suppliers");
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    // Get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setCenter(pos);
          setUserLocation(pos);
          fetchSuppliers(latitude, longitude);
        },
        () => {
          toast.error("Could not get your location. Using default.");
          fetchSuppliers(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      fetchSuppliers(defaultCenter.lat, defaultCenter.lng);
    }
  }, [fetchSuppliers]);

  const handleMarkerClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <MapPin className="text-blue-600" size={32} />
              Nearby Suppliers
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find construction material suppliers near you.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Radius:</span>
             <select 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-blue-600 cursor-pointer"
             >
                 <option value={10}>10 km</option>
                 <option value={25}>25 km</option>
                 <option value={50}>50 km</option>
                 <option value={100}>100 km</option>
             </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 border border-gray-100 dark:border-gray-700 relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={mapOptions}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
                title="Your Location"
              />
            )}

            {/* Supplier Markers */}
            {suppliers.map((loc) => (
              <Marker
                key={loc._id}
                position={{ lat: loc.lat, lng: loc.lng }}
                onClick={() => handleMarkerClick(loc)}
                title={loc.name}
              />
            ))}

            {/* Info Window */}
            {selectedSupplier && (
              <InfoWindow
                position={{ lat: selectedSupplier.lat, lng: selectedSupplier.lng }}
                onCloseClick={() => setSelectedSupplier(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                    <Store size={18} className="text-blue-600"/>
                    {selectedSupplier.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 truncate max-w-[250px]">{selectedSupplier.address}</p>
                  
                  {selectedSupplier.supplier && (
                    <div className="space-y-1 mt-2 border-t pt-2">
                         <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail size={14} className="text-gray-400"/>
                            {selectedSupplier.supplier.email}
                         </div>
                         <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400"/>
                            {selectedSupplier.supplier.phoneNumber || "N/A"}
                         </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button 
                        className="flex-1 bg-blue-600 text-white text-xs py-1.5 px-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-1 transition-colors"
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedSupplier.lat},${selectedSupplier.lng}`, '_blank')}
                    >
                        <Navigation size={12} />
                        Directions
                    </button>
                     {/* Add Chat/View Profile buttons here later */}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
           
           {/* Overlay Loader */}
           {loading && (
             <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="font-semibold text-gray-800 dark:text-white">Scanning...</span>
                </div>
             </div>
           )}
        </div>

        {/* List View Below (Optional) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map(loc => (
                <div key={loc._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                    setCenter({ lat: loc.lat, lng: loc.lng });
                    setSelectedSupplier(loc);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{loc.name}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{loc.distance} km</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{loc.address}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        View on Map <Navigation size={14}/>
                    </button>
                </div>
            ))}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default NearbySuppliers;
