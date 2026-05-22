"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import useAuthStore from "../store/authStore";
import { getCurrentUser } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const authChecked = useAuthStore((state) => state.authChecked);
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!hydrated || !token || authChecked) {
      return;
    }

    let isActive = true;

    const validateSession = async () => {
      try {
        const user = await getCurrentUser();

        if (!isActive) {
          return;
        }

        setUser(user);
      } catch {
        if (!isActive) {
          return;
        }

        clearAuth();
        router.replace("/login");
      }
    };

    validateSession();

    return () => {
      isActive = false;
    };
  }, [authChecked, clearAuth, hydrated, router, setUser, token]);

  useEffect(() => {
    if (hydrated && authChecked && !token) {
      router.replace("/login");
    }
  }, [authChecked, hydrated, token, router]);

  if (!hydrated || !authChecked || !isAuthenticated) {
    return null;
  }

  return children;
}
