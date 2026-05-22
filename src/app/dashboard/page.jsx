"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import ProtectedRoute from "../../components/ProtectedRoute";

import Sidebar from "../../components/Sidebar";

import { getDashboardAnalytics } from "../../services/analyticsService";
import useAuthStore from "../../store/authStore";

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setChartReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: getDashboardAnalytics,
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-10">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isError || !data) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-10">
            <div className="rounded-xl bg-white p-5 shadow sm:p-6">
              {error?.response?.data?.message || "Unable to load dashboard analytics."}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const taskChartData = [
    {
      name: "Completed",
      value: data.tasks.completed,
    },
    {
      name: "Remaining",
      value: data.tasks.total - data.tasks.completed,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <div
          className="
          flex-1
          min-w-0
          p-4
          sm:p-6
          lg:p-10
          bg-gray-100
        "
        >
          <h1
            className="
            text-3xl
            sm:text-4xl
            font-bold
            mb-6
            sm:mb-10
          "
          >
            Dashboard
          </h1>

          {/* stats cards */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
            sm:gap-6
            mb-6
            sm:mb-10
          "
          >
            <div
              className="
              bg-white
              p-5
              sm:p-6
              rounded-xl
              shadow
            "
            >
              <h2
                className="
                text-gray-500
                mb-2
              "
              >
                Total Tasks
              </h2>

              <p
                className="
                text-3xl
                sm:text-4xl
                font-bold
              "
              >
                {data.tasks.total}
              </p>
            </div>

            <div
              className="
              bg-white
              p-5
              sm:p-6
              rounded-xl
              shadow
            "
            >
              <h2
                className="
                text-gray-500
                mb-2
              "
              >
                Completed Tasks
              </h2>

              <p
                className="
                text-3xl
                sm:text-4xl
                font-bold
              "
              >
                {data.tasks.completed}
              </p>
            </div>

            <div
              className="
              bg-white
              p-5
              sm:p-6
              rounded-xl
              shadow
            "
            >
              <h2
                className="
                text-gray-500
                mb-2
              "
              >
                Study Hours
              </h2>

              <p
                className="
                text-3xl
                sm:text-4xl
                font-bold
              "
              >
                {data.studyTime.totalHours}
              </p>
            </div>
          </div>

          {/* charts */}

          <div
            className="
            bg-white
            rounded-xl
            shadow
            p-5
            sm:p-8
            min-w-0
          "
          >
            <h2
              className="
              text-xl
              sm:text-2xl
              font-bold
              mb-4
              sm:mb-6
            "
            >
              Task Completion
            </h2>

            <div className="h-72 w-full min-w-0 sm:h-[20rem]">
              {chartReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskChartData}
                      dataKey="value"
                      outerRadius="75%"
                      label
                    >
                      <Cell fill="#22c55e" />

                      <Cell fill="#ef4444" />
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading chart...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
