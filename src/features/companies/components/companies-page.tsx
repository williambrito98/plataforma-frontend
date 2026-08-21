import { CreateCompanyForm } from "@/features/companies/components/create-company-form";

export function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <CreateCompanyForm />
    </div>
  );
}
