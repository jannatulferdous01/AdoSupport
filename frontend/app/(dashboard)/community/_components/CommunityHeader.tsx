import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";

export default function CommunityHeader() {
  return (
    <section className="relative bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl overflow-hidden">
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

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Community
          </h1>
          <p className="text-gray-600 max-w-xl">
            Connect with others, share experiences, and learn from peers and
            experts. Our supportive community is here to help you on your
            journey.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:self-end">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/community/live-sessions">
              <Calendar className="h-4 w-4" />
              Live Sessions
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/community/experts">
              <Users className="h-4 w-4" />
              Meet Our Experts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
