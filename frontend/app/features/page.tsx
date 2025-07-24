import React from "react";
import PublicNavbar from "@/components/common/PublicNavbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 -z-10">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-white to-blue-50/50"></div>
          <div className="h-full w-full bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Platform Features
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Discover the powerful tools and resources that make AdoSupport the
              leading platform for adolescent development and parental guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">
              Core Features
            </h2>
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              Our platform offers specialized tools for both adolescents and
              parents, ensuring everyone gets the support they need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Guidance",
                description:
                  "Our advanced AI chatbot provides personalized advice and resources for common adolescent challenges.",
                image: "/assets/images/features/ai.svg",
              },
              {
                title: "Supportive Community",
                description:
                  "Connect with peers and experts in our moderated, safe community forums and discussion groups.",
                image: "/assets/images/features/community.svg",
              },
              {
                title: "Resource Library",
                description:
                  "Access our extensive collection of articles, videos, and interactive tools on adolescent development.",
                image: "/assets/images/features/resources.svg",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="h-48 relative mb-6">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Adolescents Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-primary font-medium text-sm mb-4">
                For Adolescents
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Empowering Young Minds
              </h2>

              <div className="space-y-4">
                {[
                  "Confidential support through chat and forums",
                  "Educational resources about physical and emotional changes",
                  "Stress management and mental health tools",
                  "Peer connection in a safe, monitored environment",
                  "Goal setting and personal development resources",
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                      <Check size={16} className="text-primary" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <Button className="mt-8" asChild>
                <Link href="/register">Sign Up as Adolescent</Link>
              </Button>
            </div>

            <div className="order-1 md:order-2 relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/images/features/adolescent.jpg"
                alt="Features for Adolescents"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/images/features/parent.jpg"
                alt="Features for Parents"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="inline-block bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-medium text-sm mb-4">
                For Parents
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Supporting Parental Guidance
              </h2>

              <div className="space-y-4">
                {[
                  "Expert advice on common parenting challenges",
                  "Resources on effective communication with teenagers",
                  "Monitoring tools with respect for teen privacy",
                  "Community support from other parents",
                  "Educational materials on adolescent development stages",
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-3 mt-1 bg-secondary/10 p-1 rounded-full">
                      <Check size={16} className="text-secondary" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <Button variant="secondary" className="mt-8" asChild>
                <Link href="/register">Sign Up as Parent</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-gray-600">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-primary font-bold">
                    AdoSupport
                  </th>
                  <th className="px-6 py-4 text-center text-gray-600">
                    Other Platforms
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: "AI-powered guidance", us: true, others: false },
                  { feature: "Safe community forums", us: true, others: true },
                  {
                    feature: "Expert-vetted resources",
                    us: true,
                    others: true,
                  },
                  {
                    feature: "Dual interfaces for teens & parents",
                    us: true,
                    others: false,
                  },
                  {
                    feature: "Privacy-focused monitoring",
                    us: true,
                    others: false,
                  },
                  { feature: "Free basic access", us: true, others: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.us ? (
                        <div className="inline-flex items-center justify-center bg-primary/10 p-1 rounded-full">
                          <Check size={16} className="text-primary" />
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.others ? (
                        <div className="inline-flex items-center justify-center bg-gray-100 p-1 rounded-full">
                          <Check size={16} className="text-gray-500" />
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "AdoSupport has made it so much easier to talk to my parents about difficult topics.",
                name: "Alex, 15",
                type: "Adolescent User",
              },
              {
                quote:
                  "The resources and community support helped me understand my teenager so much better.",
                name: "Maria P.",
                type: "Parent User",
              },
              {
                quote:
                  "I've seen a remarkable improvement in communication with my son since we started using AdoSupport.",
                name: "David L.",
                type: "Parent User",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100"
              >
                <div className="text-gray-500 mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                  >
                    <path
                      d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V16C10 17.0609 9.57857 18.0783 8.82843 18.8284C8.07828 19.5786 7.06087 20 6 20H5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-8">
              Join thousands of adolescents and parents who are building
              stronger relationships and navigating teenage years with
              confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Create Your Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/faq">Read FAQs</Link>
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
