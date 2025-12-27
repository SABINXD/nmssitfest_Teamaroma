
import { connectDB } from "@/config/dbConnect";
import Donor from "@/models/Donor";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();
 
  const body = await req.json();
  const {
    isAllUsers,
    province,
    district, 
    bloodGroup,
    onlyBloodFind, 
    userId,
  } = body;

  // FETCH MULTIPLE USERS
  console.log(isAllUsers,
    province,
    district,
    bloodGroup,
    userId, "x");


  if (isAllUsers) {
    try {
      const query = {};

      // Blood group filter (always allowed) 
      if (bloodGroup) {
        query.bloodgroup = bloodGroup.toUpperCase();
      }

      // Apply location filters ONLY if not fallback search
      if (!onlyBloodFind) {
        if (province) query.province = province;
        if (district) query.district = district;
      }

      // Exclude current user if provided
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        query._id = { $ne: userId };
      }

      const donors = await Donor.find(query).select("-password");
      console.log(donors, "x"); 
      

      return NextResponse.json({ success: true, donors });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }

  // FETCH SINGLE USER

  const safeUserId =
    typeof body.userId === "object" ? body.userId.id : body.userId;

  if (!safeUserId || !mongoose.Types.ObjectId.isValid(safeUserId)) {
    return NextResponse.json(
      { success: false, error: "Invalid userId" },
      { status: 400 }
    );
  }

  try {
    const donor = await Donor.findById(safeUserId).select("-password");

    if (!donor) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, detail: donor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
