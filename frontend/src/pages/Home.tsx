/**
 * Home component - renders Login form
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UseTheme } from "@/hooks/ThemeProvider";
import { Spinner } from "@/components/index";
import { api, cache, cn } from "@/lib/utils";
import { capitalCase } from "change-case";
import cookies from "js-cookie";
import LoginForm from "@/components/forms/LoginForm";
import type { FormMessageType } from "@/components/forms/SignupForm";

const apiBaseUrl =
  import.meta.env.VITE_NODE_ENV === "dev"
    ? `${import.meta.env.VITE_API_DEV_BASE_URL}`
    : import.meta.env.VITE_API_LIVE_BASE_URL;

const Home = () => {
  const { theme } = UseTheme();
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(
    cookies.get("isLoggedIn") === "true",
  );
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<FormMessageType>({
    type: "neutral",
    message: "Signing you in...hold on tight",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<Record<string, any> | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  // auto login handler
  const autoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post(`${apiBaseUrl}/auth/login`, {});
      cache.saveData(res?.data?.user);
      setUserData(res.data?.user);
      setIsLoading(false);
      setMessage({
        type: "success",
        title: "Login success.",
        message: "Taking you in...",
      });
      setTimeout(() => {
        setLoginSuccess(true);
      }, 1500);
    } catch (err: Error | any) {
      cookies.remove("authToken");
      cookies.set("isLoggedIn", "false");
      cache.clear();
      setIsLoading(false);
      setMessage({
        type: "error",
        title: "your session expired",
        message: "Taking you back to login",
      });
      setTimeout(() => {
        setUserLoggedIn(false);
        setLoginSuccess(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (userLoggedIn && !loginSuccess) {
      autoLogin();
    } else if (userLoggedIn && loginSuccess && userData) {
      navigate(`/user/${userData.id}/dashboard`);
    }
  }, [userLoggedIn, loginSuccess]);
  return (
    <section
      id="home-page"
      className="grid grid-rows-3 grid-cols-1 items-center justify-center min-h-[calc(100svh-63px)] w-full dark:bg-neutral-800 py-10"
      data-theme={theme}
    >
      {!userLoggedIn ? (
        <div className="row-span-full w-9/10 md:w-3/5 lg:w-1/2 max-w-[700px] flex flex-col gap-7 justify-center items-center bg-neutral-100  m-auto dark:bg-neutral-900 rounded-lg py-6 lg:py-10 [&_[data-slot=form-label]]:text-neutral-600 [&_[data-slot=form-label]]:font-normal dark:[&_[data-slot=form-label]]:text-neutral-100">
          <div className="flex flex-col justify-items-center items-center gap-3">
            <h2 className="font-bold text-xl md:text-3xl dark:text-neutral-100">
              Login
            </h2>
          </div>
          {!userLoggedIn && <LoginForm />}
        </div>
      ) : (
        <div className="row-span-2 flex flex-col gap-10 justify-center items-center">
          <div className="flex flex-col gap-5 justify-items-center items-center">
            <h2 className="font-bold text-xl md:text-3xl dark:text-neutral-100">
              {!userLoggedIn ? "Login" : "Welcome back"}
            </h2>
            <p
              className={cn(
                "text-md",
                message.type === "success"
                  ? "text-green-600 dark:text-green-500"
                  : message.type === "error"
                    ? "text-red-400/90 dark:text-red-500"
                    : message.type === "warning"
                      ? "text-yellow-600 dark:text-yellow-600"
                      : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {message.title && (
                <span className="font-bold">
                  {capitalCase(message.title)}:&nbsp;
                </span>
              )}
              {message.message}
            </p>
          </div>
          {isLoading && (
            <div>
              <Spinner />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Home;
