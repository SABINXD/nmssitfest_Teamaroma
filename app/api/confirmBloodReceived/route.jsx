
import { connectDB } from "@/config/dbConnect";
import Notification from "@/models/Notification";
import Donor from "@/models/Donor";
import mongoose from "mongoose";
import DonationHistory from "@/models/DonationHistory";

export async function PATCH(req) {
    await connectDB();

    try {
        let { notificationId, notificationSenderId, notificationReceiverId, bloodGroupDonated } = await req.json();
        notificationReceiverId = notificationReceiverId._id;
        console.log(notificationId, notificationSenderId, notificationReceiverId, bloodGroupDonated, 'X');

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(notificationId) ||
            !mongoose.Types.ObjectId.isValid(notificationSenderId) ||
            !mongoose.Types.ObjectId.isValid(notificationReceiverId)
        ) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid ID(s)" }),
                { status: 400 }
            );
        }

        // Delete the notification
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        if (!deletedNotification) {
            return new Response(
                JSON.stringify({ success: false, error: "Notification not found" }),
                { status: 404 }
            );
        }

        // Increment donation count of the helper/donor
        const updatedDonor = await Donor.findByIdAndUpdate(
            notificationReceiverId, // donor who helped
            { $inc: { donationCount: 1 } },
            { new: true }
        );

        // Create Donation History entry
        const donationRecord = await DonationHistory.create({
            donorId: notificationReceiverId, // the one who donated
            BloodReceiverId: notificationSenderId, // the receiver
            bloodGroupDonated
        });

        return new Response(
            JSON.stringify({ success: true, donor: updatedDonor, donationHistory: donationRecord }),
            { status: 200 }
        );

    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 }
        );
    }
}
