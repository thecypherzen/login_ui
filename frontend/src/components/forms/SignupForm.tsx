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
import { Link } from "react-router";
import { cn } from "@/lib/utils";

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
  const generatedForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const formOnSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="password"
            inputType="password"
            control={generatedForm.control}
            label="Password"
          />
        </div>
        <div className="flex flex-col gap-y-4 items-center justify-between md:flex-row text-sm lg:text-base">
          <Button className="cursor-pointer dark:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-neutral-900 w-full md:w-auto">
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
              placeholder={props.placeholder}
              {...field}
              type={props.inputType}
              className={cn(
                "py-5 md:py-6 dark:text-neutral-200",
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
};

export default LoginForm;
