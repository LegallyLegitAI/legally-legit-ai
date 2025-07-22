export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[--color-navy]" />
    </div>
  )
}