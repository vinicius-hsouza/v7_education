export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function parseBRL(value: string) {
  return Number(value.replace(/\D/g, "").replace(/^0+/, "")) / 100;
}
