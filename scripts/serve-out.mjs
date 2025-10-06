import { createServer } from 'http'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const exportDir = path.join(projectRoot, 'out')
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3000)

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
}

async function pathExists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

function isWithinExportDir(candidate) {
  const relative = path.relative(exportDir, candidate)
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

async function ensureExportDir() {
  if (!(await pathExists(exportDir))) {
    console.error('Cannot find the "out" directory. Run `npm run build` first to generate the static export.')
    process.exit(1)
  }
}

function resolveCandidates(requestPath) {
  const decodedPath = decodeURIComponent(requestPath.split('?')[0])
  const normalized = path.posix.normalize(decodedPath)

  if (normalized.endsWith('/')) {
    return [path.join(exportDir, normalized, 'index.html')]
  }

  const ext = path.extname(normalized)
  if (ext) {
    return [path.join(exportDir, normalized)]
  }

  return [
    path.join(exportDir, `${normalized}.html`),
    path.join(exportDir, normalized, 'index.html'),
  ]
}

async function sendFile(res, filePath) {
  if (!(await pathExists(filePath))) {
    return false
  }

  if (!isWithinExportDir(filePath)) {
    return false
  }

  const ext = path.extname(filePath)
  const mime = mimeTypes[ext] || 'application/octet-stream'
  const data = await fs.readFile(filePath)

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': data.length,
  })
  res.end(data)
  return true
}

async function sendNotFound(res) {
  const fallback = path.join(exportDir, '404.html')
  if (await sendFile(res, fallback)) {
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('404 - Not Found')
}

async function requestHandler(req, res) {
  const url = req.url || '/'
  const candidates = resolveCandidates(url)

  for (const candidate of candidates) {
    if (await sendFile(res, candidate)) {
      return
    }
  }

  await sendNotFound(res)
}

async function start() {
  await ensureExportDir()

  const server = createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      console.error('Failed to serve request:', error)
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('500 - Internal Server Error')
    })
  })

  server.listen(port, host, () => {
    console.log(`Static export server running at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
    console.log('Press Ctrl+C to stop the server.')
  })
}

start().catch((error) => {
  console.error('Unable to start preview server:', error)
  process.exit(1)
})
