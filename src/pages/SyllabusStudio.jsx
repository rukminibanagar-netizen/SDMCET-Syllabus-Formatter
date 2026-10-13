import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UG_DEPARTMENTS, PG_DEPARTMENTS } from '../data/departments';
import { SCHEMES, SEMESTER_COUNT } from '../data/schemes';
import { useAuth } from '../context/AuthContext';
import {
  createBlankSyllabus,
  parseRawSyllabusText,
  calculatePoPsoAverages,
  semesterLabel,
  yearLabel,
} from '../services/syllabusParser';
import SyllabusEditor from '../components/SyllabusEditor';
import SyllabusDocument from '../components/SyllabusDocument';
import {
  Printer, ArrowLeft, Eye, Edit3,
  Upload, Image, CheckCircle2, RotateCcw,
} from 'lucide-react';

// Drafts are kept in this browser so a refresh does not lose work.
const loadDraft = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveDraft = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: editing still works, it just will not persist */
  }
};

function NotFound({ message }) {
  return (
    <div className="max-w-xl mx-auto bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white shadow-2xl">
      <h1 className="text-xl font-bold">Selection not found</h1>
      <p className="text-sm text-slate-300 mt-1">{message}</p>
      <Link to="/home" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-orange-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </div>
  );
}

// The Syllabus Studio (the editor page from the reference project)
function Studio({ type, currentDept, sem, scheme, storageKey }) {
  const makeBlank = () =>
    createBlankSyllabus({
      department: currentDept.name,
      semester: semesterLabel(sem, currentDept.degree),
      scheme: scheme.label,
    });

  // Starts blank (or with the saved draft) — 100% user provided
  const [course, setCourse] = useState(() => loadDraft(storageKey) || makeBlank());
  const [activeTab, setActiveTab] = useState('edit'); // 'edit', 'upload', 'preview'
  const [rawText, setRawText] = useState('');
  const [feedback, setFeedback] = useState('');
  const feedbackTimer = useRef(null);

  useEffect(() => saveDraft(storageKey, course), [storageKey, course]);
  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  const flash = (msg, ms = 3500) => {
    setFeedback(msg);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), ms);
  };

  const footerLeft = `${yearLabel({ category: type, sem, dept: currentDept })} • ${scheme.label}`;

  // Ingestion from pasted text
  const handleTextParse = () => {
    if (!rawText.trim()) {
      alert('Please paste the faculty syllabus text first.');
      return;
    }
    const parsed = parseRawSyllabusText(rawText, makeBlank());
    parsed.poPsoMapping = calculatePoPsoAverages(parsed.cos);
    setCourse(parsed);
    setActiveTab('edit');
    flash('Text processed and mapped into fields successfully!', 3000);
  };

  // Ingestion from file upload.
  // Plain-text files are read into the paste box. PDF / Word / images cannot be read yet,
  // so we say so instead of filling the form with made-up values.
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    if (/\.(txt|md)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawText(String(reader.result || ''));
        flash(`"${file.name}" loaded into the text box. Click "Extract and Populate Fields".`);
      };
      reader.onerror = () => flash('Could not read that file.');
      reader.readAsText(file);
      return;
    }

    flash(
      `Reading "${file.name}" is not available yet. Open the file, copy its text and paste it into Option A.`,
      6000
    );
  };

  // Reset all fields
  const handleReset = () => {
    if (window.confirm('Clear all fields and start a fresh blank syllabus?')) {
      setCourse(makeBlank());
      setRawText('');
    }
  };

  // The print layout only shows the formatted syllabus, so open the preview first
  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => window.print(), 150);
  };

  const tabClass = (tab) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <Link
            to={`/${type}/${currentDept.id}/semester/${sem}`}
            title="Back to schemes"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                {currentDept.code}
              </span>
              <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
                {currentDept.name} • Syllabus Studio
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              Semester {sem} • {scheme.label} • {course.code || 'Course Code (Pending)'} —{' '}
              {course.title || 'Course Title (Pending)'}
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button type="button" onClick={() => setActiveTab('edit')} className={tabClass('edit')}>
              <Edit3 className="w-3.5 h-3.5" /> 1. Author / Edit
            </button>
            <button type="button" onClick={() => setActiveTab('upload')} className={tabClass('upload')}>
              <Upload className="w-3.5 h-3.5" /> 2. Import Text/File
            </button>
            <button type="button" onClick={() => setActiveTab('preview')} className={tabClass('preview')}>
              <Eye className="w-3.5 h-3.5" /> 3. Official Preview
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Clear & Reset"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-sm no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TAB 1: DYNAMIC AUTHORING FORM */}
      {activeTab === 'edit' && (
        <SyllabusEditor course={course} setCourse={setCourse} onPreview={() => setActiveTab('preview')} />
      )}

      {/* TAB 2: IMPORT VIA UNSTRUCTURED TEXT OR FILE UPLOAD */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm no-print max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Import Raw Syllabus from Text, PDF, or Photo</h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste unformatted notes or syllabus documents. The engine will extract all parameters and populate the
              authoring form automatically.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Option A: Paste Unstructured Syllabus Text
              </label>
              <textarea
                rows="8"
                placeholder={`Paste syllabus details here...\n\nExample:\nCourse Code: 22UCSC300\nCourse Title: Data Structures and Applications\nContact Hours: 52\nPrerequisites: C Programming\nCLO: Understanding stack and queue data structures.\n...`}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleTextParse}
                className="mt-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
              >
                Extract and Populate Fields
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Option B: Upload PDF/DOCX</div>
                <input
                  type="file"
                  id="pdf-doc-input"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-doc-input"
                  className="inline-block px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Choose Document
                </label>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
                <Image className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Option C: Upload Photo/Scan</div>
                <input
                  type="file"
                  id="img-doc-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="img-doc-input"
                  className="inline-block px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL SDMCET FORMATTED DOCUMENT PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="max-w-4xl mx-auto p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl text-xs flex items-start gap-2 shadow-sm no-print">
            <Edit3 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              This page is editable: click any text to change it, then click outside it to save (Esc cancels).
              Changes also update the Author / Edit form. To add or remove COs, units or books, use the Author /
              Edit tab.
            </span>
          </div>
          <SyllabusDocument course={course} footerLeft={footerLeft} editable onCourseChange={setCourse} />
        </div>
      )}
    </div>
  );
}

// Route: /syllabus/:category/:deptId/:sem/:schemeId  (opened after choosing a scheme)
export default function SyllabusStudio() {
  const { category, deptId, sem, schemeId } = useParams();
  const { user } = useAuth();

  const type = category === 'pg' ? 'pg' : 'ug';
  const currentDept = (type === 'pg' ? PG_DEPARTMENTS : UG_DEPARTMENTS).find((d) => d.id === deptId);
  const scheme = SCHEMES.find((s) => s.id === schemeId);
  const semNum = Number(sem);

  if (!currentDept) return <NotFound message="That department or programme does not exist." />;
  if (!scheme) return <NotFound message="That scheme does not exist." />;
  if (!Number.isInteger(semNum) || semNum < 1 || semNum > SEMESTER_COUNT[type]) {
    return <NotFound message={`Semester must be between 1 and ${SEMESTER_COUNT[type]}.`} />;
  }

  const storageKey = `syllabus-draft:${user?.id || 'anon'}:${type}:${deptId}:${semNum}:${schemeId}`;

  // key remounts the studio (and its draft) whenever the selection changes
  return (
    <Studio
      key={storageKey}
      type={type}
      currentDept={currentDept}
      sem={semNum}
      scheme={scheme}
      storageKey={storageKey}
    />
  );
}
