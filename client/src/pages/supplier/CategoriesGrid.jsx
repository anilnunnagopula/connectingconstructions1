import React from "react";
import CategoriesGrid from "./CategoriesGrid";

const Home = () => {
  return (
    <div>
      {/* Hero section */}
      <div
        className="w-full h-[90vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/building.jpg)`,
        }}
      >
        {/* ...hero content */}
      </div>

      {/* Categories */}
      <CategoriesGrid />
    </div>
  );
};

export default Home;
