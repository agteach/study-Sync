"use client";

import { useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import useAuthStore from "../store/authStore";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },
    {
      href: "/tasks",
      label: "Tasks",
      Icon: CheckSquare,
    },
    {
      href: "/sessions",
      label: "Sessions",
      Icon: BookOpen,
    },
    {
      href: "/analytics",
      label: "Analytics",
      Icon: BarChart3,
    },
  ];

  return (
    <aside
      className="
      w-full
      md:w-64
      md:min-h-screen
      bg-black
      text-white
      shrink-0
    "
    >
      <div
        className="
        flex
        items-center
        justify-between
        p-4
        md:block
        md:p-6
      "
      >
        <h1
          className="
          text-2xl
          font-bold
          md:mb-10
          md:text-3xl
        "
        >
          StudySync
        </h1>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          border
          border-white/20
          md:hidden
        "
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        className={`
        ${menuOpen ? "block" : "hidden"}
        border-t
        border-white/10
        p-4
        md:block
        md:border-0
        md:p-6
        md:pt-0
        md:space-y-4
      `}
      >
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMenu}
            className="
            flex
            items-center
            gap-3
            rounded-lg
            px-3
            py-3
            text-sm
            transition
            hover:bg-white/10
            md:px-0
            md:py-0
            md:text-base
            md:hover:bg-transparent
          "
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="
          w-full
          flex
          items-center
          gap-3
          text-red-400
          rounded-lg
          px-3
          py-3
          text-sm
          md:mt-10
          md:px-0
          md:py-0
          md:text-base
          hover:bg-white/10
          md:hover:bg-transparent
        "
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
