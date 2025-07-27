"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileHeader from "./_components/ProfileHeader";
import AccountMenu from "./_components/AccountMenu";
import OverviewTab from "./_components/OverviewTab";
import SecurityTab from "./_components/SecurityTab";
import PreferencesTab from "./_components/PreferencesTab";
import ConnectedAccountsTab from "./_components/ConnectedAccountsTab";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced user data with defaults
  const userData = {
    name: user.name || "User Name",
    email: user.email || "user@example.com",
    role: user.role || "adolescent",
    joined: "May 2023",
    status: user.status || "active",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    profileImage: `/assets/images/dummy-user.png`,
    preferences: {
      notifications: true,
      emailUpdates: true,
      privacyLevel: "standard",
    },
  };

  return (
    <main className="pb-16">
      <ProfileHeader userData={userData} />

      {/* Main content area with tabs */}
      <div className="flex flex-col lg:flex-row gap-8">
        <AccountMenu router={router} />

        {/* Right column - Main content */}
        <div className="flex-1">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-white border border-gray-200 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <OverviewTab userData={userData} />
            <SecurityTab />
            <PreferencesTab />
            <ConnectedAccountsTab />
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
