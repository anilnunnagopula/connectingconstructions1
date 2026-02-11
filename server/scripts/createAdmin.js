const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const connectDB = require("../config/db");
const readline = require("readline");

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const createAdmin = async () => {
    try {
        await connectDB();
        
        const email = process.argv[2]; 
        
        if (!email) {
            console.log("Usage: node scripts/createAdmin.js <email>");
            process.exit(1);
        }

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.name}`);
            user.role = "admin";
            await user.save();
            console.log(`✅ Success! User ${user.email} is now an ADMIN.`);
            process.exit();
        } else {
            console.log(`User with email ${email} not found.`);
            console.log("Creating new Admin account...");

            rl.question("Enter Name: ", (name) => {
                rl.question("Enter Username: ", (username) => {
                    rl.question("Enter Password: ", async (password) => {
                        try {
                            const newUser = await User.create({
                                name,
                                username,
                                email,
                                password,
                                role: "admin",
                                isVerified: true,
                                isProfileComplete: true
                            });
                            console.log(`✅ Success! New Admin created: ${newUser.name} (${newUser.email})`);
                            process.exit();
                        } catch (err) {
                            console.error("Error creating user:", err.message);
                            process.exit(1);
                        }
                    });
                });
            });
        }
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createAdmin();
