import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  Cpu,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  Printer,
  Save,
  ShieldCheck,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  ExternalLink,
} from 'lucide-react';
import { PROJECT, GUIDE, TEAM, ACKNOWLEDGEMENT } from '../data/about';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl transition-all';

const FEATURES = [
  {
    Icon: Layers,
    title: 'Guided Programme Selection',
    category: 'workflow',
    tag: 'Intuitive Navigation',
    text: 'Easily select between UG and PG, pick your engineering department, semester, and curriculum scheme with zero confusion.',
  },
  {
    Icon: ClipboardList,
    title: 'Complete Syllabus Studio',
    category: 'authoring',
    tag: '5-Unit Curriculum',
    text: 'Author course metadata, CLOs, Course Outcomes, unit teaching hours, reference books, and standard CIE/SEE evaluation patterns.',
  },
  {
    Icon: Calculator,
    title: 'Automated OBE PO/PSO Calculation',
    category: 'obe',
    tag: 'NBA Compliant',
    text: 'Automated matrix calculation transforms Substantial (3), Moderate (2), and Slight (1) correlations into official BoS average rows instantly.',
  },
  {
    Icon: FileText,
    title: 'Smart Text Parser & Import',
    category: 'authoring',
    tag: 'One-Click Import',
    text: 'Paste existing Word, PDF, or text documents. The smart parser maps course codes, titles, objectives, and units into editable fields automatically.',
  },
  {
    Icon: Printer,
    title: 'Institutional Preview & PDF Export',
    category: 'export',
    tag: 'Print Ready',
    text: 'Inspect the syllabus in the exact SDMCET Board of Studies academic layout and export high-resolution, print-ready PDFs directly from the browser.',
  },
  {
    Icon: Save,
    title: 'Zero-Data-Loss Auto-Save',
    category: 'productivity',
    tag: 'Local Persistence',
    text: 'Every keystroke and mapping is saved in real time in your browser storage, ensuring uninterrupted authoring even if you close the tab.',
  },
];

const SECURITY_POINTS = [
  {
    title: 'Role-Based Authentication',
    desc: 'Strict server-side separation between Faculty curriculum authors and Administrators.',
  },
  {
    title: 'Vetted Administrator Approvals',
    desc: 'New registrations require administrative approval before portal access is granted.',
  },
  {
    title: 'Cryptographic Protection',
    desc: 'Passwords hashed with salted bcrypt algorithms and authenticated via secure JWT sessions.',
  },
  {
    title: 'Institutional Terms & OBE Compliance',
    desc: 'Enforced acceptance of SDMCET curriculum guidelines and copyright policies upon first sign-in.',
  },
];

const TECH_STACK = [
  { name: 'React 19', role: 'Reactive Virtual DOM & Live Editor' },
  { name: 'Vite 8', role: 'Next-Gen Ultra-Fast Frontend Bundler' },
  { name: 'Tailwind CSS', role: 'Custom Glassmorphic Design System' },
  { name: 'Node.js & Express', role: 'RESTful Backend API Architecture' },
  { name: 'MongoDB Atlas', role: 'Cloud NoSQL User & Syllabus Storage' },
  { name: 'Lucide Icons', role: 'Crisp Vector Component Iconography' },
];

const IMPACT_METRICS = [
  { value: '100%', label: 'OBE & NBA Compliant', sub: 'Standardized BoS formatting' },
  { value: '8+', label: 'Engineering Departments', sub: 'UG and PG programmes' },
  { value: '3', label: 'Curriculum Schemes', sub: '2022, 2026 & Upcoming' },
  { value: '0', label: 'Manual Math Errors', sub: 'Automated average calculations' },
];

