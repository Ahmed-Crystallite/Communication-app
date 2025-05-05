// Next
import type { Metadata } from "next"
// Next Google
import { Poppins, Manrope } from "next/font/google"
// Globle Css
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"
// Convex
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
// Components
import { ConvexClientProvider } from "@/components/convex-client-provider"
import Modal from "@/components/Modal"
import { Toaster } from "@/components/ui/Sonner"
import JotaiProvider from "@/components/JotaiProvider"

// Fonts For Layout
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  subsets: ["latin"],
})
const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-mono",
  subsets: ["latin"],
})

// Meta Data
export const metadata: Metadata = {
  metadataBase: new URL("https://acme.com"),
  title: "Dark Chat App Like Slack for Team Collaboration",
  description:
    "Discover a sleek dark-themed chat app inspired by Slack, designed for seamless team collaboration and real-time communication. Built with Create Next App, it’s perfect for modern, efficient, and secure team interactions. Try it today!",
  generator: "Next.js",
  applicationName: "Dark Chat",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Dark chat app",
    "Slack alternative",
    "Team collaboration tool",
    "Real-time messaging app",
    "Secure chat platform",
    "Dark-themed communication app",
    "Dev AR chat app",
    "Modern team chat",
    "Productivity tools",
  ],
  creator: "Developer AR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${poppins.variable} ${manrope.variable} antialiased font-sans`}
        >
          <ConvexClientProvider>
            <JotaiProvider>
              <NuqsAdapter>
                <Toaster />
                <Modal />
                {children}
              </NuqsAdapter>
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
