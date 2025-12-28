

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/storeUserId";
import { useRouter } from "next/navigation";
import AllRequireUsers from "@/components/AllRequireUsers";

const provincesWithDistricts = {
    "Koshi Province": [
        "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"
    ],
    "Madhesh Province": [
        "Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"
    ],
    "Bagmati Province": [
        "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"
    ],
    "Gandaki Province": [
        "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"
    ],
    "Lumbini Province": [
        "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Parasi", "Palpa", "Pyuthan", "Rolpa", "Rupandehi", "Rukum East"
    ],
    "Karnali Province": [
        "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum West", "Salyan", "Surkhet"
    ],
    "Sudurpashchim Province": [
        "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"
    ],
};
const bloodTypes = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];


export default function findBlood() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [selectedBloodGroup, setSelectedBloodGroup] = useState(""); // initial empty

    const { allUsers, setAllUsers, openAllRequireUsers, setOpenAllRequireUsers, user } = useAuth();
    console.log(user, 'me');


    const submitForm = async (e) => {
        e.preventDefault();

        if (!province || !district || !selectedBloodGroup) {
            alert("Please select all fields");
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ First attempt: full filters
            let res = await fetch("/api/getUserData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    province,
                    district,
                    bloodGroup: selectedBloodGroup,
                    isAllUsers: true,
                    userId: user?.id
                })

            });

            let data = await res.json();
            console.log(data, "data");


            // 2️⃣ If no users found → fallback to blood-only
            if (data.donors.length === 0) {
                alert('Users from Selected Location not found.');
                const fallbackRes = await fetch("/api/getUserData", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bloodGroup: selectedBloodGroup,
                        isAllUsers: true,
                        onlyBloodFind: true,
                    }),
                });
                const fallbackData = await fallbackRes.json();
                setAllUsers(fallbackData.donors || []);
            } else {
                setAllUsers(data.donors);
            }

            setOpenAllRequireUsers(true);

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    if (openAllRequireUsers) {
        return <AllRequireUsers />
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-800 via-red-700 to-rose-600 px-4">
                <Link
                    href="/"
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white font-semibold shadow-lg hover:bg-white/30 hover:text-red-100 transition"
                >
                    ← Back
                </Link>

                <div className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 border border-red-100">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white text-2xl shadow-lg">
                            🩸
                        </div>
                        <h1 className="text-3xl font-extrabold text-red-700 mt-4">
                            Blood Finder
                        </h1>
                        <p className="text-sm text-[#808080] mt-1">
                            Find the blood type you need, fast.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={submitForm}>

                        {/* Blood Group */}
                        <select
                            name="bloodgroup"
                            value={selectedBloodGroup}
                            onChange={(e) => setSelectedBloodGroup(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                        >
                            <option value="" disabled>Select Blood Group</option>
                            {bloodTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {/* Province */}
                        <select
                            value={province}
                            onChange={(e) => { setProvince(e.target.value); setDistrict(""); }}
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                        >
                            <option value="" disabled>Select Province</option>
                            {Object.keys(provincesWithDistricts).map(prov => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>

                        {/* District */}
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={!province}
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                        >
                            <option value="" disabled>{province ? "Select District" : "Choose Province First"}</option>
                            {province && provincesWithDistricts[province].map(dist => (
                                <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>

                        {/* Submit Button */}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 transition-all duration-300 shadow-lg disabled:opacity-70"
                        >
                            {loading ? "Finding..." : "Let's Find"}
                        </button>

                        <p className="text-center text-sm text-gray-200">
                            Need a different blood type? Contact us for urgent requests.
                        </p>

                    </form>
                </div>
            </div>

        </>
    )
}