export default function About() {
  const [activeFeatureTab, setActiveFeatureTab] = useState('all');

  const filteredFeatures =
    activeFeatureTab === 'all'
      ? FEATURES
      : FEATURES.filter((f) => f.category === activeFeatureTab);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 select-none">
      
      {/* 1. Project Hero Banner */}
      <section className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-16 p-1 bg-white rounded-2xl shadow-xl shadow-orange-500/20 border border-white/30 flex items-center justify-center flex-shrink-0">
              <img
                src="/sdmcet-logo.png"
                alt="SDMCET Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                SDM College of Engineering & Technology, Dharwad
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{PROJECT.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold">
              v{PROJECT.version} • {PROJECT.academicYear}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {PROJECT.tagline} Designed and developed exclusively for{' '}
          <b>{PROJECT.institution}</b>, this portal revolutionizes course design by replacing manual, fragmented
          formatting with a unified, Outcome-Based Education (OBE) compliant publishing platform that adheres to the
          standards prescribed by the SDMCET Board of Studies and NBA.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 font-semibold text-slate-200">
            {PROJECT.department}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 font-semibold text-slate-200">
            {PROJECT.projectType}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 font-semibold text-orange-300">
            Autonomous Curriculum Engineering
          </span>
        </div>
      </section>

      {/* 2. Key Impact Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {IMPACT_METRICS.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/15 text-center transition-all hover:scale-[1.02] shadow-xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono mb-1">
              {item.value}
            </div>
            <div className="text-xs font-bold text-white">{item.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
          </div>
        ))}
      </section>

      {/* 3. Problem vs Solution Showcase */}
      <section className={`${card} space-y-4`}>
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight">The Vision & Purpose</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-200">
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 space-y-2">
            <b className="block text-red-300 text-xs font-bold uppercase tracking-wider">The Challenge</b>
            <p className="text-xs leading-relaxed text-slate-200">
              Syllabi were traditionally prepared using arbitrary word processors. This led to formatting discrepancies,
              misaligned hours, and manual calculation errors in the OBE matrices across branches.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 space-y-2">
            <b className="block text-amber-300 text-xs font-bold uppercase tracking-wider">Our Approach</b>
            <p className="text-xs leading-relaxed text-slate-200">
              A centralized web studio with automated validation: unit hour verification, dynamic NBA PO/PSO calculation
              algorithms, and one-click PDF generation matching the BoS blueprint.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 space-y-2">
            <b className="block text-emerald-300 text-xs font-bold uppercase tracking-wider">The Result</b>
            <p className="text-xs leading-relaxed text-slate-200">
              Faculty members save valuable academic time and focus on quality curriculum authoring, guaranteeing that
              every published syllabus meets autonomous institutional standards.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Features Grid with Tabs */}
      <section className={`${card} space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Layers className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-lg font-extrabold tracking-tight">Core System Capabilities</h2>
          </div>

          {/* Feature Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'obe', label: 'OBE Mapping' },
              { id: 'authoring', label: 'Authoring Studio' },
              { id: 'export', label: 'PDF Publishing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFeatureTab === tab.id
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map(({ Icon, title, tag, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 transition-all hover:bg-white/[0.08] hover:border-orange-500/40 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-orange-300">
                    {tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Access, Security & Institutional Control */}
      <section className={`${card} space-y-4`}>
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight">Security & Governance</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {SECURITY_POINTS.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-xs font-bold text-white block">{item.title}</b>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Built With (Modern Technology Stack) */}
      <section className={`${card} space-y-4`}>
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight">Technical Architecture</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all flex flex-col justify-between"
            >
              <span className="font-extrabold text-sm text-orange-400">{tech.name}</span>
              <span className="text-[11px] text-slate-300 mt-1">{tech.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Faculty Guide & Project Team */}
      <section className={`${card} space-y-5`}>
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Users className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight">Project Guidance & Development Team</h2>
        </div>

        {/* Faculty Guide Spotlight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                {GUIDE.role}
              </p>
              <h3 className="text-lg font-extrabold text-white">{GUIDE.name}</h3>
              <p className="text-xs text-slate-300">{PROJECT.department}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-orange-500/30 border border-orange-500/50 text-orange-200 text-xs font-semibold self-start sm:self-auto">
            Academic Supervisor
          </span>
        </div>

        {/* Team Members Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {TEAM.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{member.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-orange-400">
                  CSE
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300">{member.usn}</p>
              <p className="text-[11px] text-slate-400">{member.role}</p>
            </div>
          ))}
        </div>

        {ACKNOWLEDGEMENT && (
          <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-4 italic">
            "{ACKNOWLEDGEMENT}"
          </p>
        )}
      </section>

      {/* 8. Help Center & Support Action */}
      <section className={`${card} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Need Assistance with Syllabus Authoring?</h2>
            <p className="text-xs text-slate-300 mt-1">
              Visit the interactive Help Center for step-by-step guides, live calculators, and troubleshooting tips.
            </p>
          </div>

          <Link
            to="/help"
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25 shrink-0"
          >
            <span>Explore Help Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
