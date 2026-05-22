import { io } from "socket.io-client"

const socketURL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000"

const socket = io(
    socketURL,
    {
        autoConnect: false,
    }
)

export default socket
