import loginGlobe from "@/assets/img/login-globe.svg";

export function LoginSiteLink() {
  return (
    <div className="flex w-full items-center gap-2 pl-16 pt-48">
      <img src={loginGlobe} alt="" aria-hidden className="size-4 shrink-0" />
      <span className="text-sm leading-5 text-[#737373]">wimpra.com.br</span>
    </div>
  );
}
