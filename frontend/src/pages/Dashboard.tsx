/**
 * User dashboard component
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/index";
import { LogOut } from "lucide-react";
import { UseTheme } from "@/hooks/ThemeProvider";
import { cache } from "@/lib/utils";

const Dashboard = () => {
  const { theme } = UseTheme();
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // functions and handlers
  // load data from cache
  const loadData = async () => {
    const user = await cache.getData();
    if (user) {
      const name = user.username.split("@")[0];
      setUserName(name);
    }
  };

  // onclick handler
  const logoutHandler = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/auth/logout");
    }, 500);
  };

  // load data on render
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      className="min-h-[100svh] flex justify-center p-6 bg-neutral-100 dark:bg-neutral-800"
      data-theme={theme}
    >
      <div className="flex flex-col items-center mt-10 gap-5">
        <h2 className="font-bold text-xl md:text-2xl dark:text-neutral-100">
          {`${userName ? userName : "User"}'s `}Dashboard
        </h2>
        <div>
          <Button
            className="cursor-pointer dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 text-md font-semibold"
            size="lg"
            onClick={logoutHandler}
          >
            <span className="pr-1">{isLoading ? <Spinner /> : <LogOut />}</span>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
