import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { image, mediaType } = await req.json()

  if (!image || !mediaType) {
    return NextResponse.json({ error: '이미지가 없습니다.' }, { status: 400 })
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: image,
            },
          },
          {
            type: 'text',
            text: `이 영수증 이미지에서 다음 정보를 추출해주세요.

지출 카테고리 목록 (반드시 이 중 하나만 선택):
- FOOD: 식당, 음식점, 배달음식
- CAFE: 카페, 커피, 음료
- TRANSPORT: 교통, 택시, 버스, 지하철, 주유
- HOUSING: 주거, 관리비, 임대
- SHOPPING: 쇼핑, 의류, 잡화
- MEDICAL: 병원, 약국, 의료
- EDUCATION: 학원, 교육, 책
- LEISURE: 영화, 게임, 스포츠, 여가
- ETC: 기타

다음 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON만:
{
  "amount": 숫자(원화, 숫자만),
  "category": "카테고리 코드",
  "description": "가게명 또는 내용",
  "date": "YYYY-MM-DD"
}

날짜가 보이지 않으면 오늘 날짜(${new Date().toISOString().split('T')[0]})를 사용하세요.
금액이 여러 개면 합계 금액을 사용하세요.`,
          },
        ],
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const json = JSON.parse(text.trim())
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ error: '영수증을 인식하지 못했습니다.' }, { status: 422 })
  }
}
