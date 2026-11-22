import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  Layers,
  Lock,
  Printer,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl';

const QUICK_ROADMAP = [
  {
    step: '01',
    title: 'Programme & Scheme Alignment',
    desc: 'Navigate to UG or PG from the portal home. Select your engineering department, target semester (1–8 for UG, 1–4 for PG), and current academic scheme (2022, 2026, or upcoming scheme).',
  },
  {
    step: '02',
    title: 'Pedagogical Authoring',
    desc: 'Input course metadata (Code, Title, Category, L-T-P credits), Course Learning Objectives (CLOs), modular unit syllabi, contact hour distributions, and authoritative reference literature.',
  },
  {
    step: '03',
    title: 'OBE Matrix Formulation',
    desc: 'Assign correlation levels for each Course Outcome against Program Outcomes (PO 1–12) and PSOs (13–16) using Substantial (3), Moderate (2), or Slight (1) correlation levels.',
  },
  {
    step: '04',
    title: 'BoS Layout Verification',
    desc: 'Review the generated curriculum in the Official Preview tab, verifying typographic alignment, unit contact hours, and standard evaluation patterns.',
  },
  {
    step: '05',
    title: 'Archival PDF Export',
    desc: 'Utilize the integrated Print / Export PDF facility to generate publication-grade documentation for departmental Board of Studies (BoS) submission and archival.',
  },
];

function GuideAccordion({ title, Icon, children, defaultOpen = false, badge }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl bg-white/5 border border-white/10 open:bg-white/[0.08] transition-all duration-200 overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 text-sm font-bold select-none hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Icon className="w-4 h-4" />
            </span>
          )}
          <span className="text-white text-sm sm:text-base font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
              {badge}
            </span>
          )}
          <ChevronDown className="w-4 h-4 shrink-0 text-orange-400 transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>
      <div className="px-5 pb-5 pt-2 text-sm text-slate-200 leading-relaxed space-y-3.5 border-t border-white/5">
        {children}
      </div>
    </details>
  );
}

function CodeBlock({ children }) {
  return (
    <div className="relative rounded-2xl bg-slate-950/90 border border-white/10 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
      <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 mb-2 border-b border-white/10 pb-1">
        Standard Ingestion Format Sample
      </div>
      <pre className="whitespace-pre leading-relaxed">{children}</pre>
    </div>
  );
}

const SAMPLE_IMPORT_STRUCTURE = `Course Code: 22UCSC301
Course Title: Data Structures and Applications
(4-0-0) 4
Contact Hours: 52
Pre-requisites: Programming in C
Course Learning Objectives (CLOs):
- Understand foundational linear data structures and memory models
- Apply non-linear hierarchical tree and graph algorithms to engineering problems
CO-1: Formulate and analyze abstract data types including stacks and queues
CO-2: Synthesize and implement self-balancing search trees for optimal retrieval
Unit - I: Introduction to Data Structures: Pointers, dynamic allocations. 10 Hrs.
Unit - II: Linear Abstract Types: Stacks, queues, double-ended queues. 11 Hrs.
Reference Books:
1) Horowitz, Sahni, Fundamentals of Data Structures, Universities Press, 2nd Edition, 2018.
2) Tenenbaum, Data Structures Using C, Pearson Education, 2019.`;

