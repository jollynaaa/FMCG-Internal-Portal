'use client'

import { useState } from 'react'
import { logOutreachMetric, logDealClosed } from '@/lib/data'

interface FormFields {
  email_count: string
  linkedin_count: string
  cold_call_count: string
  client_name: string
  estimated_gp: string
}

interface FormErrors {
  email_count?: string
  linkedin_count?: string
  cold_call_count?: string
  estimated_gp?: string
}

const defaultFields: FormFields = {
  email_count: '',
  linkedin_count: '',
  cold_call_count: '',
  client_name: '',
  estimated_gp: '',
}

export function useLogMetricForm(onSuccess: () => void) {
  const [fields, setFields] = useState<FormFields>(defaultFields)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    const intFields: (keyof FormErrors)[] = ['email_count', 'linkedin_count', 'cold_call_count']
    for (const key of intFields) {
      const val = Number(fields[key as keyof FormFields])
      if (fields[key as keyof FormFields] === '') {
        newErrors[key] = 'Required'
      } else if (!Number.isInteger(val) || val < 0) {
        newErrors[key] = 'Must be a non-negative whole number'
      }
    }
    if (fields.estimated_gp !== '') {
      const gp = Number(fields.estimated_gp)
      if (isNaN(gp) || gp < 0) {
        newErrors.estimated_gp = 'Must be a non-negative number'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const metricResult = await logOutreachMetric({
        email_count: Number(fields.email_count),
        linkedin_count: Number(fields.linkedin_count),
        cold_call_count: Number(fields.cold_call_count),
      })
      if (metricResult.error) {
        setSubmitError(metricResult.error)
        return
      }
      if (fields.client_name.trim() && fields.estimated_gp !== '') {
        const dealResult = await logDealClosed({
          client_name: fields.client_name.trim(),
          estimated_gp: Number(fields.estimated_gp),
        })
        if (dealResult.error) {
          setSubmitError(dealResult.error)
          return
        }
      }
      setFields(defaultFields)
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  function reset() {
    setFields(defaultFields)
    setErrors({})
    setSubmitError(null)
  }

  return { fields, errors, submitError, isSubmitting, handleChange, handleSubmit, reset }
}
