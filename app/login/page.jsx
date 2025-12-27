

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
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          Login Form
        </h1>

        <form className="space-y-4" onSubmit={submitForm}>

          <input type="number" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Enter Contact Number" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />


          <button disabled={loading} type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
            {loading ? "Logging in..." : "Login"}
          </button>
          <span className="text-center block">Don't have an account?<Link href="/register" className="text-red-600"> Register here</Link></span>
        </form>
      </div>
    </div>
  );
}
