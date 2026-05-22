import { create } from "zustand"

const useAuthStore = create((set) => ({

    user: null,
    token: null,
    hydrated: false,
    isAuthenticated: false,
    authChecked: false,

    hydrateAuth: () => {
        if (typeof window === "undefined") {
            return
        }

        const token = localStorage.getItem("token")

        set((state) => {
            if (
                state.hydrated &&
                state.token === token &&
                state.authChecked
            ) {
                return state
            }

            return {
                token,
                hydrated: true,
                isAuthenticated:
                    state.token === token &&
                    state.isAuthenticated,
                authChecked: !token,
            }
        })
    },

    setAuth: (user, token) => {

        if (typeof window !== "undefined") {
            localStorage.setItem("token", token)
        }

        set({
            user,
            token,
            hydrated: true,
            isAuthenticated: true,
            authChecked: true,
        })
    },

    setUser: (user) => {
        set((state) => ({
            ...state,
            user,
            hydrated: true,
            isAuthenticated: true,
            authChecked: true,
        }))
    },

    clearAuth: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
        }

        set({
            user: null,
            token: null,
            hydrated: true,
            isAuthenticated: false,
            authChecked: true,
        })
    },

    logout: () => {

        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
        }

        set({
            user: null,
            token: null,
            hydrated: true,
            isAuthenticated: false,
            authChecked: true,
        })
    },

}))

export default useAuthStore
