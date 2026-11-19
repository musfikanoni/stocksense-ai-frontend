// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div className="space-y-4">
        <p className="text-6xl font-bold text-gold">404</p>
        <h1 className="text-2xl font-semibold">Page Not Found</h1>
        <p className="text-mute text-sm">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-gold inline-block mt-2">
          Go Home
        </Link>
      </div>
    </main>
  );
}
