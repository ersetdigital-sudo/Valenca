const OPERATOR: [string[], string][] = [
  [["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"], "Telkomsel"],
  [["0814", "0815", "0816", "0855", "0856", "0857", "0858"], "Indosat Ooredoo"],
  [["0817", "0818", "0819", "0859", "0877", "0878"], "XL Axiata"],
  [["0895", "0896", "0897", "0898", "0899"], "Tri (3)"],
  [["0831", "0832", "0833", "0838"], "Axis"],
  [["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"], "Smartfren"],
];

export function detectOperator(input: string): string | null {
  const n = input.replace(/[^0-9]/g, "").replace(/^62/, "0");
  if (n.length < 4) return null;
  const prefix = n.slice(0, 4);
  for (const [list, name] of OPERATOR) {
    if (list.includes(prefix)) return name;
  }
  return null;
}
