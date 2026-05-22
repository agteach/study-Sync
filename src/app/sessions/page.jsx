"use client";

import { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import ProtectedRoute from "../../components/ProtectedRoute";

import Sidebar from "../../components/Sidebar";
import useAuthStore from "../../store/authStore";

import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../../services/studySessionService";

export default function SessionsPage() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [formData, setFormData] = useState({
    subject: "",
    duration: "",
    scheduledFor: "",
  });

  // fetch sessions
  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
    enabled: isAuthenticated,
  });

  // create
  const createMutation = useMutation({
    mutationFn: createSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success("Session created");

      setFormData({
        subject: "",
        duration: "",
        scheduledFor: "",
      });
    },
  });

  // update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSession(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  // delete
  const deleteMutation = useMutation({
    mutationFn: deleteSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success("Session deleted");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = formData.subject.trim();
    const duration = Number(formData.duration);

    if (!subject || !duration || duration < 1 || !formData.scheduledFor) {
      toast.error("Please fill in all session fields.");
      return;
    }

    createMutation.mutate({
      ...formData,
      subject,
      duration,
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 sm:p-6 lg:p-10">
          <h1
            className="
            text-3xl
            sm:text-4xl
            font-bold
            mb-6
            sm:mb-8
          "
          >
            Study Sessions
          </h1>

          {isLoading || !isAuthenticated ? (
            <div className="rounded-xl bg-white p-5 shadow">Loading...</div>
          ) : isError ? (
            <div className="rounded-xl bg-white p-5 shadow">
              {error?.response?.data?.message || "Unable to load sessions."}
            </div>
          ) : (
            <>

              {/* create form */}

              <form
                onSubmit={handleSubmit}
                className="
            grid
            md:grid-cols-3
            gap-3
            sm:gap-4
            mb-6
            sm:mb-10
          "
              >
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject: e.target.value,
                    })
                  }
                  className="
              border
              p-3
              rounded-lg
            "
                />

                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value,
                    })
                  }
                  className="
              border
              p-3
              rounded-lg
            "
                />

                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduledFor: e.target.value,
                    })
                  }
                  className="
              border
              p-3
              rounded-lg
            "
                />

                <button
                  type="submit"
                  className="
              bg-black
              text-white
              py-3
              rounded-lg
              md:col-span-3
            "
                >
                  Create Session
                </button>
              </form>

              {/* session cards */}

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="
                  bg-white
                  shadow
                  rounded-lg
                  p-5
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  justify-between
                  sm:items-center
                "
                  >
                    <div className="min-w-0">
                      <h2
                        className={`
                      text-lg
                      sm:text-xl
                      font-semibold
                      break-words

                      ${session.completed ? "line-through text-gray-400" : ""}
                    `}
                      >
                        {session.subject}
                      </h2>

                      <p className="text-gray-600">
                        Duration: {session.duration} mins
                      </p>

                      <p className="text-sm text-gray-500 sm:text-base">
                        {new Date(session.scheduledFor).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:flex">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: session._id,

                            data: {
                              completed: !session.completed,
                            },
                          })
                        }
                        className="
                      bg-green-500
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      text-sm
                      sm:text-base
                    "
                      >
                        {session.completed ? "Undo" : "Complete"}
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(session._id)}
                        className="
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      text-sm
                      sm:text-base
                    "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
