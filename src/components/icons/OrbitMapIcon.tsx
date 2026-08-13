type Props = { size?: number; className?: string }

export function OrbitMapIcon({ size = 24, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="4.4" stroke="currentColor" strokeWidth="1.8" transform="rotate(-24 12 12)" />
      <ellipse cx="12" cy="12" rx="4.4" ry="9" stroke="currentColor" strokeWidth="1.8" transform="rotate(32 12 12)" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="20" cy="8.3" r="1.2" fill="currentColor" />
    </svg>
  )
}
