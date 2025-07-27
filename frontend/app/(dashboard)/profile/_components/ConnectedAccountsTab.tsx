import React from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

const ConnectedAccountsTab = () => {
  return (
    <TabsContent value="connected" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Connected Accounts</h3>
          <p className="text-sm text-gray-500">
            Manage your connected accounts and services
          </p>
        </div>

        <div className="p-5">
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4285F4] rounded flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Google</p>
                  <p className="text-sm text-gray-600">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1877F2] rounded flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Facebook</p>
                  <p className="text-sm text-gray-600">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Connecting accounts allows for quicker sign-in and enhanced account
            recovery options.
          </p>
        </div>
      </div>
    </TabsContent>
  );
};

export default ConnectedAccountsTab;
