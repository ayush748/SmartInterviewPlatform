// app/components/RoleSwitcher.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function RoleSwitcher() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });
  const updateRole = useMutation(api.users.updateUserRole);

  if (!userData) return null;

  const handleRoleChange = (role: "candidate" | "interviewer") => {
    if (role === userData.role) return;
    updateRole({ clerkId: user!.id, role });
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="font-medium text-sm">Switch Role:</span>
      <Button
        size="sm"
        variant={userData.role === "candidate" ? "default" : "outline"}
        onClick={() => handleRoleChange("candidate")}
      >
        Candidate
      </Button>
      <Button
        size="sm"
        variant={userData.role === "interviewer" ? "default" : "outline"}
        onClick={() => handleRoleChange("interviewer")}
      >
        Interviewer
      </Button>
    </div>
  );
}
