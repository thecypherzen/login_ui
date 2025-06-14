/**
 * User dashboard component
 */
import { UseTheme } from "@/hooks/ThemeProvider";

const Dashboard = () => {
  const { theme } = UseTheme();
  return (
    <div
      className="min-h-[100svh] flex justify-center p-6 bg-neutral-100 dark:bg-neutral-800"
      data-theme={theme}
    >
      <h2 className="font-bold text-xl md:text-2xl dark:text-neutral-100">
        Dashboard
      </h2>
    </div>
  );
};

export default Dashboard;
