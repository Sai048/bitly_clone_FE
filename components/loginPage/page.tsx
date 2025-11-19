"use client";
import Image from "next/image";
import hide from "../../public/hide.png";
import show from "../../public/show.png";
import { useState } from "react";
import { handleLogin, useBearerStore } from "@/app/api/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


interface LoginPageProps {
  email: string;
  password: string;
}

const sampledata: LoginPageProps = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [data, setData] = useState(sampledata);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    message?: string;
  }>({});
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length > 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      return;
    }
    const resdata = await handleLogin(data);
    if (resdata.status === 401) {
      if (resdata.status === 401) {
        setErrors((prev) => ({
          ...prev,
          message: resdata.message,
        }));
      }
    }
    if (resdata.status === 200 && resdata.data.accesstoken) {
      useBearerStore.getState().setToken(resdata.data.accesstoken);

      Cookies.set("token", resdata.data.accesstoken, { expires: 7 });

      sessionStorage.setItem("data", JSON.stringify(resdata));
      router.push("/home");
      setData(sampledata);
    }
  };
  return ( 
    <div className="relative h-screen w-full bg-white">
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-slate-800 bg-opacity-90 rounded-3xl shadow-2xl p-10 w-[400px] text-center text-white">
          <h1 className="text-5xl font-bold mb-10">Login</h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label className="text-xl font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => {
                  changeHandler("email", e);
                }}
                placeholder="Enter your email"
                className="border-2 border-gray-300 rounded-2xl p-3 text-center placeholder-gray-400 hover:bg-white hover:border-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 font-semibold"
              />
              {errors.email && (
                <p className="text-red-500 mt-2">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col text-left">
              <label className="text-xl font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative border-2 border-gray-300 rounded-2xl p-3 text-center placeholder-gray-400 hover:bg-white hover:border-white hover:text-black focus-within:ring-2 focus-within:ring-white focus-within:border-white transition-all duration-300 font-semibold">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => changeHandler("password", e)}
                  placeholder="Enter your password"
                  className="w-full pr-10 border-none text-center placeholder-gray-400 focus:outline-none font-semibold bg-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <Image
                    key={showPassword ? "show" : "hide"}
                    src={showPassword ? show : hide}
                    alt={showPassword ? "show" : "hide"}
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            <div>
              {errors.message && (
                <p className="text-red-500 mt-2">{errors.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
