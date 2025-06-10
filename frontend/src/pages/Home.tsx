import LoginForm from "@/components/forms/LoginForm";
import { UseTheme } from "@/hooks/ThemeProvider";

const Home = () => {
  const { theme } = UseTheme();
  return (
    <section
      id="login-form"
      className="flex flex-col items-center justify-center min-h-[calc(100svh-63px)]"
      data-theme={theme}
    >
      <div className="w-9/10 md:w-1/2 flex flex-col justify-center items-center bg-neutral-100 rounded-lg px-10 py-20 [&_[data-slot=form-label]]:text-neutral-600 [&_[data-slot=form-label]]:font-normal dark:[&_[data-slot=form-label]]:text-neutral-100">
        <LoginForm />
      </div>
    </section>
  );
};

export default Home;
