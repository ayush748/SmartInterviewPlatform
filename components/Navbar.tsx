"use client";

import Link from "next/link";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import DasboardBtn from "./DasboardBtn";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-2xl font-semibold hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="h-8 w-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            CodeSync
          </span>
        </Link>

        {/* ACTIONS */}
        <SignedIn>
          <div className="ml-auto flex items-center gap-4">
            <DasboardBtn />
            <ModeToggle />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
