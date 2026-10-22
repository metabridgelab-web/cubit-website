import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  CollectionSlug,
  Config,
  GlobalAfterChangeHook,
  GlobalBeforeChangeHook,
  Field,
  GlobalSlug,
  PayloadRequest,
  Plugin,
  RequestContext,
  TaskConfig,
} from 'payload'

import { createLocalReq } from 'payload'

import { DEFAULT_LOCALE, LOCALE_OPTIONS, TRANSLATION_TARGETS, type LocaleCode } from '../constants/locales'
import { collectTexts, getAt, hasLocalizedFields, hashText, setAt, type TextEntry } from './extract'
import { getTranslator } from './translator'

// 자동 번역 흐름
// 1. 영어(원문)를 저장하면 바뀐 글이 있는 언어를 "번역 대기"로 표시하고 번역 작업을 예약한다.
// 2. 번역 작업은 바뀐 글만 번역해서 각 언어에 넣고 "자동 번역"으로 표시한다.
// 3. 사람이 어떤 언어를 직접 고치면 "검수 완료"가 되고, 이후 원문이 바뀌어도 덮어쓰지 않고 "원문 변경됨"으로만 표시한다.
// 4. 상태를 "다시 번역"으로 바꾸고 저장하면 그 언어를 다시 자동 번역한다.

type Status = 'pending' | 'auto' | 'reviewed' | 'outdated' | 'failed'
type StatusRow = { id?: string; locale: LocaleCode; status: Status; updatedAt?: string | null; note?: string | null }
type Meta = Partial<Record<LocaleCode, Record<string, string>>>
type Target = { kind: 'collection' | 'global'; slug: string }
type Doc = Record<string, unknown> & { id?: number | string; _status?: string }

export const TRANSLATE_TASK = 'translateDocument'

const statusField: Field = {
  name: 'translationStatus',
  label: '번역 상태',
  type: 'array',
  labels: { singular: '언어', plural: '언어' },
  admin: {
    position: 'sidebar',
    description: '영어 원문을 저장하면 자동 번역됩니다. 다시 번역하려면 상태를 "다시 번역"으로 바꾸고 저장하세요.',
  },
  custom: { translate: false },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'locale', label: '언어', type: 'select', required: true, options: LOCALE_OPTIONS, admin: { readOnly: true, width: '45%' } },
        {
          name: 'status',
          label: '상태',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          admin: { width: '55%' },
          options: [
            { label: '다시 번역 / 번역 대기', value: 'pending' },
            { label: '자동 번역', value: 'auto' },
            { label: '검수 완료', value: 'reviewed' },
            { label: '원문 변경됨', value: 'outdated' },
            { label: '번역 실패', value: 'failed' },
          ],
        },
      ],
    },
    { name: 'updatedAt', label: '처리 시각', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'note', label: '메모', type: 'text', admin: { readOnly: true } },
  ],
}

const metaField: Field = {
  name: 'translationMeta',
  type: 'json',
  admin: { hidden: true },
  custom: { translate: false },
}

const hashMap = (entries: TextEntry[]) => Object.fromEntries(entries.map((e) => [e.key, hashText(e.text)]))

// 같은 요청(req)으로 다른 언어를 읽으면 req.locale이 바뀐다. 저장 중인 언어가 바뀌지 않도록 원래대로 돌려놓는다.
const keepLocale = async <T>(req: PayloadRequest, run: () => Promise<T>): Promise<T> => {
  const { locale, fallbackLocale } = req
  try {
    return await run()
  } finally {
    req.locale = locale
    req.fallbackLocale = fallbackLocale
  }
}

const getEnabledTargets = async (req: PayloadRequest): Promise<LocaleCode[]> => {
  if (req.context.enabledTargets) return req.context.enabledTargets as LocaleCode[]
  const settings = await keepLocale(req, () =>
    req.payload.findGlobal({ slug: 'site-settings', depth: 0, req, overrideAccess: true }),
  )
  const enabled = (settings.enabledLocales as LocaleCode[] | null | undefined) ?? TRANSLATION_TARGETS
  const targets = TRANSLATION_TARGETS.filter((code) => enabled.includes(code))
  req.context.enabledTargets = targets
  return targets
}

// 켜져 있는 언어마다 상태 줄이 하나씩 있도록 맞춘다
const normalizeRows = (rows: unknown, targets: LocaleCode[]): StatusRow[] => {
  const existing = Array.isArray(rows) ? (rows as StatusRow[]) : []
  return targets.map((locale) => existing.find((row) => row.locale === locale) ?? { locale, status: 'pending' })
}

const loadDoc = (req: PayloadRequest, target: Target, id: Doc['id'], locale: LocaleCode): Promise<Doc> =>
  keepLocale(req, () => readDoc(req, target, id, locale))

