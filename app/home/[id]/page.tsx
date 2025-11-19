"use client";

import { fetchDataById, useBearerStore } from "@/app/api/api";
import RouteGuard from "@/components/guard/guard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DataType {
  id: number;
  userId: number;
  shortUrl: string;
  longUrl: string;
  clicks: number;
  lastClicked: string;
  createdAt: string;
  updatedAt: string;
}

export default function SingleData() {
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<DataType | null>(null);
  const [openSpinner, setOpenSpinner] = useState(true);

  const fetchdata = async (id: number) => {
    try {
      const response = await fetchDataById(
        { token: useBearerStore.getState().token },
        id
      );
      if (response.status === 200 && response.data) {
        setData(response.data);
        setOpenSpinner(false);
      }
    } catch (error) {
      console.error("Error fetching data by ID:", error);
    }
  };

  useEffect(() => {
    fetchdata(id);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <RouteGuard>
      {openSpinner ? (
        <div className="flex justify-center items-center min-h-screen ">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6 w-full overflow-auto h-screen text-black">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">ID</label>
            <input
              type="text"
              value={data.id}
              readOnly
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">User ID</label>
            <input
              type="text"
              value={data.userId}
              readOnly
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Long URL</label>
            <input
              type="text"
              value={data.longUrl}
              onChange={(e) => setData({ ...data, longUrl: e.target.value })}
              className="border p-2 rounded w-full "
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Short URL</label>
            <input
              type="text"
              value={data.shortUrl}
              onChange={(e) => setData({ ...data, shortUrl: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1"> Last Clicked</label>
            <input
              type="text"
              value={new Date(data.lastClicked).toLocaleDateString("en-GB")}
              onChange={(e) =>
                setData({ ...data, lastClicked: e.target.value })
              }
              className="border p-2 rounded w-full "
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Created At</label>
            <input
              type="text"
              value={new Date(data.createdAt).toLocaleDateString("en-GB")}
              onChange={(e) => setData({ ...data, createdAt: e.target.value })}
              className="border p-2 rounded w-full "
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Updated At</label>
            <input
              type="text"
              value={new Date(data.updatedAt).toLocaleDateString("en-GB")}
              onChange={(e) => setData({ ...data, updatedAt: e.target.value })}
              className="border p-2 rounded w-full "
            />
          </div>
        </div>
      )}
    </RouteGuard>
  );
}
