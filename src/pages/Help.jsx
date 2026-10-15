import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Info,
  ListChecks,
  Sparkles,
  BookOpen,
  Edit3,
  Calculator,
  Eye,
  Printer,
  FileText,
  Save,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Layers,
  GraduationCap,
  Search,
  Check,
  Copy,
  CheckCircle2,
  Sliders,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const card =
  'bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl transition-all';

const QUICK_START = [
  {
    step: 'Step 1',
    icon: GraduationCap,
    title: 'Choose Programme & Scheme',
    subtitle: 'Undergraduate or Postgraduate',
    badge: 'Quick Navigation',
    description:
      'From the Home page, click UG or PG, select your engineering department, then choose your semester (1–8 for UG, 1–4 for PG) and the curriculum scheme (2022, 2026, or Upcoming).',
    actionText: 'Explore UG Programmes',
    actionLink: '/ug',
    proTip: 'Use the "Back to Semesters" or "Back to Departments" buttons at the top of each view to quickly switch branches.',
  },
  {
    step: 'Step 2',
    icon: Edit3,
    title: 'Fill Course Information',
    subtitle: 'Metadata, CLOs & Unit Contents',
    badge: 'Authoring Studio',
    description:
      'In the Author / Edit tab, fill in course details (code, title, credits, contact hours), Course Learning Objectives (CLOs), Course Outcomes (COs), unit topics, and reference books in standardized format.',
    actionText: 'Open Syllabus Studio',
    actionLink: '/ug',
    proTip: 'A real-time badge checks your total unit hours against prescribed contact hours. Green means exact match!',
  },
  {
    step: 'Step 3',
    icon: Calculator,
    title: 'Enter CO-PO & CO-PSO Mapping',
    subtitle: 'Outcome-Based Education (OBE)',
    badge: 'NBA / BoS Compliant',
    description:
      'For each Course Outcome (CO), enter the target PO numbers (1–12) and PSO numbers (1–4) under Substantial (Level 3), Moderate (Level 2), or Slight (Level 1). The average row is computed automatically.',
    actionText: 'Try OBE Calculator Below',
    actionLink: '#obe-simulator',
    proTip: 'No need to calculate averages with a calculator—the portal calculates and formats the official OBE matrix for you.',
  },
  {
    step: 'Step 4',
    icon: Eye,
    title: 'Inspect Official Preview',
    subtitle: 'Exact SDMCET Layout',
    badge: 'Institutional Preview',
    description:
      'Switch to the Official Preview tab to inspect the syllabus rendered exactly as it will appear in formal SDMCET Board of Studies documentation, complete with academic headers and OBE matrices.',
    actionText: 'View Syllabus Layout',
    actionLink: '/ug',
    proTip: 'Need a fast typo fix? You can click on editable text fields directly inside the preview to make instant adjustments!',
  },
  {
    step: 'Step 5',
    icon: Printer,
    title: 'Export or Print PDF',
    subtitle: 'One-Click Publication',
    badge: 'Publication Ready',
    description:
      'Click "Print / Export PDF". In the print window, choose "Save as PDF" to download a clean, publication-ready document with all UI buttons and navigation cleanly hidden.',
    actionText: 'Start Authoring Now',
    actionLink: '/ug',
    proTip: 'For the cleanest output, ensure "Background Graphics" is checked in your browser print dialog.',
  },
];

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
Unit - III: Linked Lists: Singly, doubly, and circular linked lists. 10 Hrs.
Unit - IV: Trees: Binary search trees, traversals, expression trees. 11 Hrs.
Unit - V: Graphs: Graph representations, BFS, DFS, shortest path. 10 Hrs.
Reference Books:
1) Horowitz, Sahni, Fundamentals of Data Structures, 2nd Ed., Universities Press, 2020.
2) Tenenbaum, Data Structures using C, Pearson Education, 2019.`;

export default function Help() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedSample, setCopiedSample] = useState(false);

  // Interactive OBE Calculator Demo State
  const [demoPoLevels, setDemoPoLevels] = useState({
    PO1: 3,
    PO2: 3,
    PO3: 2,
    PO4: 1,
    PO5: 0,
  });

  // Calculate live average for interactive demo
  const demoCalculation = useMemo(() => {
    const values = Object.values(demoPoLevels).filter((lvl) => lvl > 0);
    if (values.length === 0) return { avg: '0.0', count: 0, sum: 0 };
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = (sum / values.length).toFixed(1);
    return { avg, count: values.length, sum };
  }, [demoPoLevels]);

  const setPoLevel = (po, level) => {
    setDemoPoLevels((prev) => ({
      ...prev,
      [po]: prev[po] === level ? 0 : level,
    }));
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_TEXT);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2500);
  };

  // Structured FAQ categories and items
  const FAQ_ITEMS = [
    {
      id: 'login',
      category: 'start',
      icon: ShieldCheck,
      title: '1. Signing Up and Logging In',
      content: (
        <div className="space-y-3">
          <p>
            Create an account with your <b>Full Name</b>, official <b>Institutional Email</b> (e.g.,{' '}
            <code>faculty_cse@sdmcet.ac.in</code>), and a password (minimum 8 characters).
          </p>
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-200">
            <b>Approval Required:</b> New faculty registrations require one-time approval from an administrator.
            Until approved, you will see an <i>"awaiting admin approval"</i> status.
          </div>
          <p>
            On the login page, select your role (<b>Faculty</b> or <b>Administrator</b>). On your first sign-in as
            faculty, you will review and accept the official SDMCET Academic Terms & Conditions.
          </p>
        </div>
      ),
    },
    {
      id: 'selection',
      category: 'start',
      icon: Layers,
      title: '2. Selecting Department, Semester and Scheme',
      content: (
        <div className="space-y-2">
          <p>
            From the <b>Home</b> page, choose between <b>UG (Undergraduate)</b> and <b>PG (Postgraduate)</b>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><b>Department / Programme:</b> Select your engineering discipline (e.g., Computer Science & Engineering).</li>
            <li><b>Semester:</b> Choose the semester (1 to 8 for UG, 1 to 4 for PG).</li>
            <li><b>Curriculum Scheme:</b> Pick the scheme — <b>2022</b>, <b>2026</b>, or <b>Upcoming</b>. Each scheme automatically configures the appropriate course code patterns and header format.</li>
          </ul>
          <p className="text-xs text-slate-300">
            Use the <b>Back</b> button at the top of each selector to step up one level at any time.
          </p>
        </div>
      ),
    },
    {
      id: 'editor',
      category: 'editor',
      icon: Edit3,
      title: '3. Authoring the Syllabus in the Editor',
      content: (
        <div className="space-y-3">
          <p>The syllabus authoring studio is divided into clear sections:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><b>Course Metadata:</b> Course code, title, category (PCC, ESC, OEC, etc.), L-T-P lecture-tutorial-practical hours, total credits, contact hours, and pre-requisites.</li>
            <li><b>Course Learning Objectives (CLOs):</b> Enter one objective per input. Click <b>+ Add CLO</b> to add more.</li>
            <li><b>Course Outcomes (COs):</b> Enter what students will be able to do upon completion, along with their OBE correlation levels.</li>
            <li><b>Unit-wise Contents:</b> For each of the 5 units, provide the Unit Title, topics covered, and allocated lecture hours.</li>
            <li><b>Unit Hours Verification:</b> A real-time badge checks your total unit hours against prescribed contact hours. <b>Green</b> indicates an exact match; <b>Amber</b> warns of a discrepancy.</li>
            <li><b>Reference Books:</b> Standardized bibliographic format (Authors, Title, Edition, Publisher, Year).</li>
            <li><b>Evaluation Pattern:</b> Pre-loaded with standard SDMCET CIE (Continuous Internal Evaluation: 50 Marks) and SEE (Semester End Examination: 50 Marks) criteria.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'obe',
      category: 'obe',
      icon: Calculator,
      title: '4. How to Enter OBE PO/PSO Mappings',
      content: (
        <div className="space-y-3">
          <p>
            SDMCET follows the National Board of Accreditation (NBA) Outcome-Based Education framework. For each
            Course Outcome (CO), enter the corresponding numbers into the level columns separated by commas:
          </p>

          <div className="grid sm:grid-cols-3 gap-2.5 my-2 text-xs">
            <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30">
              <span className="font-bold text-orange-300 block mb-1">Substantial (Level 3)</span>
              High correlation: Course directly and extensively achieves this outcome.
            </div>
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <span className="font-bold text-amber-300 block mb-1">Moderate (Level 2)</span>
              Medium correlation: Course partially reinforces this outcome.
            </div>
            <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30">
              <span className="font-bold text-blue-300 block mb-1">Slight (Level 1)</span>
              Low correlation: Course provides introductory or minor exposure.
            </div>
          </div>

          <div className="text-xs space-y-1 text-slate-300">
            <p>• <b>PO Numbers:</b> Enter numbers <b>1 to 12</b> for Program Outcomes (PO1 to PO12).</p>
            <p>• <b>PSO Numbers:</b> Enter numbers <b>1 to 4</b> (or 13 to 16) for Program Specific Outcomes (PSO1 to PSO4).</p>
            <p>• Leave a column blank if there is no correlation; the preview automatically formats it with a clean hyphen (-).</p>
          </div>

          <div className="pt-2">
            <p className="font-semibold text-xs text-white mb-2">Worked Example of Auto-Calculated Averages:</p>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-white/10 text-left">
                    <th className="border border-white/15 p-2 font-bold">Course Outcome</th>
                    <th className="border border-white/15 p-2 text-orange-300 font-bold">Substantial (3)</th>
                    <th className="border border-white/15 p-2 text-amber-300 font-bold">Moderate (2)</th>
                    <th className="border border-white/15 p-2 text-blue-300 font-bold">Slight (1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/15 p-2 font-semibold">CO-1</td>
                    <td className="border border-white/15 p-2 font-mono">1, 2</td>
                    <td className="border border-white/15 p-2 font-mono">3</td>
                    <td className="border border-white/15 p-2 font-mono">-</td>
                  </tr>
                  <tr>
                    <td className="border border-white/15 p-2 font-semibold">CO-2</td>
                    <td className="border border-white/15 p-2 font-mono">1</td>
                    <td className="border border-white/15 p-2 font-mono">-</td>
                    <td className="border border-white/15 p-2 font-mono">3, 5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              <b>Resulting Averages:</b> PO1 is mapped at 3 and 3 → <b>Average 3.0</b>. PO3 is mapped at 2 and 1 → <b>Average 1.5</b>. PO5 is mapped at 1 → <b>Average 1.0</b>.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'import',
      category: 'editor',
      icon: FileText,
      title: '5. Importing Existing Syllabus from Text',
      content: (
        <div className="space-y-3">
          <p>
            If you already have a syllabus document in Microsoft Word, PDF, or text format, you do not need to retype it by hand:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm">
            <li>Select and copy all text from your existing file (<code>Ctrl + A</code>, <code>Ctrl + C</code>).</li>
            <li>Switch to the <b>Import Text</b> tab in the editor.</li>
            <li>Paste your text into the box and click <b>"Map text into fields"</b>.</li>
          </ol>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-300">Sample Recognized Syllabus Format:</span>
            <button
              onClick={handleCopySample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold transition-all"
            >
              {copiedSample ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Sample Text
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-slate-950/80 border border-white/10 p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre">
            {SAMPLE_TEXT}
          </pre>
          <p className="text-xs text-amber-300">
            <b>Pro Tip:</b> Always review the imported fields in the editor, and assign your CO-PO levels manually, as mapping levels are specific to OBE evaluation.
          </p>
        </div>
      ),
    },
    {
      id: 'print',
      category: 'export',
      icon: Printer,
      title: '6. Preview, Print and Save as PDF',
      content: (
        <div className="space-y-2">
          <p>
            Click the <b>Official Preview</b> tab to inspect the syllabus rendered exactly as it appears in formal SDMCET Board of Studies documents.
          </p>
          <p>
            When satisfied, click <b>"Print / Export PDF"</b>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>The browser's print window will open automatically with print styles applied.</li>
            <li>All navigation bars, buttons, and backgrounds are hidden so only the formal syllabus prints.</li>
            <li>To save a digital file, change the print destination from your printer to <b>"Save as PDF"</b> and click Save.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'autosave',
      category: 'editor',
      icon: RotateCcw,
      title: '7. Draft Auto-Saving & Resetting',
      content: (
        <div className="space-y-2">
          <p>
            • <b>Automatic Drafts:</b> Every keystroke is saved immediately in local browser storage, indexed by department, semester, and scheme. If you accidentally close your tab or browser, returning to that course restores your work.
          </p>
          <p>
            • <b>Reset Button:</b> If you want to discard your draft and start over with clean default templates, click the circular reset icon in the top toolbar. It will ask for confirmation before clearing.
          </p>
        </div>
      ),
    },
    {
      id: 'troubleshoot',
      category: 'troubleshoot',
      icon: AlertTriangle,
      title: '8. Troubleshooting Common Questions',
      content: (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <b className="text-orange-400 block mb-0.5">Q: It says "Your account is awaiting admin approval".</b>
            Your registration was received and is pending administrator authorization. Contact your department administrator or project guide to approve your account.
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <b className="text-orange-400 block mb-0.5">Q: The Unit Hours verification badge is Amber.</b>
            This means the sum of teaching hours across Units I through V does not equal the Total Contact Hours specified in the Course Metadata. Check the hours entered for each unit and adjust them so they match.
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <b className="text-orange-400 block mb-0.5">Q: Text Import didn't fill in some fields.</b>
            Ensure your pasted text includes clear keywords like "Course Code:", "CO-1:", "Unit - I:", or "Reference Books:". You can also type or copy-paste directly into any missing field in the editor.
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <b className="text-orange-400 block mb-0.5">Q: How do I change something in the Official Preview?</b>
            You can click on any editable text field directly inside the Official Preview to make quick adjustments, or switch back to the Author/Edit tab for full structural edits.
          </div>
        </div>
      ),
    },
  ];

  // Filtering based on search query and category
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 select-none">
      
      {/* 1. Header Banner */}
      <section className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                User Guide & Documentation
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Help Center</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/ug"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/20"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          Welcome to the SDMCET Syllabus Formatter. This interactive guide gives you quick steps, interactive
          calculators, and detailed instructions to author and export official, NBA & OBE-compliant course syllabi.
        </p>

        {/* Real-time Auto-Save Reassurance Banner */}
        <div className="mt-5 flex items-start sm:items-center gap-3 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
          <div>
            <span className="font-bold text-emerald-300">Instant Real-Time Auto-Save:</span> Every keystroke and mapping you enter is automatically saved in your browser as you type. You never have to worry about looking for a "Save" button!
          </div>
        </div>
      </section>

      {/* 2. Interactive 5-Step Stepper & Walkthrough */}
      <section className={`${card} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-orange-400" />
              Interactive 5-Step Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any step tab below to see how it works</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Step {activeStep + 1} of 5</span>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {QUICK_START.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-orange-500/25 to-amber-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-[10px] font-extrabold ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                    {item.step}
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Spotlight Card */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/15 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider">
                {QUICK_START[activeStep].badge}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {QUICK_START[activeStep].title} — <span className="text-slate-300 font-normal">{QUICK_START[activeStep].subtitle}</span>
              </h3>
            </div>

            <Link
              to={QUICK_START[activeStep].actionLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              <span>{QUICK_START[activeStep].actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{QUICK_START[activeStep].description}</p>

          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-start gap-2.5 text-xs text-orange-200">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <b className="text-orange-300">Helpful Tip: </b>
              {QUICK_START[activeStep].proTip}
            </div>
          </div>

          {/* Previous / Next Step Stepper Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(QUICK_START.length - 1, prev + 1))}
              disabled={activeStep === QUICK_START.length - 1}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
            >
              Next Step →
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive OBE / PO-PSO Live Calculator & Simulator */}
      <section id="obe-simulator" className={`${card} space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-400" />
              Interactive OBE PO/PSO Live Calculator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click the correlation buttons to see how the Board of Studies OBE formula calculates the average row in real time!
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
            Live Hands-On Demo
          </span>
        </div>

        {/* Simulator Buttons Grid */}
        <div className="grid sm:grid-cols-5 gap-3">
          {Object.keys(demoPoLevels).map((poKey) => {
            const currentLevel = demoPoLevels[poKey];
            return (
              <div key={poKey} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">{poKey}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      currentLevel === 3
                        ? 'bg-orange-500 text-white'
                        : currentLevel === 2
                        ? 'bg-amber-500 text-white'
                        : currentLevel === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {currentLevel === 0 ? 'None (-)' : `Level ${currentLevel}`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[3, 2, 1].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setPoLevel(poKey, lvl)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentLevel === lvl
                          ? lvl === 3
                            ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                            : lvl === 2
                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                            : 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Calculation Feedback Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-300">
              Formula: <span className="font-mono text-orange-300">Average = Total Points ({demoCalculation.sum}) ÷ Active Outcomes ({demoCalculation.count})</span>
            </div>
            <div className="text-xs text-slate-400">
              This exact calculation automatically fills the <b>"Mapping Level"</b> row at the bottom of your official preview table.
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Computed Average</span>
              <span className="text-2xl font-extrabold text-orange-400 font-mono">{demoCalculation.avg}</span>
            </div>
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                parseFloat(demoCalculation.avg) >= 2.5
                  ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                  : parseFloat(demoCalculation.avg) >= 1.5
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
              }`}
            >
              {parseFloat(demoCalculation.avg) >= 2.5
                ? 'Substantial Correlation'
                : parseFloat(demoCalculation.avg) >= 1.5
                ? 'Moderate Correlation'
                : 'Slight Correlation'}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Searchable & Filterable Step-by-Step Instructions */}
      <section className={`${card} space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Step-by-Step User Manual & FAQs</h2>
            <p className="text-xs text-slate-400 mt-0.5">Use search or category tags to find answers quickly</p>
          </div>

          {/* Interactive Live Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'start', label: 'Getting Started' },
            { id: 'editor', label: 'Syllabus Editor' },
            { id: 'obe', label: 'OBE & PO/PSO' },
            { id: 'export', label: 'PDF & Export' },
            { id: 'troubleshoot', label: 'Troubleshooting' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => {
              const Icon = item.icon;
              return (
                <details
                  key={item.id}
                  open={index === 0 || searchQuery !== ''}
                  className="group rounded-2xl bg-white/5 border border-white/10 open:bg-white/[0.08] open:border-orange-500/40 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 text-sm font-bold select-none">
                    <span className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-white group-hover:text-orange-300 transition-colors">{item.title}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-orange-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-200 leading-relaxed border-t border-white/5 pt-4">
                    {item.content}
                  </div>
                </details>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No help topics matched your search for "{searchQuery}". Try searching for "PO", "login", or "print".
            </div>
          )}
        </div>
      </section>

      {/* 5. Support & About Link Footer Prompt */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Still need assistance or have curriculum questions?</span>
        </div>
        <Link
          to="/about"
          className="font-bold text-orange-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View Team & Guide Contact on About Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
