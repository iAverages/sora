import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const LIMIT = 10;

export const requestbinRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                pageIndex: z.number(),
                pageSize: z.number(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { pageIndex, pageSize } = input;
            const data = await ctx.prisma.requestBin.findMany({
                where: {
                    userId: ctx.session.user.id,
                },
                skip: pageIndex * pageSize,
                take: pageSize,
                orderBy: {
                    createdAt: "desc",
                },
            });
            const total = await ctx.prisma.requestBin.count({
                where: {
                    userId: ctx.session.user.id,
                },
            });
            return {
                data,
                pages: Math.ceil(total / pageSize),
            };
        }),
});
