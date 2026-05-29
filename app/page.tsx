import { Suspense } from 'react'
import { getAuthUser, getKPIs, getOutreachMetrics, getDecks, getWeeklyUpdates } from '@/lib/data'
import { toChartWeeks } from '@/lib/format'
import KPICard from '@/components/KPICard'
import KPICardRestricted from '@/components/KPICardRestricted'
import RoleGate from '@/components/RoleGate'
import DeckList from '@/components/DeckList'
import SyncFeed from '@/components/SyncFeed'
import LogMetricModal from '@/components/LogMetricModal'
import CardSkeleton from '@/components/CardSkeleton'
import OutreachChartWrapper from '@/components/OutreachChartWrapper'

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-[#666666]">Redirecting to login...</p>
      </div>
    )
  }

  const [kpis, metrics, decks, updates] = await Promise.all([
    getKPIs(user.id, user.role),
    getOutreachMetrics(),
    getDecks(),
    getWeeklyUpdates(),
  ])

  const chartData = toChartWeeks(metrics)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-xs text-[#444444] mt-1">
          Week of {new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard
          label="Weekly Outreach Leads"
          value={kpis.weeklyOutreachLeads}
          sublabel="Emails + LinkedIn + Calls this week"
        />
        <KPICard
          label="New Clients Closed MTD"
          value={kpis.newClientsMTD}
          sublabel="Month to date"
        />
        <RoleGate
          allow={['admin', 'sales_rep']}
          role={user.role}
          fallback={<KPICardRestricted label="Estimated GP MTD" />}
        >
          <KPICard
            label="Estimated GP MTD"
            value={kpis.estimatedGpMTD ?? 0}
            format="currency"
            sublabel="Gross profit month to date"
          />
        </RoleGate>
      </section>

      {/* Analytics + Resource Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-4 mb-6">
        <Suspense fallback={<CardSkeleton />}>
          <OutreachChartWrapper data={chartData} />
        </Suspense>
        <DeckList decks={decks} emptyLabel="No decks uploaded yet." />
      </section>

      {/* Weekly Sync Feed */}
      <SyncFeed updates={updates} emptyLabel="No sync updates posted yet." />

      {/* Log Metric Modal — listens for window event dispatched by Header */}
      <LogMetricModal role={user.role} />
    </>
  )
}
