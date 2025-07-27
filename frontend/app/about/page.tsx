import React from "react";
import PublicNavbar from "@/components/common/PublicNavbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section with Background Grid */}
      <div className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 -z-10">
          {/* gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-blue-50/50"></div>
          <div className="h-full w-full bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              About AdoSupport
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A platform designed to empower adolescents and support parents
              through the challenges of teenage development.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                AdoSupport was founded with a clear mission: to create a safe,
                supportive environment where adolescents can navigate their
                developmental journey with confidence, while providing parents
                with the tools and resources they need to support their children
                effectively.
              </p>
              <p className="text-gray-700">
                We believe that every teenager deserves access to reliable
                information, a supportive community, and professional guidance
                as they navigate the complex challenges of adolescence.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <Image
                src="/assets/images/mission.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Safety & Privacy",
                description:
                  "We prioritize creating a secure environment where adolescents and parents can share concerns without fear.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                ),
              },
              {
                title: "Evidence-Based Support",
                description:
                  "Our resources and recommendations are grounded in scientific research and professional expertise.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                ),
              },
              {
                title: "Inclusivity",
                description:
                  "We welcome adolescents and parents from all backgrounds, cultures, and experiences.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="10" r="3"></circle>
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                  </svg>
                ),
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Our Team</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
            AdoSupport is backed by a passionate team of adolescent development
            experts, counselors, educators, and technology professionals.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Lead Adolescent Psychologist",
              },
              { name: "Michael Chen", role: "Parent Education Specialist" },
              { name: "Dr. Aisha Patel", role: "Research Director" },
              { name: "James Rodriguez", role: "Technology Director" },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-100 rounded-full w-36 h-36 mx-auto mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl text-primary/70 font-medium">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-gray-700 mb-8">
              Whether you're an adolescent looking for support or a parent
              seeking guidance, AdoSupport is here to help you navigate this
              important journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button variant="outline-secondary" size="lg" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
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
