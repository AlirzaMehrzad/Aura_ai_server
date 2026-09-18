import { extractText } from 'unpdf';

export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

export async function processUploadedPDF(
  fileBuffer: Buffer | Uint8Array
): Promise<string[]> {
  // Convert Node.js Buffer to a plain Uint8Array required by unpdf / pdfjs
  const uint8Array = new Uint8Array(fileBuffer);

  const { text } = await extractText(uint8Array);

  // If extractText returns an array of page strings instead of a single string
  const fullText = Array.isArray(text) ? text.join('\n') : text;

  return chunkText(fullText);
}
