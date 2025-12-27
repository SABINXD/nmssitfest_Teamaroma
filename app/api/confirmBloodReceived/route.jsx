
import { connectDB } from "@/config/dbConnect";
import Notification from "@/models/Notification";
import Donor from "@/models/Donor";
import mongoose from "mongoose";

export async function PATCH(req) {
    await connectDB();

    try {
        const { notificationId, notificationSenderId, notificationReceiverId } = await req.json();

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(notificationId) || !mongoose.Types.ObjectId.isValid(notificationSenderId)) {
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
            notificationReceiverId,
            { $inc: { donationCount: 1 } },
            { new: true }
        );

        return new Response(
            JSON.stringify({ success: true, donor: updatedDonor }),
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
