// Syllabus schemes offered to the user after they choose a semester.
// status "fixed"    -> the syllabus format is fixed
// status "upcoming" -> the scheme is still being prepared, so its format may change
// To add or rename a scheme, edit this list only.
export const SCHEMES = [
  {
    id: '2022',
    label: '2022 Scheme',
    status: 'fixed',
    description: 'Fixed syllabus format.',
  },
  {
    id: '2026',
    label: '2026 Scheme',
    status: 'fixed',
    description: 'Fixed syllabus format.',
  },
  {
    id: 'upcoming',
    label: 'Upcoming Scheme',
    status: 'upcoming',
    description: 'Scheme under preparation. The format may change before it is finalised.',
  },
];

// Number of semesters per programme type
export const SEMESTER_COUNT = { ug: 8, pg: 4 };
