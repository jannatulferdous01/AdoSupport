import FormInput from "@/components/form/FormInput";

export default function ContactInformation() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Contact Information
      </h2>
      <div className="space-y-4">
        <FormInput
          name="email"
          label="Email Address"
          placeholder="your.email@example.com"
          required
        />
        <FormInput
          name="phone"
          label="Phone Number"
          placeholder="(123) 456-7890"
          required
        />
      </div>
    </div>
  );
}
