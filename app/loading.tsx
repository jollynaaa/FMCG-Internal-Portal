export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#09090b] border border-[#1f1f23] rounded-xl p-6 animate-pulse">
            <div className="h-2.5 w-20 bg-[#1f1f23] rounded mb-4" />
            <div className="h-9 w-28 bg-[#1f1f23] rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-4">
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-xl h-80 animate-pulse" />
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-xl h-80 animate-pulse" />
      </div>
    </div>
  )
}
