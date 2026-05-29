'use client'

import dynamic from 'next/dynamic'
import CardSkeleton from './CardSkeleton'
import type { ChartWeek } from '@/lib/types'

const OutreachChart = dynamic(() => import('./OutreachChart'), {
  ssr: false,
  loading: () => <CardSkeleton />,
})

export default function OutreachChartWrapper({ data }: { data: ChartWeek[] }) {
  return <OutreachChart data={data} />
}
