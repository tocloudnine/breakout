'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  const getNextPageUrl = () => {
    if (pathname === "/" || pathname === "/app") {
      return "/metadata";
    } else if (pathname === "/metadata") {
      return "/publish"; // Assuming the next page after metadata would be publish
    }
    return "/";
  };

  return (
    <footer className="p-4 flex justify-between w-full mt-auto">
      <div className="flex space-x-4">
        <Button variant="default" className="bg-cyberdeus-purple-dark hover:bg-cyberdeus-purple flex items-center px-6 py-3 rounded-none text-black font-bold">
          <div className="w-7 h-7 bg-[rgba(0,0,0,0.2)] rounded-full flex items-center justify-center mr-3 text-sm">
            N
          </div>
          Connect Wallet <span className="ml-2">›</span>
        </Button>
        <Button variant="default" className="bg-cyberdeus-purple-dark hover:bg-cyberdeus-purple px-6 py-3 rounded-none text-black font-bold">
          Login to CYBERDEUS <span className="ml-2">›</span>
        </Button>
      </div>
      
      <Link href={getNextPageUrl()}>
        <Button variant="default" className="bg-cyberdeus-purple-dark hover:bg-cyberdeus-purple px-6 py-3 rounded-none text-black font-bold">
          NEXT <span className="ml-2">›</span>
        </Button>
      </Link>
    </footer>
  );
}