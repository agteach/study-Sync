"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { verifyEmailToken } from "../../../services/authService";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;
  const invalidToken = !token || Array.isArray(token);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (invalidToken) {
      return;
    }

    let isActive = true;

    const runVerification = async () => {
      try {
        const data = await verifyEmailToken(token);

        if (!isActive) {
          return;
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "We could not verify that link. Please try again."
        );
      }
    };

    runVerification();

    return () => {
      isActive = false;
    };
  }, [invalidToken, token]);

  const resolvedStatus = invalidToken ? "error" : status;
  const resolvedMessage = invalidToken ? "Invalid verification link." : message;

  const heading =
    resolvedStatus === "loading"
      ? "Verifying Email"
      : resolvedStatus === "success"
      ? "Email Verified"
      : "Verification Failed";

  const accentClass =
    resolvedStatus === "success"
      ? "text-green-600"
      : resolvedStatus === "error"
      ? "text-red-600"
      : "text-gray-900";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className={`mb-4 text-center text-2xl font-bold sm:text-3xl ${accentClass}`}>
          {heading}
        </h1>

        <p className="mb-6 text-center text-gray-600">{resolvedMessage}</p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-lg bg-black py-3 text-white"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
