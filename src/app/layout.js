import "./globals.css"
import { Toaster } from "react-hot-toast"
import QueryProvider
  from "../providers/QueryProvider"

export const metadata = {
  title: "StudySync",
  description: "Smart Study Platform",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>

        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}