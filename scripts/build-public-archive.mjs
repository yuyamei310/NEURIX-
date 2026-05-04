import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, 'data', 'raw')
const OUT_FILE = path.join(ROOT, 'data', 'processed', 'team-usa-archetype-clusters.json')
const MIN_CLUSTER_SIZE = 5

const POWER_SPORTS = ['shot put', 'discus', 'hammer', 'weightlifting', 'wrestling', 'judo', 'sprint', 'powerlifting']
const ENDURANCE_SPORTS = ['marathon', 'distance', 'cycling', 'triathlon', 'rowing', 'swimming', 'race walk', 'cross country']
const TECHNICAL_SPORTS = ['archery', 'shooting', 'diving', 'gymnastics', 'fencing', 'table tennis', 'equestrian']
const HYBRID_SPORTS = ['basketball', 'volleyball', 'soccer', 'rugby', 'hockey', 'handball', 'water polo']

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (ch === '"' && quoted && next === '"') {
      cell += '"'
      i++
    } else if (ch === '"') {
      quoted = !quoted
    } else if (ch === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++
      row.push(cell)
      if (row.some((v) => v.trim() !== '')) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }

  row.push(cell)
  if (row.some((v) => v.trim() !== '')) rows.push(row)
  if (!rows.length) return []

  const headers = rows[0].map((h) => normalizeHeader(h))
  return rows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, idx) => {
      record[header] = values[idx]?.trim() ?? ''
    })
    return record
  })
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function pick(record, keys) {
  for (const key of keys) {
    const value = record[normalizeHeader(key)]
    if (value !== undefined && value !== '') return value
  }
  return ''
}

function number(record, keys) {
  const raw = pick(record, keys)
  if (!raw) return null
  const parsed = Number(String(raw).replace(/[^\d.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

function isUsTeam(record) {
  const values = [
    pick(record, ['team']),
    pick(record, ['noc']),
    pick(record, ['country']),
    pick(record, ['nationality']),
  ].map((v) => v.toLowerCase())

  return values.some((value) =>
    value === 'usa' ||
    value === 'us' ||
    value === 'united states' ||
    value === 'united states of america' ||
    value.includes('team usa')
  )
}

function gamesType(record, sport) {
  const raw = pick(record, ['games_type', 'competition_type', 'program', 'games', 'source_type']).toLowerCase()
  if (raw.includes('para')) return 'Paralympic'
  if (sport.toLowerCase().includes('para') || pick(record, ['classification', 'para_classification'])) return 'Paralympic'
  return 'Olympic'
}

function classify(height, weight, sport) {
  const bmi = height && weight ? weight / Math.pow(height / 100, 2) : null
  const s = sport.toLowerCase()

  if (POWER_SPORTS.some((term) => s.includes(term))) return 'power'
  if (ENDURANCE_SPORTS.some((term) => s.includes(term))) return 'endurance'
  if (TECHNICAL_SPORTS.some((term) => s.includes(term))) return 'technical'
  if (HYBRID_SPORTS.some((term) => s.includes(term))) return 'hybrid'
  if (bmi !== null && bmi > 25) return 'power'
  if (bmi !== null && bmi < 21.8) return 'endurance'
  return 'hybrid'
}

function mean(values) {
  const clean = values.filter((v) => Number.isFinite(v))
  if (!clean.length) return null
  return Math.round(clean.reduce((sum, v) => sum + v, 0) / clean.length)
}

function topCounts(values, limit = 5) {
  const counts = new Map()
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

function era(year) {
  if (!Number.isFinite(year)) return 'unknown era'
  const start = Math.floor(year / 20) * 20
  return `${start}s-${start + 19}s`
}

function buildArchive(records) {
  const usable = records
    .filter(isUsTeam)
    .map((record) => {
      const height = number(record, ['height_cm', 'height'])
      const weight = number(record, ['weight_kg', 'weight'])
      const age = number(record, ['age'])
      const year = number(record, ['year'])
      const sport = pick(record, ['sport', 'event', 'discipline']) || 'Unspecified sport'
      const type = gamesType(record, sport)
      return {
        age,
        archetype: classify(height, weight, sport),
        games_type: type,
        height_cm: height,
        hometown_region: pick(record, ['hometown_region', 'region', 'state']),
        sport,
        weight_kg: weight,
        year,
      }
    })
    .filter((row) => row.height_cm !== null || row.weight_kg !== null || row.sport !== 'Unspecified sport')

  const clusters = []
  for (const archetype of ['power', 'endurance', 'technical', 'hybrid']) {
    const rows = usable.filter((row) => row.archetype === archetype)
    if (rows.length < MIN_CLUSTER_SIZE) continue

    const olympic = rows.filter((row) => row.games_type === 'Olympic').length
    const paralympic = rows.filter((row) => row.games_type === 'Paralympic').length
    const years = rows.map((row) => row.year).filter(Number.isFinite)
    const topSports = topCounts(rows.map((row) => row.sport))
    const topRegions = topCounts(rows.map((row) => row.hometown_region), 3)

    clusters.push({
      archetype,
      archive_id: `PUB-${archetype.slice(0, 3).toUpperCase()}-${String(rows.length).padStart(3, '0')}`,
      basis: 'Public Team USA-scope aggregate rows filtered, anonymized, and clustered by biometric and sport-pattern signals.',
      count: rows.length,
      olympic_count: olympic,
      paralympic_count: paralympic,
      time_span: years.length ? `${Math.min(...years)}-${Math.max(...years)}` : 'public aggregate',
      average_height_cm: mean(rows.map((row) => row.height_cm)),
      average_weight_kg: mean(rows.map((row) => row.weight_kg)),
      average_age: mean(rows.map((row) => row.age)),
      eras: topCounts(rows.map((row) => era(row.year)), 4),
      sports: topSports,
      hometown_regions: topRegions,
    })
  }

  return {
    schema_version: 1,
    source_type: 'public_aggregate',
    generated_at: new Date().toISOString(),
    row_count: records.length,
    us_filtered_count: usable.length,
    privacy: {
      names_removed: true,
      min_cluster_size: MIN_CLUSTER_SIZE,
      suppressed_small_clusters: true,
      output_level: 'anonymous aggregate archetype clusters',
    },
    clusters,
  }
}

const files = fs.existsSync(RAW_DIR)
  ? fs.readdirSync(RAW_DIR).filter((file) => file.endsWith('.csv'))
  : []

if (!files.length) {
  const emptyArchive = {
    schema_version: 1,
    source_type: 'empty',
    generated_at: null,
    row_count: 0,
    us_filtered_count: 0,
    privacy: {
      names_removed: true,
      min_cluster_size: MIN_CLUSTER_SIZE,
      suppressed_small_clusters: true,
      output_level: 'anonymous aggregate archetype clusters',
    },
    clusters: [],
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(emptyArchive, null, 2)}\n`)
  console.warn(`No raw public CSV files found in ${path.relative(ROOT, RAW_DIR)}.`)
  console.warn(`Wrote empty archive to ${path.relative(ROOT, OUT_FILE)}.`)
  process.exit(0)
}

const records = files.flatMap((file) => parseCsv(fs.readFileSync(path.join(RAW_DIR, file), 'utf8')))
const archive = buildArchive(records)

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, `${JSON.stringify(archive, null, 2)}\n`)

console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}`)
console.log(`Input rows: ${archive.row_count}`)
console.log(`US-filtered rows: ${archive.us_filtered_count}`)
console.log(`Clusters: ${archive.clusters.length}`)
