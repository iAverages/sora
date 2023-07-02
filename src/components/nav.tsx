import Link from "next/link";
import { type ReactNode } from "react";
import { UserNav } from "~/components/user-icon";

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
    return (
        <Link href={href} className="text-sm font-medium transition-colors hover:text-primary">
            {children}
        </Link>
    );
};

const Nav = () => {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className={"flex items-stretch justify-between"}>
                    <nav className={"flex items-center space-x-4 lg:space-x-6"}>
                        <NavLink href="/">Sora</NavLink>
                    </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div>
        </div>
    );
};

export default Nav;
