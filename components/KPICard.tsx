import Card from './Card'
import { formatCurrency } from '@/lib/format'

export default function KPICard({
  label,
  value,
  format = 'number',
  sublabel,
}: {
  label: string
  value: number
  format?: 'number' | 'currency'
  sublabel?: string
}) {
  const display =
    format === 'currency'
      ? formatCurrency(value)
      : value.toLocaleString('en-SG')

  return (
    <Card className="p-6 flex flex-col gap-2">
      <p className="text-[11px] text-[#666666] uppercase tracking-widest font-medium">
        {label}
      </p>
      <p className="text-4xl font-semibold text-white tracking-tight">{display}</p>
      {sublabel && (
        <p className="text-xs text-[#444444] mt-1">{sublabel}</p>
      )}
    </Card>
  )
}
