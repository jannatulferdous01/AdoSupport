import React from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
import FormCheckbox from "@/components/form/FormCheckbox";
import CustomForm from "@/components/form/CustomForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const preferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  platformUpdates: z.boolean().default(true),
  resourceRecommendations: z.boolean().default(true),
  communityActivities: z.boolean().default(false),
});

const PreferencesTab = () => {
  const handleSubmit = (data: any) => {
    console.log("Preferences saved:", data);
    // Save preferences to backend
  };

  return (
    <TabsContent value="preferences" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Notification Preferences</h3>
          <p className="text-sm text-gray-500">
            Manage how you receive notifications
          </p>
        </div>

        <CustomForm
          onSubmit={handleSubmit}
          resolver={zodResolver(preferencesSchema)}
          defaultValues={{
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            platformUpdates: true,
            resourceRecommendations: true,
            communityActivities: false,
          }}
        >
          <div className="p-5">
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    Email notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <Switch name="emailNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    Push notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch name="pushNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">SMS notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch name="smsNotifications" />
              </div>
            </div> */}

            <div className="mt-8">
              <h4 className="font-medium text-gray-800 mb-3">
                Communication Topics
              </h4>
              <div className="space-y-4">
                <FormCheckbox
                  name="platformUpdates"
                  label="Platform updates"
                  description="New features and improvements"
                />

                <FormCheckbox
                  name="resourceRecommendations"
                  label="Resource recommendations"
                  description="Suggestions based on your interests"
                />

                <FormCheckbox
                  name="communityActivities"
                  label="Community activities"
                  description="Updates from community groups"
                />
              </div>
            </div>

            <Button type="submit" className="mt-6">
              Save Preferences
            </Button>
          </div>
        </CustomForm>
      </div>
    </TabsContent>
  );
};

export default PreferencesTab;
