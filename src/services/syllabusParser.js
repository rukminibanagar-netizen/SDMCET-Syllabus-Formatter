/**
 * Syllabus helpers for the SDMCET portal:
 *  - blank syllabus template
 *  - PO/PSO average calculation from the CO mapping
 *  - ROBUST parser for pasted syllabus text (handles any spacing / alignment)
 */

import { getFormat } from '../data/schemeFormats';

// ─── Roman numerals ──────────────────────────────────────────────────────────
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export const toRoman = (n) => ROMAN[n] || String(n);
const ROMAN_TO_NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };

export const COURSE_CATEGORIES = {
  PCC: 'Professional Core Course',
  PCCL: 'Professional Core Course Lab',
  ASC: 'Applied Science Course',
  ESC: 'Engineering Science Course',
  UHV: 'Universal Human Values',
  AEC: 'Ability Enhancement Course',
  MC: 'Mandatory Non-credit Course',
  PLC: 'Program Leader Course',
};

// "III Semester B.E." / "II Semester M.Tech"
export function semesterLabel(sem, degree) {
  return `${toRoman(Number(sem))} Semester ${degree}`;
}
export function semesterShort(sem) {
  return `${toRoman(Number(sem))} Semester`;
}
export function yearLabel({ category, sem, dept }) {
  const year = toRoman(Math.ceil(Number(sem) / 2));
  return category === 'pg'
    ? `${year} Year ${dept.code}`
    : `${year} Year ${dept.degree} (${dept.code})`;
}

// ─── PO / PSO average calculation (unchanged) ────────────────────────────────
export function calculatePoPsoAverages(cosList, count = 16) {
  const mapping = {};
  for (let i = 1; i <= count; i++) mapping[i] = '-';
  if (!cosList || cosList.length === 0) return mapping;

  const parse = (str) =>
    !str || str === '-'
      ? []
      : str
          .split(/[, ]+/)
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));

  for (let po = 1; po <= count; po++) {
    let sum = 0;
    let cnt = 0;
    cosList.forEach((co) => {
      [
        [co.substantial, 3],
        [co.moderate, 2],
        [co.slight, 1],
      ].forEach(([levelStr, weight]) => {
        if (parse(levelStr).includes(po)) {
          sum += weight;
          cnt += 1;
        }
      });
    });
    if (cnt > 0) mapping[po] = (sum / cnt).toFixed(1);
  }
  return mapping;
}

// ─── Blank syllabus template (unchanged) ─────────────────────────────────────
export function createBlankSyllabus({ department = '', semester = '', scheme = '', schemeId } = {}) {
  const f = getFormat(schemeId);
  return {
    code: '',
    title: '',
    category: 'PCC',
    categoryName: COURSE_CATEGORIES.PCC,
    semester,
    department,
    scheme,
    ...(schemeId ? { schemeId } : {}),
    academicYear: f.academicYear,
    ltp: f.heading.defaultLtp,
    credits: f.heading.defaultCredits,
    contactHours: f.heading.defaultHours,
    prerequisites: '',
    cloIntro: 'This course focuses on the following learning perspectives:',
    clos: [''],
    cos: [{ id: 'CO-1', text: '', substantial: '', moderate: '', slight: '' }],
    mappingMode: f.mapping.psoCount > 0 ? 'popso' : 'po',
    poPsoMapping: {},
    units: f.units.defaultHours.map((hours, i) => ({
      unit: f.units.label(i + 1),
      title: '',
      content: '',
      hours,
    })),
    labTitle: f.lab.defaultTitle,
    labExperiments: [],
    suggestedSoftware: '',
    softwareUsed: '',
    references: [''],
    evaluationScheme: '',
  };
}


// ═══════════════════════════════════════════════════════════════════════════════
//  ROBUST TEXT PARSER — handles any spacing, alignment, or format variation
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Whitespace normalisation ────────────────────────────────────────────────

/** Collapse horizontal whitespace (but keep tabs for table detection) and trim each line. */
function normalizeText(raw) {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')             // non-breaking space → space
    .replace(/\u200b/g, '')              // zero-width space → gone
    .replace(/\n{4,}/g, '\n\n\n');       // limit blank runs to 2
}

