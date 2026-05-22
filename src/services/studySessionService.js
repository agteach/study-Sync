import api from "./api"

export const getSessions = async () => {

    const response =
        await api.get("/sessions")

    return response.data
}

export const createSession = async (
    sessionData
) => {

    const response =
        await api.post(
            "/sessions",
            sessionData
        )

    return response.data
}

export const updateSession = async (
    id,
    sessionData
) => {

    const response =
        await api.put(
            `/sessions/${id}`,
            sessionData
        )

    return response.data
}

export const deleteSession = async (
    id
) => {

    const response =
        await api.delete(
            `/sessions/${id}`
        )

    return response.data
}