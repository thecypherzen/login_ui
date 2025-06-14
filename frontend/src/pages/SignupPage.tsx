/**
 * Signup page
 */
import SignupForm from "@/components/forms/SignupForm";
import { UseTheme } from "@/hooks/ThemeProvider";

const SignupPage = () => {
  const { theme } = UseTheme();
  return (
    <section
      id="login-form"
      className="flex flex-col items-center justify-center min-h-[calc(100svh-63px)] dark:bg-neutral-800 py-10"
      data-theme={theme}
    >
      <div className="w-9/10 md:w-3/5 lg:w-1/2 max-w-[700px] flex flex-col gap-7 justify-center items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg py-5 lg:py-10 [&_[data-slot=form-label]]:text-neutral-600 [&_[data-slot=form-label]]:font-normal dark:[&_[data-slot=form-label]]:text-neutral-100">
        <div className="text-center">
          <h2 className="font-bold text-xl md:text-3xl dark:text-neutral-100 mb-2">
            Signup
          </h2>
          <p className="text-neutral-400 text-sm">
            Enter your email and password below to create an account
          </p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
};

export default SignupPage;
