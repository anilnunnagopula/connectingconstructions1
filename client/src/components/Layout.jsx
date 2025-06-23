import React from "react";
// import Navbar from "./Navbar"; these are updated globally so not using here
// import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-grow bg-gray-50">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
