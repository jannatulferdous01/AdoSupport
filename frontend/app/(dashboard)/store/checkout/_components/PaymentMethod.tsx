import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CreditCard, Shield } from "lucide-react";
import FormInput from "@/components/form/FormInput";
import FormRadioGroup from "@/components/form/FormRadioGroup";

export default function PaymentMethod() {
  const { watch } = useFormContext();
  const paymentMethod = watch("paymentMethod") || "credit";

  const paymentOptions = [
    {
      label: "Credit / Debit Card",
      value: "credit",
      icon: <CreditCard className="h-5 w-5 text-gray-600" />,
    },
    {
      label: "PayPal",
      value: "paypal",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.5 9.5C19.5 13.09 16.59 16 13 16H9.5L8 21M7.5 7.5C7.5 3.91 10.41 1 14 1H17.5L19 6"
            stroke="#3b7bbf"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

      <FormRadioGroup
        name="paymentMethod"
        options={paymentOptions}
        orientation="vertical"
      />

      {paymentMethod === "credit" && (
        <div className="mt-4 space-y-4">
          <FormInput
            name="cardName"
            label="Name on Card"
            placeholder="John Doe"
            required
          />
          <FormInput
            name="cardNumber"
            label="Card Number"
            placeholder="XXXX XXXX XXXX XXXX"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="cardExpiry"
              label="Expiration Date"
              placeholder="MM/YY"
              required
            />
            <FormInput name="cardCvv" label="CVV" placeholder="123" required />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center text-sm">
        <Shield className="h-4 w-4 text-gray-500 mr-2" />
        <p className="text-gray-600">
          Your payment information is securely processed
        </p>
      </div>
    </div>
  );
}