const readDoc = async (req: PayloadRequest, target: Target, id: Doc['id'], locale: LocaleCode): Promise<Doc> => {
  if (target.kind === 'global') {
    return (await req.payload.findGlobal({
      slug: target.slug as GlobalSlug,
      locale,
      fallbackLocale: false,
      depth: 0,
      draft: true,
      req,
      overrideAccess: true,
    })) as Doc
  }
  return (await req.payload.findByID({
    collection: target.slug as CollectionSlug,
    id: id as string,
    locale,
    fallbackLocale: false,
    depth: 0,
    draft: true,
    req,
    overrideAccess: true,
  })) as unknown as Doc
}

const saveDoc = (req: PayloadRequest, target: Target, source: Doc, locale: LocaleCode, data: Doc) =>
  keepLocale(req, () => writeDoc(req, target, source, locale, data))

const writeDoc = async (req: PayloadRequest, target: Target, source: Doc, locale: LocaleCode, data: Doc) => {
  const context: RequestContext = { translating: true }
  if (target.kind === 'global') {
    await req.payload.updateGlobal({ slug: target.slug as GlobalSlug, locale, data: data as never, depth: 0, context, req, overrideAccess: true })
    return
  }
  await req.payload.update({
    collection: target.slug as CollectionSlug,
    id: source.id as string,
    locale,
    data: data as never,
    depth: 0,
    draft: source._status === 'draft',
    context,
    req,
    overrideAccess: true,
  })
}

const fieldsOf = (req: PayloadRequest, target: Target): Field[] =>
  target.kind === 'global'
    ? (req.payload.globals.config.find((g) => g.slug === target.slug)?.fields ?? [])
    : (req.payload.collections[target.slug as CollectionSlug]?.config.fields ?? [])

// 저장 직전: 어떤 언어를 다시 번역해야 하는지 표시한다
const markStatuses = async (args: {
  target: Target
  fields: Field[]
  data: Doc
  originalDoc?: Doc
  req: PayloadRequest
  context: RequestContext
}) => {
  const { target, fields, data, originalDoc, req, context } = args
  if (context.translating || req.context.translating) return data
  const locale = req.locale as LocaleCode | 'all' | undefined
  if (!locale || locale === 'all') return data

  const targets = await getEnabledTargets(req)
  const rows = normalizeRows(data.translationStatus ?? originalDoc?.translationStatus, targets)
  const meta: Meta = { ...((originalDoc?.translationMeta as Meta | undefined) ?? {}) }
  const now = new Date().toISOString()

  if (locale === DEFAULT_LOCALE) {
    const hashes = hashMap(collectTexts(fields, data))
    for (const row of rows) {
      if (row.status === 'pending') continue
      const previous = meta[row.locale] ?? {}
      const changed = Object.keys(hashes).some((key) => previous[key] !== hashes[key])
      if (!changed) continue
      row.status = row.status === 'reviewed' || row.status === 'outdated' ? 'outdated' : 'pending'
      row.updatedAt = now
    }
  } else {
    // 사람이 번역본을 직접 고쳤다: 검수 완료로 보고, 지금 원문 기준으로 기록해 둔다
    const row = rows.find((r) => r.locale === locale)
    if (row) {
      row.status = 'reviewed'
      row.updatedAt = now
      row.note = req.user ? `검수: ${(req.user as { name?: string }).name ?? req.user.email}` : null
    }
    if (originalDoc && (target.kind === 'global' || originalDoc.id != null)) {
      const source = await loadDoc(req, target, originalDoc.id, DEFAULT_LOCALE)
      meta[locale] = hashMap(collectTexts(fields, source))
    }
  }

  data.translationStatus = rows
  data.translationMeta = meta
  // 훅마다 받는 context는 서로 다른 객체라서, 저장 후 훅까지 전달할 표시는 req.context에 둔다.
  // 번역 작업은 원문(영어)을 저장할 때만 예약한다.
  if (locale === DEFAULT_LOCALE && rows.some((row) => row.status === 'pending')) req.context.queueTranslation = true
  return data
}

const queueTranslation = async (req: PayloadRequest, target: Target, id: Doc['id'], context: RequestContext) => {
  if (context.translating || req.context.translating || !req.context.queueTranslation) return
  req.context.queueTranslation = false
  await req.payload.jobs.queue({
    task: TRANSLATE_TASK,
    input: { kind: target.kind, slug: target.slug, id: id == null ? '' : String(id) },
    req,
  })
}

