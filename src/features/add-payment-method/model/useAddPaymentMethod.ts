import { addPaymentMethod } from '@/features/add-payment-method/api/addPaymentMethod'
import {
  type AddPaymentMethodInput,
  addPaymentMethodSchema,
} from '@/features/add-payment-method/model/payment.schema'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface UseAddPaymentMethodOptions {
  isFirst: boolean
  onSuccess: () => void
}

export function useAddPaymentMethod({ isFirst, onSuccess }: UseAddPaymentMethodOptions) {
  const queryClient = useQueryClient()

  const [type, setType] = useState<'card' | 'account'>('card')
  const [bankName, setBankName] = useState('')
  const [name, setName] = useState('')
  const [lastFour, setLastFour] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof AddPaymentMethodInput, string>>>({})

  const { mutate, isPending } = useMutation({
    mutationFn: (input: AddPaymentMethodInput) => addPaymentMethod(input, isFirst),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENT_METHODS.all })
      resetForm()
      onSuccess()
    },
  })

  const resetForm = () => {
    setType('card')
    setBankName('')
    setName('')
    setLastFour('')
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = addPaymentMethodSchema.safeParse({ type, bankName, name, lastFour })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddPaymentMethodInput, string>> = {}
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof AddPaymentMethodInput
        fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    mutate(result.data)
  }

  return {
    type,
    setType,
    bankName,
    setBankName,
    name,
    setName,
    lastFour,
    setLastFour,
    errors,
    isPending,
    handleSubmit,
    resetForm,
  }
}
