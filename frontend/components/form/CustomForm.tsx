import React from "react";
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Form } from "@/components/ui/form";

interface CustomFormProps {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
  onError?: (errors: FieldErrors<FieldValues>) => void;
  defaultValues?: Record<string, any>;
  resolver?: any;
  className?: string;
}

const CustomForm = ({
  children,
  onSubmit,
  onError,
  defaultValues,
  resolver,
  className = "",
}: CustomFormProps) => {
  const formConfig: Record<string, any> = {};
  if (defaultValues) formConfig.defaultValues = defaultValues;
  if (resolver) formConfig.resolver = resolver;

  const methods = useForm(formConfig);

  const submitHandler: SubmitHandler<FieldValues> = (data: FieldValues) => {
    onSubmit(data);
    methods.reset();
  };

  return (
    <Form {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(submitHandler, onError)}
      >
        {children}
      </form>
    </Form>
  );
};

export default CustomForm;
