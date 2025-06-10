import { ContentWrapper } from "@/components/index";
import { SunMedium, Moon } from "lucide-react";
import { UseTheme } from "@/hooks/ThemeProvider";
import { Button } from "@/components/ui/button";

const AppNavBar = () => {
  const { theme, setTheme } = UseTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    window.localStorage.setItem("login_ui_theme", theme);
  };

  return (
    <div
      className="p-1 bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100"
      onClick={toggleTheme}
      data-theme={theme}
    >
      <ContentWrapper className="flex justify-center items-center">
        <div className="cursor-pointer rounded-sm p-2">
          <Button
            asChild
            size="icon"
            className="p-1 duration-500 transition-all dark:hover:text-neutral-700"
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
