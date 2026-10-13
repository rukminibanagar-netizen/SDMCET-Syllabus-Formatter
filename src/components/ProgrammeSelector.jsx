import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Code, Database, Cpu, Zap, Cog, Building, BrainCircuit, FlaskConical, Flame, BarChart3,
  ArrowRight, ArrowLeft, Search, GraduationCap,
} from 'lucide-react';
import { UG_DEPARTMENTS, PG_DEPARTMENTS } from '../data/departments';
import { SCHEMES, SEMESTER_COUNT } from '../data/schemes';

const ICONS = { Code, Database, Cpu, Zap, Cog, Building, BrainCircuit, FlaskConical, Flame, BarChart3 };

// Full class names are written out so Tailwind can find them
const CONFIG = {
  ug: {
    departments: UG_DEPARTMENTS,
    semesters: SEMESTER_COUNT.ug,
    banner: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700',
    bannerSub: 'text-amber-100',
    focusRing: 'focus:ring-amber-300',
    badge: 'Undergraduate (UG) Domain',
    degree: 'Bachelor of Engineering (B.E.)',
    title: '8 UG Academic Departments',
    intro:
      'Select an undergraduate department, then its semester and syllabus scheme, to author and generate standardized course syllabi.',
    searchPlaceholder: 'Search department or code...',
    iconIdle: 'bg-orange-50 text-orange-600',
    titleHover: 'group-hover:text-orange-600',
    cta: 'text-orange-600',
    stepOneTitle: 'Select your department',
    backToStepOne: 'Back to departments',
  },
  pg: {
    departments: PG_DEPARTMENTS,
    semesters: SEMESTER_COUNT.pg,
    banner: 'bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800',
    bannerSub: 'text-sky-100',
    focusRing: 'focus:ring-sky-300',
    badge: 'Postgraduate (PG) Domain',
    degree: 'Master of Technology (M.Tech) & MBA',
    title: '6 PG Academic Programmes',
    intro:
      'Select a postgraduate programme, then its semester and syllabus scheme, to author and generate course syllabi.',
    searchPlaceholder: 'Search PG programme...',
    iconIdle: 'bg-sky-50 text-sky-700',
    titleHover: 'group-hover:text-sky-700',
    cta: 'text-sky-700',
    stepOneTitle: 'Select your programme',
    backToStepOne: 'Back to programmes',
  },
};

const YEAR_NAMES = ['1st', '2nd', '3rd', '4th'];

function StepHeading({ step, title, subtitle, onBack, backLabel }) {
  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backLabel}
        </button>
      )}
      <p className="text-xs font-semibold text-slate-300">Step {step} of 3</p>
      <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">{title}</h2>
      {subtitle && <p className="text-sm text-slate-300 mt-1">{subtitle}</p>}
    </div>
  );
}

// Step panel: fills the viewport frame and scrolls on its own if its content is taller.
// Inactive panels are `inert`, so they cannot be tabbed to or clicked while off-screen.
const Panel = React.forwardRef(function Panel({ active, children }, ref) {
  return (
    <div
      ref={ref}
      inert={!active}
      aria-hidden={!active}
      tabIndex={-1}
      className="h-full overflow-y-auto overscroll-contain px-1 pt-2 pb-6 outline-none"
    >
      {children}
    </div>
  );
});

