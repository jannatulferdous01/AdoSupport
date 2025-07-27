import { z } from "zod";

// Form validation schema
export const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  paymentMethod: z.enum(["credit", "paypal"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  saveInfo: z.boolean().optional(),
  createAccount: z.boolean().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;