import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./ui/Navigation/NavBar";

export const metadata = {
    title: "Jax.IO",
    description: "Page",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className = "h-full">
            <body className = "h-full">
                <NavBar></NavBar>

                {children}

                <div className = "bg-slate-500 h-4 w-full fixed left-0 bottom-0">
                </div>
            </body>
        </html>
    );
}
