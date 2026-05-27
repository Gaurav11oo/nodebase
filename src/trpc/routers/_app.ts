import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
// import { auth } from "@/lib/auth";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    // console.log({ userId: ctx.auth.user.id });
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
