import React from 'react';
import { Plus, Trash2, Eye, AlertCircle } from 'lucide-react';
import { calculatePoPsoAverages } from '../services/syllabusParser';

const CAT_MAP = {
  PCC: 'Professional Core Course',
  PCCL: 'Professional Core Course Lab',
  ASC: 'Applied Science Course',
  ESC: 'Engineering Science Course',
  UHV: 'Universal Human Values',
  AEC: 'Ability Enhancement Course',
  MC: 'Mandatory Non-credit Course',
  PLC: 'Program Leader Course',
};

// TAB 1: dynamic authoring form (100% user-provided data)
export default function SyllabusEditor({ course, setCourse, onPreview }) {
  const update = (patch) => setCourse((c) => ({ ...c, ...patch }));

  // ---- COs: PO/PSO matrix is recalculated whenever the COs change ----
  const withCos = (cos) => update({ cos, poPsoMapping: calculatePoPsoAverages(cos) });

  const handleCoChange = (index, field, value) =>
    withCos(course.cos.map((co, i) => (i === index ? { ...co, [field]: value } : co)));

  const addCo = () =>
    withCos([
      ...course.cos,
      { id: `CO-${course.cos.length + 1}`, text: '', substantial: '', moderate: '', slight: '' },
    ]);

  const removeCo = (index) => {
    if (course.cos.length <= 1) return;
    // renumber so ids stay CO-1, CO-2, ... with no gaps or duplicates
    withCos(course.cos.filter((_, i) => i !== index).map((co, i) => ({ ...co, id: `CO-${i + 1}` })));
  };

  // ---- CLOs ----
  const handleCloChange = (index, value) =>
    update({ clos: course.clos.map((c, i) => (i === index ? value : c)) });
  const addClo = () => update({ clos: [...course.clos, ''] });
  const removeClo = (index) => {
    if (course.clos.length <= 1) return;
    update({ clos: course.clos.filter((_, i) => i !== index) });
  };

  // ---- Units ----
  const handleUnitChange = (index, field, value) =>
    update({
      units: course.units.map((u, i) =>
        i === index ? { ...u, [field]: field === 'hours' ? parseInt(value, 10) || 0 : value } : u
      ),
    });

  const addUnit = () => {
    const unitLabels = ['Unit - I', 'Unit - II', 'Unit - III', 'Unit - IV', 'Unit - V', 'Unit - VI'];
    const nextIndex = course.units.length;
    const nextLabel = unitLabels[nextIndex] || `Unit - ${nextIndex + 1}`;
    update({ units: [...course.units, { unit: nextLabel, title: '', content: '', hours: 8 }] });
  };

  const removeUnit = (index) => {
    if (course.units.length <= 1) return;
    update({ units: course.units.filter((_, i) => i !== index) });
  };

  // ---- Reference books ----
  const handleRefChange = (index, value) =>
    update({ references: course.references.map((r, i) => (i === index ? value : r)) });
  const addRef = () => update({ references: [...course.references, ''] });
  const removeRef = (index) => {
    if (course.references.length <= 1) return;
    update({ references: course.references.filter((_, i) => i !== index) });
  };

  // Total unit hours check
  const totalUnitHours = course.units.reduce((sum, u) => sum + (parseInt(u.hours, 10) || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm no-print max-w-4xl mx-auto">
      {/* Section A: Course Metadata */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>1. Course Metadata</span>
          <span className="text-[11px] font-normal text-slate-400">Prescribed by SDMCET Scheme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Code *</label>
            <input
              type="text"
              placeholder="e.g. 22UCSC300"
              value={course.code}
              onChange={(e) => update({ code: e.target.value.toUpperCase() })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
            <input
              type="text"
              placeholder="e.g. Data Structures and Applications"
              value={course.title}
              onChange={(e) => update({ title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Category</label>
            <select
              value={course.category}
              onChange={(e) =>
                update({
                  category: e.target.value,
                  categoryName: CAT_MAP[e.target.value] || 'Departmental Course',
                })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="PCC">PCC - Professional Core Course</option>
              <option value="PCCL">PCCL - Professional Core Course Lab</option>
              <option value="ASC">ASC - Applied Science Course</option>
              <option value="ESC">ESC - Engineering Science Course</option>
              <option value="UHV">UHV - Universal Human Values</option>
              <option value="AEC">AEC - Ability Enhancement Course</option>
              <option value="MC">MC - Mandatory Course (Audit)</option>
              <option value="PLC">PLC - Program Leader Course</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">L-T-P Scheme & Credits</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="(4-0-0)"
                value={course.ltp}
                onChange={(e) => update({ ltp: e.target.value })}
                className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center"
              />
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => update({ credits: parseInt(e.target.value, 10) || 0 })}
                className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prescribed Contact Hours *</label>
            <input
              type="number"
              placeholder="52"
              value={course.contactHours}
              onChange={(e) => update({ contactHours: parseInt(e.target.value, 10) || 0 })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-bold"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">Pre-requisites</label>
          <input
            type="text"
            placeholder="e.g. Problem Solving skills and knowledge of Programming in C language (or None)"
            value={course.prerequisites}
            onChange={(e) => update({ prerequisites: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Section B: Course Learning Objectives (CLOs) */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Course Learning Objectives (CLOs)
          </h3>
          <button
            type="button"
            onClick={addClo}
            className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-orange-100"
          >
            <Plus className="w-3.5 h-3.5" /> Add CLO
          </button>
        </div>

        <div className="space-y-2">
          {course.clos.map((clo, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
              <input
                type="text"
                placeholder={`Enter Course Learning Objective #${idx + 1}`}
                value={clo}
                onChange={(e) => handleCloChange(idx, e.target.value)}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
              />
              {course.clos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeClo(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Course Outcomes (COs) & PO/PSO Mapping */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Course Outcomes (COs) & NBA/OBE Mapping
            </h3>
            <p className="text-[11px] text-slate-500">
              Enter PO (1–12) and PSO (13–16) numbers mapped to each level. The system calculates column averages
              automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={addCo}
            className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-orange-100"
          >
            <Plus className="w-3.5 h-3.5" /> Add CO
          </button>
        </div>

        <div className="space-y-3">
          {course.cos.map((co, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-orange-600 font-mono bg-white px-2 py-0.5 rounded border border-orange-200">
                  {co.id}
                </span>
                {course.cos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCo(idx)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove {co.id}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Outcome Description (At the end of the course the student will be able to:)
                </label>
                <textarea
                  rows="2"
                  placeholder={`Enter outcome description for ${co.id}...`}
                  value={co.text}
                  onChange={(e) => handleCoChange(idx, 'text', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Substantial Level (3)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1, 2"
                    value={co.substantial}
                    onChange={(e) => handleCoChange(idx, 'substantial', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Moderate Level (2)</label>
                  <input
                    type="text"
                    placeholder="e.g. 14, 15"
                    value={co.moderate}
                    onChange={(e) => handleCoChange(idx, 'moderate', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Slight Level (1)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3, 16"
                    value={co.slight}
                    onChange={(e) => handleCoChange(idx, 'slight', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Units / Modules and Hours */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Five-Unit Content Distribution
            </h3>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>
                Total Unit Hours: <strong className="text-slate-800">{totalUnitHours} Hrs</strong>
              </span>
              <span>|</span>
              <span>
                Contact Hours: <strong className="text-slate-800">{course.contactHours} Hrs</strong>
              </span>
              {totalUnitHours !== course.contactHours && (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> (Mismatch by{' '}
                  {Math.abs(course.contactHours - totalUnitHours)} hrs)
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={addUnit}
            className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-orange-100"
          >
            <Plus className="w-3.5 h-3.5" /> Add Unit
          </button>
        </div>

        <div className="space-y-4">
          {course.units.map((unit, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={unit.unit}
                  onChange={(e) => handleUnitChange(idx, 'unit', e.target.value)}
                  className="w-28 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono text-center"
                />
                <input
                  type="text"
                  placeholder="Unit Title (e.g. Stacks & Queues)"
                  value={unit.title}
                  onChange={(e) => handleUnitChange(idx, 'title', e.target.value)}
                  className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={unit.hours}
                    onChange={(e) => handleUnitChange(idx, 'hours', e.target.value)}
                    className="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">Hrs</span>
                </div>
                {course.units.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUnit(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                rows="3"
                placeholder="Enter detailed syllabus topics covered in this unit..."
                value={unit.content}
                onChange={(e) => handleUnitChange(idx, 'content', e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section E: Reference Books */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            5. Reference Books (IEEE Format)
          </h3>
          <button
            type="button"
            onClick={addRef}
            className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-orange-100"
          >
            <Plus className="w-3.5 h-3.5" /> Add Book
          </button>
        </div>

        <div className="space-y-2">
          {course.references.map((ref, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
              <input
                type="text"
                placeholder="Author: 'Book Title', Edition, Publisher, Year."
                value={ref}
                onChange={(e) => handleRefChange(idx, e.target.value)}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              {course.references.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRef(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onPreview}
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Eye className="w-4 h-4" />
          <span>View SDMCET Formatted Syllabus &rarr;</span>
        </button>
      </div>
    </div>
  );
}
