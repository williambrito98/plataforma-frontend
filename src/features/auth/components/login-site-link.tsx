import { Globe } from "lucide-react";

export function LoginSiteLink() {
  return (
    <div className="flex w-full items-center gap-2 pl-16 pt-48">
      <Globe className="size-4 shrink-0 text-[#737373]" aria-hidden />
      <span className="text-sm leading-5 text-[#737373]">wimpra.com.br</span>
    </div>
  );
}
