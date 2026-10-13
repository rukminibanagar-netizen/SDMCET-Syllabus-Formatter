import React, { useEffect, useRef } from 'react';
import { calculatePoPsoAverages } from '../services/syllabusParser';

// ---------------------------------------------------------------------------
// Click-to-edit text. The text is edited directly inside the formatted page and
// saved back to the course when you click away (or press Enter on a one-line field).
//  - Esc cancels the edit.
//  - Pasting always inserts plain text, so no outside formatting sneaks in.
// The element's text is managed by hand (not by React) so the cursor never jumps
// while typing.
// ---------------------------------------------------------------------------
function EditableText({ value, onCommit, placeholder, numeric = false, multiline = false, className = '', as: Tag = 'span' }) {
  const ref = useRef(null);
  const text = String(value ?? '');
  const initial = useRef(text); // React renders this once; later updates are written below

  // Show outside changes (import, reset) unless the person is typing in this field
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== text) el.textContent = text;
  }, [text]);

  const handleBlur = () => {
    const el = ref.current;
    if (!el) return;
    let next = el.innerText.replace(/\u00a0/g, ' ').replace(/\n+$/, '');
    next = multiline ? next.trim() : next.replace(/\s*\n\s*/g, ' ').trim();
    if (numeric) {
      const n = parseInt(next, 10);
      next = Number.isNaN(n) ? 0 : n;
    }
    el.textContent = String(next); // drop any stray markup the browser added
    if (String(next) !== text) onCommit(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      ref.current.textContent = text;
      ref.current.blur();
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      ref.current.blur();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, multiline ? pasted : pasted.replace(/\s*\n\s*/g, ' '));
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-label={placeholder}
      data-placeholder={placeholder}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={`editable-field ${multiline ? 'whitespace-pre-wrap' : ''} ${className}`}
    >
      {initial.current}
    </Tag>
  );
}

// Plain text when the page is read-only, click-to-edit when `editable` is on.
function Ed({ editable, value, fallback, multiline, as: Tag = 'span', className = '', ...rest }) {
  if (editable) return <EditableText value={value} multiline={multiline} as={Tag} className={className} {...rest} />;
  const shown = value === '' || value === null || value === undefined ? fallback ?? '' : value;
  return <Tag className={`${multiline ? 'whitespace-pre-line' : ''} ${className}`}>{shown}</Tag>;
}

