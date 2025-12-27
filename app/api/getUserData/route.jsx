
import { connectDB } from "@/config/dbConnect";
import Donor from "@/models/Donor";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { isAllUsers, province, district, bloodGroup } = body;

  if (isAllUsers) {
    try {
      const query = {};
      if (province) query.province = province;
      if (district) query.district = district;
      if (bloodGroup) query.bloodgroup = bloodGroup;

      const donors = await Donor.find(query).select("-password");
      return NextResponse.json({ success: true, donors });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } else {
    const userId = typeof body.userId === "object" ? body.userId.id : body.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Invalid userId" }, { status: 400 });
    }

    try {
      const donor = await Donor.findById(userId).select("-password");
      if (!donor) {
        return NextResponse.json({ success: false, error: "Donor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, detail: donor });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}
