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
  saveData: async (
    data: Record<string, any>,
    key: string = "login_ui_data",
  ) => {
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  },

  getData: async (key: string = "login_ui_data") => {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },

  clear: async (key: string = "login_ui_data") => {
    window.localStorage.removeItem(key);
  },
};

type PostDataType = {
  username: string;
  password: string;
};

export { api, cache, cn };
export type { PostDataType };
