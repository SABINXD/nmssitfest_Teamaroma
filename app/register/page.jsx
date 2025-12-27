
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

    if (!Object.keys(provincesWithDistricts).includes(province)) {
      alert("Please select a valid province.");
      return;
    }

    if (!provincesWithDistricts[province].includes(district)) {
      alert("Please select a valid district for the chosen province.");
      return;
    }

    if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodgroup.toUpperCase())) {
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
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          Registration Form
        </h1>

        <form className="space-y-4" onSubmit={submitForm}>

          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="text" required value={bloodgroup} onChange={(e) => setBloodgroup(e.target.value)} placeholder="Enter Blood Group" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="number" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Enter Contact Number" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
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
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="" disabled>
              Select Year of Birth
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>


          <button disabled={loading} type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
            {loading ? "Registering..." : "Register"}
          </button>
          <span className="text-center block"> Already have an account? <Link href="/login" className="text-red-600">Login here</Link></span>
        </form>
      </div>
    </div>
  );
}