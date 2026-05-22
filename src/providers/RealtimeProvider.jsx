"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import socket from "../services/socket"
import useAuthStore from "../store/authStore"

export default function RealtimeProvider({ children }) {
    const queryClient = useQueryClient()
    const token = useAuthStore((state) => state.token)
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    )

    useEffect(() => {
        if (!isAuthenticated || !token) {
            socket.disconnect()
            return
        }

        socket.auth = { token }
        socket.connect()

        const refreshTasks = () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            })
        }

        const refreshSessions = () => {
            queryClient.invalidateQueries({
                queryKey: ["sessions"],
            })
        }

        const refreshAnalytics = () => {
            queryClient.invalidateQueries({
                queryKey: ["analytics"],
            })
        }

        socket.on("tasks:changed", refreshTasks)
        socket.on("sessions:changed", refreshSessions)
        socket.on("analytics:changed", refreshAnalytics)

        return () => {
            socket.off("tasks:changed", refreshTasks)
            socket.off("sessions:changed", refreshSessions)
            socket.off("analytics:changed", refreshAnalytics)
            socket.disconnect()
        }
    }, [isAuthenticated, queryClient, token])

    return children
}
