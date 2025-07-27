"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { PostData } from "../../_services/mockPostsApi";

interface AuthorInformationProps {
  author: PostData["author"];
}

export default function AuthorInformation({ author }: AuthorInformationProps) {
  const getRoleBadge = (role: string) => {
    const colors = {
      adolescent: "bg-blue-50 text-blue-600",
      parent: "bg-green-50 text-green-600",
      expert: "bg-purple-50 text-purple-600",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Author Information</h3>

      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">{author.name}</p>
          <div className="flex items-center gap-2">
            {getRoleBadge(author.role)}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {author.age && (
          <div className="flex justify-between">
            <span className="text-gray-500">Age:</span>
            <span className="font-medium">{author.age} years</span>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full">
        <User className="mr-2 h-4 w-4" />
        View Author Profile
      </Button>
    </div>
  );
}