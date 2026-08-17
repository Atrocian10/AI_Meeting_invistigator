import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, User, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Meetings() {
  const { user, isAuthenticated } = useAuth();
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(
    null
  );

  const meetingsQuery = trpc.demo.getMeetings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const meetingDetailQuery = trpc.demo.getMeetingDetail.useQuery(
    { meetingId: selectedMeetingId! },
    { enabled: selectedMeetingId !== null }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Please log in to view your meetings
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meeting History
          </h1>
          <p className="text-xl text-gray-600">
            View and manage your processed meetings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meetings List */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Your Meetings
              </h2>

              {meetingsQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : meetingsQuery.data && meetingsQuery.data.length > 0 ? (
                <div className="space-y-2">
                  {meetingsQuery.data.map(meeting => (
                    <button
                      key={meeting.id}
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedMeetingId === meeting.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            Meeting {meeting.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {String(
                              typeof meeting.createdAt === "string"
                                ? new Date(
                                    meeting.createdAt
                                  ).toLocaleDateString()
                                : (
                                    meeting.createdAt as Date
                                  ).toLocaleDateString()
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No meetings yet
                </p>
              )}
            </div>
          </div>

          {/* Meeting Details */}
          <div className="lg:col-span-2">
            {selectedMeetingId && meetingDetailQuery.data ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Summary
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {meetingDetailQuery.data.summary}
                  </p>
                </div>

                {/* Action Items */}
                {meetingDetailQuery.data.actions &&
                  meetingDetailQuery.data.actions.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Action Items
                      </h3>
                      <div className="space-y-3">
                        {meetingDetailQuery.data.actions.map((action, i) => (
                          <div
                            key={i}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="font-semibold text-gray-900">
                              {action.title}
                            </p>
                            {action.owner && (
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                                <User className="w-4 h-4" /> {action.owner}
                              </p>
                            )}
                            {action.deadline && (
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />{" "}
                                {String(action.deadline)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Q&A History */}
                {meetingDetailQuery.data.qaHistory &&
                  meetingDetailQuery.data.qaHistory.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Q&A History
                      </h3>
                      <div className="space-y-4">
                        {meetingDetailQuery.data.qaHistory.map((qa, i) => (
                          <div
                            key={i}
                            className="border-l-4 border-indigo-500 pl-4 py-2"
                          >
                            <p className="font-semibold text-gray-900 mb-2">
                              Q: {qa.question}
                            </p>
                            <p className="text-gray-800">A: {qa.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Transcript */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Full Transcript
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                      {meetingDetailQuery.data.transcript}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center h-96">
                <p className="text-gray-600 text-center">
                  Select a meeting to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
