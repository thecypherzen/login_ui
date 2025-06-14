import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/index";
import { capitalCase } from "change-case";
import axios from "axios";

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
  const navigate = useNavigate();
  const delay = 1000;
  const generatedForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const hideSpinner = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  };

  const clearError = () => {
    setShowMessage(false);
    setMessage(undefined);
  };

  const formOnSubmit = async (values: z.infer<typeof formSchema>) => {
    clearError();
    setIsLoading(true);
    const baseUrl =
      import.meta.env.VITE_NODE_ENV === "dev"
        ? `${import.meta.env.VITE_API_DEV_BASE_URL}`
        : import.meta.env.VITE_API_LIVE_BASE_URL;
    try {
      const res = await axios.post(
        `${baseUrl}/auth/signup`,
        { ...values },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(res);
      setMessage({
        type: "success",
        message: "Account created. Taking you to login page",
      });
      setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }, delay);
    } catch (err: Error | any) {
      console.error(err);
      setMessage({
        type: "error",
        message: `${err?.response?.data?.message ?? "Sign up failed for some reason"}.`,
      });
      setTimeout(() => {
        setShowMessage(true);
      }, delay);
    } finally {
      hideSpinner();
    }
  };

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
            disabled={isLoading}
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="password"
            inputType="password"
            control={generatedForm.control}
            label="Password"
            disabled={isLoading}
          />
        </div>
        {showMessage && message && (
          <div>
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
              <strong>{capitalCase(message.type)}:&nbsp;</strong>
              {message.message}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-y-4 items-center justify-between md:flex-row text-sm lg:text-base">
          <Button className="cursor-pointer dark:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-neutral-900 w-full md:w-auto">
            {isLoading && (
              <span className="space-x-2">
                <Spinner />
              </span>
            )}
            Create Account
          </Button>
          <p className="text-neutral-500 flex flex-col gap-y-1 text-center md:flex-row md:text-left">
            Already have an account?&nbsp;
            <Link
              className="text-neutral-900 font-semibold hover:cursor-pointer hover:underline active:underline dark:text-neutral-200"
              to="/"
            >
              Login
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
              disabled={props.disabled}
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
  disabled?: boolean;
};

type FormMessageType = {
  type: "success" | "error" | "warning" | "neutral";
  message: string;
};

export default LoginForm;
export type { FormMessageType };
