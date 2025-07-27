import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PostDetailHeader() {
  return (
    <nav className="py-6 flex items-center text-sm text-gray-500">
      <Link
        href="/community"
        className="flex items-center hover:text-primary"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Community
      </Link>
    </nav>
  );
}