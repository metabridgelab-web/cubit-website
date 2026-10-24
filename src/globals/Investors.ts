import type { Access, GlobalConfig } from 'payload'

import { anyone, hasRole } from '../access'
import { LOCALE_OPTIONS } from '../constants/locales'

const canEditInvestors: Access = ({ req }) => hasRole(req, 'disclosure', 'translator')
const pdf = { type: 'upload', relationTo: 'media', filterOptions: { mimeType: { equals: 'application/pdf' } } } as const

// INVESTORS (/investors): 토큰 정보 · 백서 · 로드맵 · 보안 감사 · 공식 주소 · 위험 고지.
// "공개" 스위치를 켜기 전에는 메뉴와 페이지가 방문자에게 보이지 않는다 (법률 검토 후 켜기).
// 공시는 따로 "공시" 목록에서 관리한다.
export const Investors: GlobalConfig = {
  slug: 'investors',
  label: '투자자 정보',
  admin: { group: '투자자 정보' },
  access: { read: anyone, update: canEditInvestors },
  fields: [
    {
      name: 'visible',
      label: '투자자 정보 공개',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '켜면 INVESTORS 메뉴와 페이지가 방문자에게 보입니다. 가상자산 전문 법률 검토를 마친 뒤에 켜세요.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '프로젝트 개요',
          fields: [
            { name: 'intro', label: '첫 문단', type: 'textarea', localized: true },
            {
              name: 'utilities',
              label: '토큰이 쓰이는 곳',
              type: 'array',
              admin: { description: '예: 팬 투표 · 굿즈 · 콘텐츠 이용. 수익 보장이나 가격 전망 표현은 쓰지 마세요.' },
              fields: [
                { name: 'title', label: '이름', type: 'text', required: true, localized: true },
                { name: 'description', label: '설명', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: '토큰 정보',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'tokenName', label: '토큰 이름', type: 'text', admin: { width: '33%' } },
                { name: 'symbol', label: '심볼', type: 'text', admin: { width: '33%', placeholder: '$CUBIT' } },
                { name: 'totalSupply', label: '발행 총량', type: 'text', admin: { width: '33%', placeholder: '1,000,000,000' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'network', label: '네트워크', type: 'text', admin: { width: '50%', placeholder: 'Ethereum · BNB Chain …' } },
                {
                  name: 'listingStatus',
                  label: '상장 현황',
                  type: 'text',
                  localized: true,
                  defaultValue: 'Listing planned',
                  admin: { width: '50%', description: '상장 일정 · 거래소가 확정되기 전에는 "Listing planned"로 두세요.' },
                },
              ],
            },
            {
              name: 'allocation',
              label: '배분 비율',
              type: 'array',
              admin: { description: '원형 그래프로 보입니다. 비율 합계가 100이 되게 넣으세요.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: '항목', type: 'text', required: true, localized: true, admin: { width: '70%' } },
                    { name: 'percent', label: '비율 (%)', type: 'number', required: true, min: 0, max: 100, admin: { width: '30%' } },
                  ],
                },
              ],
            },
            {
              name: 'vesting',
              label: '락업 · 배분 일정',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'category', label: '항목', type: 'text', required: true, localized: true, admin: { width: '20%' } },
                    { name: 'tgeUnlock', label: '최초 해제', type: 'text', admin: { width: '20%', placeholder: '0%' } },
                    { name: 'cliff', label: '락업 기간', type: 'text', localized: true, admin: { width: '20%', placeholder: '12 months' } },
                    { name: 'vestingPeriod', label: '분할 해제', type: 'text', localized: true, admin: { width: '20%', placeholder: '36 months' } },
                    { name: 'amount', label: '수량', type: 'text', admin: { width: '20%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '백서',
          fields: [
            {
              name: 'whitepapers',
              label: '백서 파일',
              type: 'array',
              admin: { description: '언어별 PDF와 버전을 올립니다. 새 버전을 올려도 이전 버전은 지우지 말고 남겨 두세요 (버전 기록).' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'language', label: '언어', type: 'select', required: true, defaultValue: 'en', options: LOCALE_OPTIONS, admin: { width: '25%' } },
                    { name: 'version', label: '버전', type: 'text', required: true, admin: { width: '25%', placeholder: 'v1.0' } },
                    { name: 'date', label: '날짜', type: 'date', admin: { width: '25%', date: { pickerAppearance: 'dayOnly' } } },
                    { ...pdf, name: 'file', label: 'PDF', required: true, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '로드맵',
          fields: [
            {
              name: 'roadmap',
              label: '단계',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'period', label: '시기', type: 'text', required: true, admin: { width: '30%', placeholder: '2026 Q4' } },
                    {
                      name: 'status',
                      label: '상태',
                      type: 'select',
                      required: true,
                      defaultValue: 'planned',
                      options: [
                        { label: '완료', value: 'done' },
                        { label: '진행 중', value: 'in-progress' },
                        { label: '예정', value: 'planned' },
                      ],
                      admin: { width: '30%' },
                    },
                  ],
                },
                { name: 'title', label: '제목', type: 'text', required: true, localized: true },
                { name: 'description', label: '설명', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: '보안 감사',
          fields: [
            {
              name: 'audits',
              label: '감사 보고서',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'auditor', label: '감사 기관', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'date', label: '날짜', type: 'date', admin: { width: '30%', date: { pickerAppearance: 'dayOnly' } } },
                    { ...pdf, name: 'report', label: '보고서 PDF', admin: { width: '30%' } },
                  ],
                },
                { name: 'scope', label: '감사 범위', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: '공식 주소',
          fields: [
            {
              name: 'contracts',
              label: '공식 컨트랙트 주소',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: '이름', type: 'text', required: true, admin: { width: '30%', placeholder: 'Main contract' } },
                    { name: 'network', label: '네트워크', type: 'text', admin: { width: '20%' } },
                    { name: 'address', label: '주소', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'wallets',
              label: '공식 지갑',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: '이름', type: 'text', required: true, admin: { width: '30%', placeholder: 'Treasury' } },
                    { name: 'network', label: '네트워크', type: 'text', admin: { width: '20%' } },
                    { name: 'address', label: '주소', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'securityAlert',
              label: '사기 주의 문구',
              type: 'textarea',
              localized: true,
              defaultValue:
                'Beware of fake tokens and phishing. Our token is not listed on any exchange yet, so any token offered for sale under our name is fraudulent. We will never contact you directly to ask for funds or to offer a private sale. Always check addresses on this page before any transaction.',
            },
          ],
        },
        {
          label: '위험 고지',
          fields: [
            {
              name: 'riskNotice',
              label: '위험 고지 · 법적 고지',
              type: 'textarea',
              localized: true,
              admin: { rows: 12, description: '초안입니다. 법률 검토를 거친 문구로 바꿔 주세요. 빈 줄로 문단을 나눕니다.' },
              defaultValue:
                'The information on these pages is provided for general information only. It is not an offer or solicitation to buy or sell any digital asset, and it is not financial, investment, legal, or tax advice.\n\nDigital assets are highly volatile and may lose all of their value. Nothing on this site is a promise of profit, a price forecast, or a guarantee of future listing.\n\nRules on digital assets differ by country and may change. Some services may not be available in your country. Please check the laws that apply to you and consult your own professional advisers.',
            },
            {
              name: 'restrictedRegions',
              label: '접속 제한 국가 안내',
              type: 'textarea',
              localized: true,
              admin: { description: '법률 검토 결과 이용을 제한해야 하는 국가가 있으면 적어 주세요.' },
            },
          ],
        },
      ],
    },
  ],
}
