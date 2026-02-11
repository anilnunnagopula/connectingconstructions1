const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config();

const listUsers = async () => {
    try {
        await connectDB();
        
        console.log("Connected. Fetching users...");
        const users = await User.find({}, "name email role");

        if (users.length === 0) {
            console.log("No users found in database.");
        } else {
            console.log("--- Users List ---");
            users.forEach(user => {
                console.log(`${user.name} | ${user.email} | ${user.role}`);
            });
            console.log("------------------");
        }
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

listUsers();
