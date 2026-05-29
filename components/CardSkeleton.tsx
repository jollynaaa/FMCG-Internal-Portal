export default function CardSkeleton() {
  return (
    <div className="bg-[#09090b] border border-[#1f1f23] rounded-xl p-6 animate-pulse">
      <div className="h-3 w-24 bg-[#1f1f23] rounded mb-3" />
      <div className="h-8 w-32 bg-[#1f1f23] rounded" />
    </div>
  )
}
