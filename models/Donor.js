
// models/Donor.js
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        bloodgroup: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // restrict to valid blood groups
        },
        contact: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/, // must be 10 digits
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // basic validation
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/, // simple email regex
        },
        birthYear: {
            type: Number,
            required: true,
            min: new Date().getFullYear() - 100,
            max: new Date().getFullYear(),
        },
        province: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: String,
            required: true,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        donationCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

export default Donor;
