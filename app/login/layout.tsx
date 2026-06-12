import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — purecadence.ai",
  description:
    "Sign in to your purecadence.ai account to access your Garmin training assistant.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
