
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        notificationSenderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },
        notificationReceiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },
        bloodGroupRequire: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"]
        },
        helperConfirmed: { type: Boolean, default: false }, // Helper clicked "I helped"
        receiverConfirmed: { type: Boolean, default: false }, // Receiver confirms blood received
    },
    { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
