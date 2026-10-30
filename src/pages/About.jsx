import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  Printer,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl';

const CAPABILITIES = [
  {
    Icon: Layers,
    title: 'Multi-Scheme Curriculum Architecture',
    text: 'Standardized curriculum templates configured for Autonomous Scheme 2022, 2026, and upcoming academic frameworks across all 8 UG engineering branches and 6 PG programmes.',
  },
  {
    Icon: Scale,
    title: 'Automated Outcome-Based Matrix Engine',
    text: 'Dynamic calculation of Course Outcome (CO) to Program Outcome (PO 1–12) and Program Specific Outcome (PSO 1–4) correlation levels with instant mathematical averaging.',
  },
  {
    Icon: FileCheck,
    title: 'Contact Hour & Credit Validator',
    text: 'Real-time synchronization between L-T-P (Lecture-Tutorial-Practical) credit structures and modular unit syllabus contact hours to prevent BoS submission discrepancies.',
  },
  {
    Icon: FileText,
    title: 'Intelligent Structured Ingestion',
    text: 'Rapid migration engine that ingests syllabus text and auto-populates course metadata, objectives, modular units, and reference literature in standard format.',
  },
  {
    Icon: Printer,
    title: 'BoS-Standard Layout & Archival PDF',
    text: 'High-resolution official SDMCET typographic styling engine for instant browser-based printing and export of archival-grade PDF documents for Board of Studies review.',
  },
  {
    Icon: ShieldCheck,
    title: 'Institutional Role-Based Governance',
    text: 'Strict access control with institutional domain validation, two-tier faculty-administrator workflows, and continuous local draft state persistence.',
  },
];

const PILLARS = [
  {
    Icon: Compass,
    title: 'Institutional Consistency',
    desc: 'Unifies disparate formatting into an authoritative, institutional standard conforming to Academic Council and Board of Studies mandates.',
  },
  {
    Icon: Award,
    title: 'NBA & NAAC Compliance',
    desc: 'Automates Bloom’s Revised Taxonomy alignment and rigorous Course Outcome to Program Outcome correlation matrices for seamless accreditation audits.',
  },
  {
    Icon: Sparkles,
    title: 'Faculty-Centric Efficiency',
    desc: 'Eliminates repetitive manual typesetting and mathematical calculations, enabling educators to focus entirely on pedagogical excellence.',
  },
];

const SECURITY_MEASURES = [
  'Verified institutional email registration for authorized faculty and administrators.',
  'Administrative approval lifecycle governing course authoring and syllabus approval privileges.',
  'Strict role-based authorization ensuring data integrity and administrative oversight.',
  'Continuous in-browser autosave architecture safeguarding active curriculum authoring drafts.',
];

function SectionHeading({ Icon, children }) {
  return (
    <h2 className="flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
      <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </span>
      <span>{children}</span>
    </h2>
  );
}

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 select-none">
      {/* Institutional Hero Banner */}
      <section className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl p-1.5 shrink-0 overflow-hidden">
            <img src="/sdmcet-logo.png" alt="SDMCET Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Curriculum Engineering Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              SDMCET Syllabus Formatter Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Shri Dharmasthala Manjunatheshwara College of Engineering & Technology, Dharwad
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          The SDMCET Syllabus Formatter Portal is the dedicated academic platform designed for faculty members and academic administrators to author, standardize, validate, and publish official curriculum documents. Engineered to uphold the highest benchmarks of Outcome-Based Education (OBE) and autonomy governance, the portal ensures complete uniformity across every undergraduate and postgraduate programme.
        </p>

        {/* Institutional Quality Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> Autonomous Curriculum Standards
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> NBA & NAAC Compliant Formats
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> Outcome-Based Education (OBE)
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> Board of Studies (BoS) Aligned
          </span>
        </div>
      </section>

      {/* Strategic Vision & Institutional Pillars */}
      <section className={`${card} space-y-5`}>
        <SectionHeading Icon={GraduationCap}>
          Strategic Pillars & Academic Mission
        </SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          {PILLARS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 p-5 transition-all hover:bg-white/[0.07] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3.5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Capabilities */}
      <section className={`${card} space-y-6`}>
        <SectionHeading Icon={Layers}>
          Core Curriculum Engineering Capabilities
        </SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 p-5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Workflow Lifecycle */}
      <section className={`${card} space-y-5`}>
        <SectionHeading Icon={Compass}>
          Curriculum Formulation Lifecycle
        </SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold mb-2">Stage 01</span>
            <h4 className="font-bold text-sm text-white mb-1">Programme & Scheme Selection</h4>
            <p className="text-slate-300 leading-relaxed">Select department, semester, and curriculum framework (2022, 2026, or upcoming scheme).</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold mb-2">Stage 02</span>
            <h4 className="font-bold text-sm text-white mb-1">Pedagogical Authoring</h4>
            <p className="text-slate-300 leading-relaxed">Formulate course learning objectives, modular unit contents, contact hours, and standard citations.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold mb-2">Stage 03</span>
            <h4 className="font-bold text-sm text-white mb-1">OBE Matrix Correlation</h4>
            <p className="text-slate-300 leading-relaxed">Map Course Outcomes to POs and PSOs with automatic real-time correlation index computation.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold mb-2">Stage 04</span>
            <h4 className="font-bold text-sm text-white mb-1">BoS Review & Archival</h4>
            <p className="text-slate-300 leading-relaxed">Inspect verified print layouts, generate high-definition PDFs, and archive for Board of Studies approval.</p>
          </div>
        </div>
      </section>

      {/* Security & Access Assurance */}
      <section className={`${card} space-y-4`}>
        <SectionHeading Icon={ShieldCheck}>
          Governance & Security Standards
        </SectionHeading>
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          {SECURITY_MEASURES.map((measure) => (
            <div key={measure} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-slate-200">
              <Lock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{measure}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Support & Action */}
      <section className={`${card} space-y-4`}>
        <SectionHeading Icon={Mail}>
          Institutional Support & Academic Guidance
        </SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-200">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h4 className="text-sm font-bold text-white mb-1">Academic Affairs & BoS Secretariat</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              For curriculum guidelines, scheme amendments, or departmental syllabus coordination, contact the Academic Section and Board of Studies Secretariat of SDMCET Dharwad.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h4 className="text-sm font-bold text-white mb-1">Faculty & Administrative Assistance</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detailed procedural instructions, formatting guidelines, and troubleshooting solutions are available in the dedicated portal support documentation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            to="/help"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]"
          >
            <span>Explore Documentation & Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-semibold text-xs transition-colors"
          >
            <span>Back to Portal Home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
