import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UG_DEPARTMENTS, PG_DEPARTMENTS } from '../data/departments';
import { SCHEMES } from '../data/schemes';
import { getFormat, mappingSpec } from '../data/schemeFormats';
import { getSyllabus, updateSyllabus } from '../services/syllabusApi';
import {
  createBlankSyllabus,
  parseRawSyllabusText,
  calculatePoPsoAverages,
  semesterShort,
  yearLabel,
} from '../services/syllabusParser';
import { extractTextFromPDF, extractTextFromTxt } from '../services/pdfExtractor';
import SyllabusEditor from '../components/SyllabusEditor';
import SyllabusDocument from '../components/SyllabusDocument';
import {
  Printer, ArrowLeft, Eye, Edit3,
  Upload, Image, CheckCircle2, RotateCcw, FileText, Loader2,
} from 'lucide-react';

function NotFound({ message }) {
  return (
    <div className="max-w-xl mx-auto bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white shadow-2xl">
      <h1 className="text-xl font-bold">Could not open this syllabus</h1>
      <p className="text-sm text-slate-300 mt-1">{message}</p>
      <Link to="/home" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-orange-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </div>
  );
}

function SaveStatus({ state, onRetry }) {
  const styles = {
    saved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    saving: 'text-slate-600 bg-slate-50 border-slate-200',
    dirty: 'text-amber-700 bg-amber-50 border-amber-200',
    error: 'text-red-700 bg-red-50 border-red-200',
  };
  const labels = { saved: 'Saved', saving: 'Saving...', dirty: 'Unsaved changes', error: 'Could not save' };
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${styles[state]}`}
    >
      {labels[state]}
      {state === 'error' && (
        <button type="button" onClick={onRetry} className="underline">
          Retry
        </button>
      )}
    </span>
  );
}

function Studio({ record, type, currentDept, sem, scheme }) {
  const canEdit = record.canEdit;
  const format = getFormat(scheme.id);
  const makeBlank = () =>
    createBlankSyllabus({
      department: currentDept.name,
      semester: semesterShort(sem),
      scheme: scheme.label,
      schemeId: scheme.id,
    });

  const [course, setCourse] = useState(record.course);
  const [activeTab, setActiveTab] = useState(canEdit ? 'edit' : 'preview');
  const [rawText, setRawText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success'); // 'success' | 'error' | 'info'
  const [extracting, setExtracting] = useState(false); // PDF extraction in progress
  const feedbackTimer = useRef(null);

  // ---- Saving ----
  const [saveState, setSaveState] = useState('saved');
  const courseRef = useRef(course);
  const unsaved = useRef(false);
  const saveCounter = useRef(0);
  courseRef.current = course;

  const saveNow = async () => {
    const mine = ++saveCounter.current;
    setSaveState('saving');
    try {
      await updateSyllabus(record.id, courseRef.current);
      if (mine === saveCounter.current) {
        unsaved.current = false;
        setSaveState('saved');
      }
    } catch {
      if (mine === saveCounter.current) setSaveState('error');
    }
  };

  useEffect(() => {
    if (!canEdit || course === record.course) return undefined;
    unsaved.current = true;
    setSaveState('dirty');
    const timer = setTimeout(saveNow, 1000);
    return () => clearTimeout(timer);
  }, [course]);

  useEffect(
    () => () => {
      if (unsaved.current) updateSyllabus(record.id, courseRef.current).catch(() => {});
    },
    []
  );

  useEffect(() => {
    if (saveState === 'saved') return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [saveState]);

  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  const flash = (msg, type = 'success', ms = 4000) => {
    setFeedback(msg);
    setFeedbackType(type);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), ms);
  };

  const footerLeft = `${yearLabel({ category: type, sem, dept: currentDept }).replace('B.E.', 'B. E.')}: ${
    course.academicYear || format.academicYear
  }`;

  // ---- Parse pasted text and jump to preview ----
  const handleTextParse = () => {
    if (!rawText.trim()) {
      alert('Please paste the faculty syllabus text first.');
      return;
    }
    const parsed = parseRawSyllabusText(rawText, makeBlank());
    parsed.poPsoMapping = calculatePoPsoAverages(parsed.cos, mappingSpec(format, parsed).total);
    setCourse(parsed);
    setActiveTab('preview'); // ← go straight to the formatted output
    flash('✅ Syllabus extracted and formatted! Scroll down to see the SDMCET preview.', 'success', 5000);
  };

  // ---- File upload: PDF gets extracted, .txt goes straight to paste box ----
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    // Plain-text / markdown files — load into the paste area
    if (/\.(txt|md|text)$/i.test(file.name)) {
      try {
        const text = await extractTextFromTxt(file);
        setRawText(text);
        flash(`"${file.name}" loaded. Click "Extract & Format Syllabus" to process it.`, 'info');
      } catch {
        flash('Could not read the text file.', 'error');
      }
      return;
    }

    // PDF files — extract text with PDF.js, then run parser immediately
    if (/\.pdf$/i.test(file.name)) {
      setExtracting(true);
      flash(`Extracting text from "${file.name}"… please wait.`, 'info', 60000);
      try {
        const text = await extractTextFromPDF(file);
        if (!text || text.trim().length < 20) {
          flash(
            `"${file.name}" appears to be a scanned image PDF. Please use Option C (photo upload) or copy-paste the text manually.`,
            'error',
            8000
          );
          setExtracting(false);
          return;
        }
        // Show the raw text so the user can review it, then auto-parse
        setRawText(text);
        const parsed = parseRawSyllabusText(text, makeBlank());
        parsed.poPsoMapping = calculatePoPsoAverages(parsed.cos, mappingSpec(format, parsed).total);
        setCourse(parsed);
        setActiveTab('preview'); // ← jump straight to formatted output
        flash(
          `✅ PDF extracted and formatted! "${file.name}" → ${parsed.cos?.length || 0} COs, ${parsed.units?.length || 0} units found.`,
          'success',
          6000
        );
      } catch (err) {
        flash(
          `Could not extract text from "${file.name}". Try opening the PDF and copy-pasting the text into Option A.`,
          'error',
          8000
        );
      } finally {
        setExtracting(false);
      }
      return;
    }

    // DOCX / DOC — cannot parse in the browser without a server; guide the user
    if (/\.(docx?|odt)$/i.test(file.name)) {
      flash(
        `Word documents cannot be read directly in the browser. Open "${file.name}" in Word, press Ctrl+A → Ctrl+C, then paste into Option A.`,
        'error',
        8000
      );
      return;
    }

    // Any other type
    flash(
      `"${file.name}" is not a supported format. Use PDF, TXT, or paste text directly.`,
      'error',
      6000
    );
  };

  const handleReset = () => {
    if (window.confirm('Clear all fields and start a fresh blank syllabus?')) {
      setCourse(makeBlank());
      setRawText('');
    }
  };

  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => window.print(), 150);
  };

  const tabClass = (tab) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
    }`;

  // Feedback colour
  const feedbackColours = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border-red-200 text-red-800',
    info:    'bg-sky-50 border-sky-200 text-sky-900',
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <Link
            to={`/syllabus/${type}/${currentDept.id}/${sem}/${scheme.id}`}
            title="Back to courses"
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
              {course.title || 'Course Title (Pending)'} • Author: {record.ownerName}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {canEdit && (
              <>
                <button type="button" onClick={() => setActiveTab('edit')} className={tabClass('edit')}>
                  <Edit3 className="w-3.5 h-3.5" /> 1. Author / Edit
                </button>
                <button type="button" onClick={() => setActiveTab('upload')} className={tabClass('upload')}>
                  <Upload className="w-3.5 h-3.5" /> 2. Import Text/File
                </button>
              </>
            )}
            <button type="button" onClick={() => setActiveTab('preview')} className={tabClass('preview')}>
              <Eye className="w-3.5 h-3.5" /> 3. Official Preview
            </button>
          </div>

          {canEdit && <SaveStatus state={saveState} onRetry={saveNow} />}

          {canEdit && (
            <button
              type="button"
              onClick={handleReset}
              title="Clear & Reset"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

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

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 border rounded-2xl text-xs flex items-center gap-2 shadow-sm no-print ${feedbackColours[feedbackType] || feedbackColours.info}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {!canEdit && (
        <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl text-xs flex items-center gap-2 shadow-sm no-print">
          <Eye className="w-4 h-4 text-sky-600 shrink-0" />
          <span>You can view and print this syllabus. Only its author or an admin can edit it.</span>
        </div>
      )}

      {/* TAB 1: DYNAMIC AUTHORING FORM */}
      {activeTab === 'edit' && (
        <SyllabusEditor
          course={course}
          setCourse={setCourse}
          format={format}
          onPreview={() => setActiveTab('preview')}
        />
      )}

      {/* TAB 2: IMPORT VIA UNSTRUCTURED TEXT OR FILE UPLOAD */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm no-print max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Import Raw Syllabus from Text, PDF, or Photo</h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste or upload your syllabus in <strong>any format</strong> — the engine handles varying
              spacing, different labels, and multiple styles automatically.
            </p>
          </div>

          {/* Option A: Paste Text */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Option A: Paste Raw Syllabus Text (any spacing or format)
            </label>
            <textarea
              rows={10}
              placeholder={`Paste your syllabus text here — any alignment works, for example:\n\nCourse Code   :   22UCSC300\nCourse  Title :   Data Structures and Applications\nContact Hours :   52\nPre-requisites:   C Programming\n\nCourse Learning Objectives\n- Understanding stack and queue data structures\n- Applying graph algorithms in real applications\n\nCO 1 : Understand sorting algorithms     1,2    14,15    3\nCO 2 : Develop graph-based solutions     1,3    12,14    5\n\nUnit - I : Introduction to Data Structures\nArrays, linked lists, stacks...  8 Hrs\n\nUnit - II : Trees and Graphs\nBinary trees, BST, graph traversal...  8 Hrs\n\nReference Books\n1) Horowitz E., Sahni S., 'Data Structures in C', Galgotia, 2010.\n2) Cormen T.H., 'Introduction to Algorithms', MIT Press.`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={handleTextParse}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Extract &amp; Format Syllabus →
            </button>
            <p className="text-[11px] text-slate-400">
              The formatter accepts any spacing — extra spaces, tabs, missing colons, different unit numbering styles (Unit I / Module 1 / Chapter IV), and CO formats (CO-1 / CO 1 / CO.1).
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option B: PDF Upload */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              {extracting ? (
                <Loader2 className="w-8 h-8 text-orange-500 mx-auto animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              )}
              <div className="text-xs font-bold text-slate-700">Option B: Upload PDF</div>
              <p className="text-[11px] text-slate-400">
                Text-based PDFs are extracted automatically and formatted. Scanned / image PDFs are not supported.
              </p>
              <input
                type="file"
                id="pdf-doc-input"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
                disabled={extracting}
              />
              <label
                htmlFor="pdf-doc-input"
                className={`inline-block px-4 py-2 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                  extracting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-orange-600'
                }`}
              >
                {extracting ? 'Extracting…' : 'Choose PDF / TXT'}
              </label>
            </div>

            {/* Option C: Image (manual step — OCR not in browser) */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <Image className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Option C: Scanned Image / Photo</div>
              <p className="text-[11px] text-slate-400">
                Open the image in Google Lens or Word, copy the recognised text, then paste it into Option A above.
              </p>
              <a
                href="https://lens.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Open Google Lens ↗
              </a>
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
          <SyllabusDocument
            course={course}
            format={format}
            footerLeft={footerLeft}
            editable={canEdit}
            onCourseChange={canEdit ? setCourse : undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function SyllabusStudio() {
  const { syllabusId } = useParams();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setRecord(null);
    setError('');
    getSyllabus(syllabusId)
      .then((data) => { if (!cancelled) setRecord(data); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [syllabusId]);

  if (error) return <NotFound message={error} />;
  if (!record) return <p className="text-sm text-slate-200 text-center py-20">Loading syllabus...</p>;

  const type = record.category === 'pg' ? 'pg' : 'ug';
  const currentDept = (type === 'pg' ? PG_DEPARTMENTS : UG_DEPARTMENTS).find((d) => d.id === record.deptId);
  const scheme = SCHEMES.find((s) => s.id === record.schemeId);
  if (!currentDept || !scheme) {
    return <NotFound message="The department or scheme of this syllabus no longer exists." />;
  }

  return (
    <Studio
      key={record.id}
      record={record}
      type={type}
      currentDept={currentDept}
      sem={record.sem}
      scheme={scheme}
    />
  );
}