/** Clean a single line: collapse all whitespace to single space, trim. */
function clean(line) {
  return line.replace(/\s+/g, ' ').trim();
}

// ─── First-match helper ──────────────────────────────────────────────────────
/** Try multiple regex patterns against a string; return first match or null. */
function firstMatch(str, patterns) {
  for (const p of patterns) {
    const m = str.match(p);
    if (m) return m;
  }
  return null;
}

// ─── Flexible separator: handles ": ", " : ", " = ", "  ", " - " between label and value ─
const SEP = '[\\s:_.,\\-–=]+';

// ─── Section-boundary detector ───────────────────────────────────────────────
const SECTION_HEAD = new RegExp(
  '^(?:' +
    'course\\s*learning\\s*obj|' +
    'clo\\b|' +
    'course\\s*outcome|' +
    'co\\s*[-:.]|' +
    'pre[\\s\\-]*requi|' +
    'contents?\\b|' +
    'unit\\b|module\\b|chapter\\b|' +
    'referenc|text\\s*books?|' +
    'assessment|evaluation|' +
    'lab(?:oratory)?\\b|experiment|' +
    'list\\s*of\\s*(?:experiment|lab)' +
  ')',
  'i'
);

// ─── CO line detector — many variations ──────────────────────────────────────
const CO_PATTERNS = [
  // CO-1: text, CO - 1: text, CO 1: text, CO1: text, CO.1 text
  /^C\.?O\.?\s*[-–:.\s]?\s*(\d+)\s*[-–:.)]\s*(.+)/i,
  // "Course Outcome 1: text"
  /^Course\s*Outcome\s*[-–:.]?\s*(\d+)\s*[-–:.)]\s*(.+)/i,
];

// ─── Unit heading detector — many variations ─────────────────────────────────
const UNIT_PATTERNS = [
  // Unit - I: Title, Unit-I: Title, Unit I Title, Unit:I Title
  /^(?:Unit|Module|Chapter)\s*[-–:.]?\s*([IVXivx]+|\d+)\s*[-–:.)]*\s*(.*)/i,
  // UNIT 1 : Title
  /^(?:UNIT|MODULE|CHAPTER)\s+([IVXivx]+|\d+)\s*[-–:.)]*\s*(.*)/i,
];

// ─── Extract PO/PSO mapping values from the tail of a CO line ────────────────
function extractCoParts(raw) {
  const trimmed = raw.trim();

  // Method 1: pipe-separated (CO text | 1,2 | 14,15 | 3)
  const pipeCols = trimmed.split(/\s*\|\s*/);
  if (pipeCols.length >= 4) {
    const last3 = pipeCols.slice(-3);
    const desc  = pipeCols.slice(0, -3).join(' ').trim();
    if (last3.every(c => /^[\d,\s\-]*$/.test(c.trim())) && desc.length > 3) {
      return { text: desc, substantial: last3[0].trim(), moderate: last3[1].trim(), slight: last3[2].trim() };
    }
  }

  // Method 2: tab-separated
  const tabCols = trimmed.split(/\t+/);
  if (tabCols.length >= 2) {
    const last3 = tabCols.slice(-3);
    const desc  = tabCols.slice(0, Math.max(1, tabCols.length - 3)).join(' ').trim();
    if (last3.length === 3 && last3.every(c => /^[\d,\s\-]*$/.test(c.trim())) && desc.length > 3) {
      return { text: desc, substantial: last3[0].trim(), moderate: last3[1].trim(), slight: last3[2].trim() };
    }
  }

  // Method 3: 3+ spaces between groups
  const spaceCols = trimmed.split(/\s{3,}/);
  if (spaceCols.length >= 4) {
    const last3 = spaceCols.slice(-3);
    const desc  = spaceCols.slice(0, -3).join(' ').trim();
    if (last3.every(c => /^[\d,\s\-]*$/.test(c.trim())) && desc.length > 3) {
      return { text: desc, substantial: last3[0].trim(), moderate: last3[1].trim(), slight: last3[2].trim() };
    }
  }

  // No mapping values found — the whole string is the description
  return { text: trimmed, substantial: '', moderate: '', slight: '' };
}

