import { Suspense } from "react";
import SearchContent from "./search-content";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
