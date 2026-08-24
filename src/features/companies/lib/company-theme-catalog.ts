export type CompanyThemeTokenDefinition = {
  token: string;
  label: string;
};

export type CompanyThemeGroupDefinition = {
  id: string;
  label: string;
  tokens: CompanyThemeTokenDefinition[];
};

export const COMPANY_THEME_GROUPS: CompanyThemeGroupDefinition[] = [
  {
    id: "brand",
    label: "Marca",
    tokens: [
      { token: "primary", label: "Primária" },
      { token: "primary-foreground", label: "Texto primário" },
      { token: "ring", label: "Foco" },
    ],
  },
  {
    id: "surfaces",
    label: "Superfícies",
    tokens: [
      { token: "background", label: "Fundo" },
      { token: "foreground", label: "Texto" },
      { token: "card", label: "Cartão" },
      { token: "card-foreground", label: "Texto do cartão" },
      { token: "popover", label: "Popover" },
      { token: "popover-foreground", label: "Texto do popover" },
      { token: "secondary", label: "Secundária" },
      { token: "secondary-foreground", label: "Texto secundário" },
      { token: "muted", label: "Muted" },
      { token: "muted-foreground", label: "Texto muted" },
      { token: "accent", label: "Accent" },
      { token: "accent-foreground", label: "Texto accent" },
      { token: "border", label: "Borda" },
      { token: "input", label: "Input" },
    ],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    tokens: [
      { token: "sidebar", label: "Fundo" },
      { token: "sidebar-foreground", label: "Texto" },
      { token: "sidebar-primary", label: "Primária" },
      { token: "sidebar-primary-foreground", label: "Texto primário" },
      { token: "sidebar-accent", label: "Accent" },
      { token: "sidebar-accent-foreground", label: "Texto accent" },
      { token: "sidebar-border", label: "Borda" },
      { token: "sidebar-ring", label: "Foco" },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    tokens: [
      { token: "destructive", label: "Destrutiva" },
      { token: "destructive-foreground", label: "Texto destrutivo" },
      { token: "success", label: "Sucesso" },
      { token: "success-foreground", label: "Texto sucesso" },
      { token: "warning", label: "Aviso" },
      { token: "warning-foreground", label: "Texto aviso" },
      { token: "error", label: "Erro" },
      { token: "error-foreground", label: "Texto erro" },
      { token: "info", label: "Info" },
      { token: "info-foreground", label: "Texto info" },
      { token: "badge", label: "Badge" },
      { token: "badge-foreground", label: "Texto badge" },
      { token: "progress-bar", label: "Barra de progresso" },
    ],
  },
  {
    id: "categories",
    label: "Categorias",
    tokens: [
      { token: "category-fiscal", label: "Fiscal" },
      { token: "category-pessoal", label: "Pessoal" },
      { token: "category-contabil", label: "Contábil" },
      { token: "category-trabalhista", label: "Trabalhista" },
      { token: "chart-1", label: "Gráfico 1" },
      { token: "chart-2", label: "Gráfico 2" },
      { token: "chart-3", label: "Gráfico 3" },
      { token: "chart-4", label: "Gráfico 4" },
      { token: "chart-5", label: "Gráfico 5" },
    ],
  },
];
