import { Bell, ChevronRight, HelpCircle, LogOut, RotateCcw, ShieldCheck, X } from 'lucide-react'
import type { DemoMoment } from '../domain/types'

type Props = {
  open: boolean
  days: number
  onClose: () => void
  onReset: (moment: DemoMoment) => void
}

export function ResetSheet({ open, days, onClose, onReset }: Props) {
  if (!open) return null
  return (
    <div className="sheet-backdrop account-drawer-backdrop" onClick={onClose}>
      <section className="bottom-sheet account-sheet account-drawer" onClick={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-label="账户设置">
        <button className="icon-button sheet-close" onClick={onClose} aria-label="关闭"><X size={19} /></button>
        <div className="account-profile"><span className="account-avatar"><img src={`${import.meta.env.BASE_URL}avatar-xucheng.png`} alt="" /></span><div><h2>许澄</h2><p>上海 · Orbit 演示账户 · 已记录 {days} 天</p></div></div>
        <div className="settings-group">
          <button><Bell size={18} /><span>提醒与通知</span><ChevronRight size={16} /></button>
          <button><ShieldCheck size={18} /><span>隐私与记录权限</span><ChevronRight size={16} /></button>
          <button><HelpCircle size={18} /><span>帮助与反馈</span><ChevronRight size={16} /></button>
        </div>
        <div className="demo-tools">
          <span>Demo 工具</span>
          <button onClick={() => onReset('day21')}><RotateCcw size={16} />恢复 Day 21 状态</button>
          <button onClick={() => onReset('day14')}><RotateCcw size={16} />回到活动推荐前</button>
        </div>
        <button className="sign-out" disabled><LogOut size={17} />退出账户</button>
      </section>
    </div>
  )
}
