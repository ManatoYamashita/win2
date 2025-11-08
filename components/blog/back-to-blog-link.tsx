'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function BackToBlogLink() {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Link
      href="/blog"
      className="relative inline-flex items-center justify-center gap-2 rounded-lg border border-orange-600 px-6 py-3 text-orange-600 transition hover:bg-orange-50"
      onClick={() => setIsNavigating(true)}
      aria-busy={isNavigating}
    >
      {isNavigating && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>ブログ一覧へ戻る</span>
    </Link>
  );
}
