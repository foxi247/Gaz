import { CheckCircle2 } from 'lucide-react';

interface ToastProps { message: string | null; }

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-[20px] bg-graphite px-5 py-4 text-white shadow-soft animate-[slideIn_.25s_ease-out]">
      <CheckCircle2 className="h-5 w-5 text-success" />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