export default function Help() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 select-none">
      {/* Hero Header */}
      <section className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl p-1.5 shrink-0 overflow-hidden">
            <img src="/sdmcet-logo.png" alt="SDMCET Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Faculty & Administrator Documentation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Academic Formatter Knowledge Base
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Comprehensive guidelines for course formulation, OBE correlation, and institutional syllabus publication.
            </p>
          </div>
        </div>

        {/* Quick Categorical Filter Buttons */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            All Documentation
          </button>
          <button
            type="button"
            onClick={() => setFilter('faculty')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'faculty'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            Faculty Authoring Guides
          </button>
          <button
            type="button"
            onClick={() => setFilter('obe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'obe'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            OBE & Matrix Computation
          </button>
          <button
            type="button"
            onClick={() => setFilter('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'admin'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            Administrator Governance
          </button>
        </div>
      </section>

      {/* Curriculum Authoring Roadmap */}
      {(filter === 'all' || filter === 'faculty') && (
        <section className={`${card} space-y-5`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
                <Compass className="w-5 h-5 text-white" />
              </span>
              <span>Curriculum Formulation Roadmap</span>
            </h2>
            <div className="flex items-center gap-2">
              <Link
                to="/ug"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-md"
              >
                <span>Launch UG Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/pg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-colors"
              >
                <span>Launch PG Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            {QUICK_ROADMAP.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white/5 border border-white/10 p-4.5 flex flex-col justify-between hover:bg-white/[0.08] transition-all"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-black text-xs flex items-center justify-center mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comprehensive Operational Guidelines */}
      <section className={`${card} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </span>
            <span>Comprehensive Operational Guides</span>
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {/* Guide 1: Registration & Access */}
          {(filter === 'all' || filter === 'faculty' || filter === 'admin') && (
            <GuideAccordion
              title="Faculty Account Registration & Credential Verification"
              Icon={UserCheck}
              badge="Access Protocol"
              defaultOpen
            >
              <p>
                Access to the syllabus authoring portal is strictly governed by institutional credentials. Faculty members must register using their official institutional email address (<code className="text-orange-300 font-mono text-xs">faculty_name@sdmcet.ac.in</code>) with a secure password containing at least 8 characters.
              </p>
              <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-3.5 text-xs text-orange-200">
                <strong>Administrative Verification:</strong> Upon submission, newly created faculty profiles enter a pending authorization queue. An institutional administrator validates academic identity before access rights are granted.
              </div>
              <p>
                Upon initial authentication, faculty members must review and accept the official <strong>Institutional Terms and Conditions</strong> before entering the curriculum design studio.
              </p>
            </GuideAccordion>
          )}

          {/* Guide 2: Programme & Scheme Selection */}
          {(filter === 'all' || filter === 'faculty') && (
            <GuideAccordion
              title="Departmental Hierarchy & Scheme Navigation"
              Icon={Layers}
              badge="Curriculum Structure"
            >
              <p>
                Curriculum schemas are indexed hierarchically across Under Graduate (UG) and Post Graduate (PG) branches:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-200">
                <li><strong>Under Graduate Engineering (8 Departments):</strong> Computer Science, Information Science, Electronics & Communication, Electrical & Electronics, Mechanical, Civil, Chemical, and Artificial Intelligence & Machine Learning.</li>
                <li><strong>Post Graduate Programmes (6 Specializations):</strong> Advanced Master's engineering specializations and autonomous curricula.</li>
                <li><strong>Autonomous Schemes:</strong> 2022 Scheme (active autonomous syllabus), 2026 Scheme (revised NEP-compliant autonomous curriculum), and upcoming Board of Studies frameworks.</li>
              </ul>
              <p className="text-xs text-slate-300">
                The portal preserves your selection context automatically as you transition between semester levels and modular course views.
              </p>
            </GuideAccordion>
          )}

          {/* Guide 3: Course Formulation & Hours Validator */}
          {(filter === 'all' || filter === 'faculty') && (
            <GuideAccordion
              title="Course Formulation & Contact Hour Synchronization"
              Icon={FileCheck}
              badge="Academic Standards"
            >
              <p>
                The curriculum authoring studio provides structured fields enforcing institutional Board of Studies conventions:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="block text-white mb-1">Course Metadata</strong>
                  Course Code, Official Title, Academic Category (Professional Core Course - PCC, Professional Elective - PEC, Open Elective - OEC, Basic Sciences - BSC, Engineering Sciences - ESC), and Prerequisites.
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="block text-white mb-1">L-T-P & Credit Formulation</strong>
                  Lecture (L), Tutorial (T), and Practical (P) distribution alongside assigned institutional credits and mandated contact semester hours.
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs text-emerald-200">
                <strong>Contact Hour Integrity Indicator:</strong> The portal actively computes the cumulative contact hours across all syllabus units. When modular unit hours match the assigned total contact hours, a green confirmation indicator displays. An amber alert indicates a mathematical discrepancy requiring adjustment.
              </div>
            </GuideAccordion>
          )}

          {/* Guide 4: Pedagogical Objectives & Bloom's Taxonomy */}
          {(filter === 'all' || filter === 'faculty' || filter === 'obe') && (
            <GuideAccordion
              title="Course Learning Objectives (CLOs) & Bloom's Revised Taxonomy"
              Icon={GraduationCap}
              badge="Pedagogical Design"
            >
              <p>
                Pedagogical objectives define the fundamental cognitive goals of the course:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-200">
                <li><strong>Course Learning Objectives (CLOs):</strong> Broad educational intentions summarizing what instructional concepts will be delivered across the semester.</li>
                <li><strong>Course Outcomes (COs):</strong> Measurable, demonstrable competencies students acquire upon completion. Outcomes must be articulated utilizing active verbs conforming to Bloom’s Revised Cognitive Levels: <em>Remember (L1), Understand (L2), Apply (L3), Analyze (L4), Evaluate (L5), Create (L6)</em>.</li>
              </ul>
            </GuideAccordion>
          )}

          {/* Guide 5: OBE Matrix Formulation */}
          {(filter === 'all' || filter === 'obe') && (
            <GuideAccordion
              title="OBE PO/PSO Correlation Matrix & Calculation Methodology"
              Icon={Calculator}
              badge="NBA / NAAC Compliance"
              defaultOpen
            >
              <p>
                In alignment with National Board of Accreditation (NBA) guidelines, Course Outcomes (COs) correlate with twelve Graduate Attributes / Program Outcomes (PO 1–12) and Departmental Program Specific Outcomes (PSO 13–16).
              </p>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2 text-xs">
                <p className="font-semibold text-white">Correlation Level Standards:</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/25">
                    <strong className="text-orange-400">Level 3 (Substantial)</strong>
                    <p className="text-slate-300 mt-0.5">High direct relevance, measured through major assessments.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <strong className="text-amber-400">Level 2 (Moderate)</strong>
                    <p className="text-slate-300 mt-0.5">Medium conceptual relevance supported through assignments.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <strong className="text-blue-400">Level 1 (Slight)</strong>
                    <p className="text-slate-300 mt-0.5">Introductory or contextual alignment.</p>
                  </div>
                </div>
              </div>

              <p className="font-semibold text-xs text-white pt-1">Sample BoS Correlation Matrix & Arithmetic Index Derivation:</p>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-white/10 text-slate-200">
                      <th className="p-2.5 border-b border-white/10 font-bold">Outcome</th>
                      <th className="p-2.5 border-b border-white/10 font-bold text-orange-400">Substantial (Level 3)</th>
                      <th className="p-2.5 border-b border-white/10 font-bold text-amber-400">Moderate (Level 2)</th>
                      <th className="p-2.5 border-b border-white/10 font-bold text-blue-400">Slight (Level 1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    <tr>
                      <td className="p-2.5 font-bold text-white">CO-1</td>
                      <td className="p-2.5 font-mono">PO1, PO2</td>
                      <td className="p-2.5 font-mono">PO3</td>
                      <td className="p-2.5 font-mono">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">CO-2</td>
                      <td className="p-2.5 font-mono">PO1</td>
                      <td className="p-2.5 font-mono">—</td>
                      <td className="p-2.5 font-mono">PO3, PSO1</td>
                    </tr>
                    <tr className="bg-white/5 font-semibold text-white">
                      <td className="p-2.5">Mapping Index</td>
                      <td className="p-2.5 font-mono">PO1: 3.0</td>
                      <td className="p-2.5 font-mono">PO3: 1.5</td>
                      <td className="p-2.5 font-mono">PSO1: 1.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The portal calculates arithmetic averages dynamically across all assigned levels, eliminating manual tabulations and ensuring mathematical accuracy for NBA accreditation exhibits.
              </p>
            </GuideAccordion>
          )}

          {/* Guide 6: Ingestion Engine */}
          {(filter === 'all' || filter === 'faculty') && (
            <GuideAccordion
              title="Structured Text Ingestion Engine"
              Icon={FileText}
              badge="Productivity Tool"
            >
              <p>
                To accelerate syllabus digitisation from historical records, the <strong>Import Text</strong> module parses raw text blocks into the appropriate structured fields automatically.
              </p>
              <CodeBlock>{SAMPLE_IMPORT_STRUCTURE}</CodeBlock>
              <p className="text-xs text-slate-300">
                Paste structured curriculum content into the parsing terminal and select <em>Map text into fields</em>. Always perform an authoritative review in the editor tab prior to final preview generation.
              </p>
            </GuideAccordion>
          )}

          {/* Guide 7: Preview & BoS Print Layout */}
          {(filter === 'all' || filter === 'faculty') && (
            <GuideAccordion
              title="BoS Layout Verification, High-Definition Printing & PDF Generation"
              Icon={Printer}
              badge="Publication Output"
            >
              <p>
                The <strong>Official Preview</strong> tab renders the curriculum precisely in the mandated SDMCET institutional layout:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-200">
                <li>Institutional header banner incorporating the college emblem and department typography.</li>
                <li>Standardised CIE (Continuous Internal Evaluation) and SEE (Semester End Examination) evaluation criteria tables.</li>
                <li>High-resolution vector rendering optimized for A4 physical printing or digital archival.</li>
              </ul>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-slate-200">
                <strong>Exporting Archival PDF:</strong> Select <em>Print / Export PDF</em>. In the system print dialog, designate your printer destination as <strong>"Save as PDF"</strong> with Margins set to "Default" and Background Graphics enabled for optimal visual fidelity.
              </div>
            </GuideAccordion>
          )}

          {/* Guide 8: Autosave & Storage Architecture */}
          {(filter === 'all' || filter === 'faculty') && (
            <GuideAccordion
              title="Continuous Local Autosave & State Resilience"
              Icon={Save}
              badge="Data Integrity"
            >
              <p>
                The authoring studio continuously preserves active drafts within your local browser storage engine. Each curriculum draft is uniquely partitioned by department, semester level, and academic scheme.
              </p>
              <p className="text-xs text-slate-300">
                Unexpected tab closures, browser refreshes, or navigation switches will not result in lost work. To initiate a blank curriculum template, utilize the circular reset action in the studio toolbar.
              </p>
            </GuideAccordion>
          )}

          {/* Guide 9: Administrator Governance */}
          {(filter === 'all' || filter === 'admin') && (
            <GuideAccordion
              title="Administrator Governance & Account Authorization Workflow"
              Icon={ShieldCheck}
              badge="Administrative Oversight"
              defaultOpen={user?.role === 'admin'}
            >
              <p>
                Administrative accounts maintain institutional stewardship over curriculum formulation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-200">
                <li><strong>Registration Review:</strong> Inspect pending faculty registration requests through the administrative dashboard, confirming departmental affiliation prior to authorization.</li>
                <li><strong>Access Revocation:</strong> Temporarily or permanently suspend credentials upon departmental reassignment or academic leave.</li>
                <li><strong>Curriculum Audit:</strong> Ensure syllabus submissions adhere to Autonomous Scheme conventions prior to Board of Studies tabling.</li>
              </ul>
            </GuideAccordion>
          )}

          {/* Guide 10: Troubleshooting */}
          {(filter === 'all' || filter === 'faculty' || filter === 'admin') && (
            <GuideAccordion
              title="Operational Diagnostics & Troubleshooting"
              Icon={HelpCircle}
              badge="Resolution Center"
            >
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="text-white block mb-1">Account Awaiting Approval</strong>
                  <p className="text-slate-300">New accounts require administrative verification. Contact your departmental coordinator or the portal administrator for authorization.</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="text-white block mb-1">Amber Contact Hour Alert</strong>
                  <p className="text-slate-300">The sum of modular unit hours does not equate to the declared total contact hours. Verify unit allocations against course credits.</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="text-white block mb-1">Import Incomplete</strong>
                  <p className="text-slate-300">Ensure raw syllabus text contains recognized delimiters such as <em>Course Code:</em>, <em>CO-1:</em>, and <em>Unit - I:</em>.</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                  <strong className="text-white block mb-1">Draft State Recovery</strong>
                  <p className="text-slate-300">Drafts are saved locally in the active browser. Ensure you access the portal using the same browser profile and workstation.</p>
                </div>
              </div>
            </GuideAccordion>
          )}
        </div>
      </section>

      {/* Institutional Support Contact Banner */}
      <section className={`${card} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Need Additional Institutional Guidance?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Consult the Board of Studies Secretariat or review institutional curriculum policies on the About page.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]"
            >
              <span>View Institutional About</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
