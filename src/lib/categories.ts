export type Category =
  | "ALIMENTACAO"
  | "MORADIA"
  | "TRANSPORTE"
  | "LAZER"
  | "SAUDE"
  | "EDUCACAO"
  | "OUTROS";

export const CATEGORIES: {
  value: Category;
  label: string;
}[] = [
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "MORADIA", label: "Moradia" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "LAZER", label: "Lazer" },
  { value: "SAUDE", label: "Saúde" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "OUTROS", label: "Outros" },
];
