
import { connectDB } from "@/config/dbConnect";
import Donor from "@/models/Donor";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    // 1️⃣ Find donor
    const donor = await Donor.findOne({ contact: body.contact });
    if (!donor) {
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    // 2️⃣ Check password
    const decrypt = await bcrypt.compare(body.password, donor.password);
    if (!decrypt) {
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    try {
        // 3️⃣ Create JWT
        const token = jwt.sign({ id: donor._id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

        // 4️⃣ Set cookie
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        // 5️⃣ Return success
        const donorData = donor.toObject();
        console.log(donorData, donor);

        delete donorData.password;

        return Response.json({ success: true, donor: donorData });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 400 });
    }
}
