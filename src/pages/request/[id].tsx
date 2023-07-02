import { ChevronDown, Copy } from "lucide-react";
import { useRouter } from "next/router";
import { Show } from "~/components/show";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { RouterOutputs, api } from "~/utils/api";
import { timeAgo, timeUntil } from "~/utils/date";

const formatHeaders = (headers: string) => {
    const parsedHeaders = JSON.parse(headers) as string[];
    const formatted: Record<string, string[]> = {};
    for (let i = 0; i < parsedHeaders.length; i = i + 2) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const key = parsedHeaders[i]!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = parsedHeaders[i + 1]!;
        if (key in formatted) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            formatted[key]!.push(value);
        } else {
            formatted[key] = [value];
        }
    }
    return JSON.stringify(formatted, null, 4);
};

const Request = () => {
    const requestId = useRouter().query.id as string;
    const { data } = api.requestbin.get.useQuery({ id: requestId }, { enabled: !!requestId });

    const handleWebhookthingExport = (exportData: RouterOutputs["requestbin"]["all"]["data"][0]) => {
        const webhookthing = {
            headers: exportData.headers,
            body: exportData.body,
        };

        void navigator.clipboard.writeText(JSON.stringify(webhookthing, null, 4));
    };

    return (
        <div className={"flex w-full gap-4"}>
            <div className={"flex flex-col gap-4"}>
                <Card className={"w-full"}>
                    <Show when={data}>
                        {(request) => (
                            <>
                                <CardHeader>
                                    <CardTitle>Request - {requestId}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={"flex gap-2"}>
                                        <div className={"text-gray-500"}>Created At</div>
                                        <div>{timeAgo(request.createdAt)}</div>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <div className={"text-gray-500"}>Expires In</div>
                                        <div>
                                            {timeUntil(new Date(request.createdAt.getTime() + 60 * 60 * 24 * 1000))}
                                        </div>
                                    </div>
                                    <Separator className={"my-2"} />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={"outline"}>
                                                Export as <ChevronDown />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={handleWebhookthingExport}>
                                                webhookthing
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </>
                        )}
                    </Show>
                </Card>
                <Card className={"w-full"}>
                    <Show when={data}>
                        {(request) => (
                            <>
                                <CardHeader>
                                    <CardTitle>Headers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <pre>{formatHeaders(request.headers)}</pre>
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Show>
                </Card>
            </div>
            <Card className={"w-full"}>
                <Show when={data}>
                    {(request) => (
                        <>
                            <CardHeader>
                                <CardTitle className={"flex justify-between"}>
                                    <div>Body</div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() => {
                                                        void navigator.clipboard.writeText(request.body);
                                                    }}
                                                >
                                                    <Copy />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side={"left"}>
                                                <p>Copy body</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(JSON.parse(request.body), null, 4)}
                                    </pre>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Show>
            </Card>
        </div>
    );
};

export default Request;
