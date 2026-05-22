"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const router = useRouter();

  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
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

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      setAuth(data, data.token);

      toast.success("Login successful");

      router.push("/dashboard");
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
          Login
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Welcome back. Pick up where your study plan left off.
        </p>

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

        <div className="mb-6 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            Forgot password?
          </Link>
        </div>

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
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{" "}
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
