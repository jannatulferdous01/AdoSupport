"use client";

import React from "react";
import {
  Bot,
  MessageCircle,
  ShoppingBag,
  Lightbulb,
  ArrowRight,
  Shield,
  BookOpen,
  PanelRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hook";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}

interface ResourceGuideProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  href: string;
}

const AdolescentHome = () => {
  const { name } = useAppSelector((state) => state.user);
  const firstName = name?.split(" ")[0] || "Friend";

  console.log(name);

  // Main feature actions
  const mainFeatures: QuickActionProps[] = [
    {
      icon: <Bot className="size-10 text-primary" />,
      title: "AI Support Assistant",
      desc: "Get personalized guidance and answers to your questions",
      href: "/adolescent/ai-chat",
    },
    {
      icon: <MessageCircle className="size-10 text-secondary" />,
      title: "Community Connect",
      desc: "Join discussions and connect with peers in a safe environment",
      href: "/adolescent/community",
    },
    {
      icon: <ShoppingBag className="size-10 text-accent" />,
      title: "AdoStore",
      desc: "Browse and purchase helpful resources for better health",
      href: "/adolescent/store",
    },
  ];

  // Resource guides
  const resourceGuides: ResourceGuideProps[] = [
    {
      icon: <Shield />,
      color: "bg-blue-500/10 text-blue-500",
      title: "Privacy & Safety",
      description:
        "Learn how we protect your privacy and ensure a safe environment for all users",
      href: "/adolescent/resources/privacy-safety",
    },
    {
      icon: <BookOpen />,
      color: "bg-purple-500/10 text-purple-500",
      title: "Using AI Support",
      description:
        "Tips for getting the most helpful responses from our AI assistant",
      href: "/adolescent/resources/ai-guide",
    },
    {
      icon: <PanelRight />,
      color: "bg-orange-500/10 text-orange-500",
      title: "Community Guidelines",
      description: "Our community values and how to have positive interactions",
      href: "/adolescent/resources/community-guidelines",
    },
  ];

  return (
    <main className="space-y-8 pb-16">
      {/* Hero section */}
      <section className="rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-8 border border-primary/10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
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

        <div className="flex flex-col md:flex-row gap-6 md:items-center relative z-10">
          <div className="flex-1">
            <div className="inline-block mb-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-primary font-medium">
              Personal Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 text-gray-600 max-w-md">
              What would you like help with today?
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/adolescent/ai-chat">
                  <Bot size={22} />
                  Talk to AI
                </Link>
              </Button>
              <Button
                variant="outline-secondary"
                asChild
                size="lg"
                className="gap-2"
              >
                <Link href="/adolescent/community">
                  <MessageCircle size={18} />
                  Browse Community
                </Link>
              </Button>
            </div>
          </div>

          {/* <div className="hidden md:flex justify-end relative">
            <div className="relative z-10">
              <Image
                src="/assets/images/adolescent-home.png"
                alt="Supporting visual"
                width={220}
                height={220}
                className="drop-shadow-md"
              />
            </div>
          </div> */}

          {/* <div className="hidden md:flex justify-end relative">
            <div className="relative z-10 flex items-end">
              <div className="bg-primary/10 rounded-2xl p-4 mb-6 mr-2 w-36">
                <p className="text-sm font-medium text-primary">
                  How can I help you today?
                </p>
                <div className="absolute -bottom-2 -left-2">
                  <Bot size={24} className="text-primary" />
                </div>
              </div>
              <div className="bg-white shadow-sm border rounded-2xl p-4 w-32">
                <p className="text-sm text-gray-700">
                  I'd like to talk about...
                </p>
                <div className="flex space-x-1 mt-2">
                  <div className="w-6 h-2 rounded-full bg-primary/30 animate-pulse"></div>
                  <div className="w-4 h-2 rounded-full bg-primary/20"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/10"></div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="hidden md:flex justify-end relative">
            {/* Enhanced conversational bubbles with better styling and animation */}
            <div className="relative z-10 flex items-end">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm rounded-2xl p-5 mb-6 mr-3 w-40 shadow-sm border border-primary/20">
                  <p className="text-sm font-medium text-primary leading-snug">
                    How can I help you today?
                  </p>
                  <div className="absolute -bottom-3 -left-2 bg-primary/10 rounded-full p-1.5 border border-primary/20 shadow-sm">
                    <Bot size={26} className="text-primary" />
                  </div>
                </div>
                <div
                  className="absolute -top-10 left-4 w-12 h-12 rounded-full bg-primary/5 animate-pulse"
                  style={{ animationDuration: "4s" }}
                ></div>
                <div
                  className="absolute -top-6 left-14 w-8 h-8 rounded-full bg-secondary/5 animate-pulse"
                  style={{ animationDuration: "6s" }}
                ></div>
              </div>

              <div className="relative">
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 w-36">
                  <p className="text-sm text-gray-800 font-medium mb-1 leading-snug">
                    I'd like to talk about...
                  </p>
                  <div className="flex space-x-1.5 mt-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{
                        animationDelay: "0ms",
                        animationDuration: "1.2s",
                      }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{
                        animationDelay: "200ms",
                        animationDuration: "1.2s",
                      }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{
                        animationDelay: "400ms",
                        animationDuration: "1.2s",
                      }}
                    ></div>
                  </div>
                  <div className="absolute -bottom-3 -right-2 bg-gray-100 rounded-full p-1.5 border border-gray-200 shadow-sm">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <div
                  className="absolute -top-8 right-2 w-10 h-10 rounded-full bg-secondary/5 animate-pulse"
                  style={{ animationDuration: "5s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main features highlight */}
      <section>
        <h2 className="text-xl font-bold mb-4">Our Support Features</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {mainFeatures.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{feature.desc}</p>
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Access Now
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource Guides */}
      <section className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Resource Guides</h2>
            <p className="text-gray-600 text-sm mt-1">
              Helpful information to make the most of our platform
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary">
            <Link href="/adolescent/resources">View All Resources</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {resourceGuides.map((guide, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow transition-shadow border border-gray-100"
            >
              <div
                className={`${guide.color} w-10 h-10 rounded-full flex items-center justify-center mb-4`}
              >
                {guide.icon}
              </div>
              <h3 className="font-semibold mb-2">{guide.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {guide.description}
              </p>
              <Link
                href={guide.href}
                className="text-primary font-medium text-sm inline-flex items-center hover:underline"
              >
                Learn more
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section>
        <div className="bg-white rounded-xl overflow-hidden shadow border border-gray-100">
          <div className="bg-gradient-to-r from-secondary/80 to-secondary p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="size-5" />
                  <h3 className="text-xl font-bold">Need immediate support?</h3>
                </div>
                <p className="text-white/90">
                  Our support team is available 24/7 to help with any urgent
                  concerns.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="bg-white text-secondary hover:bg-white/90"
                  asChild
                >
                  <Link href="/adolescent/support">Talk to Someone Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdolescentHome;