// ---------------------------------------------------------------------------
// The print-ready syllabus page. `footerLeft` is built by the studio from the selected
// year, department and scheme. With `editable`, every text on the page can be changed in
// place and `onCourseChange(updater)` receives the change (updater: course => newCourse).
// ---------------------------------------------------------------------------
export default function SyllabusDocument({ course, footerLeft = '', editable = false, onCourseChange }) {
  if (!course) return null;

  const change = (updater) => onCourseChange && onCourseChange(updater);
  const set = (patch) => change((c) => ({ ...c, ...patch }));
  const setCo = (i, field, value) =>
    change((c) => {
      const cos = c.cos.map((co, idx) => (idx === i ? { ...co, [field]: value } : co));
      return { ...c, cos, poPsoMapping: calculatePoPsoAverages(cos) };
    });
  const setUnit = (i, field, value) =>
    change((c) => ({ ...c, units: c.units.map((u, idx) => (idx === i ? { ...u, [field]: value } : u)) }));
  const setItem = (key, i, value) =>
    change((c) => ({ ...c, [key]: c[key].map((x, idx) => (idx === i ? value : x)) }));

  // Read-only view hides empty entries; the editable view keeps them so they can be filled in
  const clos = editable ? course.clos || [] : (course.clos || []).filter(Boolean);
  const refs = editable ? course.references || [] : (course.references || []).filter(Boolean);

  return (
    <div className="bg-white sdmcet-doc-font text-black max-w-4xl mx-auto p-10 border border-slate-300 shadow-xl rounded-sm syllabus-print-container">
      {/* Header pill */}
      <div className="flex justify-center mb-6">
        <div className="border-[2.5px] border-double border-black rounded-full px-12 py-1 font-bold text-center text-sm tracking-wide bg-slate-50">
          SDMCET: Syllabus
        </div>
      </div>

      <div className="text-center font-bold text-sm mb-4">
        <Ed
          editable={editable}
          value={course.semester}
          placeholder="Semester"
          onCommit={(v) => set({ semester: v })}
        />
      </div>

      {/* Course code / title / L-T-P bar */}
      <table className="w-full border-collapse border border-sky-400 mb-1">
        <tbody>
          <tr className="bg-sky-400 text-black font-bold text-xs">
            <td className="p-1.5 border border-sky-500 font-mono w-1/4 text-left">
              <Ed
                editable={editable}
                value={course.code}
                fallback="COURSE CODE"
                placeholder="COURSE CODE"
                onCommit={(v) => set({ code: String(v).toUpperCase() })}
              />
            </td>
            <td className="p-1.5 border border-sky-500 text-center w-2/4 text-sm">
              <Ed
                editable={editable}
                value={course.title}
                fallback="COURSE TITLE"
                placeholder="COURSE TITLE"
                onCommit={(v) => set({ title: v })}
              />
            </td>
            <td className="p-1.5 border border-sky-500 text-right w-1/4">
              <Ed editable={editable} value={course.ltp} placeholder="(L-T-P)" onCommit={(v) => set({ ltp: v })} />{' '}
              <Ed
                editable={editable}
                value={course.credits}
                numeric
                placeholder="0"
                onCommit={(v) => set({ credits: v })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-right font-bold text-xs mb-4">
        Contact Hours:{' '}
        <Ed
          editable={editable}
          value={course.contactHours || 0}
          numeric
          placeholder="0"
          onCommit={(v) => set({ contactHours: v })}
        />
      </div>

      {/* CLOs */}
      <div className="mb-5 text-xs">
        <div className="font-bold mb-1">Course Learning Objectives (CLOs):</div>
        <ul className="list-disc pl-5 space-y-1 leading-relaxed">
          {clos.map((clo, idx) => (
            <li key={idx}>
              <Ed
                editable={editable}
                value={clo}
                placeholder="Course learning objective"
                onCommit={(v) => setItem('clos', idx, v)}
              />
            </li>
          ))}
          {clos.length === 0 && <li className="text-slate-400 italic">No CLOs entered yet.</li>}
        </ul>
      </div>

      {/* COs */}
      <div className="mb-4">
        <div className="font-bold text-xs mb-1">Course Outcomes (COs):</div>
        <table className="w-full border-collapse border border-black text-xs text-left">
          <thead>
            <tr className="bg-sky-100">
              <th rowSpan="2" className="border border-black p-1.5 w-1/12 text-center">CO #</th>
              <th rowSpan="2" className="border border-black p-1.5 w-6/12">
                Description of the Course Outcome:
                <br />
                <span className="font-normal italic">At the end of the course the student will be able to:</span>
              </th>
              <th colSpan="3" className="border border-black p-1.5 text-center w-5/12">
                Mapping to POs(1-12) / PSOs (13-16)
              </th>
            </tr>
            <tr className="bg-sky-50 text-center text-[11px]">
              <th className="border border-black p-1">Substantial Level (3)</th>
              <th className="border border-black p-1">Moderate Level (2)</th>
              <th className="border border-black p-1">Slight Level (1)</th>
            </tr>
          </thead>
          <tbody>
            {course.cos?.map((co, idx) => (
              <tr key={idx} className="align-top">
                <td className="border border-black p-1.5 text-center font-bold">{co.id}</td>
                <td className="border border-black p-1.5">
                  <Ed
                    editable={editable}
                    value={co.text}
                    fallback="—"
                    placeholder="Course outcome"
                    onCommit={(v) => setCo(idx, 'text', v)}
                  />
                </td>
                {['substantial', 'moderate', 'slight'].map((level) => (
                  <td key={level} className="border border-black p-1.5 text-center">
                    <Ed
                      editable={editable}
                      value={co[level]}
                      fallback="-"
                      placeholder="-"
                      onCommit={(v) => setCo(idx, level, v)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PO/PSO averages (calculated from the COs above, so not edited directly) */}
      <div className="mb-5 overflow-x-auto">
        <table className="w-full border-collapse border border-black text-center text-xs">
          <thead>
            <tr className="bg-sky-200 font-bold">
              <th className="border border-black p-1">POs/PSOs</th>
              {[...Array(16)].map((_, i) => (
                <th key={i + 1} className="border border-black p-1 w-6">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-black p-1 font-bold">Mapping Level</td>
              {[...Array(16)].map((_, i) => (
                <td key={i + 1} className="border border-black p-1 font-mono text-[11px]">
                  {course.poPsoMapping?.[i + 1] || '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-5 text-xs">
        <span className="font-bold">Pre-requisites: </span>
        <Ed
          editable={editable}
          value={course.prerequisites}
          fallback="None"
          placeholder="None"
          onCommit={(v) => set({ prerequisites: v })}
        />
      </div>

      {/* Contents */}
      <div className="mb-5 text-xs">
        <div className="font-bold mb-2">Contents:</div>
        <div className="space-y-3">
          {course.units?.map((u, idx) => (
            <div key={idx} className="leading-relaxed">
              <div className="text-center font-bold mb-0.5">
                <Ed
                  editable={editable}
                  value={u.unit}
                  placeholder="Unit"
                  onCommit={(v) => setUnit(idx, 'unit', v)}
                />
              </div>
              <p>
                <strong className="font-bold">
                  <Ed
                    editable={editable}
                    value={u.title}
                    placeholder="Unit title"
                    onCommit={(v) => setUnit(idx, 'title', v)}
                  />
                  {u.title ? ': ' : ''}
                </strong>
                <Ed
                  editable={editable}
                  value={u.content}
                  fallback="—"
                  multiline
                  placeholder="Topics covered in this unit"
                  onCommit={(v) => setUnit(idx, 'content', v)}
                />{' '}
                <span className="float-right font-bold pl-2">
                  <Ed
                    editable={editable}
                    value={u.hours}
                    numeric
                    placeholder="0"
                    onCommit={(v) => setUnit(idx, 'hours', v)}
                  />{' '}
                  Hrs.
                </span>
              </p>
              <div className="clear-both"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference books */}
      <div className="mb-6 text-xs">
        <div className="font-bold mb-1">Reference Books:</div>
        <ol className="list-decimal pl-5 space-y-1">
          {refs.map((ref, idx) => (
            <li key={idx}>
              <Ed
                editable={editable}
                value={ref}
                placeholder="Author, Title, Publisher, Edition, Year"
                onCommit={(v) => setItem('references', idx, v)}
              />
            </li>
          ))}
          {refs.length === 0 && <li className="text-slate-400 italic">No reference books entered yet.</li>}
        </ol>
      </div>

      {/* Evaluation */}
      <div className="text-xs bg-slate-50 border border-slate-300 p-2.5 rounded-sm">
        <div className="font-bold mb-1">Assessment and Evaluation Pattern:</div>
        <Ed
          editable={editable}
          value={course.evaluationScheme}
          multiline
          as="p"
          className="text-slate-700"
          placeholder="Assessment and evaluation pattern"
          onCommit={(v) => set({ evaluationScheme: v })}
        />
      </div>

      {/* Footer capsule */}
      <div className="mt-12 pt-4 border-t border-slate-200">
        <div className="border-[2px] border-double border-black rounded-full px-6 py-1 text-[11px] font-bold flex justify-between items-center">
          <span>{footerLeft}</span>
          <span>Approved by BoS</span>
        </div>
      </div>
    </div>
  );
}
