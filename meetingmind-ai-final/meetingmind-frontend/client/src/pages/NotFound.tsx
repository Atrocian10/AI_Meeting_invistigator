import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-extrabold text-indigo-200 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist. Let's get you back
          on track.
        </p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
