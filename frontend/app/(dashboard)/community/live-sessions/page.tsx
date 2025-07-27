"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Search, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLiveSessions, mockExperts } from "../_data/mockData";
import { format, isPast, isFuture, isToday } from "date-fns";

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState(mockLiveSessions);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Simulate API call
    const fetchSessions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSessions(mockLiveSessions);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  // Filter sessions based on search and active tab
  const filteredSessions = sessions.filter((session) => {
    // Filter by search query
    if (
      searchQuery &&
      !session.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !session.expert.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by tab
    if (activeTab === "upcoming" && isPast(session.date)) {
      return false;
    }
    if (activeTab === "past" && isFuture(session.date)) {
      return false;
    }
    if (activeTab === "today" && !isToday(session.date)) {
      return false;
    }

    return true;
  });

  return (
    <main className="max-w-5xl mx-auto pb-16 px-4 sm:px-6">
      <div className="py-6 flex items-center">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Live Sessions
        </h1>
      </div>

      <div className="space-y-6">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 md:p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect with Experts in Live Sessions
            </h2>
            <p className="text-gray-700 mb-4">
              Join interactive live sessions with mental health professionals.
              Learn new strategies, ask questions, and connect with others
              facing similar challenges.
            </p>
            <Button>View Schedule</Button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-white border border-gray-200 w-full sm:w-auto">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sessions list */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                No sessions found
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                {searchQuery
                  ? "No sessions match your search query"
                  : activeTab === "upcoming"
                  ? "There are no upcoming sessions scheduled at the moment"
                  : activeTab === "today"
                  ? "There are no sessions scheduled for today"
                  : "There are no past sessions to view"}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {format(session.date, "EEEE, MMMM d, yyyy")} at{" "}
                          {format(session.date, "h:mm a")}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        isPast(session.date)
                          ? "secondary"
                          : isToday(session.date)
                          ? "default"
                          : "outline"
                      }
                    >
                      {isPast(session.date)
                        ? "Completed"
                        : isToday(session.date)
                        ? "Today"
                        : "Upcoming"}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mt-3 mb-4">
                    {session.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.expert.image}
                        alt={session.expert.name}
                      />
                      <AvatarFallback>
                        {session.expert.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium text-gray-900">
                        {session.expert.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.expert.role}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {session.registeredCount} registered
                      </span>
                    </div>

                    {!isPast(session.date) && <Button>Register Now</Button>}

                    {isPast(session.date) && (
                      <Button variant="outline">Watch Recording</Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
