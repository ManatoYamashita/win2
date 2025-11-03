import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" label="ページを読み込んでいます…" />
    </div>
  );
}
