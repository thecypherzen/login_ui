import { Outlet } from "react-router";
import { Navbar, ProgressBar } from "@/components/index.js";

const AppLayout = () => {
  return (
    <div>
      <ProgressBar />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
