import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface BearerStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

interface LoginPageProps {
  email: string;
  password: string;
}


const url = "https://bitly-clone-be-1.onrender.com/api";

export const useBearerStore = create<BearerStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "bearer",
    }
  )
);

export const handleLogin = async (payload: LoginPageProps) => {
  try {
    const response = await axios.post(`${url}/users/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return { status: 500, message: "Something went wrong" };
    }
  }
};

export const fetchDashboardData = async (
  payload: any,
  filters?: any,
  page?: number,
  limit?: number,
    text?: string
) => {
  try {
    const queryParams = new URLSearchParams();

    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

   
    if (text)
      queryParams.append("search", text);
    if (filters?.fromDate) queryParams.append("fromDate", filters.fromDate);
    if (filters?.toDate) queryParams.append("toDate", filters.toDate);

    const queryString = queryParams.toString();
    const response = await axios.get(
      `${url}/links/user/${payload.id}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const deleteDataById = async (payload: any) => {
  try {
    const response = await axios.delete(`${url}/links/${payload.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const fetchDataById = async (payload: any, id: number) => {
  try {
    const response = await axios.get(`${url}/links/id/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};
export const fetchDataByCode = async (payload: any, code: string) => {
  try {
    const response = await axios.get(`${url}/links/id/${code}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const editFormDataById = async (payload: any, formData: any) => {
  try {
    const response = await axios.put(
      `${url}/links/${payload.id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const postFormDataById = async (payload: any, formData: any) => {
  try {
    const response = await axios.post(
      `${url}/links/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};