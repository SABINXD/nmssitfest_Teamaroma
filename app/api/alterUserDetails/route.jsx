
import { connectDB } from "@/config/dbConnect";
import Donor from "@/models/Donor";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
    await connectDB();

    const { userId, formData } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
            { success: false, error: "Invalid userId" },
            { status: 400 }
        );
    }

    try {
        const updatedDonor = await Donor.findByIdAndUpdate(
            userId,
            {
                email: formData.email,
                contact: formData.contact,
                birthYear: formData.birthYear,
                province: formData.province,
                district: formData.district,
                isActive: formData.isActive,
            },
            {
                new: true,          // return updated document
                runValidators: true // apply schema validation
            }
        ).select("-password");

        if (!updatedDonor) {
            return NextResponse.json(
                { success: false, error: "Donor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            detail: updatedDonor,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
