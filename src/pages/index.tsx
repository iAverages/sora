import { type RouterOutputs, api } from "~/utils/api";
import { Show } from "~/components/show";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useMemo, useState } from "react";
import { timeAgo } from "~/utils/date";
import { env } from "process";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
type RequestBinData = RouterOutputs["requestbin"]["all"]["data"];

export const columns: ColumnDef<RequestBinData[0]>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "body",
        header: "Body",
        accessorFn: (row) => {
            const text = row.body.substring(0, 100);
            return text.length === 100 ? `${text}...` : text === '""' ? "No body" : text;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        accessorFn: (row) => timeAgo(row.createdAt),
    },
];

const Index = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data } = api.requestbin.all.useQuery(
        {
            pageIndex,
            pageSize,
        },
        {
            keepPreviousData: true,
        }
    );
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const table = useReactTable({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        data: data?.data ?? [],
        columns,
        pageCount: data?.pages ?? -1,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
    });

    return (
        <div>
            <h1>RequestBin</h1>
            <Show
                when={data}
                fallback={
                    <div className={"flex w-full"}>
                        <div className={"h-24 flex-1 animate-pulse bg-gray-200"}></div>
                    </div>
                }
            >
                <div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className={"cursor-pointer "}
                                                    // Can't use anchor tags because of table, it is considered "invalid HTML"
                                                    onClick={() => void router.push(`/request/${row.original.id}`)}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No requests found. Get started by sending a request to{" "}
                                            <a
                                                href={`${env.NEXTAUTH_URL ?? ""}/api/callback/${session?.user?.id ?? ""}
                                            `}
                                            >
                                                {env.NEXTAUTH_URL}
                                                /api/callback/{session?.user?.id}
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end px-2">
                            <div className="flex items-center space-x-6 lg:space-x-8">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium">Rows per page</p>
                                    <Select
                                        value={`${table.getState().pagination.pageSize}`}
                                        onValueChange={(value) => {
                                            table.setPageSize(Number(value));
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to first page</span>
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to previous page</span>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to next page</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to last page</span>
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default Index;
