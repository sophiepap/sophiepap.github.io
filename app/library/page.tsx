"use client";

import Link from "next/link";
import ScrollStory from "@/components/scroll/ScrollStory";

export default function LibraryPage() {
  return (
    <main className="story-page">
      <div className="story-nav">
        <Link href="/" className="story-back">
          ← back to room
        </Link>
        <span>LIBRARY / INFLUENCES</span>
      </div>

      <ScrollStory />
    </main>
  );
}
