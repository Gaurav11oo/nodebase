import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async () => {
    // throw new TRPCError({
    //   code: "BAD_REQUEST",
    //   message: "Something Went Wrong!!!",
    // });

    await inngest.send({
      name: "execute/ai",
    });
    return { success: true, message: "AI Job Queued" };
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "app/hello.created",
      data: {
        email: "tony@gmail.com",
      },
    });
    return { success: true, message: "Job Queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
