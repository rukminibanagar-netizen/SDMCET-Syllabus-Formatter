import React, { useEffect, useRef } from 'react';
import { calculatePoPsoAverages } from '../services/syllabusParser';
import { mappingSpec } from '../data/schemeFormats';

// ---------------------------------------------------------------------------
// Bold text. Faculty mark bold words as **bold** (or press Ctrl+B while editing in the preview).
// The stored text keeps the ** markers; the page shows real bold.
// ---------------------------------------------------------------------------
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const richHtml = (text) =>
  escapeHtml(String(text ?? '')).replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');

function RichText({ text }) {
  const parts = String(text ?? '').split(/\*\*([\s\S]+?)\*\*/g); // odd positions are the bold parts
  return (
    <>
      {parts.map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

// Turns what is on screen (text plus <b>/<strong>) back into text with ** markers
function toMarkup(node, inBold = false) {
  let out = '';
  node.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      out += n.nodeValue;
    } else if (n.nodeType === 1) {
      const tag = n.tagName;
      if (tag === 'BR') {
        out += '\n';
        return;
      }
      const weight = n.style?.fontWeight || '';
      const bold = tag === 'STRONG' || tag === 'B' || weight === 'bold' || Number(weight) >= 600;
      const inner = toMarkup(n, inBold || bold);
      if (tag === 'DIV' || tag === 'P') {
        out += (out && !out.endsWith('\n') ? '\n' : '') + inner;
      } else if (bold && !inBold && inner.trim()) {
        out += `**${inner}**`;
      } else {
        out += inner;
      }
    }
  });
  return out.replace(/\*\*\s*\*\*/g, '');
}

