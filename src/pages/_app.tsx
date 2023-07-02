import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Nav from "~/components/nav";
import { ThemeProvider } from "~/components/theme-provider";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Nav />
                <div className={"mx-8 my-4"}>
                    <Component {...pageProps} />
                </div>
            </ThemeProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
