"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";

import { resetPassword } from "../../../services/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || Array.isArray(token)) {
      toast.error("Invalid reset link");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, formData.password);

      toast.success(data.message || "Password reset successful");
      router.push("/login");
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
        <h1 className="mb-3 text-center text-2xl font-bold sm:text-3xl">Reset Password</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Set a new password for your account.
        </p>

        <input
          type="password"
          name="password"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 w-full rounded-lg border p-3"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-6 w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 text-white"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to{" "}
          <Link
            href="/login"
            className="font-medium text-black underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
