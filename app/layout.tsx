import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:{default:"Coffee Chats | Great connections start with hello",template:"%s | Coffee Chats"},description:"An inviting place for U of T students and alumni to find meaningful career conversations."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
