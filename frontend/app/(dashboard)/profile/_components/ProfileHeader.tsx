import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  userData: {
    name: string;
    email: string;
    role: string;
    joined: string;
    phone: string;
    location: string;
    profileImage: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  return (
    <section className="relative bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-primary/30 h-full" />
          ))}
        </div>
        <div className="grid grid-rows-6 w-full absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-primary/30 w-full" />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 ring-4 ring-white shadow-md overflow-hidden">
              <Image
                src={userData.profileImage}
                alt={userData.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {userData.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="capitalize border-primary/30 text-primary"
                  >
                    {userData.role}
                  </Badge>
                </div>
                <p className="text-gray-500 mt-1">
                  Member since {userData.joined}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link href="/profile/edit">
                    <Edit size={16} />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Mail size={15} className="text-gray-400" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Phone size={15} className="text-gray-400" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin size={15} className="text-gray-400" />
                <span>{userData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
