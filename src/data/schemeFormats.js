// ---------------------------------------------------------------------------
// How a syllabus page looks for each scheme.
// The preview and the editor read everything format-specific from here, so a new or
// changed scheme only needs a change in this file.
// ---------------------------------------------------------------------------
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const toRoman = (n) => ROMAN[n] || String(n);

// 2022 scheme, as printed in "CSE Syllabus AY 2024-25, III and IV Semesters"
const FORMAT_2022 = {
  id: '2022',
  label: '2022 Scheme',
  academicYear: '2024-25',

  // Course heading bar: "22UCSC300   Data Structures and Applications   (4-0-0) 4"
  heading: {
    fill: '#00CCFF',
    text: '#000000',
    ltpHint: '(L-T-P)',
    defaultLtp: '(3-0-0)',
    defaultCredits: 3,
    creditsGap: ' ',
    hoursLabel: 'Contact Hours',
    defaultHours: 39,
  },

  clos: { style: 'bullets', introOnSameLine: true },
  prerequisitesLabel: 'Pre-requisites',

  // Mapping table: POs 1-12, plus PSOs 13-16 (the course can choose to use POs only)
  mapping: { poCount: 12, psoCount: 4, psoOptional: true },
  tableHeaderFill: '#C6D9F1',
  poHeaderFill: '#66CCFF',
  poTableFullWidth: true,

  units: {
    label: (n) => `Unit-${toRoman(n)}`,
    titleOnOwnLine: false, // "Fourier Series: Periodic functions ..." (bold title runs into the text)
    padHours: false, // 8 Hrs
    hoursOnOwnLine: false,
    defaultHours: [8, 8, 8, 8, 7], // 39 hours
  },

  lab: { defaultTitle: '**List of Experiments:**' },
};

// 2026 scheme, as printed in "CSE Syllabus AY 2026-27, I and II Semesters"
const FORMAT_2026 = {
  id: '2026',
  label: '2026 Scheme',
  academicYear: '2026-27',

  // Course heading bar: "26UMATCS11   Mathematics - I for CS stream   (42-0-28-50)4", then "Total Hours: 120"
  heading: {
    fill: '#00CCFF',
    text: '#FFFFFF',
    ltpHint: '(CI-LI-TW&SL)',
    defaultLtp: '(42-0-0-48)',
    defaultCredits: 3,
    creditsGap: '',
    hoursLabel: 'Total Hours',
    defaultHours: 90,
  },

  clos: { style: 'numbered', introOnSameLine: false },
  prerequisitesLabel: 'Pre-requisite',

  // Mapping table: POs 1-11 only
  mapping: { poCount: 11, psoCount: 0, psoOptional: false },
  tableHeaderFill: '#C6D9F1',
  poHeaderFill: '#C6D9F1',
  poTableFullWidth: false,

  units: {
    label: (n) => `Unit-${toRoman(n)}`,
    titleOnOwnLine: true, // bold topic name on its own line above the text
    padHours: true, // 08 Hrs
    hoursOnOwnLine: true,
    defaultHours: [9, 9, 8, 8, 8], // 42 hours
  },

  lab: { defaultTitle: '**List of Laboratory experiments**' },
};

// The upcoming scheme starts as a copy of 2026. When its final format is known, change it here.
const FORMAT_UPCOMING = {
  ...FORMAT_2026,
  id: 'upcoming',
  label: 'Upcoming Scheme',
  academicYear: '2027-28',
};

export const SCHEME_FORMATS = {
  2022: FORMAT_2022,
  2026: FORMAT_2026,
  upcoming: FORMAT_UPCOMING,
};

export const getFormat = (schemeId) => SCHEME_FORMATS[schemeId] || FORMAT_2026;

// Which columns the PO / PSO table has for this course
export function mappingSpec(format, course) {
  const { poCount, psoCount, psoOptional } = format.mapping;
  const withPso = psoCount > 0 && !(psoOptional && course?.mappingMode === 'po');
  const total = poCount + (withPso ? psoCount : 0);
  return {
    poCount,
    withPso,
    total,
    header: withPso
      ? `Mapping to POs(1-${poCount}) / PSOs (${poCount + 1}-${total})`
      : `Mapping to POs (1-${poCount})`,
    firstCell: withPso ? 'POs/PSOs' : 'POs',
  };
}