// One page, three steps stacked vertically. The web address decides which step is in view:
//   /ug                          -> step 1: departments
//   /ug/cse                      -> step 2: semesters of that department
//   /ug/cse/semester/3           -> step 3: schemes for that semester
// Choosing something scrolls the next step into view; the Back button scrolls back up.
// Steps already passed are never visible below or above the current one.
// (PG works the same way under /pg)
export default function ProgrammeSelector({ category }) {
  const c = CONFIG[category];
  const navigate = useNavigate();
  const { deptId, sem } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const dept = deptId ? c.departments.find((d) => d.id === deptId) : null;
  const semNumber = sem ? Number(sem) : null;
  const semValid = Number.isInteger(semNumber) && semNumber >= 1 && semNumber <= c.semesters;

  // The panels keep showing the last choice while they scroll out of view,
  // otherwise their text would vanish in the middle of the animation.
  const lastDept = useRef(null);
  const lastSem = useRef(null);
  if (dept) lastDept.current = dept;
  if (dept && semValid) lastSem.current = semNumber;
  const shownDept = dept || lastDept.current;
  const shownSem = dept && semValid ? semNumber : lastSem.current;

  const stepIndex = dept && semValid ? 2 : dept ? 1 : 0;
  const panelRefs = [useRef(null), useRef(null), useRef(null)];
  const firstRender = useRef(true);

  // After each move: start the new step at its top and give it keyboard focus
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    const timer = setTimeout(() => {
      const panel = panelRefs[stepIndex].current;
      if (panel) {
        panel.scrollTop = 0;
        panel.focus({ preventScroll: true });
      }
    }, 520);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Wrong addresses go back to the nearest valid page
  if (deptId && !dept) return <Navigate to={`/${category}`} replace />;
  if (sem && !semValid) return <Navigate to={`/${category}/${deptId}`} replace />;

  const filtered = c.departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const semesters = Array.from({ length: c.semesters }, (_, i) => i + 1);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 'calc(100dvh - 65px - 3rem)', minHeight: '520px' }}
    >
      <div
        className="h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateY(-${stepIndex * 100}%)` }}
      >
        {/* ---------- Step 1: department ---------- */}
        <Panel ref={panelRefs[0]} active={stepIndex === 0}>
          <div className="space-y-10">
            <div className={`${c.banner} rounded-3xl p-8 text-white shadow-lg`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      {c.badge}
                    </span>
                    <span className={`text-xs ${c.bannerSub}`}>{c.degree}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{c.title}</h1>
                  <p className={`text-xs sm:text-sm ${c.bannerSub} mt-1 max-w-xl`}>{c.intro}</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={c.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white text-slate-800 text-xs shadow-md focus:outline-none focus:ring-2 ${c.focusRing}`}
                  />
                </div>
              </div>
            </div>

            <section className="space-y-5">
              <StepHeading step={1} title={c.stepOneTitle} />
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-300">No match found. Try a different name or code.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filtered.map((d) => {
                    const Icon = ICONS[d.icon] || GraduationCap;
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => navigate(`/${category}/${d.id}`)}
                        className="group text-left bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer"
                      >
                        <span className="block">
                          <span className="flex justify-between items-center mb-4">
                            <span
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all ${c.iconIdle}`}
                            >
                              <Icon className="w-6 h-6" />
                            </span>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded-lg">
                              {d.code}
                            </span>
                          </span>
                          <span className={`block text-base font-bold text-slate-900 ${c.titleHover} transition-colors mb-2 leading-snug`}>
                            {d.name}
                          </span>
                          <span className="block text-xs text-slate-500 line-clamp-2">{d.description}</span>
                        </span>
                        <span className={`mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold ${c.cta}`}>
                          <span>Choose semester</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </Panel>

        {/* ---------- Step 2: semester ---------- */}
        <Panel ref={panelRefs[1]} active={stepIndex === 1}>
          {shownDept && (
            <div className="space-y-6">
              <StepHeading
                step={2}
                title="Select semester"
                subtitle={`${shownDept.name} (${shownDept.degree})`}
                onBack={() => navigate(`/${category}`)}
                backLabel={c.backToStepOne}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {semesters.map((n) => {
                  const year = Math.ceil(n / 2);
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => navigate(`/${category}/${shownDept.id}/semester/${n}`)}
                      className="group text-left bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                    >
                      <span className={`block text-lg font-extrabold text-slate-900 ${c.titleHover} transition-colors`}>
                        Semester {n}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1">
                        {YEAR_NAMES[year - 1]} year, {n % 2 === 1 ? 'odd' : 'even'} semester
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Panel>

        {/* ---------- Step 3: scheme ---------- */}
        <Panel ref={panelRefs[2]} active={stepIndex === 2}>
          {shownDept && shownSem && (
            <div className="space-y-6">
              <StepHeading
                step={3}
                title="Select syllabus scheme"
                subtitle={`${shownDept.name}, Semester ${shownSem}`}
                onBack={() => navigate(`/${category}/${shownDept.id}`)}
                backLabel="Back to semesters"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {SCHEMES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => navigate(`/syllabus/${category}/${shownDept.id}/${shownSem}/${s.id}`)}
                    className="group text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-lg font-extrabold text-slate-900 ${c.titleHover} transition-colors`}>
                        {s.label}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.status === 'fixed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {s.status === 'fixed' ? 'Fixed format' : 'Format may change'}
                      </span>
                    </span>
                    <span className="block text-xs text-slate-500 mt-2">{s.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
