import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertToast } from "@/components/ui/sonner";
import { useAuthUser } from "@/features/auth/stores/auth-store";
import { LoginLogo } from "@/features/auth/components/login-logo";
import { getUserCompanies } from "@/features/companies/lib/company-selection";
import { useCompanyStore } from "@/features/companies/stores/company-store";

const inputClassName = "h-8 border-border bg-secondary shadow-none rounded-md";

export function LoginCompanyPanel() {
  const navigate = useNavigate();
  const user = useAuthUser();
  const setSelectedCompany = useCompanyStore(
    (state) => state.setSelectedCompany,
  );
  const companies = getUserCompanies(user);
  const [companyId, setCompanyId] = useState<string>("");

  function handleCompanyChange(value: string | null) {
    setCompanyId(value ?? "");
  }

  function handleContinue() {
    if (!user) {
      return;
    }

    if (!companyId) {
      alertToast.warning(
        "Selecione uma empresa",
        "Escolha a empresa para continuar.",
      );
      return;
    }

    setSelectedCompany(user.id, companyId);
    alertToast.success("Empresa selecionada", "Redirecionando para o painel.");
    navigate({ to: "/automacoes" });
  }

  return (
    <main className="flex flex-1 items-start justify-center overflow-hidden py-24">
      <div className="flex w-80 flex-col gap-16">
        <LoginLogo />
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-lg leading-7 font-bold text-foreground">
              Selecione a empresa
            </p>
            <p className="text-sm text-muted-foreground">
              Você tem acesso a mais de uma empresa. Escolha qual deseja
              utilizar nesta sessão.
            </p>
          </div>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel
              htmlFor="company-select"
              className="font-medium text-sm"
            >
              Empresa
            </FieldLabel>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger
                id="company-select"
                className={inputClassName}
                aria-label="Selecionar empresa"
              >
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Button type="button" onClick={handleContinue} className="w-full">
            Continuar
          </Button>
        </div>
      </div>
    </main>
  );
}
