import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UseTheme } from "@/hooks/ThemeProvider";
import { Spinner } from "@/components/index";
import { Button } from "@/components/ui/button";
import { House, Check, X } from "lucide-react";
import { api, cache, cn } from "@/lib/utils";
import Cookies from "js-cookie";
import type { FormMessageType } from "@/components/forms/SignupForm";

const LogoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logoutSuccess, setLogoutSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
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
      await api.post(`${apiBaseUrl}/auth/logout`, {});
      // clear data
      cache.clear();
      setIsLoading(false);
      setLogoutSuccess(true);
      Cookies.remove("authToken");
      setMessage({ type: "success", message: "Logout Successful" });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: Error | any) {
      setIsLoading(false);
      setLogoutSuccess(false);
      setMessage({
        type: "error",
        message:
          err?.response?.data?.code === 5
            ? "Sorry. You're not logged in"
            : (err?.message ?? "Logout failed"),
      });
    }
  };
  useEffect(() => {
    logoutUser();
  }, []);
  return (
    <div
      className="min-h-[calc(100svh-62px)] dark:bg-neutral-800 dark:text-neutral-100 grid grid-rows-3 p-6"
      data-theme={theme}
    >
      <div className="row-span-2 flex flex-col justify-center items-center gap-5 font-semibold">
        <p
          className={cn(
            "",
            message.type === "error"
              ? "text-red-400 dark:text-red-500"
              : message.type === "success"
                ? "text-green-500"
                : "text-neutral-900 dark:text-neutral-200",
          )}
        >
          {message.message}
        </p>
        <div>
          {isLoading ? (
            <Spinner />
          ) : (
            <span
              className={cn(
                "bg-green-neutral-800 flex flex-col items-center justify-center rounded-full size-6 md:size-8 dark:bg-neutral-200 dark:text-neutral-900",
                message.type === "success"
                  ? "bg-green-500 dark:bg-green-500 text-white dark:text-neutral-100"
                  : message.type === "error"
                    ? "bg-red-400 dark:bg-red-500 text-white dark:text-neutral-100"
                    : "",
              )}
            >
              {logoutSuccess ? <Check /> : <X />}
            </span>
          )}
        </div>
        {!logoutSuccess && !isLoading && (
          <Button
            className="cursor-pointer dark:bg-neutral-200 dark:hover:bg-white dark:text-neutral-900 font-semibold mt-5"
            size="lg"
            onClick={() => {
              navigate("/");
            }}
          >
            <span className="pr-1">
              <House />
            </span>
            Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;
