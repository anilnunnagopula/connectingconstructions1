# 🏗️ Construction Materials Product Management Guide

## Product Schema Enhancements

### New Fields Added for Construction Materials:

#### 1. **Brand** (e.g., UltraTech, ACC, Tata Steel, JSW)
- Required for branded materials like cement, steel
- Optional for generic materials like sand, aggregate

#### 2. **Grade/Quality** (e.g., Fe415, Fe500, OPC 43, OPC 53, M-Sand)
- Critical for cement (OPC, PPC, PSC), steel (Fe415, Fe500, Fe550)
- Sand types (M-Sand, P-Sand, River Sand)
- Aggregate grades (20mm, 10mm, etc.)

#### 3. **Packaging** (e.g., 25kg bag, 50kg bag, loose, bundled)
- How the material is sold
- Examples: "50kg bag", "Loose (per tonne)", "6m bars bundled"

#### 4. **Technical Specifications** (Map/Object)
```javascript
specifications: {
  "Compressive Strength": "43 MPa",
  "Fineness": "300 m²/kg",
  "Setting Time": "30 minutes",
  "Specific Gravity": "3.15"
}
```

#### 5. **Bulk Pricing Tiers**
```javascript
bulkPricing: [
  { minQuantity: 1, maxQuantity: 10, pricePerUnit: 400 },    // ₹400/bag for 1-10 bags
  { minQuantity: 11, maxQuantity: 50, pricePerUnit: 380 },   // ₹380/bag for 11-50 bags
  { minQuantity: 51, pricePerUnit: 360 }                      // ₹360/bag for 51+ bags
]
```

#### 6. **Product Variants** (Size, Color, Finish, Thickness)
```javascript
variants: [
  {
    name: "Weight",
    options: [
      { value: "25kg", priceAdjustment: 0, stockQuantity: 100, sku: "CEM-25" },
      { value: "50kg", priceAdjustment: 50, stockQuantity: 200, sku: "CEM-50" }
    ]
  }
]
```

#### 7. **Certifications**
- ISI Marked
- BIS Certified
- ISO 9001:2015
- ASTM Standards

#### 8. **Other Fields**
- `manufacturingDate`: Date
- `batchNumber`: String
- `warranty`: String (e.g., "1 year", "6 months")
- `countryOfOrigin`: String (default: "India")
- `hsnCode`: String (for GST)
- `gstRate`: Number (default: 18%)

---

## Real-World Examples

### Example 1: Cement (UltraTech OPC 43 Grade)

```javascript
{
  name: "UltraTech OPC 43 Grade Cement",
  category: "Cement",
  productType: "material",
  unit: "bags",
  brand: "UltraTech",
  grade: "OPC 43",
  packaging: "50kg bag",
  price: 400,
  minOrderQuantity: 10,
  stepSize: 10,

  specifications: {
    "Compressive Strength": "43 MPa (28 days)",
    "Fineness": "≥ 225 m²/kg",
    "Setting Time (Initial)": "≥ 30 minutes",
    "Setting Time (Final)": "≤ 600 minutes",
    "Specific Gravity": "3.15"
  },

  bulkPricing: [
    { minQuantity: 10, maxQuantity: 50, pricePerUnit: 400 },
    { minQuantity: 51, maxQuantity: 100, pricePerUnit: 390 },
    { minQuantity: 101, pricePerUnit: 380 }
  ],

  variants: [
    {
      name: "Packaging",
      options: [
        { value: "25kg bag", priceAdjustment: -50, stockQuantity: 50 },
        { value: "50kg bag", priceAdjustment: 0, stockQuantity: 500 }
      ]
    }
  ],

  certifications: ["ISI Marked", "BIS Certified", "ISO 9001:2015"],
  hsnCode: "2523",
  gstRate: 28,
  warranty: "No warranty (consumable)",
  countryOfOrigin: "India"
}
```

### Example 2: TMT Steel Bars (Tata Tiscon Fe500D)

```javascript
{
  name: "Tata Tiscon TMT Fe500D Steel Bars",
  category: "Steel & TMT",
  productType: "material",
  unit: "tonnes",
  brand: "Tata Tiscon",
  grade: "Fe500D",
  packaging: "6m bars bundled",
  price: 65000,
  minOrderQuantity: 1,
  stepSize: 0.5,

  specifications: {
    "Yield Strength": "500 MPa minimum",
    "Tensile Strength": "565 MPa minimum",
    "Elongation": "14.5% minimum",
    "Bend Test": "180° bend (without cracks)",
    "Rebend Test": "135° (without cracks)"
  },

  bulkPricing: [
    { minQuantity: 1, maxQuantity: 5, pricePerUnit: 65000 },
    { minQuantity: 5.5, maxQuantity: 10, pricePerUnit: 64000 },
    { minQuantity: 10.5, pricePerUnit: 63000 }
  ],

  variants: [
    {
      name: "Diameter",
      options: [
        { value: "8mm", priceAdjustment: 0, stockQuantity: 10 },
        { value: "10mm", priceAdjustment: 500, stockQuantity: 15 },
        { value: "12mm", priceAdjustment: 1000, stockQuantity: 20 },
        { value: "16mm", priceAdjustment: 2000, stockQuantity: 12 },
        { value: "20mm", priceAdjustment: 3000, stockQuantity: 8 }
      ]
    }
  ],

  certifications: ["BIS IS 1786:2008", "CRS Certified"],
  hsnCode: "7214",
  gstRate: 18,
  warranty: "No warranty",
  countryOfOrigin: "India"
}
```

