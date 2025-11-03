import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const dir = join(process.cwd(), 'public', 'memories')
  const debug = getQuery(event).debug === '1'
  try {
    const st = await fs.stat(dir).catch(() => null)
    if (!st || !st.isDirectory()) {
      return debug ? { files: [], debug: { exists: false, path: dir } } : { files: [] }
    }
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const allow = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'])
    const files: Array<{ url: string; name: string; mtime: string }> = []
    for (const d of entries) {
      if (!d.isFile()) continue
      const name = d.name
      const dot = name.lastIndexOf('.')
      if (dot === -1) continue
      if (!allow.has(name.substring(dot).toLowerCase())) continue
      const stf = await fs.stat(join(dir, name)).catch(() => null)
      files.push({
        url: `/memories/${encodeURIComponent(name)}`,
        name,
        mtime: stf ? new Date(stf.mtimeMs).toISOString() : new Date().toISOString()
      })
    }
    return debug ? { files, debug: { exists: true, path: dir, count: files.length } } : { files }
  } catch (e: any) {
    return debug ? { files: [], debug: { error: String(e), path: dir } } : { files: [] }
  }
})


