
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];


export default function RegisterPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bloodgroup, setBloodgroup] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);



  const submitForm = async (e) => {
    e.preventDefault();

    setBloodgroup(bloodgroup.toUpperCase());

    if (!name.trim() || !bloodgroup.trim() || !contact.trim() || !password.trim() || !email.trim() || !province.trim() || !district.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setBirthYear(Number(birthYear));
    const currentYear = new Date().getFullYear();
    if (birthYear > currentYear || birthYear < currentYear - 100) {
      alert("Please select a valid birth year.");
      return;
    }

    if (currentYear - birthYear < 18) {
      alert("You must be 18+ to register.");
      return;
    }

    if (!Object.keys(provincesWithDistricts).includes(province)) {
      alert("Please select a valid province.");
      return;
    }

    if (!provincesWithDistricts[province].includes(district)) {
      alert("Please select a valid district for the chosen province.");
      return;
    }

    if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes) {
      alert("Please enter a valid blood group (A+, A-, B+, B-, AB+, AB-, O+, O-).");
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      alert("Contact number should be 10 digits long and contain only numbers.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, bloodgroup, contact, password, email, birthYear, province, district,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.replace("/dashboard"); // ✅ NO back button
      } else {
        alert("Error: " + data.error);
      }

    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-800 via-red-700 to-rose-600 px-4">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white font-semibold shadow-lg hover:bg-white/30 hover:text-red-100 transition"
        >
          ← Back
        </Link>

        <div className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-3xl px-8 py-4 border border-red-100">

          {/* Header */}
          <div className="flex items-center mb-8 gap-4">

            {/* Icon on the left */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white text-2xl shadow-lg">
              🩸
            </div>

            {/* Text on the right */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-red-700">
                Registration
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Donate • Save • Protect Lives
              </p>
            </div>
          </div>


          <form className="space-y-5" onSubmit={submitForm}>
            {/* Name */}
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition" />

            {/* Contact */}
            <input type="number" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition" />

            {/* Password */}
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition" />

            {/* Email */}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition" />

            {/* Blood Group */}
            <select value={bloodgroup} onChange={(e) => setBloodgroup(e.target.value)} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition">
              <option value="" disabled>Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>

            {/* Province */}
            <select value={province} onChange={(e) => { setProvince(e.target.value); setDistrict(""); }} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition">
              <option value="" disabled>Select Province</option>
              {Object.keys(provincesWithDistricts).map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>

            {/* District */}
            <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!province} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition">
              <option value="" disabled>{province ? "Select District" : "Choose Province First"}</option>
              {province && provincesWithDistricts[province].map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>

            {/* Birth Year */}
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition">
              <option value="" disabled>Select Year of Birth</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Submit Button */}
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 transition-all duration-300 shadow-lg disabled:opacity-70">
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?
              <Link href="/login" className="ml-1 font-semibold text-red-600 hover:underline">
                Login here
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>

  );
}