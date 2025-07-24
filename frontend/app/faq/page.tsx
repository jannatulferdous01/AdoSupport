"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/common/PublicNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqItems = [
    {
      id: "faq-1",
      category: "general",
      question: "What is AdoSupport?",
      answer:
        "AdoSupport is a platform designed to support adolescents and parents through the challenges of teenage development. We provide resources, community support, and expert guidance to help navigate this important life stage.",
    },
    {
      id: "faq-2",
      category: "general",
      question: "Is AdoSupport free to use?",
      answer:
        "Yes, AdoSupport offers a free basic membership that gives access to essential resources and community features. We also offer premium subscriptions with additional features and personalized support.",
    },
    {
      id: "faq-3",
      category: "adolescents",
      question: "Is my information private as a teenage user?",
      answer:
        "Yes, we take privacy very seriously, especially for our adolescent users. Your personal information and conversations are kept confidential. Parents do not have access to your private conversations unless you choose to share them.",
    },
    {
      id: "faq-4",
      category: "adolescents",
      question: "How can I connect with other teens on the platform?",
      answer:
        "You can connect with peers through our moderated community forums and interest groups. All community interactions are supervised by trained moderators to ensure a safe, supportive environment.",
    },
    {
      id: "faq-5",
      category: "parents",
      question:
        "How can I monitor my child's activity while respecting their privacy?",
      answer:
        "Our platform offers a balanced approach to monitoring. You'll receive general updates about your child's engagement with the platform and alerts about potential concerns, without accessing their private conversations.",
    },
    {
      id: "faq-6",
      category: "parents",
      question: "What resources are available for parents?",
      answer:
        "Parents have access to educational articles, expert webinars, discussion forums with other parents, and personalized guidance on how to support their adolescent through specific challenges.",
    },
    {
      id: "faq-7",
      category: "technical",
      question: "Can I use AdoSupport on my phone?",
      answer:
        "Yes, AdoSupport is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android for a better mobile experience.",
    },
    {
      id: "faq-8",
      category: "technical",
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send a password reset link to your registered email address.",
    },
  ];

  const filteredFaqs = faqItems.filter(
    (faq) =>
      (activeTab === "all" || faq.category === activeTab) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-white to-white"></div>
          <div className="h-full w-full bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Find answers to common questions about AdoSupport and how we can
              help adolescents and parents.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <section className="py-12 bg-white">
        <div className="container">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {[
              { id: "all", label: "All Questions" },
              { id: "general", label: "General" },
              { id: "adolescents", label: "For Adolescents" },
              { id: "parents", label: "For Parents" },
              { id: "technical", label: "Technical" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="py-5">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full justify-between items-start text-left"
                  >
                    <span className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {openItems[faq.id] ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </button>

                  {openItems[faq.id] && (
                    <div className="mt-3 pr-12">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  No results found for "{searchQuery}"
                </p>
                <Button variant="link" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-gray-700 mb-8">
              Can't find what you're looking for? Our support team is here to
              help with any questions about AdoSupport.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="outline-secondary" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/register">Join AdoSupport</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Helpful Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started Guide",
                description:
                  "A comprehensive guide to help you make the most of AdoSupport's features.",
                link: "/resources/getting-started",
              },
              {
                title: "Privacy Policy",
                description:
                  "Learn about how we protect your data and privacy on our platform.",
                link: "/privacy-policy",
              },
              {
                title: "Community Guidelines",
                description:
                  "Our rules and expectations for positive community interaction.",
                link: "/community-guidelines",
              },
            ].map((resource, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button variant="link" className="p-0" asChild>
                  <Link href={resource.link}>Read More →</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t">
        <div className="container text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AdoSupport. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
