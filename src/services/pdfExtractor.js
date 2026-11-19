/**
 * pdfExtractor.js
 * Client-side PDF → plain text extraction using Mozilla PDF.js (pdfjs-dist).
 *
 * Usage:
 *   import { extractTextFromPDF } from './pdfExtractor';
 *   const text = await extractTextFromPDF(file);  // file is a File object
 */

import * as pdfjsLib from 'pdfjs-dist';

// Point the worker at the bundled worker file (Vite copies it to /public automatically)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Read a PDF File object and return all text as a single string.
 * Pages are separated by newlines; items within a page preserve their order.
 *
 * @param {File} file  - A File selected from an <input type="file">
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(file) {
  // Convert File → ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // content.items is an array of TextItem objects.
    // Each has: str (text), transform (position matrix), hasEOL (line break flag)
    // We reconstruct lines by grouping items that share the same Y position.

    // Build a list of { y, x, str } for each text fragment
    const fragments = content.items
      .filter((item) => item.str && item.str.trim() !== '')
      .map((item) => ({
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
        str: item.str,
        hasEOL: item.hasEOL,
      }));

    if (fragments.length === 0) {
      pageTexts.push('');
      continue;
    }

    // Group into lines by Y coordinate (tolerance ±3px for slight misalignments)
    const lines = [];
    let currentLine = null;
    const Y_TOLERANCE = 3;

    // Sort top-to-bottom (descending Y in PDF coord space), then left-to-right
    fragments.sort((a, b) => b.y - a.y || a.x - b.x);

    for (const frag of fragments) {
      if (!currentLine || Math.abs(frag.y - currentLine.y) > Y_TOLERANCE) {
        currentLine = { y: frag.y, parts: [] };
        lines.push(currentLine);
      }
      currentLine.parts.push(frag);
    }

    // Build text lines, inserting spaces based on x-gap between fragments
    const lineStrings = lines.map((line) => {
      const sorted = line.parts.sort((a, b) => a.x - b.x);
      let text = '';
      for (let i = 0; i < sorted.length; i++) {
        if (i > 0) {
          // If there's a noticeable gap between fragments, add spaces
          const prevEnd = sorted[i - 1].x + sorted[i - 1].str.length * 5; // rough char width
          const gap = sorted[i].x - prevEnd;
          if (gap > 10) text += '  '; // double-space acts as column separator
          else if (gap > 2) text += ' ';
        }
        text += sorted[i].str;
      }
      return text.trim();
    });

    pageTexts.push(lineStrings.filter(Boolean).join('\n'));
  }

  // Join all pages, separated by a clear page break marker
  return pageTexts.filter(Boolean).join('\n\n');
}

/**
 * Read a plain-text or markdown File object and return its contents as a string.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
