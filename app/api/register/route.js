
import { connectDB } from "@/config/dbConnect";
import Donor from "@/models/Donor";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    console.log(body);

    const hash = await bcrypt.hash(body.password, 10);
    body.password = hash;


    try {

        let emailFinder = await Donor.findOne({ email: body.email });
        if (emailFinder) {
            return Response.json({ success: false, error: "Email already registered" },
                { status: 400 });
        }

        let contactFinder = await Donor.findOne({ contact: body.contact });
        if (contactFinder) {
            return Response.json({ success: false, error: "Contact number already registered" },
                { status: 400 });
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT secret not defined");
        }


        const donor = new Donor(body);
        await donor.save();
        var token = jwt.sign({ id: donor._id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return Response.json({ success: true, donor });
    } catch (error) {
        return Response.json({ success: false, error: error.message },
            { status: 400 });
    }
}
