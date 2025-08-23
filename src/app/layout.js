import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import Provider from "./provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Crafta",
  description:
    "Create stunning websites without touching a single line of code",
  openGraph: {
    title: "Crafta - Create Stunning Websites Without Code",
    description:
      "Create stunning websites without touching a single line of code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crafta - Website Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crafta",
    description:
      "Create stunning websites without touching a single line of code",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <Provider>
            {children}
            <Toaster />{" "}
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
