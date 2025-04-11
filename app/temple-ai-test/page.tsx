"use client";

import { TempleAIInfo } from '@/components/temple-ai-info';

export default function TempleAITestPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-amber-800 mb-8 font-josefin">
        Temple AI Analysis Test Page
      </h1>
      <TempleAIInfo />
    </div>
  );
}