import React from "react";

const Profile = () => {
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail"); // you'll store this during login soon

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <p><strong>Email:</strong> {email || "Not available"}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
};

export default Profile;
