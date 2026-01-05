"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type Interview = Doc<"interviews">;

export default function DashboardPage() {
  const { isLoaded } = useUser();

  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const [loadingId, setLoadingId] = useState<Id<"interviews"> | null>(null);

  /* ---------------------------------
     AUTH CHECK ONLY
  ---------------------------------- */
  if (!isLoaded) return <LoaderUI />;

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  /* ---------------------------------
     HANDLERS
  ---------------------------------- */
  const handleStatusUpdate = async (
    interviewId: Id<"interviews">,
    status: string
  ) => {
    try {
      setLoadingId(interviewId);
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update interview status");
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="container mx-auto py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Link href="/schedule">
          <Button>Schedule New Interview</Button>
        </Link>
      </div>

      {/* INTERVIEWS */}
      <div className="space-y-10">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* CATEGORY HEADER */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold">
                    {category.title}
                  </h2>
                  <Badge variant={category.variant}>
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupedInterviews[category.id].map(
                    (interview: Interview) => {
                      const candidateInfo = getCandidateInfo(
                        users,
                        interview.candidateId
                      );

                      const startTime = new Date(interview.startTime);

                      return (
                        <Card
                          key={interview._id}
                          className="hover:shadow-md transition-all"
                        >
                          {/* HEADER */}
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback>
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <CardTitle className="text-base">
                                  {candidateInfo.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {interview.title}
                                </p>
                              </div>
                            </div>
                          </CardHeader>

                          {/* DATE & TIME */}
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {format(startTime, "MMM dd")}
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {format(startTime, "hh:mm a")}
                              </div>
                            </div>
                          </CardContent>

                          {/* ACTIONS */}
                          <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  className="flex-1"
                                  disabled={loadingId === interview._id}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      interview._id,
                                      "succeeded"
                                    )
                                  }
                                >
                                  <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                  Pass
                                </Button>

                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  disabled={loadingId === interview._id}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      interview._id,
                                      "failed"
                                    )
                                  }
                                >
                                  <XCircleIcon className="h-4 w-4 mr-2" />
                                  Fail
                                </Button>
                              </div>
                            )}

                            <CommentDialog interviewId={interview._id} />
                          </CardFooter>
                        </Card>
                      );
                    }
                  )}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
