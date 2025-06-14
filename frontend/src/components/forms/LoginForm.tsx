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
import { cn } from "@/lib/utils";
import { capitalCase } from "change-case";
import axios from "axios";
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
  const hideSpinner = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  };

  const clearMessage = () => {
    setShowMessage(false);
    setMessage(undefined);
  };

  const formOnSubmit = async (values: z.infer<typeof formSchema>) => {
    clearMessage();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${apiBaseUrl}/auth/login`,
        {
          ...values,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
        },
      );
      console.log(res);
      setMessage({ type: "success", message: "Taking you in..." });
      setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => {
          navigate("/user/me/dashboard");
        }, delay / 1.5);
      }, delay);
    } catch (err: Error | any) {
      console.error(err);
      if (err.status === 404) {
        setUserNotFound(true);
        setMessage({
          type: "error",
          message:
            err?.status === 404
              ? "User account not found"
              : (err?.response?.message ?? err?.message),
        });
        setTimeout(() => {
          setShowMessage(true);
        }, delay);
      }
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    // do nothing
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
                "text-sm px-1 text-green-500",
                message.type === "error"
                  ? "text-destructive"
                  : "text-neutral-300 dark:text-neutral-200",
              )}
            >
              {`${capitalCase(message.type)}: ${message.message}`}
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
type LoginFormPropsType = {
  className?: string;
};

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
