/**
 * AppLayout: defines app's basic ui structure
 */
import { Outlet } from "react-router";
import { Navbar, ProgressBar } from "@/components/index.js";

// component definition
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