// ─── Detect trailing hours in unit content ───────────────────────────────────
const TRAILING_HOURS = /[-–]?\s*(\d{1,3})\s*(?:hrs?|hours?)\.?\s*$/i;

// ─── Detect course category from text ────────────────────────────────────────
function detectCategory(text) {
  const t = text.toUpperCase();
  for (const key of Object.keys(COURSE_CATEGORIES)) {
    if (t.includes(key)) return key;
  }
  if (/professional\s*core.*lab/i.test(text)) return 'PCCL';
  if (/professional\s*core/i.test(text))      return 'PCC';
  if (/applied\s*science/i.test(text))        return 'ASC';
  if (/engineering\s*science/i.test(text))     return 'ESC';
  if (/human\s*values?/i.test(text))           return 'UHV';
  if (/ability\s*enhancement/i.test(text))     return 'AEC';
  if (/mandatory/i.test(text))                 return 'MC';
  return null;
}

// ─── Detect academic year ────────────────────────────────────────────────────
function detectAcademicYear(text) {
  const m = text.match(/(?:a\.?y\.?|academic\s*year)?\s*[-:.]?\s*(20\d{2}\s*[-–]\s*\d{2,4})/i);
  return m ? m[1].replace(/\s+/g, '') : null;
}


// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PARSER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse unstructured / variably-formatted text pasted by faculty.
 * Handles:
 *  - any spacing or tab alignment
 *  - labels with or without colons
 *  - COs with embedded PO-mapping columns (tab / multi-space / pipe separated)
 *  - units as "Unit I", "UNIT-I", "Module 1", "Chapter IV", etc.
 *  - hours as "8 Hrs", "8hrs", "8 Hours", "08 Hrs.", etc.
 *  - reference books as "1) ...", "1. ...", "[1] ...", or plain author lines
 *  - LTP as "(3-0-0) 3", "3-0-0", "(42-0-28-50)4", "L:3 T:0 P:0"
 *
 * `base` is the blank syllabus (keeps department / semester / scheme).
 */
