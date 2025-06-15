import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const api = {
  post: async (url: string, values: PostDataType | {}) => {
    try {
      const res = await axios.post(
        url,
        {
          ...values,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
          withCredentials: true,
        },
      );
      return res;
    } catch (err) {
      throw err;
    }
  },
};

const cache = {
  saveData: async (data: Record<string, any>) => {
    window.localStorage.setItem("login_ui_data", JSON.stringify(data));
    return true;
  },

  getData: async () => {
    const data = window.localStorage.getItem("login_ui_data");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },

  clear: async () => {
    window.localStorage.removeItem("login_ui_data");
  },
};

type PostDataType = {
  username: string;
  password: string;
};

export { api, cache, cn };
export type { PostDataType };
