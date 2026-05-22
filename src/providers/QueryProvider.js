"use client"

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"
import RealtimeProvider from "./RealtimeProvider"

const queryClient = new QueryClient()

export default function QueryProvider({
    children,
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <RealtimeProvider>
                {children}
            </RealtimeProvider>
        </QueryClientProvider>
    )
}
