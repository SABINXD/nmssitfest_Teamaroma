

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
                // alert('Users from Selected Location not found.');
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
            <div className="p-6">
                <Link
                    href="/dashboard"
                    className="text-red-600 font-semibold hover:underline"
                >
                    ← Go to Home Page
                </Link>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
                        Blood Finding Form
                    </h1>

                    <form className="space-y-4" onSubmit={submitForm}>

                        <select
                            name="bloodgroup"
                            value={selectedBloodGroup} // controlled value
                            onChange={(e) => setSelectedBloodGroup(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {/* Placeholder */}
                            <option value="" disabled>
                                Select Blood Group
                            </option>

                            {/* Blood group options */}
                            {bloodTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>



                        <select
                            value={province}
                            onChange={(e) => {
                                setProvince(e.target.value);
                                setDistrict(""); // reset district when province changes
                            }}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="" disabled>Select Province</option>
                            {Object.keys(provincesWithDistricts).map((prov) => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>

                        {/* District dropdown */}
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={!province}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="" disabled>
                                {province ? "Select District" : "Choose Province First"}
                            </option>
                            {province &&
                                provincesWithDistricts[province].map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                        </select>


                        <button disabled={loading} type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                            {loading ? "Finding..." : "Let's Find"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}