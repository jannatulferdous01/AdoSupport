"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockExperts, mockLiveSessions } from "../_data/mockData";
import { format } from "date-fns";

export default function ExpertsPage() {
  const [experts, setExperts] = useState(mockExperts);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call
    const fetchExperts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setExperts(mockExperts);
      setLoading(false);
    };

    fetchExperts();
  }, []);

  // Filter experts based on search query
  const filteredExperts = experts.filter((expert) => {
    if (!searchQuery) return true;

    return (
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Get upcoming session for each expert
  const getUpcomingSession = (expertId: string) => {
    return mockLiveSessions
      .filter(
        (session) =>
          session.expert.id === expertId && new Date(session.date) > new Date()
      )
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];
  };

  return (
    <main className="max-w-5xl mx-auto pb-16 px-4 sm:px-6">
      <div className="py-6 flex items-center">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Expert Directory
        </h1>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Input
            placeholder="Search by name, role or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Experts list */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
          ) : filteredExperts.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                No experts found
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                Try adjusting your search query to find experts in our directory
              </p>
            </div>
          ) : (
            filteredExperts.map((expert) => {
              const upcomingSession = getUpcomingSession(expert.id);

              return (
                <div
                  key={expert.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={expert.image} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-gray-600">{expert.role}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-4 text-sm line-clamp-3">
                      {expert.bio}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {expert.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="bg-gray-100"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {upcomingSession && (
                      <div className="mt-4 bg-primary/5 rounded-md p-3">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Upcoming Session
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {upcomingSession.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {format(upcomingSession.date, "MMM d, h:mm a")}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
