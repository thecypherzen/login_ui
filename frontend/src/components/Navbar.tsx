/**
 * Navbar: App's main nav component
 */
import { ContentWrapper } from "@/components/index";
import { SunMedium, Moon } from "lucide-react";
import { UseTheme } from "@/hooks/ThemeProvider";
import { Button } from "@/components/ui/button";

const AppNavBar = () => {
  const { theme, setTheme } = UseTheme();
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    window.localStorage.setItem("login_ui_theme", newTheme);
  };

  return (
    <div
      className="p-1 sticky z-20 bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-neutral-900"
      onClick={toggleTheme}
      data-theme={theme}
    >
      <ContentWrapper className="flex felx-col justify-center items-center">
        <div className="cursor-pointer rounded-sm p-2">
          <Button
            asChild
            size="icon"
            className="p-1 duration-500 transition-all hover:text-neutral-500 dark:hover:text-neutral-700"
            variant="ghost"
          >
            {theme === "light" ? <SunMedium /> : <Moon />}
          </Button>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default AppNavBar;
