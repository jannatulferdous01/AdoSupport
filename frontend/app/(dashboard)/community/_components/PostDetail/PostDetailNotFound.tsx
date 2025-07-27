import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostDetailNotFound() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Post not found</h1>
      <p className="text-gray-600 mb-6">
        This post may have been removed or is no longer available.
      </p>
      <Button asChild>
        <Link href="/community">Return to Community</Link>
      </Button>
    </div>
  );
}