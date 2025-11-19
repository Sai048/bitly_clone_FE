"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Sidebar() {
  const [userData, setUserData] = useState<any>(null);
  const [active, setActive] = useState<any>("home");

  const handleChange = (name: string) => {
    setActive(name);
  };

  useEffect(() => {
    const getData = sessionStorage.getItem("data");
    setUserData(getData ? JSON.parse(getData) : null);
  }, []);

  return (
    <div className="w-60 rounded-xl bg-white shadow-lg flex flex-col p-4 text-center justify-between h-full text-black">
      <div>
        <h2 className="text-xl font-bold mb-6">
          Hello {userData?.data?.name?.toUpperCase()}
        </h2>
        <nav className="flex flex-col space-y-3">
          <Link
            href="/home"
            className={`hover:text-blue-600 font-semibold ${
              active === "home" ? "text-blue-600" : ""
            }`}
            onClick={() => {
              handleChange("home");
            }}
          >
            Home
          </Link>

          <Link
            href="/home/settings"
            className={`hover:text-blue-600 font-semibold ${
              active === "settings" ? "text-blue-600" : ""
            }`}
            onClick={() => {
              handleChange("settings");
            }}
          >
            Settings
          </Link>
        </nav>
      </div>

      <div>
        <Link
          href="/"
          className="mt-6 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
          onClick={async () => {
            sessionStorage.removeItem("data");
            localStorage.removeItem("bearer");
            Cookies.remove("token");
            localStorage.removeItem("persist:bearer");
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
