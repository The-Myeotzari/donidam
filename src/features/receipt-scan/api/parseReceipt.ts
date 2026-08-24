import {
  ReceiptParseResponseSchema,
  type ReceiptParseResponse,
} from '@/features/receipt-scan/model/receipt.schema'

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('image_read_failed'))
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('image_read_failed'))
        return
      }

      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.readAsDataURL(file)
  })
}

export async function parseReceipt(file: File): Promise<ReceiptParseResponse> {
  if (!SUPPORTED_IMAGE_TYPES.some((type) => type === file.type)) {
    throw new Error('unsupported_image_type')
  }

  const image = await fileToBase64(file)
  const response = await fetch('/api/receipt/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, mediaType: file.type }),
  })

  if (!response.ok) throw new Error('receipt_parse_failed')

  const result = ReceiptParseResponseSchema.safeParse(await response.json())
  if (!result.success) throw new Error('invalid_receipt_response')

  return result.data
}
