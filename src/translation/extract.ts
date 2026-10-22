import { createHash } from 'crypto'
import type { Block, Field } from 'payload'

// 문서에서 번역할 글 조각 하나.
// key: 원문이 바뀌었는지 비교할 때 쓰는 고정 이름 (배열 줄은 순서가 아니라 줄 id로 구분)
// path: 문서 안에서 그 글이 있는 위치 (값을 넣을 때 사용)
export type TextEntry = { key: string; path: (string | number)[]; text: string }

type Data = Record<string, unknown>

export const hashText = (text: string) => createHash('sha1').update(text).digest('hex').slice(0, 16)

const isRecord = (value: unknown): value is Data => typeof value === 'object' && value !== null && !Array.isArray(value)

// 번역에서 제외할 칸: custom.translate === false
const skip = (field: Field) => (field as { custom?: { translate?: boolean } }).custom?.translate === false

// 리치 텍스트(Lexical)의 글자 조각만 골라낸다. 굵게·링크 같은 서식은 그대로 둔다.
const collectLexical = (node: unknown, key: string, path: (string | number)[], out: TextEntry[]) => {
  if (!isRecord(node)) return
  if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) {
    out.push({ key, path: [...path, 'text'], text: node.text })
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => collectLexical(child, `${key}.${index}`, [...path, 'children', index], out))
  }
}

const collectFields = (
  fields: Field[],
  data: Data,
  keyPrefix: string,
  path: (string | number)[],
  out: TextEntry[],
  parentLocalized: boolean,
) => {
  for (const field of fields) {
    if (skip(field)) continue

    // 이름 없는 묶음: 같은 위치의 데이터를 그대로 이어서 본다
    if (field.type === 'row' || field.type === 'collapsible') {
      collectFields(field.fields, data, keyPrefix, path, out, parentLocalized)
      continue
    }
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('name' in tab && tab.name) {
          const tabData = data[tab.name]
          if (isRecord(tabData)) {
            collectFields(tab.fields, tabData, `${keyPrefix}${tab.name}.`, [...path, tab.name], out, parentLocalized || Boolean(tab.localized))
          }
        } else {
          collectFields(tab.fields, data, keyPrefix, path, out, parentLocalized)
        }
      }
      continue
    }
    if (!('name' in field) || !field.name) continue

    const value = data[field.name]
    const localized = parentLocalized || Boolean('localized' in field && field.localized)
    const key = `${keyPrefix}${field.name}`
    const fieldPath = [...path, field.name]

    switch (field.type) {
      case 'text':
      case 'textarea':
        if (localized && typeof value === 'string' && value.trim()) out.push({ key, path: fieldPath, text: value })
        break
      case 'richText':
        if (localized && isRecord(value)) collectLexical(value.root, key, [...fieldPath, 'root'], out)
        break
      case 'group':
        if (isRecord(value)) collectFields(field.fields, value, `${key}.`, fieldPath, out, localized)
        break
      case 'array':
        if (Array.isArray(value)) {
          value.forEach((row, index) => {
            if (isRecord(row)) collectFields(field.fields, row, `${key}.${row.id ?? index}.`, [...fieldPath, index], out, localized)
          })
        }
        break
      case 'blocks':
        if (Array.isArray(value)) {
          value.forEach((row, index) => {
            if (!isRecord(row)) return
            const block = (field.blocks as Block[]).find((b) => b.slug === row.blockType)
            if (block) collectFields(block.fields, row, `${key}.${row.id ?? index}.`, [...fieldPath, index], out, localized)
          })
        }
        break
    }
  }
}

export const collectTexts = (fields: Field[], data: Data): TextEntry[] => {
  const out: TextEntry[] = []
  collectFields(fields, data, '', [], out, false)
  return out
}

export const getAt = (data: unknown, path: (string | number)[]): unknown =>
  path.reduce<unknown>((node, segment) => (node == null ? undefined : (node as Record<string | number, unknown>)[segment]), data)

export const setAt = (data: unknown, path: (string | number)[], value: unknown) => {
  const parent = getAt(data, path.slice(0, -1))
  if (parent != null && typeof parent === 'object') (parent as Record<string | number, unknown>)[path[path.length - 1]] = value
}

// 문서 안에 번역할 칸이 하나라도 있는지 (번역 기능을 붙일 컬렉션 고르기)
export const hasLocalizedFields = (fields: Field[]): boolean =>
  fields.some((field) => {
    if ('localized' in field && field.localized) return true
    if (field.type === 'tabs') return field.tabs.some((tab) => Boolean(tab.localized) || hasLocalizedFields(tab.fields))
    if (field.type === 'blocks') return (field.blocks as Block[]).some((block) => hasLocalizedFields(block.fields))
    if ('fields' in field && Array.isArray(field.fields)) return hasLocalizedFields(field.fields)
    return false
  })
