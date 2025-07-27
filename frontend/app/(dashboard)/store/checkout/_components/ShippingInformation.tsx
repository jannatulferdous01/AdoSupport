import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormCheckbox from "@/components/form/FormCheckbox";

// US States options
const stateOptions = [
  { label: "California", value: "CA" },
  { label: "New York", value: "NY" },
  { label: "Texas", value: "TX" },
  { label: "Florida", value: "FL" },
  { label: "Illinois", value: "IL" },
  // Add more states as needed
];

export default function ShippingInformation() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Shipping Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="John"
          required
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
        />
        <div className="sm:col-span-2">
          <FormInput
            name="address"
            label="Street Address"
            placeholder="123 Main St, Apt 4B"
            required
          />
        </div>
        <FormInput
          name="city"
          label="City"
          placeholder="San Francisco"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="state"
            label="State"
            options={stateOptions}
            required
          />
          <FormInput
            name="zipCode"
            label="ZIP Code"
            placeholder="94103"
            required
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <FormCheckbox
          name="saveInfo"
          label="Save this information for next time"
        />
        <FormCheckbox
          name="createAccount"
          label="Create an account for faster checkout"
        />
      </div>
    </div>
  );
}
