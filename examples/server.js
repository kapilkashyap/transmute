import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST_ROOT = path.resolve(ROOT, '..', 'dist');
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.jsx': 'application/javascript; charset=utf-8',
    '.cjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

function toTitle(folderName) {
    return folderName.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function listExamples() {
    return fs
        .readdirSync(ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'snippets')
        .map((entry) => ({
            name: entry.name,
            title: toTitle(entry.name),
            path: `/${entry.name}/`
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function isWithinRoot(targetPath) {
    const rootPath = path.resolve(ROOT);
    const resolved = path.resolve(targetPath);
    return resolved === rootPath || resolved.startsWith(rootPath + path.sep);
}

function sendJson(res, payload) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, buffer) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Failed to read file');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(buffer);
    });
}

function resolveFileFromModulePath(candidatePath) {
    if (!candidatePath || path.extname(candidatePath)) {
        return candidatePath;
    }

    const possibleFiles = [
        candidatePath,
        `${candidatePath}.js`,
        `${candidatePath}.mjs`,
        `${candidatePath}.jsx`,
        `${candidatePath}.ts`,
        `${candidatePath}.tsx`,
        path.join(candidatePath, 'index.js'),
        path.join(candidatePath, 'index.mjs'),
        path.join(candidatePath, 'index.jsx'),
        path.join(candidatePath, 'index.ts'),
        path.join(candidatePath, 'index.tsx')
    ];

    for (const filePath of possibleFiles) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            return filePath;
        }
    }

    return candidatePath;
}

function serveNotFound(res, pathname) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Not found: ${pathname}`);
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/api/examples') {
        sendJson(res, listExamples());
        return;
    }

    if (pathname === '/' || pathname === '/index.html') {
        sendFile(res, path.join(ROOT, 'index.html'));
        return;
    }

    if (pathname === '/app.js') {
        sendFile(res, path.join(ROOT, 'app.js'));
        return;
    }

    if (pathname === '/dist' || pathname.startsWith('/dist/')) {
        const relativeDistPath = pathname.replace(/^\/dist\/?/, '');
        const resolvedDistPath = path.resolve(DIST_ROOT, relativeDistPath);
        if (resolvedDistPath.startsWith(DIST_ROOT + path.sep)) {
            const resolvedFile = resolveFileFromModulePath(resolvedDistPath);
            if (fs.existsSync(resolvedFile) && fs.statSync(resolvedFile).isFile()) {
                sendFile(res, resolvedFile);
                return;
            }
        }
        serveNotFound(res, pathname);
        return;
    }

    const relativePath = pathname === '/' ? '' : pathname.replace(/^\//, '');
    const resolvedPath = path.resolve(ROOT, relativePath);

    if (!isWithinRoot(resolvedPath)) {
        serveNotFound(res, pathname);
        return;
    }

    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        if (!pathname.endsWith('/')) {
            res.writeHead(302, { Location: `${pathname}/` });
            res.end();
            return;
        }

        const indexFile = path.join(resolvedPath, 'index.html');
        if (fs.existsSync(indexFile)) {
            sendFile(res, indexFile);
            return;
        }
    }

    const resolvedFile = resolveFileFromModulePath(resolvedPath);
    if (fs.existsSync(resolvedFile) && fs.statSync(resolvedFile).isFile()) {
        sendFile(res, resolvedFile);
        return;
    }

    serveNotFound(res, pathname);
});

server.listen(PORT, () => {
    console.log(`Transmute examples are running at http://localhost:${PORT}`);
    console.log('Open the root page to browse all examples.');
});
