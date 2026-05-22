"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { registerUser } from "../../services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name,
        email,
        password,
      });

      toast.success(
        data.message || "Registration successful. Check your email to verify your account."
      );

      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      px-4
      py-8
    "
    >
      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        p-6
        sm:p-8
        rounded-xl
        shadow-lg
        w-full
        max-w-md
      "
      >
        <h1
          className="
          text-2xl
          sm:text-3xl
          font-bold
          mb-2
          text-center
        "
        >
          Register
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Create your account and start organizing your study sessions.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="
          w-full
          p-3
          border
          rounded-lg
          mb-4
        "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="
          w-full
          p-3
          border
          rounded-lg
          mb-4
        "
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="
          w-full
          p-3
          border
          rounded-lg
          mb-6
        "
        />

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          bg-black
          text-white
          py-3
          rounded-lg
        "
        >
          {loading ? "Loading..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
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
