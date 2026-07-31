import loginLogo from "@/assets/img/login-logo.svg";

export function LoginLogo() {
  return (
    <img
      src={loginLogo}
      alt="Wimpra"
      width={56}
      height={47}
      className="h-11.75 w-14 shrink-0"
    />
  );
}
