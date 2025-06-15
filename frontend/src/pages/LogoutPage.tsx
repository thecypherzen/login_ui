import { useEffect, useState } from "react";
import { UseTheme } from "@/hooks/ThemeProvider";
import { Spinner } from "@/components/index";
import { Check } from "lucide-react";
import { api, cache } from "@/lib/utils";
import Cookies from "js-cookie";
import type { FormMessageType } from "@/components/forms/SignupForm";

const LogoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<FormMessageType>({
    type: "neutral",
    message: "Logging you out ...",
  });
  const { theme } = UseTheme();

  const logoutUser = async () => {
    const apiBaseUrl =
      import.meta.env.VITE_NODE_ENV === "dev"
        ? `${import.meta.env.VITE_API_DEV_BASE_URL}`
        : import.meta.env.VITE_API_LIVE_BASE_URL;
    try {
      const res = await api.post(`${apiBaseUrl}/auth/logout`, {});
      console.log(res);
      // clear data
      cache.clear();
      setIsLoading(false);
      Cookies.remove("authToken");
      Cookies.remove("isLogedIn");
      setMessage({ type: "success", message: "Successful" });
    } catch (err: Error | any) {
      setIsLoading(false);
      setMessage({
        type: "error",
        message:
          err?.response?.data?.message ?? err?.message ?? "Logout failed",
      });
    }
  };
  useEffect(() => {
    logoutUser();
  }, []);
  return (
    <div
      className="min-h-[calc(100svh-62px)] dark:bg-neutral-800 dark:text-neutral-100 flex flex-col items-center py-50"
      data-theme={theme}
    >
      <div className="flex flex-col items-center gap-5">
        <p>{message.message}</p>
        <div>{isLoading ? <Spinner /> : <Check />}</div>
      </div>
    </div>
  );
};

export default LogoutPage;
