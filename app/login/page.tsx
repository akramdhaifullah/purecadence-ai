import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In — purecadence.ai",
  description: "Sign in to your purecadence.ai account to access your Garmin training assistant.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <svg
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth={4} />
              <path d="M50 20 L32 68 L68 68 Z" fill="currentColor" />
              <circle cx="50" cy="48" r="6" fill="white" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              purecadence.ai
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your Garmin Connect credentials to get started.
          </p>

          <form className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your credentials are encrypted and used solely to establish a secure
          session with Garmin Connect.
        </p>
      </div>
    </div>
  );
}
