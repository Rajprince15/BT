import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const execFileAsync = promisify(execFile);
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function locateFrontendRoot() {
  const candidates = [process.cwd(), path.resolve(process.cwd(), 'frontend')];
  return candidates.find((candidate) => existsSync(path.join(candidate, 'src', 'app'))) ?? process.cwd();
}

export async function GET() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bhavita-frontend-'));
  const archivePath = path.join(tempDir, 'bhavita-textiles-frontend.zip');

  try {
    await execFileAsync(
      'zip',
      [
        '-qr',
        archivePath,
        '.',
        '-x',
        'node_modules/*',
        '.next/*',
        'out/*',
        'coverage/*',
        'dist/*',
        '.git/*',
        '.gitignore',
        '.env',
        '.env.*',
        '*.zip',
      ],
      { cwd: locateFrontendRoot(), maxBuffer: 1024 * 1024 },
    );

    const archive = await readFile(archivePath);
    return new Response(archive, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bhavita-textiles-frontend.zip"',
        'Content-Length': String(archive.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return Response.json({ error: 'Unable to prepare the frontend download.' }, { status: 500 });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}