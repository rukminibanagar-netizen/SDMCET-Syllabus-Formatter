const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema(
  {
    // Who created it
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerName: { type: String, required: true, trim: true },

    // Where it belongs: programme type, department, semester and scheme
    category: { type: String, enum: ['ug', 'pg'], required: true },
    deptId: { type: String, required: true },
    sem: { type: Number, required: true, min: 1, max: 8 },
    schemeId: { type: String, required: true },

    // Copies of two fields from the syllabus, so the course list can show them without loading everything
    code: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },

    // The whole syllabus exactly as the editor produces it
    course: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// The course list asks for everything in one department, semester and scheme
syllabusSchema.index({ category: 1, deptId: 1, sem: 1, schemeId: 1 });

module.exports = mongoose.model('Syllabus', syllabusSchema);
