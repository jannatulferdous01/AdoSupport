import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, Bell } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

interface OverviewTabProps {
  userData: {
    name: string;
    email: string;
    role: string;
    joined: string;
    phone: string;
    location: string;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userData }) => {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Profile Information</h3>
          <p className="text-sm text-gray-500">
            Your basic account information
          </p>
        </div>

        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <div className="text-gray-800">{userData.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <div className="text-gray-800">{userData.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Phone Number
              </label>
              <div className="text-gray-800">{userData.phone}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Location
              </label>
              <div className="text-gray-800">{userData.location}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Account Type
              </label>
              <div className="text-gray-800 capitalize">{userData.role}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Member Since
              </label>
              <div className="text-gray-800">{userData.joined}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button asChild>
              <Link href="/profile/edit">Edit Information</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Activity summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
          <p className="text-sm text-gray-500">
            Your latest actions and sessions
          </p>
        </div>

        <div className="p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">Password changed</p>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  You updated your account password successfully
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">Profile updated</p>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  You updated your profile information
                </p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="mt-6 w-full">
            View All Activity
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
