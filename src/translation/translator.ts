import Anthropic from '@anthropic-ai/sdk'

import { LOCALES, type LocaleCode } from '../constants/locales'

export type Translator = {
  name: string
  translate: (texts: string[], target: LocaleCode, glossary: string[]) => Promise<string[]>
}

// ANTHROPIC_API_KEY가 없을 때 쓰는 개발용 가짜 번역기. "[ko] 원문"처럼 표시만 한다.
const mockTranslator: Translator = {
  name: 'mock',
  translate: async (texts, target) => texts.map((text) => `[${target}] ${text}`),
}

const MODEL = process.env.TRANSLATION_MODEL || 'claude-opus-5-5'
const MAX_CHARS_PER_REQUEST = 12000

const languageName = (code: LocaleCode) => {
  const locale = LOCALES.find((l) => l.code === code)
  return locale ? `${locale.label} (${code})` : code
}

const systemPrompt = (target: LocaleCode, glossary: string[]) =>
  [
    `You localize website copy for CUBIT ENTERTAINMENT, a global entertainment company whose artists are AI talents.`,
    `Translate each English string into ${languageName(target)}.`,
    `Keep the meaning and the polished, confident brand voice. Use natural wording a native speaker would expect on a professional entertainment website, not a literal word-for-word rendering.`,
    `Preserve leading and trailing spaces, numbers, URLs, email addresses, and any markup exactly.`,
    glossary.length
      ? `Keep these terms exactly as written, untranslated: ${glossary.map((term) => JSON.stringify(term)).join(', ')}.`
      : '',
    `Return one translation per input string, in the same order.`,
  ]
    .filter(Boolean)
    .join('\n')

// 긴 글은 여러 번에 나눠 보낸다
const chunk = (texts: string[]) => {
  const chunks: string[][] = []
  let current: string[] = []
  let size = 0
  for (const text of texts) {
    if (current.length && size + text.length > MAX_CHARS_PER_REQUEST) {
      chunks.push(current)
      current = []
      size = 0
    }
    current.push(text)
    size += text.length
  }
  if (current.length) chunks.push(current)
  return chunks
}

const claudeTranslator = (client: Anthropic): Translator => ({
  name: `claude (${MODEL})`,
  translate: async (texts, target, glossary) => {
    const results: string[] = []
    for (const part of chunk(texts)) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: {
          effort: 'low',
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              properties: { translations: { type: 'array', items: { type: 'string' } } },
              required: ['translations'],
              additionalProperties: false,
            },
          },
        },
        system: systemPrompt(target, glossary),
        messages: [{ role: 'user', content: JSON.stringify({ strings: part }) }],
      })

      if (response.stop_reason === 'refusal') {
        throw new Error(`번역이 거절되었습니다 (${response.stop_details?.category ?? '사유 없음'})`)
      }
      if (response.stop_reason === 'max_tokens') {
        throw new Error('번역 결과가 너무 길어 잘렸습니다.')
      }
      const text = response.content.find((block) => block.type === 'text')
      if (!text || text.type !== 'text') throw new Error('번역 결과가 비어 있습니다.')

      const { translations } = JSON.parse(text.text) as { translations: string[] }
      if (translations.length !== part.length) {
        throw new Error(`번역 개수가 맞지 않습니다 (보냄 ${part.length}, 받음 ${translations.length})`)
      }
      results.push(...translations)
    }
    return results
  },
})

let cached: Translator | undefined

export const getTranslator = (): Translator => {
  if (cached) return cached
  cached = process.env.ANTHROPIC_API_KEY ? claudeTranslator(new Anthropic()) : mockTranslator
  return cached
}
