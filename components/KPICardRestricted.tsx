import Card from './Card'
import { LockClosedIcon } from './icons/LockClosedIcon'

export default function KPICardRestricted({ label }: { label: string }) {
  return (
    <Card className="p-6 flex flex-col gap-2">
      <p className="text-[11px] text-[#666666] uppercase tracking-widest font-medium">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <LockClosedIcon className="w-4 h-4 text-[#444444]" />
        <p className="text-sm text-[#444444]">Restricted</p>
      </div>
      <p className="text-xs text-[#333333] mt-1">
        Contact your admin for access.
      </p>
    </Card>
  )
}
