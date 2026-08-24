import { ImageIcon, Palette, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COMPANY_THEME_GROUPS } from "@/features/companies/lib/company-theme-catalog";
import {
  buildThemePayload,
  hexToColorInputValue,
  isHexColor,
  themeToFormState,
} from "@/features/companies/lib/company-theme-css";
import type { CompanyBrandingValues } from "@/features/companies/types/company-theme";

const inputClassName =
  "h-8 border-border bg-background px-3 shadow-none rounded-md";

type CompanyBrandingSectionProps = {
  initialLogoUrl?: string | null;
  initialTheme?: CompanyBrandingValues["theme"];
  value: CompanyBrandingValues;
  onChange: (value: CompanyBrandingValues) => void;
};

export function CompanyBrandingSection({
  initialLogoUrl,
  initialTheme,
  value,
  onChange,
}: CompanyBrandingSectionProps) {
  const [themeFormState, setThemeFormState] = useState(() =>
    themeToFormState(initialTheme),
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialLogoUrl ?? null,
  );

  useEffect(() => {
    setThemeFormState(themeToFormState(initialTheme));
  }, [initialTheme]);

  useEffect(() => {
    if (value.logoFile) {
      const objectUrl = URL.createObjectURL(value.logoFile);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (value.removeLogo) {
      setLogoPreview(null);
      return;
    }

    setLogoPreview(initialLogoUrl ?? null);
  }, [initialLogoUrl, value.logoFile, value.removeLogo]);

  const previewTheme = useMemo(
    () => buildThemePayload(themeFormState),
    [themeFormState],
  );

  function updateBranding(partial: Partial<CompanyBrandingValues>) {
    onChange({ ...value, ...partial });
  }

  function updateToken(
    mode: "light" | "dark",
    token: string,
    nextValue: string,
  ) {
    setThemeFormState((current) => {
      const nextState = {
        ...current,
        [mode]: {
          ...current[mode],
          ...(nextValue.trim()
            ? { [token]: nextValue.trim() }
            : (() => {
                const nextMode = { ...current[mode] };
                delete nextMode[token];
                return nextMode;
              })()),
        },
      };

      updateBranding({
        clearTheme: false,
        theme: buildThemePayload(nextState),
      });

      return nextState;
    });
  }

  function handleClearTheme() {
    setThemeFormState({ light: {}, dark: {} });
    updateBranding({ theme: null, clearTheme: true });
  }

  function handleLogoChange(file: File | null) {
    if (!file) {
      return;
    }

    updateBranding({
      logoFile: file,
      removeLogo: false,
    });
  }

  function handleRemoveLogo() {
    updateBranding({
      logoFile: null,
      removeLogo: true,
    });
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="size-5" aria-hidden />
          Identidade visual
        </CardTitle>
        <CardDescription>
          Configure a logo e as cores da empresa. Campos vazios usam o tema
          padrão da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-start">
          <div className="flex size-24 items-center justify-center rounded-lg border border-border bg-muted/30">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Pré-visualização da logo"
                className="max-h-20 max-w-20 object-contain"
              />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="company-logo">Logo</FieldLabel>
              <Input
                id="company-logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                className={inputClassName}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  handleLogoChange(file);
                }}
              />
            </Field>
            {(logoPreview || initialLogoUrl) && !value.removeLogo ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={handleRemoveLogo}
              >
                <Trash2 className="size-4" />
                Remover logo
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {previewTheme
              ? "Tema personalizado configurado."
              : "Nenhum override de cor configurado."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearTheme}
          >
            Limpar tema
          </Button>
        </div>

        <Tabs defaultValue="light">
          <TabsList>
            <TabsTrigger value="light">Claro</TabsTrigger>
            <TabsTrigger value="dark">Escuro</TabsTrigger>
          </TabsList>

          {(["light", "dark"] as const).map((mode) => (
            <TabsContent key={mode} value={mode} className="grid gap-3">
              {COMPANY_THEME_GROUPS.map((group) => (
                <Collapsible key={group.id} defaultOpen={group.id === "brand"}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm font-medium">
                    {group.label}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="grid gap-3 px-1 py-3 md:grid-cols-2">
                    {group.tokens.map(({ token, label }) => {
                      const currentValue = themeFormState[mode][token] ?? "";

                      return (
                        <Field
                          key={`${mode}-${token}`}
                          orientation="vertical"
                          className="gap-2"
                        >
                          <FieldLabel htmlFor={`${mode}-${token}`}>
                            {label}
                          </FieldLabel>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`${mode}-${token}`}
                              type="color"
                              value={hexToColorInputValue(currentValue)}
                              disabled={
                                !isHexColor(currentValue) && !!currentValue
                              }
                              className="h-8 w-12 shrink-0 cursor-pointer p-1"
                              onChange={(event) =>
                                updateToken(mode, token, event.target.value)
                              }
                            />
                            <Input
                              value={currentValue}
                              placeholder="Usar padrão"
                              className={inputClassName}
                              onChange={(event) =>
                                updateToken(mode, token, event.target.value)
                              }
                            />
                          </div>
                        </Field>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
