import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
