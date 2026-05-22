"use client";

import { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import ProtectedRoute from "../../components/ProtectedRoute";

import Sidebar from "../../components/Sidebar";
import useAuthStore from "../../store/authStore";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../../services/taskService";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [title, setTitle] = useState("");

  // fetch tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: isAuthenticated,
  });

  // create task
  const createMutation = useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task created");

      setTitle("");
    },
  });

  // delete task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task deleted");
    },
  });

  // complete task
  const completeMutation = useMutation({
    mutationFn: ({ id, completed }) =>
      updateTask(id, {
        completed,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const handleCreateTask = (e) => {
    e.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) return;

    createMutation.mutate({
      title: normalizedTitle,
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
            Tasks
          </h1>

          {isLoading || !isAuthenticated ? (
            <div className="rounded-xl bg-white p-5 shadow">Loading...</div>
          ) : isError ? (
            <div className="rounded-xl bg-white p-5 shadow">
              {error?.response?.data?.message || "Unable to load tasks."}
            </div>
          ) : (
            <>

              {/* create task */}

              <form
                onSubmit={handleCreateTask}
                className="
            grid
            gap-3
            mb-6
            sm:grid-cols-[1fr_auto]
            sm:gap-4
            sm:mb-8
          "
              >
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
              flex-1
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
              px-6
              rounded-lg
            "
                >
                  Add
                </button>
              </form>

              {/* task list */}

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
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
                      font-semibold
                      break-words

                      ${task.completed ? "line-through text-gray-400" : ""}
                    `}
                      >
                        {task.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:flex">
                      <button
                        onClick={() =>
                          completeMutation.mutate({
                            id: task._id,
                            completed: !task.completed,
                          })
                        }
                        className="
                      px-4
                      py-2
                      rounded-lg
                      bg-green-500
                      text-white
                      text-sm
                      sm:text-base
                    "
                      >
                        {task.completed ? "Undo" : "Complete"}
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(task._id)}
                        className="
                      px-4
                      py-2
                      rounded-lg
                      bg-red-500
                      text-white
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
