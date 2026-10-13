import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Calculator, ClipboardList, Cpu, FileText, GraduationCap,
  Layers, Lock, Mail, Printer, Save, ShieldCheck, Users,
} from 'lucide-react';
import { PROJECT, GUIDE, TEAM, ACKNOWLEDGEMENT } from '../data/about';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl';

const FEATURES = [
  {
    Icon: Layers,
    title: 'Guided selection',
    text: 'Pick the programme, department, semester and scheme step by step. 8 UG departments, 6 PG programmes and the 2022, 2026 and upcoming schemes.',
  },
  {
    Icon: ClipboardList,
    title: 'Complete syllabus editor',
    text: 'Enter course details, learning objectives, course outcomes, unit-wise contents, reference books and the evaluation pattern in one place.',
  },
  {
    Icon: Calculator,
    title: 'Automatic OBE mapping',
    text: 'PO/PSO averages are calculated from the Substantial (3), Moderate (2) and Slight (1) levels you enter for each CO.',
  },
  {
    Icon: FileText,
    title: 'Text import',
    text: 'Paste existing syllabus text and the portal fills the code, title, outcomes, units and reference books where it recognises the headings.',
  },
  {
    Icon: Printer,
    title: 'Official preview and PDF',
    text: 'See the syllabus in the SDMCET layout and print it or save it as a PDF straight from the browser.',
  },
  {
    Icon: Save,
    title: 'Draft auto-save',
    text: 'Your work is saved in your browser as you type, so a refresh or an accidental close does not lose it.',
  },
];

const SECURITY = [
  'Faculty sign up and wait for administrator approval before they can log in.',
  'Separate faculty and administrator roles, enforced on the server.',
  'Passwords are stored hashed, and sessions use signed tokens that expire.',
  'Faculty accept the Terms and Conditions on their first sign-in.',
];

const TECH = ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'];

function Heading({ Icon, children }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
        <Icon className="w-5 h-5 text-white" />
      </span>
      {children}
    </h2>
  );
}

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Intro */}
      <section className={card}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">About</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{PROJECT.name}</h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {PROJECT.tagline} Built for {PROJECT.institution}, the portal replaces hand-formatted syllabus documents
          with one consistent, Outcome-Based Education (OBE) compliant layout that follows the standards of the
          Board of Studies.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">{PROJECT.department}</span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">{PROJECT.projectType}</span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">{PROJECT.academicYear}</span>
        </div>
      </section>

      {/* Why */}
      <section className={`${card} space-y-4`}>
        <Heading Icon={GraduationCap}>Why this portal</Heading>
        <ul className="grid sm:grid-cols-3 gap-4 text-sm text-slate-200">
          <li className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <b className="block text-white mb-1">The problem</b>
            Syllabi were typed and formatted by hand, which took time and varied between departments and faculty.
          </li>
          <li className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <b className="block text-white mb-1">The approach</b>
            One fixed template for every scheme, with the OBE calculations done by the portal instead of by hand.
          </li>
          <li className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <b className="block text-white mb-1">The result</b>
            Faculty focus on the content, and every printed syllabus looks the same and follows the same rules.
          </li>
        </ul>
      </section>

      {/* Features */}
      <section className={`${card} space-y-5`}>
        <Heading Icon={Layers}>What it can do</Heading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <Icon className="w-5 h-5 text-orange-400 mb-2" />
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Access and security */}
      <section className={`${card} space-y-4`}>
        <Heading Icon={ShieldCheck}>Access and security</Heading>
        <ul className="space-y-2 text-sm text-slate-200">
          {SECURITY.map((line) => (
            <li key={line} className="flex gap-2.5">
              <Lock className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Technology */}
      <section className={`${card} space-y-4`}>
        <Heading Icon={Cpu}>Built with</Heading>
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={`${card} space-y-5`}>
        <Heading Icon={Users}>Project team</Heading>
        <div className="rounded-2xl bg-orange-500/10 border border-orange-500/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-300">{GUIDE.role}</p>
          <p className="text-base font-bold mt-0.5">{GUIDE.name}</p>
          <p className="text-xs text-slate-300">{PROJECT.department}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM.map((m, i) => (
            <div key={`${m.name}-${i}`} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm font-bold">{m.name}</p>
              <p className="text-xs font-mono text-slate-300 mt-0.5">{m.usn}</p>
              <p className="text-[11px] text-slate-400 mt-1">{m.role}</p>
            </div>
          ))}
        </div>
        {ACKNOWLEDGEMENT && <p className="text-xs text-slate-300 leading-relaxed">{ACKNOWLEDGEMENT}</p>}
      </section>

      {/* Current limits and contact */}
      <section className={`${card} space-y-4`}>
        <Heading Icon={Mail}>Status and support</Heading>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-200">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <b className="block text-white mb-1">Good to know</b>
            Text can be imported by pasting it (or from a .txt file). Reading PDF and Word files, and saving
            syllabi to the server for use on any computer, are planned for a future version.
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <b className="block text-white mb-1">Need help?</b>
            Write to{' '}
            <a href={`mailto:${PROJECT.supportEmail}`} className="text-orange-400 hover:underline">
              {PROJECT.supportEmail}
            </a>
            . Version {PROJECT.version}.
          </div>
        </div>
        <Link
          to="/help"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:underline"
        >
          Open the Help page <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
