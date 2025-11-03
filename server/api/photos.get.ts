import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const publicDir = join(process.cwd(), 'public', 'photos')
  const altDir = join(process.cwd(), 'public', 'photo')
  const query = getQuery(event)
  const debug = query.debug === '1' || query.debug === 'true'
  try {
    // Check dir exists
    async function readDirSafe(dir: string) {
      const st = await fs.stat(dir).catch(() => null)
      if (!st || !st.isDirectory()) return [] as any[]
      return await fs.readdir(dir, { withFileTypes: true })
    }

    const entriesPhotos = await readDirSafe(publicDir)
    const entriesPhoto = await readDirSafe(altDir)
    const entries = [...entriesPhotos, ...entriesPhoto.map((d:any) => ({ ...d, fromAlt: true }))]
    const allow = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'])
    const list = entries
      .filter((d) => d.isFile())
      .map((d: any) => ({ name: d.name, fromAlt: !!d.fromAlt }))
      .filter((f) => {
        const dot = f.name.lastIndexOf('.')
        if (dot === -1) return false
        return allow.has(f.name.substring(dot).toLowerCase())
      })
    const files = [] as Array<{ url: string; name: string; mtime: string }>
    for (const f of list) {
      const dir = f.fromAlt ? altDir : publicDir
      const stat = await fs.stat(join(dir, f.name)).catch(() => null)
      files.push({
        url: f.fromAlt ? `/photo/${encodeURIComponent(f.name)}` : `/photos/${encodeURIComponent(f.name)}`,
        name: f.name,
        mtime: stat ? new Date(stat.mtimeMs).toISOString() : new Date().toISOString()
      })
    }

    if (debug) {
      return { files, debug: { exists: entriesPhotos.length>0, path: publicDir, altExists: entriesPhoto.length>0, altPath: altDir, count: files.length } }
    }
    return { files }
  } catch (e: any) {
    return debug
      ? { files: [], debug: { exists: false, path: publicDir, error: String(e) } }
      : { files: [] }
  }
})


