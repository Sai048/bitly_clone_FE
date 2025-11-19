"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import RouteGuard from "@/components/guard/guard";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUsername(parsedData.data.name || "");
      setEmail(parsedData.data.email || "");
    }
  }, []);

  const handleLogOut = async () => {
    sessionStorage.removeItem("data");
    localStorage.removeItem("bearer");
    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <RouteGuard>
      <div className="p-6 max-w-4xl mx-auto text-black">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <section className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                disabled
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
        </section>

        <section className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="flex flex-col gap-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all">
              Change Password
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
              onClick={() => handleLogOut()}
            >
              Log Out
            </button>
          </div>
        </section>
      </div>
    </RouteGuard>
  );
};

export default Settings;
