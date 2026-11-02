import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Pencil, Eye } from 'lucide-react';
import { UG_DEPARTMENTS, PG_DEPARTMENTS } from '../data/departments';
import { SCHEMES, SEMESTER_COUNT } from '../data/schemes';
import { createBlankSyllabus, semesterShort } from '../services/syllabusParser';
import { listSyllabi, createSyllabus, deleteSyllabus } from '../services/syllabusApi';

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

const when = (value) => new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

function Courses({ type, dept, sem, scheme }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(null); // null while loading
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const selection = { category: type, deptId: dept.id, sem, schemeId: scheme.id };
  const base = `/syllabus/${type}/${dept.id}/${sem}/${scheme.id}`;

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError('');
    listSyllabi(selection)
      .then((list) => { if (!cancelled) setItems(list); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [type, dept.id, sem, scheme.id]);

  const addCourse = async () => {
    setCreating(true);
    setError('');
    try {
      const blank = createBlankSyllabus({
        department: dept.name,
        semester: semesterShort(sem),
        scheme: scheme.label,
        schemeId: scheme.id,
      });
      const created = await createSyllabus(selection, blank);
      navigate(`${base}/${created.id}`);
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  };

  const remove = async (item) => {
    const name = item.code || item.title ? `${item.code} ${item.title}`.trim() : 'this untitled course';
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteSyllabus(item.id);
      setItems((list) => list.filter((x) => x.id !== item.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <Link
          to={`/${type}/${dept.id}/semester/${sem}`}
          className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to schemes
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Courses</h1>
            <p className="text-sm text-slate-300 mt-1">
              {dept.name} • Semester {sem} • {scheme.label}
            </p>
          </div>
          <button
            type="button"
            onClick={addCourse}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Creating...' : 'Add course'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-100">{error}</div>
      )}

      {items === null && !error && <p className="text-sm text-slate-300">Loading courses...</p>}

      {items && items.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <p className="text-base font-bold text-slate-900">No courses yet</p>
          <p className="text-sm text-slate-500 mt-1">Click Add course to write the first syllabus for this semester.</p>
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {item.code || 'No code'}
                  </span>
                  <span className="font-bold text-slate-900 truncate">{item.title || 'Untitled course'}</span>
                  {item.ownedByMe && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">Yours</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  By {item.ownerName} • Updated {when(item.updatedAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`${base}/${item.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 transition-colors"
                >
                  {item.canEdit ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {item.canEdit ? 'Edit' : 'View'}
                </Link>
                {item.canEdit && (
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    title="Delete course"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Route: /syllabus/:category/:deptId/:sem/:schemeId   (opened after choosing a scheme)
export default function CourseList() {
  const { category, deptId, sem, schemeId } = useParams();

  const type = category === 'pg' ? 'pg' : 'ug';
  const dept = (type === 'pg' ? PG_DEPARTMENTS : UG_DEPARTMENTS).find((d) => d.id === deptId);
  const scheme = SCHEMES.find((s) => s.id === schemeId);
  const semNum = Number(sem);

  if (!dept) return <NotFound message="That department or programme does not exist." />;
  if (!scheme) return <NotFound message="That scheme does not exist." />;
  if (!Number.isInteger(semNum) || semNum < 1 || semNum > SEMESTER_COUNT[type]) {
    return <NotFound message={`Semester must be between 1 and ${SEMESTER_COUNT[type]}.`} />;
  }

  return <Courses key={`${type}:${deptId}:${semNum}:${schemeId}`} type={type} dept={dept} sem={semNum} scheme={scheme} />;
}
