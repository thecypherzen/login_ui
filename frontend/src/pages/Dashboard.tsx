/**
 * User dashboard component
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/index";
import { MoveRight } from "lucide-react";
import { UseTheme } from "@/hooks/ThemeProvider";
import { cache } from "@/lib/utils";

const Dashboard = () => {
  const { theme } = UseTheme();
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [initPass, setInitPass] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // functions and handlers
  // load data from cache
  const loadData = async () => {
    const user = await cache.getData();
    if (user) {
      const name = user.username.split("@")[0];
      setUserName(name);
      setTimeout(() => {
        setInitPass(id === user.id);
      }, 2000);
    } else {
      setTimeout(() => {
        setInitPass(false);
      }, 1000);
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

  useEffect(() => {
    if (initPass === false) {
      navigate("/");
    }
  }, [initPass]);

  return (
    <div
      className="min-h-[calc(100svh-62px)] grid grid-rows-3 justify-center items-center p-6 bg-neutral-100 dark:bg-neutral-800"
      data-theme={theme}
    >
      {initPass === undefined ? (
        <div className="row-span-2">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10 row-span-2">
          <h2 className="font-bold text-xl md:text-2xl dark:text-neutral-100">
            {`${userName ? userName : "User"}'s `}Dashboard
          </h2>
          <div>
            <Button
              className="cursor-pointer dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 text-md font-semibold"
              size="lg"
              onClick={logoutHandler}
            >
              Logout
              <span className="pl-1">
                {isLoading ? <Spinner /> : <MoveRight />}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
