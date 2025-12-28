
import mongoose from "mongoose";

const donationHistory = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },
        BloodReceiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },
        bloodGroupDonated: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"]
        },
    },
    { timestamps: true }
);

const DonationHistory = mongoose.models.DonationHistory || mongoose.model("DonationHistory", donationHistory);

export default DonationHistory;
