import { editFormDataById, fetchDataById, useBearerStore } from "@/app/api/api";
import React, { use, useEffect } from "react";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import Image from "next/image";

interface EditDataFormProps {
  closeForm: () => void;
  id?: number | null;
  token?: string | null;
  initialData?: {
    userId?: number;
    longUrl: string;
    shortUrl: string;
  };
}

const EditDataForm: React.FC<EditDataFormProps> = ({
  closeForm,
  id,
  token,
  initialData,
}) => {
  const [formData, setFormData] = React.useState({
    userId: 0,
    longUrl: initialData?.longUrl || "",
    shortUrl: initialData?.shortUrl || "",
  });

  const fetchdata = async (id: number) => {
    try {
      const response = await fetchDataById(
        { token: useBearerStore.getState().token },
        id
      );
      if (response.status === 200 && response.data) {
        setFormData({
          userId: response.data.userId,
          longUrl: response.data.longUrl,
          shortUrl: response.data.shortUrl,
        });
      }
    } catch (error) {
      console.error("Error fetching data by ID:", error);
    }
  };

  useEffect(() => {
    fetchdata(id!);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = await editFormDataById({ token, id: id }, formData);

    console.log("Updated data:", formData);
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative cursor-pointer">
        <button
          onClick={closeForm}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          <Image src={circleclose} alt="Close" width={24} height={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Edit Data
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-700 font-semibold">Long Url</label>
          <input
            name="longUrl"
            value={formData.longUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <label className="text-gray-700 font-semibold">Short Url</label>
          <input
            name="shortUrl"
            value={formData.shortUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold h-12 rounded-lg hover:bg-blue-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDataForm;
