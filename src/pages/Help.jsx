import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle, Info, ListChecks } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl';

const QUICK_START = [
  {
    title: 'Choose your programme',
    text: 'On the Home page click UG or PG, then pick your department, the semester and the syllabus scheme. Each step scrolls to the next, and the Back button takes you up one step.',
  },
  {
    title: 'Enter the syllabus',
    text: 'In the Author / Edit tab fill in the course details, objectives, course outcomes, units, reference books and the evaluation pattern.',
  },
  {
    title: 'Map the outcomes',
    text: 'For each CO type the PO/PSO numbers under Substantial, Moderate and Slight. The averages are calculated for you.',
  },
  {
    title: 'Check the preview',
    text: 'Open the Official Preview tab to see the syllabus in the SDMCET layout. Fix anything that looks wrong in the editor.',
  },
  {
    title: 'Print or save as PDF',
    text: 'Click Print / Export PDF. In the print window choose your printer, or choose "Save as PDF" as the destination.',
  },
];

function Item({ title, children, defaultOpen = false }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl bg-white/5 border border-white/10 open:bg-white/10 transition-colors"
    >
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 text-sm font-bold">
        {title}
        <ChevronDown className="w-4 h-4 shrink-0 text-orange-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 text-sm text-slate-200 leading-relaxed space-y-3">{children}</div>
    </details>
  );
}

function Code({ children }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950/80 border border-white/10 p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre">
      {children}
    </pre>
  );
}

const SAMPLE_TEXT = `Course Code: 22UCSC301
Course Title: Data Structures and Applications
(4-0-0) 4
Contact Hours: 52
Pre-requisites: Programming in C
Course Learning Objectives (CLOs):
- Understand the basic linear data structures
- Apply tree and graph algorithms to problems
CO-1: Explain the concept of stacks and queues
CO-2: Implement trees and graphs for applications
Unit - I: Introduction: Pointers, dynamic memory allocation. 10 Hrs.
Unit - II: Stacks and Queues: Stack operations, circular queue. 11 Hrs.
Reference Books:
1) Horowitz, Fundamentals of Data Structures
2) Tenenbaum, Data Structures using C`;

