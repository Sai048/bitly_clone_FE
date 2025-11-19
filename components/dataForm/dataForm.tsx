"use client";
import { postFormDataById, useBearerStore } from "@/app/api/api";
import axios from "axios";
import { useEffect, useState } from "react";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import Image from "next/image";

interface OverlayFormProps {
  closeForm: () => void;
}

interface OverlayFormData {
  userId?: number;
  longUrl: string;
}

const OverlayForm: React.FC<OverlayFormProps> = ({ closeForm }) => {
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedData = sessionStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const userId = parsedData?.data?.id;
      if (userId) {
        setId(userId);
        setFormData((prev) => ({ ...prev, userId }));
      }
    }
  }, []);

  const [formData, setFormData] = useState<OverlayFormData>({
    userId: id,
    longUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "actualAmount" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      console.error("User ID not found!");
      return;
    }

    try {
      const payload = { token : useBearerStore.getState().token };
      const saveData = await postFormDataById(payload,formData);

      setFormData({
        ...formData,
        longUrl: "",
      });
      closeForm();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={closeForm}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold transition cursor-pointer"
        >
          <Image src={circleclose} alt="Close" width={24} height={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Entry
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         

          <label className="text-gray-700 font-semibold">Actual Url</label>
          <input
            name="longUrl"
            value={formData.longUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <button
            type="submit"
            className=" bg-blue-500 from-green-500 to-green-600 text-white font-semibold h-12 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverlayForm;
