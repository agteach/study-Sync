"use client";

import Link from "next/link";
import { useState } from "react";

import toast from "react-hot-toast";

import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword(normalizedEmail);

      toast.success(data.message || "Password reset email sent");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8"
      >
        <h1 className="mb-3 text-center text-2xl font-bold sm:text-3xl">Forgot Password</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6 w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 text-white"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-black underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-gray-500">
          Need an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
