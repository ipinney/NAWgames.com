// St. Rose Elementary Science Fair 2026-2027, 3rd grade. From Miss Taggart's due-date sheet,
// the Aug 19, 2026 parent letter, and the SRL 3rd and 5th grade rubric.

export const FAIR = '/projects/addie/mosquito-turret/fair';

// Each part gets its own grade.
export const DUE = [
  {
    id: 'question',
    date: '2026-11-18',
    label: 'Wed Nov 18',
    title: 'Question',
    text: 'One question that a test can answer. It names what gets changed and what gets counted.',
    rubric: ['purpose'],
  },
  {
    id: 'research',
    date: '2026-12-02',
    label: 'Wed Dec 2',
    title: 'Research notes, bibliography, Catholic connection',
    text: '3 to 5 research bullet points, 2 or 3 sources, and how the project connects to our faith.',
    rubric: ['analysis', 'religion'],
  },
  {
    id: 'hypothesis',
    date: '2026-12-09',
    label: 'Wed Dec 9',
    title: 'Hypothesis',
    text: 'Your best guess before any test runs, and the reason for it. Plus the variables.',
    rubric: ['purpose'],
  },
  {
    id: 'experiments',
    date: '2027-01-19',
    label: 'Tue Jan 19',
    title: 'Conduct and complete experiments',
    text: 'All 30 runs done, written in the journal, with a photo of every setup.',
    rubric: ['procedure', 'journal', 'other'],
  },
  {
    id: 'results',
    date: '2027-01-25',
    label: 'Mon Jan 25',
    title: 'Data, results, and conclusion',
    text: 'Averages, one bar graph for each test, and what the data says about the hypothesis.',
    rubric: ['data', 'analysis'],
  },
  {
    id: 'final',
    date: '2027-02-01',
    label: 'Mon Feb 1',
    title: 'Final project',
    text: 'The trifold board, the journal, and the MS-2000, all turned in.',
    rubric: ['display', 'journal', 'oral'],
  },
];

export const EVENTS = [
  { date: '2027-02-03', label: 'Wed Feb 3, 2:00 PM', title: 'Parent exhibition', text: 'Parish Hall. Judging and the demo.' },
  { date: '2027-02-25', label: 'Thu Feb 25', title: 'Archdiocesan Science Fair', text: 'For the projects St. Rose picks as winners.' },
];

// SRL rubric: every row is scored 0, 1, 3, or 5. Nine rows, 45 points.
export const RUBRIC = [
  { id: 'purpose', title: 'Purpose, hypothesis, and variables', look: 'Purpose is clear; hypothesis addresses the purpose; variables are included.' },
  { id: 'procedure', title: 'Experimental procedure and materials', look: 'Procedure written in clear steps.' },
  { id: 'data', title: 'Data and results', look: 'Observations are organized; good use of photos, charts, and graphs to display data.' },
  { id: 'analysis', title: 'Analysis and conclusions', look: 'Related to purpose and research; supported by the data.' },
  { id: 'religion', title: 'Religion reflection', look: 'Makes connections between the project and our Catholic faith.' },
  { id: 'journal', title: 'Journal', look: 'Records all steps and observations.' },
  { id: 'display', title: 'Display', look: 'Neat, attractive, and well organized.' },
  { id: 'oral', title: 'Oral presentation', look: 'Knowledge gained is expressed clearly; questions answered correctly.' },
  { id: 'other', title: 'Other', look: 'Originality, creativity, presentation, multiple trials.' },
];

export const SCORES = [
  [0, 'Not evident'],
  [1, 'Not clear'],
  [3, 'Somewhat clear'],
  [5, 'Very clear'],
];

export function daysUntil(iso, now) {
  const [y, m, d] = iso.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due - today) / 86400000);
}
