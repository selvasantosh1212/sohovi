/**
 * Shared CSV/XLSX parser for free tools.
 * Runs in the browser — no uploads, no workers needed for typical files.
 */

export interface ParsedFile {
  headers: string[];
  rows: string[][];
  fileName: string;
  rowCount: number;
}

function parseCSVText(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("File is empty");

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        result.push(cur.trim()); cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "xlsx" || ext === "xls") {
    const { read, utils } = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const wb = read(buffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: string[][] = utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
    if (!data.length) throw new Error("File is empty");
    const headers = (data[0] as string[]).map(String);
    const rows = data.slice(1).map((r) => headers.map((_, i) => String((r as string[])[i] ?? "")));
    return { headers, rows, fileName: file.name, rowCount: rows.length };
  }

  const text = await file.text();
  const { headers, rows } = parseCSVText(text);
  return { headers, rows, fileName: file.name, rowCount: rows.length };
}

export function rowsToCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) =>
    v.includes(",") || v.includes('"') || v.includes("\n")
      ? `"${v.replace(/"/g, '""')}"`
      : v;
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