// ---------------------------------------------------------------------------
// Click-to-edit text. The text is edited directly inside the formatted page and
// saved back to the course when you click away (or press Enter on a one-line field).
//  - Esc cancels the edit.
//  - Pasting always inserts plain text, so no outside formatting sneaks in.
//  - With `rich`, Ctrl+B makes the selected words bold.
// The element's content is managed by hand (not by React) so the cursor never jumps
// while typing.
// ---------------------------------------------------------------------------
function EditableText({ value, onCommit, placeholder, numeric = false, multiline = false, rich = false, className = '', as: Tag = 'span' }) {
  const ref = useRef(null);
  const text = String(value ?? '');
  const initial = useRef(rich ? { __html: richHtml(text) } : text); // React renders this once; later updates are written below

  // Show outside changes (import, reset) unless the person is typing in this field
  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (rich) {
      const html = richHtml(text);
      if (el.innerHTML !== html) el.innerHTML = html;
    } else if (el.textContent !== text) {
      el.textContent = text;
    }
  }, [text, rich]);

  const handleBlur = () => {
    const el = ref.current;
    if (!el) return;
    let next = rich ? toMarkup(el) : el.innerText;
    next = next.replace(/\u00a0/g, ' ').replace(/\n+$/, '');
    next = multiline ? next.trim() : next.replace(/\s*\n\s*/g, ' ').trim();
    if (numeric) {
      const n = parseInt(next, 10);
      next = Number.isNaN(n) ? 0 : n;
    }
    if (rich) el.innerHTML = richHtml(next); // drop any stray markup the browser added
    else el.textContent = String(next);
    if (String(next) !== text) onCommit(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (rich) ref.current.innerHTML = richHtml(text);
      else ref.current.textContent = text;
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

  const shared = {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    role: 'textbox',
    'aria-label': placeholder,
    'data-placeholder': placeholder,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    className: `editable-field ${multiline ? 'whitespace-pre-wrap' : ''} ${className}`,
  };

  return rich ? (
    <Tag {...shared} dangerouslySetInnerHTML={initial.current} />
  ) : (
    <Tag {...shared}>{initial.current}</Tag>
  );
}

// Plain text when the page is read-only, click-to-edit when `editable` is on.
function Ed({ editable, value, fallback, multiline, rich, as: Tag = 'span', className = '', ...rest }) {
  if (editable) {
    return <EditableText value={value} multiline={multiline} rich={rich} as={Tag} className={className} {...rest} />;
  }
  const shown = value === '' || value === null || value === undefined ? fallback ?? '' : value;
  return (
    <Tag className={`${multiline ? 'whitespace-pre-line' : ''} ${className}`}>
      {rich ? <RichText text={shown} /> : shown}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// The print-ready syllabus page, laid out exactly like the SDMCET syllabus book of the chosen scheme.
// `format` (from data/schemeFormats.js) decides every difference between the schemes.
// `footerLeft` is the text in the footer capsule, e.g. "II Year B. E. (CSE): 2024-25".
// With `editable`, every text on the page can be changed in place and
// `onCourseChange(updater)` receives the change (updater: course => newCourse).
// ---------------------------------------------------------------------------
export default function SyllabusDocument({ course, format, footerLeft = '', editable = false, onCourseChange }) {
  if (!course || !format) return null;

  const f = format;
  const spec = mappingSpec(f, course);

  const change = (updater) => onCourseChange && onCourseChange(updater);
  const set = (patch) => change((c) => ({ ...c, ...patch }));
  const setCo = (i, field, value) =>
    change((c) => {
      const cos = c.cos.map((co, idx) => (idx === i ? { ...co, [field]: value } : co));
      return { ...c, cos, poPsoMapping: calculatePoPsoAverages(cos, spec.total) };
    });
  const setUnit = (i, field, value) =>
    change((c) => ({ ...c, units: c.units.map((u, idx) => (idx === i ? { ...u, [field]: value } : u)) }));
  const setItem = (key, i, value) =>
    change((c) => ({ ...c, [key]: (c[key] || []).map((x, idx) => (idx === i ? value : x)) }));

  // Read-only view hides empty entries; the editable view keeps them so they can be filled in
  const keep = (list) => (editable ? list || [] : (list || []).filter(Boolean));
  const clos = keep(course.clos);
  const refs = keep(course.references);
  const labItems = keep(course.labExperiments);

  const hours = (n) => (f.units.padHours ? String(n ?? 0).padStart(2, '0') : String(n ?? 0));
  const hasLab = labItems.length > 0 || course.suggestedSoftware || course.softwareUsed;
  const cloIntro = course.cloIntro ?? 'This course focuses on the following learning perspectives:';
  const levelCols = [
    ['substantial', 'Substantial', 'Level (3)'],
    ['moderate', 'Moderate', 'Level (2)'],
    ['slight', 'Slight', 'Level (1)'],
  ];
  const headerFill = { backgroundColor: f.tableHeaderFill };

  return (
    <div className="sdmcet-doc syllabus-print-container bg-white text-black mx-auto border border-slate-300 shadow-xl">
      {/* Header: repeats on every printed page */}
      <div className="doc-header">
        <div className="doc-rule" />
        <div className="doc-pill">SDMCET: Syllabus</div>
        <div className="doc-rule" />
      </div>

      {/* Semester (printed above the first course of each semester) */}
      <div className="text-center font-bold mb-3">
        <Ed editable={editable} value={course.semester} placeholder="Semester" onCommit={(v) => set({ semester: v })} />
      </div>

      {/* Course heading bar */}
      <table className="w-full border-collapse" style={{ border: '1px solid #000' }}>
        <tbody>
          <tr className="font-bold" style={{ backgroundColor: f.heading.fill, color: f.heading.text }}>
            <td className="py-1 px-2 text-left" style={{ width: '25%' }}>
              <Ed
                editable={editable}
                value={course.code}
                fallback="COURSE CODE"
                placeholder="COURSE CODE"
                onCommit={(v) => set({ code: String(v).toUpperCase() })}
              />
            </td>
            <td className="py-1 px-2 text-center">
              <Ed
                editable={editable}
                value={course.title}
                fallback="COURSE TITLE"
                placeholder="COURSE TITLE"
                onCommit={(v) => set({ title: v })}
              />
            </td>
            <td className="py-1 px-2 text-right whitespace-nowrap" style={{ width: '25%' }}>
              <Ed editable={editable} value={course.ltp} placeholder={f.heading.ltpHint} onCommit={(v) => set({ ltp: v })} />
              {f.heading.creditsGap}
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

      <div className="text-right font-bold mb-2">
        {f.heading.hoursLabel}:{' '}
        <Ed
          editable={editable}
          value={course.contactHours || 0}
          numeric
          placeholder="0"
          onCommit={(v) => set({ contactHours: v })}
        />
      </div>

      {/* Course learning objectives */}
      <div className="mb-3">
        {f.clos.introOnSameLine ? (
          <p className="text-justify">
            <strong>Course Learning Objectives (CLOs):</strong>{' '}
            {(editable || cloIntro) && (
              <Ed editable={editable} value={cloIntro} rich placeholder="Introduction line (optional)" onCommit={(v) => set({ cloIntro: v })} />
            )}
          </p>
        ) : (
          <>
            <p className="font-bold">Course Learning Objectives (CLOs):</p>
            {(editable || cloIntro) && (
              <p>
                <Ed editable={editable} value={cloIntro} rich placeholder="Introduction line (optional)" onCommit={(v) => set({ cloIntro: v })} />
              </p>
            )}
          </>
        )}

        {f.clos.style === 'bullets' ? (
          <ul className="list-disc pl-10 mt-1">
            {clos.map((clo, idx) => (
              <li key={idx} className="text-justify">
                <Ed editable={editable} value={clo} rich placeholder="Course learning objective" onCommit={(v) => setItem('clos', idx, v)} />
              </li>
            ))}
          </ul>
        ) : (
          <ol className="list-none pl-6 mt-1">
            {clos.map((clo, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="shrink-0">{idx + 1})</span>
                <span className="flex-1 text-justify">
                  <Ed editable={editable} value={clo} rich placeholder="Course learning objective" onCommit={(v) => setItem('clos', idx, v)} />
                </span>
              </li>
            ))}
          </ol>
        )}
        {clos.length === 0 && <p className="text-slate-400 italic">No CLOs entered yet.</p>}
      </div>

      {/* Course outcomes */}
      <div className="mb-4">
        <p className="font-bold mb-1">Course Outcomes (COs):</p>
        <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid #000' }}>
          <thead>
            <tr style={headerFill}>
              <th colSpan="2" rowSpan="2" className="border border-black p-2 text-left align-middle">
                Description of the Course Outcome:
                <br />
                <span className="font-normal">At the end of the course the student will be able to:</span>
              </th>
              <th colSpan="3" className="border border-black p-1.5 text-center">
                {spec.header}
              </th>
            </tr>
            <tr style={headerFill} className="text-center text-[9pt]">
              {levelCols.map(([key, name, level]) => (
                <th key={key} className="border border-black p-1" style={{ width: '12%' }}>
                  {name}
                  <br />
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {course.cos?.map((co, idx) => (
              <tr key={idx} className="align-middle">
                <td className="border border-black p-1.5 text-center font-bold" style={{ width: '9%' }}>
                  {co.id}
                </td>
                <td className="border border-black p-1.5 text-justify">
                  <Ed
                    editable={editable}
                    value={co.text}
                    fallback="—"
                    rich
                    placeholder="Course outcome"
                    onCommit={(v) => setCo(idx, 'text', v)}
                  />
                </td>
                {levelCols.map(([key]) => (
                  <td key={key} className="border border-black p-1.5 text-center">
                    <Ed editable={editable} value={co[key]} fallback="-" placeholder="-" onCommit={(v) => setCo(idx, key, v)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PO / PSO averages (calculated from the COs above, so not edited directly) */}
      <div className={`mb-4 ${f.poTableFullWidth ? '' : 'flex justify-center'}`}>
        <table
          className={`border-collapse text-center text-[10pt] ${f.poTableFullWidth ? 'w-full' : ''}`}
          style={{ border: '1px solid #000' }}
        >
          <tbody>
            <tr className="font-bold" style={{ backgroundColor: f.poHeaderFill }}>
              <td className="border border-black px-2 py-0.5">{spec.firstCell}</td>
              {Array.from({ length: spec.total }, (_, i) => (
                <td key={i + 1} className="border border-black px-1.5 py-0.5" style={{ minWidth: '1.6rem' }}>
                  {i + 1}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-black px-2 py-0.5 font-bold" style={{ backgroundColor: f.poHeaderFill }}>
                Mapping Level
              </td>
              {Array.from({ length: spec.total }, (_, i) => (
                <td key={i + 1} className="border border-black px-1.5 py-0.5">
                  {course.poPsoMapping?.[i + 1] || '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-3">
        <strong>{f.prerequisitesLabel}:</strong>{' '}
        <Ed
          editable={editable}
          value={course.prerequisites}
          fallback="None"
          rich
          placeholder="None"
          onCommit={(v) => set({ prerequisites: v })}
        />
      </p>

      {/* Contents */}
      <div className="mb-3">
        <p className="font-bold mb-1">Contents:</p>
        <div className="space-y-2">
          {course.units?.map((u, idx) => (
            <div key={idx}>
              <div className="text-center font-bold">
                <Ed editable={editable} value={u.unit} placeholder="Unit" onCommit={(v) => setUnit(idx, 'unit', v)} />
              </div>

              {f.units.titleOnOwnLine ? (
                <>
                  <div className="font-bold">
                    <Ed editable={editable} value={u.title} placeholder="Unit topic" onCommit={(v) => setUnit(idx, 'title', v)} />
                  </div>
                  <p className="text-justify">
                    <Ed
                      editable={editable}
                      value={u.content}
                      fallback="—"
                      multiline
                      rich
                      placeholder="Topics covered in this unit"
                      onCommit={(v) => setUnit(idx, 'content', v)}
                    />
                  </p>
                  <div className="text-right font-bold">
                    <Ed editable={editable} value={hours(u.hours)} numeric placeholder="0" onCommit={(v) => setUnit(idx, 'hours', v)} /> Hrs
                  </div>
                </>
              ) : (
                <>
                  <p className="text-justify">
                    <strong>
                      <Ed editable={editable} value={u.title} placeholder="Unit topic" onCommit={(v) => setUnit(idx, 'title', v)} />
                      {u.title ? ': ' : ''}
                    </strong>
                    <Ed
                      editable={editable}
                      value={u.content}
                      fallback="—"
                      multiline
                      rich
                      placeholder="Topics covered in this unit"
                      onCommit={(v) => setUnit(idx, 'content', v)}
                    />{' '}
                    <span className="float-right font-bold pl-2">
                      <Ed editable={editable} value={hours(u.hours)} numeric placeholder="0" onCommit={(v) => setUnit(idx, 'hours', v)} /> Hrs
                    </span>
                  </p>
                  <div className="clear-both" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Laboratory / term work (only for courses that have it) */}
      {hasLab && (
        <div className="mb-3">
          <p>
            <Ed editable={editable} value={course.labTitle} rich placeholder="List of experiments" onCommit={(v) => set({ labTitle: v })} />
          </p>
          <ol className="list-none pl-2">
            {labItems.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="shrink-0">{idx + 1}.</span>
                <span className="flex-1 text-justify">
                  <Ed
                    editable={editable}
                    value={item}
                    rich
                    multiline
                    placeholder="Experiment"
                    onCommit={(v) => setItem('labExperiments', idx, v)}
                  />
                </span>
              </li>
            ))}
          </ol>
          {(editable || course.suggestedSoftware) && course.suggestedSoftware !== undefined && course.suggestedSoftware !== '' && (
            <p>
              <strong>Suggested softwares:</strong>{' '}
              <Ed editable={editable} value={course.suggestedSoftware} placeholder="Software" onCommit={(v) => set({ suggestedSoftware: v })} />
            </p>
          )}
          {course.softwareUsed ? (
            <p>
              <strong>Software used:</strong>{' '}
              <Ed editable={editable} value={course.softwareUsed} placeholder="Software" onCommit={(v) => set({ softwareUsed: v })} />
            </p>
          ) : null}
        </div>
      )}

      {/* Reference books */}
      <div className="mb-3">
        <p className="font-bold mb-1">Reference Books:</p>
        <ol className="list-none pl-6">
          {refs.map((ref, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="shrink-0">{idx + 1})</span>
              <span className="flex-1 text-justify">
                <Ed
                  editable={editable}
                  value={ref}
                  rich
                  placeholder="Author, Title, Publisher, Edition, Year"
                  onCommit={(v) => setItem('references', idx, v)}
                />
              </span>
            </li>
          ))}
        </ol>
        {refs.length === 0 && <p className="text-slate-400 italic">No reference books entered yet.</p>}
      </div>

      {/* Assessment and evaluation (only when the course has its own pattern) */}
      {course.evaluationScheme ? (
        <div className="mb-3">
          <p className="font-bold">Assessment and Evaluation Pattern:</p>
          <Ed
            editable={editable}
            value={course.evaluationScheme}
            multiline
            rich
            as="p"
            className="text-justify"
            placeholder="Assessment and evaluation pattern"
            onCommit={(v) => set({ evaluationScheme: v })}
          />
        </div>
      ) : null}

      {/* Footer: repeats on every printed page */}
      <div className="doc-footer">
        <div className="doc-pill doc-pill-left">{footerLeft}</div>
        <div className="doc-rule" />
      </div>
    </div>
  );
}
