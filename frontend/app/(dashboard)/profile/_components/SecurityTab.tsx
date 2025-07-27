import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Shield } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

const SecurityTab = () => {
  return (
    <TabsContent value="security" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Security Settings</h3>
          <p className="text-sm text-gray-500">Manage your account security</p>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Password</p>
                <p className="text-sm text-gray-600">Last updated 2 days ago</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/password">Change</Link>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">
                  Two-factor authentication
                </p>
                <p className="text-sm text-gray-600">Not enabled</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/2fa">Setup</Link>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Active sessions</p>
                <p className="text-sm text-gray-600">1 active session</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/sessions">Manage</Link>
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default SecurityTab;
