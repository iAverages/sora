import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Check, ChevronsUpDown } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/utils/ui";
import { useState } from "react";

const themes = [
    {
        value: "dark",
        label: "Dark",
    },
    {
        value: "light",
        label: "Light",
    },
    {
        value: "system",
        label: "System",
    },
];

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {theme ? themes.find((themeOption) => themeOption.value === theme)?.label : "Select theme..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandGroup>
                        {themes.map((framework) => (
                            <CommandItem
                                key={framework.value}
                                onSelect={(currentValue) => {
                                    setTheme(currentValue === theme ? "" : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        theme === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {framework.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

const Settings = () => {
    return (
        <div className={"flex flex-col gap-2"}>
            <ThemeSwitcher />
            <div>
                <Button type="submit">Update profile</Button>
            </div>
        </div>
    );
};

export default Settings;
