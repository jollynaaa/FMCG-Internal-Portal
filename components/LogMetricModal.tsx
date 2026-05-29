'use client'

import { useEffect, useState } from 'react'
import { useLogMetricForm } from '@/hooks/useLogMetricForm'
import type { UserRole } from '@/lib/types'

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'number',
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-[#666666] uppercase tracking-widest font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === 'number' ? '0' : undefined}
        className={`bg-[#030303] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333333] outline-none transition-colors focus:border-indigo-500/60 ${
          error ? 'border-red-500/50' : 'border-[#1f1f23]'
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default function LogMetricModal({ role }: { role: UserRole }) {
  const [isOpen, setIsOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const { fields, errors, submitError, isSubmitting, handleChange, handleSubmit, reset } =
    useLogMetricForm(() => {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setIsOpen(false)
      }, 1800)
    })

  useEffect(() => {
    function handleOpenEvent() {
      setIsOpen(true)
    }
    window.addEventListener('open-log-metric', handleOpenEvent)
    return () => window.removeEventListener('open-log-metric', handleOpenEvent)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        reset()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, reset])

  if (!isOpen) return null

  const canLog = role === 'admin' || role === 'sales_rep'

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={e => {
        if (e.target === e.currentTarget) {
          setIsOpen(false)
          reset()
        }
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative ml-auto h-full w-full max-w-md bg-[#09090b] border-l border-[#1f1f23] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f23]">
          <div>
            <h2 className="text-base font-medium text-white">Log Weekly Metric</h2>
            <p className="text-xs text-[#666666] mt-0.5">Record your outreach activity</p>
          </div>
          <button
            onClick={() => { setIsOpen(false); reset() }}
            className="text-[#444444] hover:text-white transition-colors p-1 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!canLog ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm text-[#666666] text-center">
              Viewer accounts cannot log metrics. Contact your admin.
            </p>
          </div>
        ) : success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-white font-medium">Metrics logged successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            <div>
              <p className="text-[11px] text-[#444444] uppercase tracking-widest mb-4 font-medium">
                Outreach Activity
              </p>
              <div className="flex flex-col gap-4">
                <InputField
                  label="Email Outreach"
                  name="email_count"
                  value={fields.email_count}
                  onChange={handleChange}
                  error={errors.email_count}
                  placeholder="0"
                />
                <InputField
                  label="LinkedIn Touches"
                  name="linkedin_count"
                  value={fields.linkedin_count}
                  onChange={handleChange}
                  error={errors.linkedin_count}
                  placeholder="0"
                />
                <InputField
                  label="Cold Calls"
                  name="cold_call_count"
                  value={fields.cold_call_count}
                  onChange={handleChange}
                  error={errors.cold_call_count}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="border-t border-[#1f1f23] pt-5">
              <p className="text-[11px] text-[#444444] uppercase tracking-widest mb-4 font-medium">
                New Deal (Optional)
              </p>
              <div className="flex flex-col gap-4">
                <InputField
                  label="Client Name"
                  name="client_name"
                  type="text"
                  value={fields.client_name}
                  onChange={handleChange}
                  placeholder="e.g. Meridian Retail Group"
                />
                <InputField
                  label="Estimated GP (SGD)"
                  name="estimated_gp"
                  value={fields.estimated_gp}
                  onChange={handleChange}
                  error={errors.estimated_gp}
                  placeholder="0"
                />
              </div>
            </div>

            {submitError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-3 transition-colors"
              >
                {isSubmitting ? 'Logging...' : 'Log Metrics'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
