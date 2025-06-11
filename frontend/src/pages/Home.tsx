import LoginForm from "@/components/forms/LoginForm";
import { UseTheme } from "@/hooks/ThemeProvider";

const Home = () => {
  const { theme } = UseTheme();
  return (
    <section
      id="login-form"
      className="flex flex-col items-center justify-center min-h-[calc(100svh-63px)] dark:bg-neutral-800 py-10"
      data-theme={theme}
    >
      <div className="w-9/10 md:w-3/5 lg:w-1/2 flex flex-col gap-7 justify-center items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg py-5 lg:py-10 [&_[data-slot=form-label]]:text-neutral-600 [&_[data-slot=form-label]]:font-normal dark:[&_[data-slot=form-label]]:text-neutral-100">
        <h2 className="font-bold text-xl md:text-3xl dark:text-neutral-100">
          Login
        </h2>
        <LoginForm />
      </div>
    </section>
  );
};

export default Home;
