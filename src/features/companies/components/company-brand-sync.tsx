import { useEffect } from "react";

import { useSelectedCompany } from "@/features/companies/hooks/use-selected-company";
import {
  buildCompanyThemeCss,
  hasCompanyThemeContent,
} from "@/features/companies/lib/company-theme-css";

const STYLE_ID = "company-theme";

export function CompanyBrandSync() {
  const { selectedCompany } = useSelectedCompany();

  useEffect(() => {
    const theme = selectedCompany?.theme;
    const existingStyle = document.getElementById(
      STYLE_ID,
    ) as HTMLStyleElement | null;

    if (!hasCompanyThemeContent(theme)) {
      existingStyle?.remove();
      return;
    }

    const styleElement = existingStyle ?? document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = buildCompanyThemeCss(theme!);

    if (!existingStyle) {
      document.head.appendChild(styleElement);
    }
  }, [selectedCompany?.id, selectedCompany?.theme]);

  return null;
}
