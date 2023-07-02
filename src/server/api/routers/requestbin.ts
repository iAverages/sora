import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
    get: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id } = input;
            return await ctx.prisma.requestBin.findUnique({
                where: {
                    id,
                },
            });
        }),
});
