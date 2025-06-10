import { createContext, useContext, useState } from "react";

// theme context
const ThemeContext = createContext<ThemeContextType>({
  theme: "",
  setTheme: () => {},
});

// theme provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    window.localStorage.getItem("login_ui_theme") || "light",
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// custom useTheme hook
const UseTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used withina ThemProvider");
  }
  return context;
};

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

export { ThemeContext, ThemeProvider, UseTheme };
