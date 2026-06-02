const categoryCtaMap: Record<string, string> = {
  "healthcare": "Healthcare teams use Sohovi to validate patient data before it reaches production — try it free",
  "recruitment": "Clean candidate spreadsheets automatically — Sohovi spots gaps, duplicates, and format errors instantly",
  "hr": "Clean candidate spreadsheets automatically — Sohovi spots gaps, duplicates, and format errors instantly",
  "finance": "Validate client data before submission — Sohovi catches errors and mismatches in minutes",
  "mortgage": "Validate client data before submission — Sohovi catches errors and mismatches in minutes",
  "agencies": "Deliver clean data to every client — Sohovi audits your files automatically",
  "marketing": "Deliver clean data to every client — Sohovi audits your files automatically",
  "ecommerce": "Stop bad product data from reaching customers — Sohovi flags quality issues before they ship",
  "data-quality": "Sohovi profiles your datasets for quality issues in minutes — see what's broken before it breaks your pipeline",
  "data quality": "Sohovi profiles your datasets for quality issues in minutes — see what's broken before it breaks your pipeline",
  "analytics": "Trust the data behind your dashboards — Sohovi validates quality at the source",
  "operations": "Catch data errors before they slow your team down — Sohovi flags issues automatically",
  "logistics": "Accurate data keeps shipments moving — Sohovi validates your records before they cause delays",
};

const tagCtaMap: Record<string, string> = {
  "csv": "Upload your CSV and see exactly what's wrong — Sohovi profiles quality in seconds",
  "spreadsheet": "Upload your spreadsheet and get an instant quality report — free with Sohovi",
  "data cleaning": "Stop cleaning data manually — Sohovi shows you exactly what needs fixing and where",
  "validation": "Automated data validation that runs in minutes — see how Sohovi works free",
  "duplicates": "Find and fix duplicates across your dataset — Sohovi surfaces them automatically",
  "completeness": "Spot missing values and gaps before they cause problems — try Sohovi free",
  "compliance": "Meet data quality requirements without the manual audit — Sohovi does the checks for you",
};

const fallbackCta = "See exactly what's wrong with your data — try Sohovi free";

export function getBlogCTA(
  category: string | null,
  tags: string[]
): { text: string; href: string } {
  const cat = (category ?? "").toLowerCase();
  if (categoryCtaMap[cat]) {
    return { text: categoryCtaMap[cat], href: "/sign-up" };
  }

  for (const tag of tags) {
    const t = tag.toLowerCase();
    if (tagCtaMap[t]) {
      return { text: tagCtaMap[t], href: "/sign-up" };
    }
    for (const key of Object.keys(categoryCtaMap)) {
      if (t.includes(key) || key.includes(t)) {
        return { text: categoryCtaMap[key], href: "/sign-up" };
      }
    }
  }

  return { text: fallbackCta, href: "/sign-up" };
}

export function splitAtMidpoint(content: string): { firstHalf: string; secondHalf: string } {
  const h2Pattern = /\n## /g;
  const positions: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = h2Pattern.exec(content)) !== null) {
    positions.push(match.index);
  }

  if (positions.length >= 2) {
    const mid = content.length / 2;
    const closest = positions.reduce((prev, curr) =>
      Math.abs(curr - mid) < Math.abs(prev - mid) ? curr : prev
    );
    return {
      firstHalf: content.slice(0, closest),
      secondHalf: content.slice(closest),
    };
  }

  if (positions.length === 1) {
    return {
      firstHalf: content.slice(0, positions[0]),
      secondHalf: content.slice(positions[0]),
    };
  }

  // Fallback: split at nearest paragraph break to 50% mark
  const mid = Math.floor(content.length / 2);
  const paraBreak = content.indexOf("\n\n", mid);
  const splitAt = paraBreak !== -1 ? paraBreak + 2 : mid;
  return {
    firstHalf: content.slice(0, splitAt),
    secondHalf: content.slice(splitAt),
  };
}