export function parseRawSyllabusText(rawText, base) {
  const result = { ...base };
  if (!rawText || !rawText.trim()) return result;

  const normalized = normalizeText(rawText);

  // rawLines keeps tabs (for CO table detection); cleanLines collapses everything
  const rawLines   = normalized.split('\n');
  const cleanLines = rawLines.map(clean).filter(Boolean);
  const fullClean  = cleanLines.join('\n');  // single-space version for regex scans

  // ── 1. COURSE CODE ─────────────────────────────────────────────────────────
  const codeMatch = firstMatch(fullClean, [
    new RegExp(`(?:course\\s*code|sub(?:ject)?\\s*code|code)${SEP}([A-Z0-9]{5,12})`, 'i'),
  ]);
  if (codeMatch) {
    result.code = codeMatch[1].toUpperCase();
  } else {
    // Fallback: standalone SDMCET-style course code (e.g. 22UCSC300, 26UMATCS11)
    const bare = fullClean.match(/\b(\d{2}[A-Z]{2,6}\d{2,4})\b/);
    if (bare) result.code = bare[1].toUpperCase();
  }

  // ── 2. COURSE TITLE ────────────────────────────────────────────────────────
  const titleMatch = firstMatch(fullClean, [
    new RegExp(`(?:course\\s*(?:title|name)|sub(?:ject)?\\s*(?:title|name)|title|subject)${SEP}([^\\n]+)`, 'i'),
  ]);
  if (titleMatch) {
    // Remove trailing LTP or code from the title
    result.title = titleMatch[1]
      .replace(/\(?\d+[-–]\d+[-–]\d+.*$/, '')
      .replace(/\b\d{2}[A-Z]{2,6}\d{2,4}\b.*$/, '')
      .trim();
  } else if (result.code) {
    // Fallback: look for a substantial line near the code
    const codeIdx = cleanLines.findIndex((l) => l.includes(result.code));
    if (codeIdx >= 0) {
      // Try the same line after the code
      const afterCode = cleanLines[codeIdx].split(result.code).slice(1).join('').trim();
      const candidate = afterCode
        .replace(/\(?\d+[-–]\d+[-–]\d+.*$/, '')
        .replace(/\s*\d+\s*$/, '')
        .trim();
      if (candidate.length > 3 && !/^\d+$/.test(candidate)) {
        result.title = candidate;
      } else if (codeIdx + 1 < cleanLines.length) {
        // Or the next line
        const next = cleanLines[codeIdx + 1]
          .replace(/\(?\d+[-–]\d+[-–]\d+.*$/, '')
          .trim();
        if (next.length > 3 && !SECTION_HEAD.test(next)) {
          result.title = next;
        }
      }
    }
  }

  // ── 3. CONTACT / TOTAL HOURS ───────────────────────────────────────────────
  const hoursMatch = firstMatch(fullClean, [
    new RegExp(`(?:total|contact|teaching)\\s*(?:hours?|hrs?)${SEP}(\\d+)`, 'i'),
    /(?:hours?|hrs?)\s*[:=]\s*(\d+)/i,
  ]);
  if (hoursMatch) result.contactHours = parseInt(hoursMatch[1], 10);

  // ── 4. L-T-P and CREDITS ──────────────────────────────────────────────────
  const ltpMatch = firstMatch(fullClean, [
    // (3-0-0) 3  or  (42-0-28-50)4  — with or without parentheses
    /\(?\s*(\d+\s*[-–]\s*\d+\s*[-–]\s*\d+(?:\s*[-–]\s*\d+)?)\s*\)?\s*(\d+)?/,
    // L:3 T:0 P:0  or  L=3 T=0 P=0
    /L\s*[:=]\s*(\d+)\s*T\s*[:=]\s*(\d+)\s*P\s*[:=]\s*(\d+)/i,
  ]);
  if (ltpMatch) {
    if (/L\s*[:=]/i.test(ltpMatch[0])) {
      // L:T:P format
      result.ltp = `(${ltpMatch[1]}-${ltpMatch[2]}-${ltpMatch[3]})`;
    } else {
      // Parenthesised format
      const inner = ltpMatch[1].replace(/\s+/g, '');
      result.ltp = `(${inner})`;
      if (ltpMatch[2]) result.credits = parseInt(ltpMatch[2], 10);
    }
  }

  // ── 5. PREREQUISITES ──────────────────────────────────────────────────────
  const prereqMatch = firstMatch(fullClean, [
    new RegExp(`(?:pre[\\s\\-]*requisit(?:es?)?|prerequisites?)${SEP}([^\\n]+)`, 'i'),
  ]);
  if (prereqMatch) result.prerequisites = prereqMatch[1].trim();

  // ── 6. COURSE CATEGORY ────────────────────────────────────────────────────
  const catMatch = fullClean.match(/(?:course\s*category|category|type)[\s:_.\-=]+([^\n]+)/i);
  if (catMatch) {
    const detected = detectCategory(catMatch[1]);
    if (detected) {
      result.category = detected;
      result.categoryName = COURSE_CATEGORIES[detected];
    }
  } else {
    const detected = detectCategory(fullClean);
    if (detected) {
      result.category = detected;
      result.categoryName = COURSE_CATEGORIES[detected];
    }
  }

  // ── 7. ACADEMIC YEAR ──────────────────────────────────────────────────────
  const ay = detectAcademicYear(fullClean);
  if (ay) result.academicYear = ay;

  // ── 8. CLOs ───────────────────────────────────────────────────────────────
  const bullet = /^[•●◦▪\-\*]\s*/;
  const clos = [];

  const cloHead = cleanLines.findIndex((l) =>
    /^(?:course\s*learning\s*obj|clos?\s*[:.\-])/i.test(l)
  );

  if (cloHead >= 0) {
    for (let i = cloHead + 1; i < cleanLines.length; i++) {
      const cl = cleanLines[i];
      // Stop at the next section
      if (SECTION_HEAD.test(cl) && !bullet.test(cl) && !/^\d+[).]\s/.test(cl)) break;
      const text = cl
        .replace(bullet, '')
        .replace(/^\d+[).]\s*/, '')  // remove numbered prefix
        .trim();
      if (text.length > 5) clos.push(text);
    }
  } else {
    // Fallback: bullets that appear before any CO or Unit line
    const firstSection = cleanLines.findIndex((l) => /^(?:c\.?o\.?\s*(?:-|:)|unit\b|module\b)/i.test(l));
    const limit = firstSection >= 0 ? firstSection : cleanLines.length;
    for (let i = 0; i < limit && clos.length < 8; i++) {
      if (bullet.test(cleanLines[i])) {
        const text = cleanLines[i].replace(bullet, '').trim();
        if (text.length > 10) clos.push(text);
      }
    }
  }
  if (clos.length) result.clos = clos;

  // ── 9. COs (with optional PO/PSO mapping values) ─────────────────────────
  const cos = [];

  // We scan rawLines (preserving tabs) so extractCoParts can detect table columns
  rawLines.forEach((rawLine) => {
    const cl = clean(rawLine);
    for (const pattern of CO_PATTERNS) {
      const m = cl.match(pattern);
      if (m && m[2] && m[2].trim().length > 3) {
        // Use the RAW tail (after CO-N marker) to detect tab/space separated columns
        const markerEnd = rawLine.search(/C\.?O\.?\s*[-–:.\s]?\s*\d+\s*[-–:.)]\s*/i);
        const rawTail = markerEnd >= 0
          ? rawLine.slice(markerEnd).replace(/^C\.?O\.?\s*[-–:.\s]?\s*\d+\s*[-–:.)]\s*/i, '')
          : m[2];

        const parts = extractCoParts(rawTail);
        cos.push({
          id: `CO-${cos.length + 1}`,
          text: parts.text,
          substantial: parts.substantial,
          moderate: parts.moderate,
          slight: parts.slight,
        });
        break; // matched — move to next line
      }
    }
  });

  // Fallback: numbered lines under a "Course Outcomes" heading
  if (cos.length === 0) {
    const coHead = cleanLines.findIndex((l) => /^course\s*outcomes?\b/i.test(l));
    if (coHead >= 0) {
      for (let i = coHead + 1; i < cleanLines.length; i++) {
        const cl = cleanLines[i];
        if (SECTION_HEAD.test(cl) && !/^co\b/i.test(cl) && !/^\d+[).]/i.test(cl)) break;
        const numMatch = cl.match(/^\d+[).]\s*(.+)/);
        if (numMatch && numMatch[1].trim().length > 5) {
          cos.push({
            id: `CO-${cos.length + 1}`,
            text: numMatch[1].trim(),
            substantial: '',
            moderate: '',
            slight: '',
          });
        }
      }
    }
  }
  if (cos.length) result.cos = cos;

  // ── 10. UNITS (the most complex part) ─────────────────────────────────────
  const units = [];
  let current = null;

  const finishUnit = () => {
    if (!current) return;
    let body = current.body.trim();

    // Extract trailing hours: "8 Hrs", "08 Hours", "8hrs", etc.
    const hrsMatch = body.match(TRAILING_HOURS);
    if (hrsMatch) {
      current.hours = parseInt(hrsMatch[1], 10);
      body = body.replace(TRAILING_HOURS, '').trim();
    }

    // Split title from content at the first colon (if the title part is short enough)
    if (!current.title) {
      const colon = body.indexOf(':');
      if (colon > 0 && colon < 100) {
        const before = body.slice(0, colon).trim();
        if (before.split(/\s+/).length <= 12) {
          current.title = before;
          body = body.slice(colon + 1).trim();
        }
      }
    }

    current.content = body;
    units.push({
      unit: current.unit,
      title: current.title,
      content: current.content,
      hours: current.hours,
    });
    current = null;
  };

  cleanLines.forEach((cl) => {
    // Try unit heading patterns
    let unitMatch = null;
    for (const pattern of UNIT_PATTERNS) {
      unitMatch = cl.match(pattern);
      if (unitMatch) break;
    }

    if (unitMatch) {
      finishUnit();
      const id = unitMatch[1].toUpperCase();
      const n = ROMAN_TO_NUM[id] || parseInt(id, 10) || units.length + 1;
      const tail = (unitMatch[2] || '').trim();

      // The tail might start with a colon or dash (title separator)
      const cleanTail = tail.replace(/^[-–:.]\s*/, '').trim();

      // Check if the tail itself contains "Title: Content"
      const colonInTail = cleanTail.indexOf(':');
      let title = '';
      let body = cleanTail;
      if (colonInTail > 0 && colonInTail < 80) {
        const beforeColon = cleanTail.slice(0, colonInTail).trim();
        if (beforeColon.split(/\s+/).length <= 10) {
          title = beforeColon;
          body = cleanTail.slice(colonInTail + 1).trim();
        }
      }

      current = { unit: `Unit-${toRoman(n)}`, title, content: '', hours: 8, body };
      return;
    }

    // If we're inside a unit, accumulate content (unless it's a new section)
    if (current) {
      if (/^(?:referenc|text\s*books?|assessment|evaluation|list\s*of\s*(?:experiment|lab))/i.test(cl)) {
        finishUnit();
      } else {
        current.body = `${current.body} ${cl}`.trim();
      }
    }
  });
  finishUnit();
  if (units.length) result.units = units;

  // ── 11. REFERENCE BOOKS ───────────────────────────────────────────────────
  const refs = [];

  // Find the references section
  const refHead = cleanLines.findIndex((l) =>
    /^(?:referenc|text\s*books?|bibliography)/i.test(l)
  );

  if (refHead >= 0) {
    for (let i = refHead + 1; i < cleanLines.length; i++) {
      const cl = cleanLines[i];
      if (/^(?:assessment|evaluation|unit\b|module\b|course\s*outcome|co\s*(?:-|:)|course\s*learning)/i.test(cl)) break;
      const stripped = cl
        .replace(/^\s*(?:\d+\s*[).:\-]|[\[({]\s*\d+\s*[\])}])\s*/, '')
        .trim();
      if (stripped.length > 5) refs.push(stripped);
    }
  } else {
    // Fallback: scan entire text for numbered reference-like lines
    cleanLines.forEach((l) => {
      const m = l.match(/^\s*(?:\d+\s*[).:\-]|[\[({]\s*\d+\s*[\])}])\s*(.+)/);
      if (m && m[1].length > 15 && /[,'"]/i.test(m[1])) {
        refs.push(m[1].trim());
      }
    });
  }
  if (refs.length) result.references = refs;

  // ── 12. LABORATORY EXPERIMENTS ─────────────────────────────────────────────
  const labHead = cleanLines.findIndex((l) =>
    /^(?:list\s*of\s*(?:experiment|lab)|lab(?:oratory)?\s*(?:experiment|work)|experiment)/i.test(l)
  );
  if (labHead >= 0) {
    const exps = [];
    for (let i = labHead + 1; i < cleanLines.length; i++) {
      const cl = cleanLines[i];
      if (/^(?:referenc|text\s*books?|assessment|evaluation|unit\b|module\b|suggest|software)/i.test(cl)) break;
      const stripped = cl.replace(/^\s*\d+\s*[).:\-]\s*/, '').trim();
      if (stripped.length > 3) exps.push(stripped);
    }
    if (exps.length) result.labExperiments = exps;
  }

  // ── 13. SOFTWARE ──────────────────────────────────────────────────────────
  const swMatch = firstMatch(fullClean, [
    /(?:suggested\s*software|software\s*suggested)[\s:_.\-=]+([^\n]+)/i,
  ]);
  if (swMatch) result.suggestedSoftware = swMatch[1].trim();

  const swUsedMatch = firstMatch(fullClean, [
    /(?:software\s*used)[\s:_.\-=]+([^\n]+)/i,
  ]);
  if (swUsedMatch) result.softwareUsed = swUsedMatch[1].trim();

  // ── 14. EVALUATION / ASSESSMENT ────────────────────────────────────────────
  const evalHead = cleanLines.findIndex((l) =>
    /^(?:assessment|evaluation)\s*(and|&|pattern|scheme)?/i.test(l)
  );
  if (evalHead >= 0) {
    const evalLines = [];
    for (let i = evalHead + 1; i < cleanLines.length; i++) {
      const cl = cleanLines[i];
      if (/^(?:referenc|text\s*books?|unit\b|module\b|course\s*outcome|co\s*(?:-|:))/i.test(cl)) break;
      evalLines.push(cl);
    }
    if (evalLines.length) result.evaluationScheme = evalLines.join('\n');
  }

  // ── 15. Recalculate PO/PSO mapping ────────────────────────────────────────
  result.poPsoMapping = calculatePoPsoAverages(result.cos);

  return result;
}
