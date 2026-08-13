import { X } from 'lucide-react'

type Props = { days: number; onClose: () => void }

export function DemoNotice({ days, onClose }: Props) {
  return (
    <aside className="demo-notice">
      <div>
        <span>演示账户</span>
        <p>许澄（化名）已经使用 Orbit {days} 天。你可以查看记录，也可以从现在继续操作。</p>
      </div>
      <button onClick={onClose} aria-label="关闭说明"><X size={17} /></button>
    </aside>
  )
}
