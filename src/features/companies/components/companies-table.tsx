import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ban, CheckCircle, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import { CompanyStatusBadge } from "@/features/companies/components/company-status-badge";
import { ToggleCompanyStatusDialog } from "@/features/companies/components/toggle-company-status-dialog";
import { useUpdateCompanyStatus } from "@/features/companies/hooks/use-update-company";
import type {
  Company,
  CompanyStatus,
} from "@/features/companies/types/company";
import { formatFileDate } from "@/features/files/utils/format-file-date";
import { cn } from "@/lib/utils";

const SKELETON_ROW_COUNT = 5;

type CompaniesTableProps = {
  companies: Company[];
  isLoading: boolean;
};

type CompanyStatusToggle = {
  id: string;
  name: string;
  targetStatus: CompanyStatus;
};

export function CompaniesTable({ companies, isLoading }: CompaniesTableProps) {
  const canUpdate = useCan(PermissionCodes.COMPANIES_UPDATE);
  const updateStatus = useUpdateCompanyStatus();

  const [statusToggle, setStatusToggle] = useState<CompanyStatusToggle | null>(
    null,
  );

  const columnCount = canUpdate ? 5 : 4;

  async function handleConfirmStatusToggle() {
    if (!statusToggle) {
      return;
    }

    try {
      await updateStatus.mutateAsync({
        id: statusToggle.id,
        status: statusToggle.targetStatus,
      });
      setStatusToggle(null);
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground">
            Empresas cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrada em</TableHead>
                {canUpdate ? (
                  <TableHead className="text-right">Ações</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      {canUpdate ? (
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Skeleton className="size-8 rounded-md" />
                            <Skeleton className="size-8 rounded-md" />
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))
                : null}

              {!isLoading && companies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma empresa cadastrada.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? companies.map((company) => {
                    const isActive = company.status === "ATIVA";

                    return (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium text-foreground">
                          {company.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {company.document ?? "—"}
                        </TableCell>
                        <TableCell>
                          <CompanyStatusBadge status={company.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {company.createdAt
                            ? formatFileDate(company.createdAt)
                            : "—"}
                        </TableCell>
                        {canUpdate ? (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Editar ${company.name}`}
                                render={
                                  <Link
                                    to="/empresas/$id/editar"
                                    params={{ id: company.id }}
                                  />
                                }
                                nativeButton={false}
                              >
                                <Pencil aria-hidden />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={
                                  isActive
                                    ? `Inativar ${company.name}`
                                    : `Ativar ${company.name}`
                                }
                                className={cn(
                                  isActive &&
                                    "text-destructive hover:text-destructive",
                                )}
                                onClick={() =>
                                  setStatusToggle({
                                    id: company.id,
                                    name: company.name,
                                    targetStatus: isActive
                                      ? "INATIVA"
                                      : "ATIVA",
                                  })
                                }
                              >
                                {isActive ? (
                                  <Ban aria-hidden />
                                ) : (
                                  <CheckCircle aria-hidden />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ToggleCompanyStatusDialog
        companyName={statusToggle?.name ?? null}
        targetStatus={statusToggle?.targetStatus ?? null}
        open={statusToggle !== null}
        onOpenChange={(open) => {
          if (!open && !updateStatus.isPending) {
            setStatusToggle(null);
          }
        }}
        onConfirm={handleConfirmStatusToggle}
        isPending={updateStatus.isPending}
      />
    </>
  );
}
