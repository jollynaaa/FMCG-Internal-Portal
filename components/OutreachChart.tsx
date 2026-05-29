'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Card from './Card'
import type { ChartWeek } from '@/lib/types'

interface TooltipPayload {
  name: string
  value: number
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#666666] mb-2 uppercase tracking-widest font-medium">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-[#888888]">{entry.name}</span>
          <span className="ml-auto text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function OutreachChart({ data }: { data: ChartWeek[] }) {
  return (
    <Card className="p-0 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1f1f23]">
        <h2 className="text-sm font-medium text-white">Outreach Trends</h2>
        <p className="text-xs text-[#666666] mt-0.5">Weekly breakdown by channel</p>
      </div>
      <div className="p-4 flex-1">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={14} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f1f23"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: '#666666', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#666666', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              formatter={(value) => (
                <span style={{ color: '#888888' }}>{value}</span>
              )}
            />
            <Bar dataKey="email" name="Email" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="linkedin" name="LinkedIn" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="coldCall" name="Cold Call" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
