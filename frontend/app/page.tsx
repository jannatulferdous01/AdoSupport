import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PublicNavbar from "@/components/common/PublicNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden flex-grow">
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-white to-blue-100/30"></div>

          <div className="h-full w-full bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:8rem_8rem] opacity-70"></div>

          {/* Gradient Blobs */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-100/30 rounded-full filter blur-3xl"></div>
        </div>

        <main className="container relative pt-20 pb-24 md:pt-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Empowering Young Minds and Parental Guidance
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                AdoSupport connects adolescents with resources, support, and
                community while giving parents the tools to better understand
                and guide their children.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline-secondary"
                  className="text-base px-8 py-6 border-2 hover:bg-muted/50"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-sm text-gray-600">Resources</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[500px] w-full hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[460px] w-[460px]">
                  <Image
                    src="/assets/images/public-hero.png"
                    alt="AdoSupport Platform"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="absolute top-20 right-12 bg-white rounded-lg shadow-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium">Resource Support</div>
                </div>
              </div>

              <div className="absolute bottom-32 left-0 bg-white rounded-lg shadow-lg p-4 animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="text-sm font-medium">
                    Community Connection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Feature Section */}
      <section className="bg-white py-16 border-t">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How AdoSupport Helps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-muted/20 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 8v4l3 3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Guidance
              </h3>
              <p className="text-gray-600">
                Tailored resources and support based on individual needs.
              </p>
            </div>

            <div className="bg-muted/20 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe Community</h3>
              <p className="text-gray-600">
                Connect with peers and experts in a moderated environment.
              </p>
            </div>

            <div className="bg-muted/20 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Helpful Resources</h3>
              <p className="text-gray-600">
                Access a library of verified educational materials.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size={"xl"} asChild>
              <Link href="/register">Join Our Community</Link>
            </Button>
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
