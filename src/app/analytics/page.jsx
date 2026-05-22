"use client";

import { useQuery } from "@tanstack/react-query";

import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";
import { getDashboardAnalytics } from "../../services/analyticsService";
import useAuthStore from "../../store/authStore";

export default function AnalyticsPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: getDashboardAnalytics,
    enabled: isAuthenticated,
  });

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
        <Sidebar />

        <div className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-10">
          <h1 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">Analytics</h1>

          {isLoading || !isAuthenticated ? (
            <div className="rounded-xl bg-white p-5 shadow sm:p-6">Loading...</div>
          ) : isError || !data ? (
            <div className="rounded-xl bg-white p-5 shadow sm:p-6">
              {error?.response?.data?.message || "Unable to load analytics."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white p-5 shadow sm:p-6">
                <p className="mb-2 text-sm text-gray-500">Task Completion</p>
                <p className="text-3xl font-bold">{data.tasks.completionRate}%</p>
                <p className="mt-2 text-sm text-gray-600">
                  {data.tasks.completed} of {data.tasks.total} tasks completed
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow sm:p-6">
                <p className="mb-2 text-sm text-gray-500">Session Completion</p>
                <p className="text-3xl font-bold">
                  {data.studySessions.completionRate}%
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {data.studySessions.completed} of {data.studySessions.total} sessions
                  completed
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow sm:p-6">
                <p className="mb-2 text-sm text-gray-500">Study Time</p>
                <p className="text-3xl font-bold">{data.studyTime.totalHours} hrs</p>
                <p className="mt-2 text-sm text-gray-600">
                  {data.studyTime.totalMinutes} minutes completed
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow sm:p-6">
                <p className="mb-2 text-sm text-gray-500">Open Tasks</p>
                <p className="text-3xl font-bold">
                  {data.tasks.total - data.tasks.completed}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Remaining tasks across your study plan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