export default function Help() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Intro */}
      <section className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">Support</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Help</h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          How to prepare a syllabus with the SDMCET Syllabus Formatter, from choosing your department to printing the
          final document.
        </p>
      </section>

      {/* Quick start */}
      <section className={`${card} space-y-5`}>
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ListChecks className="w-5 h-5 text-orange-400" /> Quick start
        </h2>
        <ol className="space-y-3">
          {QUICK_START.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-4">
              <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-sm font-extrabold">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-bold">{s.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/ug"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold transition-colors"
          >
            Start with UG <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pg"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-colors"
          >
            Start with PG <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Detailed help */}
      <section className={`${card} space-y-3`}>
        <h2 className="text-lg font-extrabold tracking-tight mb-2">Step-by-step help</h2>

        <Item title="Signing up and logging in" defaultOpen>
          <p>
            Create an account with your name, institutional email and a password of at least 8 characters. A new
            account cannot log in until the administrator approves it, so you will see "awaiting admin approval"
            until then.
          </p>
          <p>
            On the login page choose the role you were registered with (Faculty or Administrator). The first time you
            sign in, read and accept the Terms and Conditions to continue.
          </p>
        </Item>

        <Item title="Choosing the programme, semester and scheme">
          <p>
            From the Home page click <b>UG</b> or <b>PG</b>. Select your department (or PG programme), then the
            semester (1 to 8 for UG, 1 to 4 for PG), then the scheme: 2022, 2026 or Upcoming. The "Upcoming" scheme
            is still being prepared, so its format may change.
          </p>
          <p>
            Each choice scrolls to the next step. Use <b>Back to departments</b> or <b>Back to semesters</b> to go up
            a step, or the browser's back button.
          </p>
        </Item>

        <Item title="Filling in the editor">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><b>Course metadata:</b> course code, title, category, L-T-P with credits, contact hours and pre-requisites.</li>
            <li><b>Course Learning Objectives:</b> one objective per box. Use Add CLO for more.</li>
            <li><b>Course Outcomes:</b> one box per CO with its PO/PSO mapping (explained below).</li>
            <li><b>Contents:</b> for each unit enter the title, the topics and the hours.</li>
            <li><b>Reference books:</b> author, title, publisher, edition and year, in a consistent format.</li>
            <li><b>Assessment and evaluation pattern:</b> pre-filled with the standard CIE/SEE text; edit it if your course differs.</li>
          </ul>
          <p>
            The semester, department and scheme come from what you chose earlier and need not be typed. Below the
            units a line tells you whether the total unit hours match the contact hours. Green means they match, amber
            means they do not.
          </p>
        </Item>

        <Item title="PO/PSO mapping: how to enter it">
          <p>
            Under each CO, list the PO numbers (1 to 12) and PSO numbers (13 to 16) in the box for its level, separated
            by commas: <b>Substantial (3)</b>, <b>Moderate (2)</b> or <b>Slight (1)</b>. Leave a box empty where there
            is no mapping. The preview shows a hyphen (-) there.
          </p>
          <p>
            The table row "Mapping Level" is the average of the levels given to each PO/PSO across all COs. For
            example:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-white/10 text-left">
                  <th className="border border-white/15 p-2"></th>
                  <th className="border border-white/15 p-2">Substantial (3)</th>
                  <th className="border border-white/15 p-2">Moderate (2)</th>
                  <th className="border border-white/15 p-2">Slight (1)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-white/15 p-2 font-bold">CO-1</td>
                  <td className="border border-white/15 p-2 font-mono">1, 2</td>
                  <td className="border border-white/15 p-2 font-mono">3</td>
                  <td className="border border-white/15 p-2 font-mono">-</td>
                </tr>
                <tr>
                  <td className="border border-white/15 p-2 font-bold">CO-2</td>
                  <td className="border border-white/15 p-2 font-mono">1</td>
                  <td className="border border-white/15 p-2 font-mono">-</td>
                  <td className="border border-white/15 p-2 font-mono">3, 5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            PO1 is mapped at 3 and 3, so its average is 3.0. PO3 is mapped at 2 and 1, so its average is 1.5. PO5 is
            mapped once at 1, so it is 1.0.
          </p>
        </Item>

        <Item title="Importing existing syllabus text">
          <p>
            Open the <b>Import Text</b> tab, paste the text (or load a .txt file) and click <b>Map text into
            fields</b>. The portal recognises headings like the ones below and fills the matching fields. Always check
            the result in the editor, and enter the PO/PSO levels yourself, because they are not imported.
          </p>
          <Code>{SAMPLE_TEXT}</Code>
          <p>
            Importing replaces what is currently in the editor. PDF and Word files cannot be read yet, so open them,
            copy the text and paste it into the box.
          </p>
        </Item>

        <Item title="Preview, print and save as PDF">
          <p>
            The <b>Official Preview</b> tab shows the syllabus exactly as it will print. Click{' '}
            <b>Print / Export PDF</b>: the portal switches to the preview and opens the print window, and only the
            syllabus page is printed. To make a PDF, choose "Save as PDF" as the destination in that window.
          </p>
        </Item>

        <Item title="Your drafts and the reset button">
          <p>
            Everything you type is saved automatically in this browser, separately for each department, semester and
            scheme. Coming back to the same selection later on the same computer and browser brings your draft back.
          </p>
          <p>
            Drafts are not yet stored on the server, so they do not follow you to another computer, and clearing your
            browser data deletes them. The circular-arrow button in the toolbar clears the current syllabus and starts
            a blank one, after asking you to confirm.
          </p>
        </Item>

        {user?.role === 'admin' && (
          <Item title="For administrators: approving accounts">
            <p>
              Open the Admin page to see faculty accounts waiting for approval. Approve to let a person log in, or
              reject to refuse the request. Only approved accounts can sign in.
            </p>
          </Item>
        )}

        <Item title="Troubleshooting">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>"Your account is awaiting admin approval":</b> the administrator has not approved the account yet.
              Contact them.
            </li>
            <li>
              <b>"Invalid email or password":</b> check both, and check that the selected role matches your account.
            </li>
            <li>
              <b>The unit hours line is amber:</b> the unit hours do not add up to the contact hours. Adjust one of
              them.
            </li>
            <li>
              <b>Import filled nothing in:</b> the text probably lacks recognisable headings. Add lines such as
              "Course Code:", "CO-1:" and "Unit - I:" and try again, or type the content in the editor.
            </li>
            <li>
              <b>My draft is missing:</b> drafts belong to one browser and one selection. Check you are on the same
              computer, browser, department, semester and scheme.
            </li>
          </ul>
        </Item>
      </section>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4" />
        Still stuck? See the <Link to="/about" className="text-orange-400 hover:underline">About page</Link> for
        contact details.
      </p>
    </div>
  );
}
