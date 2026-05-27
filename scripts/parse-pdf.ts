/**
 * Parses the source manual PDF into raw chapter text.
 *
 * Usage: npm run parse-pdf -- /path/to/manual.pdf
 *
 * Output: data/_raw/lectures.json — array of { title, body } per detected lecture heading.
 * The structured per-topic JSON in data/theory/*.json is hand-curated from this raw text
 * (the manual's prose doesn't decompose cleanly into concepts/scholars/timeline without a
 * human pass), but this script gives you the source-of-truth text for that curation.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import pdf from 'pdf-parse';

const DEFAULT_PDF = path.join(
  process.env.HOME ?? '',
  'Documents',
  'History of Kazakhstan_Educational Manual (3).pdf',
);

async function main() {
  const pdfPath = process.argv[2] ?? DEFAULT_PDF;
  const outDir = path.join(process.cwd(), 'data', '_raw');
  await fs.mkdir(outDir, { recursive: true });

  console.log(`📄 Reading: ${pdfPath}`);
  const buf = await fs.readFile(pdfPath);
  const { text, numpages } = await pdf(buf);
  console.log(`   ${numpages} pages, ${text.length.toLocaleString()} chars`);

  // Split on "LECTURE N." headings
  const re = /LECTURE\s+(\d+)\.\s+([^\n]+)/gi;
  const matches: { num: number; title: string; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ num: Number(m[1]), title: m[2].trim(), start: m.index });
  }

  const lectures = matches.map((cur, i) => {
    const end = matches[i + 1]?.start ?? text.length;
    return {
      number: cur.num,
      title: cur.title,
      body: text.slice(cur.start, end).trim(),
    };
  });

  await fs.writeFile(
    path.join(outDir, 'lectures.json'),
    JSON.stringify(lectures, null, 2),
    'utf8',
  );
  await fs.writeFile(path.join(outDir, 'full.txt'), text, 'utf8');

  console.log(`✅ Extracted ${lectures.length} lectures → data/_raw/lectures.json`);
  console.log(`   Full text → data/_raw/full.txt`);
}

main().catch(e => { console.error(e); process.exit(1); });