// 번역 작업: "번역 대기" 언어만 바뀐 글을 번역해서 넣는다
const translateTask: TaskConfig = {
  slug: TRANSLATE_TASK,
  label: '자동 번역',
  retries: 2,
  // 같은 문서의 번역 작업은 한 번에 하나만 돌고, 아직 시작 안 한 이전 작업은 새 작업으로 대체한다
  concurrency: {
    key: ({ input }) => {
      const { kind, slug, id } = input as { kind: string; slug: string; id?: string }
      return `translate:${kind}:${slug}:${id ?? ''}`
    },
    exclusive: true,
    supersedes: true,
  },
  inputSchema: [
    { name: 'kind', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'id', type: 'text' },
  ],
  handler: async ({ input: rawInput, req: jobRunnerReq }) => {
    // 작업 실행기는 동시에 도는 여러 작업에 같은 req를 넘긴다. 언어 설정이 섞이지 않도록 이 작업 전용 req를 만든다.
    const req = await createLocalReq({ context: { translating: true } }, jobRunnerReq.payload)
    const input = rawInput as { kind: Target['kind']; slug: string; id?: string }
    const target: Target = { kind: input.kind, slug: input.slug }
    const fields = fieldsOf(req, target)
    const source = await loadDoc(req, target, input.id, DEFAULT_LOCALE)
    const entries = collectTexts(fields, source)
    const hashes = hashMap(entries)
    const topKeys = [...new Set(entries.map((entry) => entry.path[0] as string))]

    const glossary = (
      await req.payload.find({ collection: 'glossary', limit: 1000, depth: 0, pagination: false, req, overrideAccess: true })
    ).docs.map((doc) => doc.term)

    const rows = normalizeRows(source.translationStatus, await getEnabledTargets(req))
    const meta: Meta = { ...((source.translationMeta as Meta | undefined) ?? {}) }
    const translator = getTranslator()

    for (const row of rows.filter((r) => r.status === 'pending')) {
      try {
        const current = await loadDoc(req, target, source.id, row.locale)
        const previous = meta[row.locale] ?? {}
        const todo = entries.filter((entry) => previous[entry.key] !== hashes[entry.key] || !getAt(current, entry.path))
        const uniqueTexts = [...new Set(todo.map((entry) => entry.text))]
        const translated = uniqueTexts.length ? await translator.translate(uniqueTexts, row.locale, glossary) : []
        const byText = new Map(uniqueTexts.map((text, index) => [text, translated[index]]))

        // 원문 구조를 그대로 복사하고, 글 조각만 번역본(바뀌지 않은 곳은 기존 번역)으로 바꾼다
        const draft = structuredClone(source)
        const todoKeys = new Set(todo.map((entry) => entry.key))
        for (const entry of entries) {
          setAt(draft, entry.path, todoKeys.has(entry.key) ? byText.get(entry.text) : getAt(current, entry.path))
        }

        row.status = 'auto'
        row.updatedAt = new Date().toISOString()
        row.note = `${translator.name} · ${todo.length}개 번역`
        meta[row.locale] = hashes

        const data: Doc = Object.fromEntries(topKeys.map((key) => [key, draft[key]]))
        data.translationStatus = rows
        data.translationMeta = meta
        await saveDoc(req, target, source, row.locale, data)
      } catch (error) {
        row.status = 'failed'
        row.updatedAt = new Date().toISOString()
        row.note = error instanceof Error ? error.message.slice(0, 200) : '알 수 없는 오류'
        req.payload.logger.error({ err: error, msg: `번역 실패: ${target.slug} ${source.id ?? ''} → ${row.locale}` })
        await saveDoc(req, target, source, DEFAULT_LOCALE, { translationStatus: rows, translationMeta: meta })
      }
    }
    return { output: {} }
  },
}

// 번역할 칸이 있는 모든 컬렉션·전역 설정에 번역 상태 칸과 자동 번역 훅을 붙인다
export const translationPlugin =
  (options: { exclude?: string[] } = {}): Plugin =>
  (config: Config): Config => {
    const exclude = new Set(options.exclude ?? [])

    const collections = (config.collections ?? []).map((collection): CollectionConfig => {
      if (exclude.has(collection.slug) || !hasLocalizedFields(collection.fields)) return collection
      const target: Target = { kind: 'collection', slug: collection.slug }
      const beforeChange: CollectionBeforeChangeHook = ({ data, originalDoc, req, context }) =>
        markStatuses({ target, fields: collection.fields, data, originalDoc, req, context })
      const afterChange: CollectionAfterChangeHook = async ({ doc, req, context }) => {
        await queueTranslation(req, target, doc.id, context)
        return doc
      }
      return {
        ...collection,
        fields: [...collection.fields, statusField, metaField],
        hooks: {
          ...collection.hooks,
          beforeChange: [...(collection.hooks?.beforeChange ?? []), beforeChange],
          afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
        },
      }
    })

    const globals = (config.globals ?? []).map((global) => {
      if (exclude.has(global.slug) || !hasLocalizedFields(global.fields)) return global
      const target: Target = { kind: 'global', slug: global.slug }
      const beforeChange: GlobalBeforeChangeHook = ({ data, originalDoc, req, context }) =>
        markStatuses({ target, fields: global.fields, data, originalDoc, req, context })
      const afterChange: GlobalAfterChangeHook = async ({ doc, req, context }) => {
        await queueTranslation(req, target, undefined, context)
        return doc
      }
      return {
        ...global,
        fields: [...global.fields, statusField, metaField],
        hooks: {
          ...global.hooks,
          beforeChange: [...(global.hooks?.beforeChange ?? []), beforeChange],
          afterChange: [...(global.hooks?.afterChange ?? []), afterChange],
        },
      }
    })

    return {
      ...config,
      collections,
      globals,
      jobs: {
        ...config.jobs,
        tasks: [...(config.jobs?.tasks ?? []), translateTask],
      },
    }
  }
