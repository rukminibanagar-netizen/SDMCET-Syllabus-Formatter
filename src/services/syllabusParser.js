/**
 * Syllabus helpers for the SDMCET portal:
 *  - blank syllabus template
 *  - PO/PSO average calculation from the CO mapping
 *  - best-effort parser for pasted syllabus text
 */

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

// "II Year B.E. (CSE)" for UG, "I Year M.Tech CSE" for PG; a semester pair makes one year
export function yearLabel({ category, sem, dept }) {
  const year = toRoman(Math.ceil(Number(sem) / 2));
  return category === 'pg'
    ? `${year} Year ${dept.code}`
    : `${year} Year ${dept.degree} (${dept.code})`;
}

// Mathematically compute PO 1-12 and PSO 13-16 averages from the entered COs
export function calculatePoPsoAverages(cosList) {
  const mapping = {};
  for (let i = 1; i <= 16; i++) mapping[i] = '-';
  if (!cosList || cosList.length === 0) return mapping;

  const parse = (str) =>
    !str || str === '-'
      ? []
      : str
          .split(/[, ]+/)
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));

  for (let po = 1; po <= 16; po++) {
    let sum = 0;
    let count = 0;
    cosList.forEach((co) => {
      [
        [co.substantial, 3],
        [co.moderate, 2],
        [co.slight, 1],
      ].forEach(([levelStr, weight]) => {
        if (parse(levelStr).includes(po)) {
          sum += weight;
          count += 1;
        }
      });
    });
    if (count > 0) mapping[po] = (sum / count).toFixed(1);
  }
  return mapping;
}

// Blank template for a faculty member starting a fresh syllabus
export function createBlankSyllabus({ department = '', semester = '', scheme = '' } = {}) {
  return {
    code: '',
    title: '',
    category: 'PCC',
    categoryName: COURSE_CATEGORIES.PCC,
    semester,
    department,
    scheme,
    ltp: '(3-0-0)',
    credits: 3,
    contactHours: 39,
    prerequisites: '',
    clos: [''],
    cos: [{ id: 'CO-1', text: '', substantial: '', moderate: '', slight: '' }],
    units: [
      { unit: 'Unit - I', title: '', content: '', hours: 8 },
      { unit: 'Unit - II', title: '', content: '', hours: 8 },
      { unit: 'Unit - III', title: '', content: '', hours: 8 },
      { unit: 'Unit - IV', title: '', content: '', hours: 8 },
      { unit: 'Unit - V', title: '', content: '', hours: 7 },
    ],
    references: [''],
    evaluationScheme:
      'Continuous Internal Evaluation (CIE): 50 Marks (Tests: 40 + CTA: 10). Semester End Examination (SEE): 50 Marks (3 Hours duration, 5 full questions chosen from five units with internal choice).',
    poPsoMapping: {},
  };
}

const SECTION_START =
  /^(course\s+learning\s+objectives|clos?\b|course\s+outcomes|cos?\b|pre-?requisites?|contents?\b|unit\b|reference|text\s*books?|assessment|evaluation)/i;