### Example 3: M-Sand (Manufactured Sand)

```javascript
{
  name: "Premium M-Sand (Manufactured Sand)",
  category: "Sand & Aggregates",
  productType: "material",
  unit: "tonnes",
  grade: "M-Sand",
  packaging: "Loose (bulk)",
  price: 1500,
  minOrderQuantity: 1,
  stepSize: 0.5,

  specifications: {
    "Particle Size": "0-4.75mm",
    "Silt Content": "< 3%",
    "Water Absorption": "< 2%",
    "Bulk Density": "1.75 g/cm³",
    "Fineness Modulus": "2.5-3.0"
  },

  bulkPricing: [
    { minQuantity: 1, maxQuantity: 10, pricePerUnit: 1500 },
    { minQuantity: 10.5, maxQuantity: 50, pricePerUnit: 1450 },
    { minQuantity: 50.5, pricePerUnit: 1400 }
  ],

  certifications: ["BIS Certified", "Eco-Friendly"],
  hsnCode: "2505",
  gstRate: 5,
  warranty: "No warranty",
  countryOfOrigin: "India"
}
```

### Example 4: Vitrified Floor Tiles

```javascript
{
  name: "Kajaria Premium Vitrified Floor Tiles",
  category: "Tiles & Flooring",
  productType: "product",
  unit: "sq_ft",
  brand: "Kajaria",
  packaging: "Box of 4 tiles (8 sq ft)",
  price: 80,
  minOrderQuantity: 100,
  stepSize: 8,

  specifications: {
    "Size": "2ft x 2ft (600x600mm)",
    "Thickness": "8mm",
    "Water Absorption": "< 0.5%",
    "Surface": "Polished Glazed Vitrified",
    "Breakage Strength": "≥ 1300 N"
  },

  bulkPricing: [
    { minQuantity: 100, maxQuantity: 500, pricePerUnit: 80 },
    { minQuantity: 501, maxQuantity: 1000, pricePerUnit: 75 },
    { minQuantity: 1001, pricePerUnit: 70 }
  ],

  variants: [
    {
      name: "Color/Design",
      options: [
        { value: "Marble White", priceAdjustment: 0, stockQuantity: 500 },
        { value: "Granite Grey", priceAdjustment: 5, stockQuantity: 300 },
        { value: "Wooden Brown", priceAdjustment: 10, stockQuantity: 200 }
      ]
    },
    {
      name: "Finish",
      options: [
        { value: "Glossy", priceAdjustment: 0, stockQuantity: 600 },
        { value: "Matte", priceAdjustment: 5, stockQuantity: 400 }
      ]
    }
  ],

  certifications: ["ISO 9001", "ISI Marked"],
  hsnCode: "6907",
  gstRate: 28,
  warranty: "10 years (manufacturing defects)",
  countryOfOrigin: "India"
}
```

---

## UI/UX Improvements Needed

### AddProduct Form Sections:

1. **Basic Information**
   - Name, Category, Description
   - Product Type (Material/Service/Product)

2. **Pricing & Inventory**
   - Base Price
   - Unit of Measurement
   - Current Stock Quantity
   - Min Order Quantity, Step Size
   - **Bulk Pricing Builder** (add tiers)

3. **Brand & Quality**
   - Brand Name
   - Grade/Quality
   - Packaging Type

4. **Technical Specifications**
   - **Specifications Builder** (key-value pairs)
   - Dynamic add/remove fields

5. **Product Variants** (if applicable)
   - **Variants Builder** (size, color, finish, etc.)
   - Each variant option has: value, price adjustment, stock, SKU

6. **Certifications & Compliance**
   - Certifications (multi-select)
   - Manufacturing Date, Batch Number
   - Warranty Details
   - HSN Code, GST Rate
   - Country of Origin

7. **Images & Location** (existing)
   - Multiple images upload
   - Location picker

---

## Benefits of This Enhancement:

✅ **IndiaMART-style product management**
✅ **Supports all construction material types**
✅ **Bulk/wholesale pricing built-in**
✅ **Product variants for different sizes/grades**
✅ **Technical specs for engineering materials**
✅ **GST-compliant with HSN codes**
✅ **Professional supplier catalog**

---

This makes ConnectingConstructions a **true B2B construction marketplace** like IndiaMART! 🚀
