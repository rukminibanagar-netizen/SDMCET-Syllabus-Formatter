const express = require('express');
const Syllabus = require('../models/Syllabus');
const { requireAuth, requireTerms } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireTerms);

const SEMESTERS = { ug: 8, pg: 4 };
const ID_PATTERN = /^[a-z0-9-]{1,40}$/;
const OBJECT_ID = /^[a-f0-9]{24}$/i;
const MAX_COURSE_BYTES = 300 * 1024;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Checks category, department, semester and scheme. Returns clean values, or null if anything is wrong.
function readSelection(source = {}) {
  const { category, deptId, schemeId } = source;
  const sem = Number(source.sem);
  if (!['ug', 'pg'].includes(category)) return null;
  if (!Number.isInteger(sem) || sem < 1 || sem > SEMESTERS[category]) return null;
  if (typeof deptId !== 'string' || !ID_PATTERN.test(deptId)) return null;
  if (typeof schemeId !== 'string' || !ID_PATTERN.test(schemeId)) return null;
  return { category, deptId, sem, schemeId };
}

// The syllabus content must be an object and not unreasonably large
function readCourse(value) {
  if (!isPlainObject(value)) return null;
  if (Buffer.byteLength(JSON.stringify(value)) > MAX_COURSE_BYTES) return null;
  return value;
}

// Everyone signed in can view. Only the author or an admin can change or delete.
const canEdit = (user, syllabus) =>
  user.role === 'admin' || String(syllabus.owner) === String(user._id);

function summary(syllabus, user) {
  return {
    id: syllabus._id,
    code: syllabus.code,
    title: syllabus.title,
    ownerName: syllabus.ownerName,
    ownedByMe: String(syllabus.owner) === String(user._id),
    canEdit: canEdit(user, syllabus),
    createdAt: syllabus.createdAt,
    updatedAt: syllabus.updatedAt,
  };
}

// Loads the syllabus named in the address, or answers 404 and returns null
async function findFromParams(req, res) {
  const found = OBJECT_ID.test(req.params.id) ? await Syllabus.findById(req.params.id) : null;
  if (!found) res.status(404).json({ message: 'Syllabus not found.' });
  return found;
}

// GET /api/syllabi?category=ug&deptId=cse&sem=3&schemeId=2022   -> the course list
router.get('/', async (req, res) => {
  const selection = readSelection(req.query);
  if (!selection) return res.status(400).json({ message: 'Invalid department, semester or scheme.' });

  const list = await Syllabus.find(selection).select('-course').sort({ code: 1, createdAt: 1 });
  res.json(list.map((s) => summary(s, req.user)));
});

// POST /api/syllabi   -> add a course
router.post('/', async (req, res) => {
  const selection = readSelection(req.body);
  const course = readCourse(req.body?.course);
  if (!selection || !course) return res.status(400).json({ message: 'Invalid syllabus data.' });

  const created = await Syllabus.create({
    ...selection,
    owner: req.user._id,
    ownerName: req.user.name,
    code: clean(course.code, 40),
    title: clean(course.title, 200),
    course,
  });
  res.status(201).json(summary(created, req.user));
});

// GET /api/syllabi/:id   -> one course with its full content
router.get('/:id', async (req, res) => {
  const found = await findFromParams(req, res);
  if (!found) return;
  res.json({
    ...summary(found, req.user),
    category: found.category,
    deptId: found.deptId,
    sem: found.sem,
    schemeId: found.schemeId,
    course: found.course,
  });
});

// PUT /api/syllabi/:id   -> save changes (author or admin)
router.put('/:id', async (req, res) => {
  const found = await findFromParams(req, res);
  if (!found) return;
  if (!canEdit(req.user, found)) {
    return res.status(403).json({ message: 'Only the author or an admin can edit this syllabus.' });
  }

  const course = readCourse(req.body?.course);
  if (!course) return res.status(400).json({ message: 'Invalid syllabus data.' });

  found.course = course;
  found.code = clean(course.code, 40);
  found.title = clean(course.title, 200);
  await found.save();
  res.json({ updatedAt: found.updatedAt });
});

// DELETE /api/syllabi/:id   -> remove a course (author or admin)
router.delete('/:id', async (req, res) => {
  const found = await findFromParams(req, res);
  if (!found) return;
  if (!canEdit(req.user, found)) {
    return res.status(403).json({ message: 'Only the author or an admin can delete this syllabus.' });
  }
  await found.deleteOne();
  res.json({ ok: true });
});

module.exports = router;
