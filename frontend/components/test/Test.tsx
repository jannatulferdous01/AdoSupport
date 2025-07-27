"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormCheckbox from "@/components/form/FormCheckbox";
import FormTextarea from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import CustomCalendar from "../form/CustomCalendar";

const formSchema = z.object({
  // name: z.string().min(2, "Name must be at least 2 characters"),
  // email: z.string().email("Please enter a valid email"),
  // age: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
  //   message: "Age must be a number",
  // }),
  // topic: z.string().min(1, "Please select a topic"),
  // message: z.string().min(10, "Message must be at least 10 characters"),
  // subscribe: z.boolean().optional(),
  appointmentDate: z.date({
    required_error: "Please select an appointment date",
  }),
});

export default function Test() {
  const handleSubmit = (data: FieldValues) => {
    console.log("Form submitted:", data);
    console.log(new Intl.DateTimeFormat("en-US").format(data.appointmentDate));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Form</h1>

      <CustomForm
        onSubmit={handleSubmit}
        resolver={zodResolver(formSchema)}
        defaultValues={{
          // name: "",
          // email: "",
          // age: "",
          // topic: "",
          // message: "",
          // subscribe: false,
          appointmentDate: undefined,
        }}
        className="space-y-6"
      >
        {/* <FormInput
          name="name"
          label="Full Name"
          placeholder="Enter your name"
          required
        /> */}
        {/* <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
        />
        <FormInput
          name="age"
          label="Age"
          type="number"
          placeholder="Your age"
        />
        <FormSelect
          name="topic"
          label="Topic"
          placeholder="Select a topic"
          options={[
            { label: "General Inquiry", value: "general" },
            { label: "Technical Support", value: "support" },
            { label: "Feedback", value: "feedback" },
          ]}
          required
        />
        <FormTextarea
          name="message"
          label="Your Message"
          placeholder="Write your message here..."
          rows={4}
          required
        />
        <FormCheckbox
          name="subscribe"
          label="Subscribe to newsletter"
          description="Receive updates and offers via email"
        /> */}
        <CustomCalendar
          name="appointmentDate"
          label="Appointment Date"
          required
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </CustomForm>
    </div>
  );
}
