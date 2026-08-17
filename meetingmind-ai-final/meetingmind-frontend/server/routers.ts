import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createMeeting,
  getMeetingsByUser,
  getMeetingById,
  getActionItemsByMeeting,
  getQAHistoryByMeeting,
  saveQARecord,
} from "./db";
import { summarizeTranscript } from "./agents/summarizer";
import { extractActionItems } from "./agents/actionExtractor";
import { answerQuestionAboutMeeting } from "./agents/qaAgent";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  demo: router({
    processTranscript: protectedProcedure
      .input(z.object({ transcript: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Use real AI agents for processing
          const summaryResult = await summarizeTranscript(input.transcript);
          const actionItems = await extractActionItems(input.transcript);

          // Save to database
          const meetingResult = await createMeeting(
            ctx.user.id,
            input.transcript,
            summaryResult.summary
          );

          return {
            summary: summaryResult.summary,
            keyPoints: summaryResult.keyPoints,
            participants: summaryResult.participants,
            actions: actionItems.map(item => ({
              title: item.title,
              owner: item.owner,
              deadline: item.deadline,
              priority: item.priority,
            })),
          };
        } catch (error) {
          console.error("[Demo] Error processing transcript:", error);
          throw new Error("Failed to process transcript with AI agents");
        }
      }),

    answerQuestion: protectedProcedure
      .input(
        z.object({ question: z.string(), meetingId: z.number().optional() })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // If meetingId provided, use that specific meeting
          // Otherwise use the most recent meeting
          let meeting = null;

          if (input.meetingId) {
            meeting = await getMeetingById(input.meetingId);
          } else {
            const meetings = await getMeetingsByUser(ctx.user.id);
            meeting = meetings[meetings.length - 1] || null;
          }

          if (!meeting) {
            return {
              answer:
                "No meeting transcript found. Please process a meeting first.",
            };
          }

          // Use AI agent to answer question
          const qaResult = await answerQuestionAboutMeeting(
            meeting.transcript,
            input.question
          );

          // Save Q&A to history
          await saveQARecord(meeting.id, input.question, qaResult.answer);

          return { answer: qaResult.answer, confidence: qaResult.confidence };
        } catch (error) {
          console.error("[Demo] Error answering question:", error);
          throw new Error("Failed to answer question");
        }
      }),

    getMeetings: protectedProcedure.query(async ({ ctx }) => {
      return await getMeetingsByUser(ctx.user.id);
    }),

    getMeetingDetail: protectedProcedure
      .input(z.object({ meetingId: z.number() }))
      .query(async ({ input }) => {
        const meeting = await getMeetingById(input.meetingId);
        if (!meeting) return null;

        const actions = await getActionItemsByMeeting(input.meetingId);
        const qaHistory = await getQAHistoryByMeeting(input.meetingId);

        return {
          ...meeting,
          actions,
          qaHistory,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
