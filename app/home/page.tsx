"use client";
import plus from "@/public/icons8-plus.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { deleteDataById, fetchDashboardData } from "../api/api";
import { useBearerStore } from "../api/api";
import deleteImage from "@/public/delete-svgrepo-com.svg";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import pencil from "../../public/icons8-pencil-30.png";
import RouteGuard from "@/components/guard/guard";
import OverlayForm from "@/components/dataForm/dataForm";
import EditDataForm from "@/components/editForm/editForm";
import Link from "next/link";

interface DashboardData {
  id: number;
  longUrl: string;
  shortUrl: string;
  lastClicked: string;
  createdAt: string;
}

interface StoreDate {
  startDate: string;
  endDate: string;
  month: string;
}

const Dashboard = () => {
  const [openSpinner, setOpenSpinner] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [data, setData] = useState<DashboardData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [store, setStore] = useState<StoreDate[]>([
    {
      startDate: "",
      endDate: "",
      month: "",
    },
  ]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  const itemsPerPage = 10;

  function formatLocalDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function getMonthsWithDates(year: number): StoreDate[] {
    const months: StoreDate[] = [];

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0);
      const monthName = start.toLocaleString("default", { month: "long" });

      months.push({
        month: monthName,
        startDate: formatLocalDate(start),
        endDate: formatLocalDate(end),
      });
    }

    return months;
  }

  let payload: { token: string | null; id: number | undefined };
  let id: number | undefined;

  useEffect(() => {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    const months = getMonthsWithDates(currentYear);
    setYear(currentYear);
    setMonth(currentMonthIndex);
    setStore(months);

    setFilters((prev: any) => ({
      ...prev,
      fromDate: months[currentMonthIndex].startDate,
      toDate: months[currentMonthIndex].endDate,
    }));

    const storedData = sessionStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const id = parsedData?.data?.id;
      const bearer = useBearerStore.getState().token;

      if (id && bearer) {
        setUserId(id);
        setToken(bearer);
      }
    }
  }, [year, month]);

  useEffect(() => {
    if (userId && token) fetchData(currentPage);
  }, [userId, token, open, open1, currentPage, text]);

  const fetchData = async (page = 1) => {
    try {
      if (!token || !userId) return;
      const payload = { token, id: userId };
      console.log(token);

      const response = await fetchDashboardData(
        payload,
        filters,
        page,
        itemsPerPage,
        text
      );
      if (response.status === 200) {
        setOpenSpinner(false);
      }

      setData(response.data);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fnopenForm = () => {
    setOpen(true);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchData(prevPage);
    }
  };

  const handleDelete = async (id: number) => {
    const payload = { token, id };
    try {
      const deleteResponse = await deleteDataById(payload);
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleFilterChange = () => {
    fetchData(currentPage);
    setOpenDropdown(false);
  };

  return (
    <RouteGuard>
      {openSpinner ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen h-auto p-2 text-black">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h1 className="font-bold text-2xl">Short Format</h1>

            <div className="flex flex-wrap gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Search by code or URL..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="px-4 py-2 border rounded-xl bg-gray-50 w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Filters
                </button>

                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4">
                    <button
                      onClick={() => setOpenDropdown(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    >
                      ✕
                    </button>

                    <div className="flex flex-col gap-3 mt-6">
                      <label className="font-semibold">From Date</label>
                      <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleChange}
                        className="px-2 py-2 border rounded w-full"
                      />

                      <label className="font-semibold">To Date</label>
                      <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleChange}
                        className="px-2 py-2 border rounded w-full"
                      />

                      <button
                        onClick={() => setFilters({ fromDate: "", toDate: "" })}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Clear Filters
                      </button>

                      <button
                        onClick={() => handleFilterChange()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all"
                onClick={fnopenForm}
              >
                <Image src={plus} alt="Add" width={25} height={25} />
                Add New Data
              </button>
            </div>
            {open && <OverlayForm closeForm={() => setOpen(false)} />}
            {open1 && (
              <EditDataForm id={editId!} closeForm={() => setOpen1(false)} />
            )}
          </div>

          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold">
                    Id
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold hidden sm:table-cell">
                    Long Url
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold">
                    Short Url
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold">
                    Last Clicked
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold hidden md:table-cell">
                    Created
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b cursor-pointer">
                    <td className="py-3 px-4">
                      <Link
                        href={`/home/${item.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {item.id}
                      </Link>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell max-w-xs">
                      <Link
                        href={`/home/${item.id}`}
                        className="hover:underline text-blue-600 block truncate"
                        title={item.longUrl}
                      >
                        {item.longUrl}
                      </Link>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <a
                        href={`https://bitly-clone-be.onrender.com/api/links/${item.shortUrl}`}
                        target="_blank"
                        className="text-blue-600 hover:underline block truncate"
                        title={`https://bitly-clone-be.onrender.com/api/links/${item.shortUrl}`}
                      >
                        {`https://bitly-clone-be.onrender.com/api/links/${item.shortUrl}`}
                      </a>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell">
                      <Link
                        href={`/home/${item.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {item.lastClicked
                          ? new Date(item.lastClicked).toLocaleDateString(
                              "en-GB"
                            )
                          : "Never"}
                      </Link>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell">
                      <Link
                        href={`/home/${item.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setOpen1(true);
                            setEditId(item.id);
                          }}
                        >
                          <Image
                            src={pencil}
                            width={20}
                            height={20}
                            alt="Edit"
                          />
                        </button>

                        <button onClick={() => handleDelete(item.id)}>
                          <Image
                            src={deleteImage}
                            width={20}
                            height={20}
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2 bg-white shadow rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default Dashboard;
