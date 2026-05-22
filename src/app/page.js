import Link from "next/link"

export default function Home() {
  return (
    <div
      className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      bg-gray-100
      px-4
      py-8
      sm:px-6
    "
    >

      <h1
        className="
        text-4xl
        sm:text-5xl
        font-bold
        mb-4
      "
      >
        StudySync
      </h1>

      <p
        className="
        text-gray-600
        text-base
        sm:text-lg
        mb-8
        text-center
        max-w-xl
      "
      >
        Smart study management platform
        with tasks, analytics,
        reminders, and real-time
        productivity tracking.
      </p>

      <div className="grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

        <Link
          href="/login"
          className="
          bg-black
          text-white
          px-6
          py-3
          rounded-lg
          text-center
        "
        >
          Login
        </Link>

        <Link
          href="/register"
          className="
          border
          border-black
          px-6
          py-3
          rounded-lg
          text-center
        "
        >
          Register
        </Link>

      </div>

    </div>
  )
}
