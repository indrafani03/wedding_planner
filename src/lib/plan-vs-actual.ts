/**
 * Plan vs actual for one line item (estimate vs real price, budget vs bought
 * price), multiplied by qty. Shared by Budget Administrasi and Seserahan.
 */
export function planVsActual(plan: number, actual: number, qty: number) {
  const planTotal = plan * qty;
  const actualTotal = actual * qty;
  if (actual <= 0) {
    return {
      tone: "neutral" as const,
      planTotal,
      actualTotal,
      label: "Selisih",
      text: "Belum ada harga",
    };
  }
  const diff = planTotal - actualTotal;
  return {
    tone: diff >= 0 ? ("good" as const) : ("bad" as const),
    planTotal,
    actualTotal,
    label: diff >= 0 ? "Hemat" : "Over budget",
    text: Math.abs(diff),
  };
}
