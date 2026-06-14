import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'

type StatCounterProps = {
  value: number
  label: string
  suffix?: string
}

export function StatCounter({ value, label, suffix = '' }: StatCounterProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const count = useCountUp(value, isInView)

  return (
    <div ref={ref} className="stat-counter">
      <strong>
        {count.toLocaleString()}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  )
}
