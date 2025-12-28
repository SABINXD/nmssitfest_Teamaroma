
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Donor from "@/models/Donor";
import { connectDB } from "@/config/dbConnect";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);

    const user = await Donor.findById(payload.id).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        contact: user.contact,
        isAdmin: user.isAdmin,
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
