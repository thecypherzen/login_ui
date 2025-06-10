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
import type {
  Control,
  ControllerRenderProps,
  FieldPath,
} from "@react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// form schema
const formSchema = z.object({
  username: z
    .string({
      required_error: "required",
    })
    .email("Expects a valid email"),
  password: z.string({
    required_error: "required",
  }),
});

// Form component
const LoginForm: React.FC<LoginFormPropsType> = ({ className }) => {
  const generatedForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
            inputClassName="py-6"
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="password"
            inputType="password"
            control={generatedForm.control}
            label="Password"
            inputClassName="py-6"
          />
        </div>
        <Button className="cursor-pointer">Submit</Button>
      </form>
    </Form>
  );
};

const LoginFormField: React.FC<LoginFormFieldPropsType> = ({ ...props }) => {
  return (
    <FormField
      className={props.className}
      name={props.name}
      control={props.control}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={props.inputType}
              className={props.inputClassName}
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
  className?: string;
  inputClassName?: string;
};

export default LoginForm;
