
import { connectDB } from "@/config/dbConnect";
import Notification from "@/models/Notification";
import mongoose from "mongoose";
import Donor from "@/models/Donor";
import nodemailer from "nodemailer"

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const {
            notificationSenderId,
            notificationReceiverId,
            bloodRequire,
            userId,
            isNotificationReceiveCase,
        } = body;

        // --- FETCH NOTIFICATIONS CASE ---
        if (isNotificationReceiveCase) {
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return new Response(
                    JSON.stringify({ success: false, error: "Invalid userId" }),
                    { status: 400 }
                );
            }

            const notifications = await Notification.find({
                notificationReceiverId: userId,
                helperConfirmed: false, // Blood requests waiting for helper
            })
                .populate("notificationSenderId", "name bloodgroup email contact")
                .sort({ createdAt: -1 });

            const confirmNotifications = await Notification.find({
                notificationSenderId: userId,
                helperConfirmed: true, // Already helped, waiting for receiver confirmation
                receiverConfirmed: false,
            })
                .populate("notificationSenderId", "name bloodgroup email contact")
                .populate("notificationReceiverId", "name bloodgroup email contact")
                .sort({ createdAt: -1 });

            return new Response(
                JSON.stringify({ success: true, notifications, confirmNotifications }),
                { status: 200 }
            );
        }


        // --- SEND NOTIFICATION CASE ---
        // Validate required fields
        if (!notificationSenderId || !notificationReceiverId || !bloodRequire) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields" }),
                { status: 400 }
            );
        }



        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(notificationSenderId) ||
            !mongoose.Types.ObjectId.isValid(notificationReceiverId)
        ) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid sender or receiver ID" }),
                { status: 400 }
            );
        }

        // Prevent sending notification to self
        if (notificationSenderId === notificationReceiverId) {
            return new Response(
                JSON.stringify({ success: false, error: "Cannot send notification to yourself" }),
                { status: 400 }
            );
        }

        // --- Check for existing notification ---
        const existingNotification = await Notification.findOne({
            notificationSenderId,
            notificationReceiverId,
            bloodGroupRequire: bloodRequire.toUpperCase(),
        });

        if (existingNotification) {
            return new Response(
                JSON.stringify({ success: false, error: "Notification already sent!" }),
                { status: 400 }
            );
        }

        // Create notification
        const newNotification = await Notification.create({
            notificationSenderId,
            notificationReceiverId,
            bloodGroupRequire: bloodRequire.toUpperCase(),
        });

        const sender = await Donor.findById(notificationSenderId).select("name email contact");
        const receiver = await Donor.findById(notificationReceiverId).select("name email contact");

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Emergency Blood Case" <${process.env.EMAIL_USER}>`,
            to: receiver.email,
            subject: "📩 Emergency Blood Case",
            html: `
        <div style="
          font-family: Arial, sans-serif;
          border: 2px solid #4f46e5;
          border-radius: 12px;
          padding: 20px;
          background-color: #f3f4f6;
          color: #111827;
          max-width: 600px;
        ">
          <p><strong>From:</strong> ${sender.name} (${sender.email}) ${sender.contact}</p>
          <p><strong>Blood Group Required:</strong> ${bloodRequire.toUpperCase()}</p>
          <p>Please contact the sender if you can help!</p>
        </div>
    `,
        });


        return new Response(
            JSON.stringify({ success: true, notification: newNotification }),
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { notificationId } = await req.json();
        const notification = await Notification.findById(notificationId);
        console.log(notification);


        if (!notification) return new Response(JSON.stringify({ success: false, error: "Notification not found" }), { status: 404 });

        // Update helper confirmation
        notification.helperConfirmed = true;
        await notification.save();

        return new Response(JSON.stringify({ success: true, notification }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
