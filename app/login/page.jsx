


"use client"; // needed for stateful components in App Router
import Link from "next/link";

import React, { useState } from "react";
import { useRouter } from "next/navigation";



export default function RegisterPage() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitForm = async (e) => {
    e.preventDefault();

    if (!contact.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }


    if (!/^\d{10}$/.test(contact)) {
      alert("Contact number should be 10 digits long and contain only numbers.");
      return;
    }

    setLoading(true);


    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, password }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-800 via-red-700 to-rose-600 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-red-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white text-2xl shadow-lg">
            🩸
          </div>
          <h1 className="text-3xl font-extrabold text-red-700 mt-4">
            Blood Flow Login
          </h1>
          <p className="text-sm text-gray-500 mt-1"> 
            Donate • Save • Protect Lives
          </p>
        </div>

        <form className="space-y-5" onSubmit={submitForm}>

          <input
            type="number"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Number"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 transition-all duration-300 shadow-lg disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?
            <Link href="/register" className="ml-1 font-semibold text-red-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>

  );
}
