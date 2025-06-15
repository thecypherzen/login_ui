/**
 * Login form component for login page
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Spinner } from "@/components/index";
import { api, cache, cn } from "@/lib/utils";
import { capitalCase } from "change-case";
import cookies from "js-cookie";
import type { FormMessageType } from "@/components/forms/SignupForm";

const apiBaseUrl =
  import.meta.env.VITE_NODE_ENV === "dev"
    ? `${import.meta.env.VITE_API_DEV_BASE_URL}`
    : import.meta.env.VITE_API_LIVE_BASE_URL;

// form schema
const formSchema = z.object({
  username: z
    .string({
      required_error: "required",
    })
    .min(3, "Must be at least 3 characters long")
    .email("Enter a valid email"),
  password: z
    .string({
      required_error: "required",
    })
    .min(8, "Must be at least 8 characters long"),
});

// Form component
const LoginForm: React.FC<LoginFormPropsType> = ({ className }) => {
  // state variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<FormMessageType | undefined>(
    undefined,
  );
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const navigate = useNavigate();
  const generatedForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const delay = 2000;

  // hide spinner controller
  const hideSpinner = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  };

  // clear ui error handler
  const clearMessage = () => {
    setShowMessage(false);
    setMessage(undefined);
    setUserNotFound(false);
  };

  // form onsubmit handler
  const formOnSubmit = async (values: z.infer<typeof formSchema>) => {
    clearMessage();
    setIsLoading(true);
    try {
      // request to api
      const res = await api.post(`${apiBaseUrl}/auth/login`, { ...values });
      // set success message
      setMessage({
        type: "success",
        title: "login successful",
        message: "Taking you in...",
      });
      cache.saveData(res?.data?.user);
      cookies.set("isLoggedIn", "true");
      // display message and redirect to dashboard on success
      setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => {
          navigate("/user/me/dashboard");
        }, delay / 1.5);
      }, delay);
    } catch (err: Error | any) {
      if (err?.status === 404) {
        setUserNotFound(true);
      }
      // set error message and display error message on failure
      setMessage({
        type: "error",
        title: "unauthorised",
        message:
          err?.status === 404
            ? "User account not found"
            : (err?.response?.data?.message ?? err?.message),
      });
      setTimeout(() => {
        setShowMessage(true);
      }, delay);
    } finally {
      // hide spinner
      hideSpinner();
    }
  };

  useEffect(() => {
    // track loading state
  }, [isLoading]);

  return (
    <Form {...generatedForm}>
      <form
        onSubmit={generatedForm.handleSubmit(formOnSubmit)}
        className={cn("space-y-6 w-4/5", className)}
      >
        <div>
          <LoginFormField
            name="username"
            placeholder="your username"
            inputType="email"
            control={generatedForm.control}
            label="Username"
            inputDisabled={isLoading}
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="password"
            inputType="password"
            control={generatedForm.control}
            label="Password"
            inputDisabled={isLoading}
          />
        </div>
        {showMessage && message && (
          <div className="animate-all duration-500">
            <p
              className={cn(
                "text-sm px-1",
                message.type === "error"
                  ? "text-destructive"
                  : message.type === "success"
                    ? "text-green-500"
                    : "text-neutral-300 dark:text-neutral-200",
              )}
            >
              {message.title && (
                <span className="font-bold">
                  {`${capitalCase(message.title)}: `}&nbsp;
                </span>
              )}
              {message.message}
              {userNotFound && (
                <span>
                  .&nbsp;Click&nbsp;
                  <strong>Sign up</strong>&nbsp; to register.
                </span>
              )}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-y-4 items-center justify-between md:flex-row text-sm lg:text-base">
          <Button
            disabled={isLoading}
            className="cursor-pointer dark:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-neutral-900 w-full md:w-auto"
          >
            {isLoading && (
              <span className="space-x-2">
                <Spinner />
              </span>
            )}{" "}
            Submit
          </Button>
          <p className="text-neutral-500 flex flex-col gap-y-1 text-center md:flex-row md:text-left">
            Don't have an account?&nbsp;
            <Link
              className="text-neutral-900 font-semibold hover:cursor-pointer hover:underline active:underline dark:text-neutral-200"
              to="/auth/signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

// form field definition
const LoginFormField: React.FC<LoginFormFieldPropsType> = ({ ...props }) => {
  return (
    <FormField
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input
              disabled={props.inputDisabled}
              placeholder={props.placeholder}
              {...field}
              type={props.inputType}
              className={cn(
                "py-5 md:py-6 dark:text-neutral-200 bg-white",
                props.inputClassName,
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Types
// form props type
type LoginFormPropsType = {
  className?: string;
};

// form field type
type LoginFormFieldPropsType = {
  name: FieldPath<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema>, any>;
  inputType: string;
  placeholder?: string;
  description?: string;
  label?: string;
  inputClassName?: string;
  inputDisabled?: boolean;
};

export default LoginForm;