// Parse unstructured text pasted by faculty into the editor's fields.
// `base` is the blank syllabus (keeps department / semester / scheme).
export function parseRawSyllabusText(rawText, base) {
  const result = { ...base };
  if (!rawText || !rawText.trim()) return result;

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const codeMatch = rawText.match(/(?:Course Code|Code)[\s:]*([0-9A-Z]{7,10})/i);
  if (codeMatch) result.code = codeMatch[1].toUpperCase();

  const titleMatch = rawText.match(/(?:Course Title|Subject|Title)[\s:]*([^\n\r]+)/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const hoursMatch = rawText.match(/(?:Contact Hours|Hours)[\s:]*(\d+)/i);
  if (hoursMatch) result.contactHours = parseInt(hoursMatch[1], 10);

  const ltpMatch = rawText.match(/(\(\d+-\d+-\d+\))\s*(\d+)?/);
  if (ltpMatch) {
    result.ltp = ltpMatch[1];
    if (ltpMatch[2]) result.credits = parseInt(ltpMatch[2], 10);
  }

  const prereqMatch = rawText.match(/(?:Pre-requisites|Prerequisites)[\s:]*([^\n\r]+)/i);
  if (prereqMatch) result.prerequisites = prereqMatch[1].trim();

  // ---- CLOs: lines under the "Course Learning Objectives" heading, else bullets before any CO/Unit line
  const bullet = /^[•\-*]\s*/;
  const clos = [];
  const cloHead = lines.findIndex((l) => /^course\s+learning\s+objectives/i.test(l));
  if (cloHead >= 0) {
    for (let i = cloHead + 1; i < lines.length; i++) {
      if (SECTION_START.test(lines[i]) && !bullet.test(lines[i])) break;
      const text = lines[i].replace(bullet, '').trim();
      if (text.length > 5) clos.push(text);
    }
  } else {
    const firstSection = lines.findIndex((l) => /^(CO[\s-]?\d|unit\b)/i.test(l));
    const limit = firstSection >= 0 ? firstSection : lines.length;
    for (let i = 0; i < limit && clos.length < 5; i++) {
      if (bullet.test(lines[i])) {
        const text = lines[i].replace(bullet, '').trim();
        if (text.length > 10) clos.push(text);
      }
    }
  }
  if (clos.length) result.clos = clos;

  // ---- COs: "CO-1: text", "CO1. text", "CO 2 - text"
  const cos = [];
  lines.forEach((l) => {
    const m = l.match(/^CO[\s-]?(\d+)\s*[:.)\-–]?\s*(.+)$/i);
    if (m && m[2].length > 5) {
      cos.push({
        id: `CO-${cos.length + 1}`,
        text: m[2].trim(),
        substantial: '',
        moderate: '',
        slight: '',
      });
    }
  });
  if (cos.length) result.cos = cos;

  // ---- Units: "Unit - I: Title: content ... 8 Hrs."  (content may continue on following lines)
  const units = [];
  let current = null;
  const finish = () => {
    if (!current) return;
    const hrs = current.body.match(/(\d+)\s*Hrs?\.?\s*$/i);
    if (hrs) current.hours = parseInt(hrs[1], 10);
    const body = current.body.replace(/\s*\d+\s*Hrs?\.?\s*$/i, '').trim();
    const colon = body.indexOf(':');
    // A short phrase before the first colon is the unit title
    if (colon > 0 && colon < 80) {
      current.title = body.slice(0, colon).trim();
      current.content = body.slice(colon + 1).trim();
    } else {
      current.content = body;
    }
    units.push({ unit: current.unit, title: current.title, content: current.content, hours: current.hours });
    current = null;
  };

  lines.forEach((l) => {
    const head = l.match(/^(Unit)\s*[-–:]?\s*([IVX]+|\d+)\b\s*[:.\-–]?\s*(.*)$/i);
    if (head) {
      finish();
      const id = head[2].toUpperCase();
      const n = ROMAN_TO_NUM[id] || parseInt(id, 10) || units.length + 1;
      current = { unit: `Unit - ${toRoman(n)}`, title: '', content: '', hours: 8, body: head[3] || '' };
      return;
    }
    if (current) {
      if (/^(reference|text\s*books?|assessment|evaluation)/i.test(l)) finish();
      else current.body = `${current.body} ${l}`.trim();
    }
  });
  finish();
  if (units.length) result.units = units;

  // ---- Reference books: "1) ...", "2. ..."
  const refs = [];
  lines.forEach((l) => {
    if (/^\d+[).]\s*(.+)/.test(l)) refs.push(l.replace(/^\d+[).]\s*/, '').trim());
  });
  if (refs.length) result.references = refs;

  result.poPsoMapping = calculatePoPsoAverages(result.cos);
  return result;
}
