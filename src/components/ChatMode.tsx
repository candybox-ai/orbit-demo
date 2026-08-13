import { CalendarDays, Clock3, Image, MapPin, Mic, Paperclip, Plus, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { activityCandidates } from '../data/demoData'
import { evaluateActivities, formatChatTimestamp } from '../domain/orbitDomain'
import type { ChatEvent, GrowthUpdateProposal } from '../domain/types'
import { saveLocalMedia } from '../lib/mediaStore'
import { ActivityRecordingCard } from './ActivityRecordingCard'
import { OrbitMapIcon } from './icons/OrbitMapIcon'

type Props = {
  events: ChatEvent[]
  draft: string
  savedScrollTop: number
  firstUnreadEventId: string | null
  proposal: GrowthUpdateProposal | null
  selectedActivityId: string | null
  onDraftChange: (value: string) => void
  onScrollPosition: (top: number) => void
  onMarkRead: () => void
  onSend: (text: string, attachment?: string) => void
  onConfirmGrowth: () => void
  onRejectGrowth: () => void
  onSelectActivity: (id: string) => void
  onCancelActivity: (eventId: string) => void
  onReturnMap: () => void
  onOpenSettings: () => void
}

function MatchCards({ selectedActivityId, onSelect }: { selectedActivityId: string | null; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const candidates = evaluateActivities(activityCandidates, Number.POSITIVE_INFINITY)
  return (
    <div className="match-section">
      <div className="match-carousel">
      {candidates.map((activity) => (
        <article className={`activity-card ${activity.recommended ? 'recommended' : ''}`} key={activity.id}>
          <div className="activity-topline"><span>{activity.type}</span>{activity.recommended && <em>建议先看</em>}</div>
          <h3>{activity.title}</h3>
          <dl>
            <div><dt>时间</dt><dd>{activity.schedule}</dd></div>
            <div><dt>地点</dt><dd>{activity.place} · {activity.commute}</dd></div>
            <div><dt>价格</dt><dd>¥{activity.price} · {activity.remaining}</dd></div>
          </dl>
          <p className="activity-reason">{activity.reason}</p>
          <p className="activity-advantage">{activity.alternativeDifference}</p>
          {expanded === activity.id && (
            <div className="activity-details">
              <p><b>形式：</b>{activity.durationType}</p>
              <p><b>现场怎么安排：</b>{activity.feedbackForm}</p>
              <p><b>参加要求：</b>{activity.requirement}</p>
              <p><b>报名：</b>{activity.deadline}</p>
              <p><b>退出：</b>{activity.cancellationRule}</p>
              <p><b>记录规则：</b>{activity.recordingRule}</p>
            </div>
          )}
          <div className="activity-actions">
            <button onClick={() => setExpanded(expanded === activity.id ? null : activity.id)}>{expanded === activity.id ? '收起详情' : '活动详情'}</button>
            <button className="primary-small" disabled={selectedActivityId === activity.id || !activity.available} onClick={() => onSelect(activity.id)}>
              {selectedActivityId === activity.id ? '已预约' : activity.available ? '预约' : '暂不可预约'}
            </button>
          </div>
        </article>
      ))}
      </div>
    </div>
  )
}

function EventCard({ event, proposal, onConfirmGrowth, onRejectGrowth, selectedActivityId, onSelectActivity, onCancelActivity }: {
  event: ChatEvent
  proposal: GrowthUpdateProposal | null
  onConfirmGrowth: () => void
  onRejectGrowth: () => void
  selectedActivityId: string | null
  onSelectActivity: (id: string) => void
  onCancelActivity: (eventId: string) => void
}) {
  if (event.kind === 'message') {
    return (
      <div className={`chat-message dialogue-message message-${event.speaker}`}>
        {event.text && <p>{event.text}</p>}
        {event.attachment && <span className="message-attachment"><Paperclip size={14} />{event.attachment}</span>}
      </div>
    )
  }

  if (event.kind === 'match') {
    return (
      <div className="structured-block">
        <div className="chat-message dialogue-message message-agent"><p>{event.text}</p></div>
        <MatchCards selectedActivityId={selectedActivityId} onSelect={onSelectActivity} />
      </div>
    )
  }

  if (event.kind === 'recording') {
    return <ActivityRecordingCard event={event} />
  }

  if (event.kind === 'selected-activity' && event.activitySnapshot) {
    return (
      <article className="appointment-card">
        <span>{event.eyebrow}</span>
        <h3>{event.title}</h3>
        <div className="appointment-meta"><p><CalendarDays size={15} />{event.activitySnapshot.schedule}</p><p><MapPin size={15} />{event.activitySnapshot.place}</p><p><Clock3 size={15} />{event.activitySnapshot.duration}</p></div>
        <div className="appointment-status">{event.status}</div>
        <button disabled={!event.canCancel} onClick={() => onCancelActivity(event.id)}>{event.canCancel ? '取消预约' : '已过取消时间'}</button>
      </article>
    )
  }

  const isGrowth = event.kind === 'growth-update'
  const hasActions = isGrowth && proposal?.responseState === 'awaiting'
  const plainText = event.text || [event.title, event.bullets?.join('；')].filter(Boolean).join('：')
  return (
    <div className={`chat-message message-agent ${hasActions ? 'action-message growth-message' : 'dialogue-message'}`}>
      {plainText && <p>{plainText}</p>}
      {event.status && !isGrowth && <small className="message-inline-status">{event.status}</small>}
      {hasActions && (
        <div className="growth-actions">
          <button className="growth-confirm" onClick={onConfirmGrowth}>符合我的感受</button>
          <button onClick={onRejectGrowth}>我觉得还没有</button>
          <button onClick={onRejectGrowth}>变化发生在别处</button>
        </div>
      )}
      {isGrowth && proposal?.responseState === 'confirmed' && <div className="confirmed-status">已确认，地图已经更新</div>}
      {isGrowth && proposal?.responseState === 'rejected' && <div className="confirmed-status neutral">地图没有改变</div>}
    </div>
  )
}

export function ChatMode(props: Props) {
  const feedRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const speechRecognition = useRef<{ start: () => void; stop: () => void } | null>(null)
  const [transcribing, setTranscribing] = useState(false)
  const [inputExpanded, setInputExpanded] = useState(false)
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null)

  useEffect(() => {
    window.setTimeout(() => {
      const feed = feedRef.current
      const target = props.firstUnreadEventId ? document.getElementById(props.firstUnreadEventId) : null
      if (feed && target) feed.scrollTo({ top: Math.max(0, target.offsetTop - 22), behavior: 'auto' })
      else if (feed && props.savedScrollTop > 0) feed.scrollTo({ top: props.savedScrollTop, behavior: 'auto' })
      else feed?.scrollTo({ top: feed.scrollHeight })
      props.onMarkRead()
    }, 180)
  }, [props.firstUnreadEventId])

  const send = () => {
    if (!props.draft.trim()) return
    props.onSend(props.draft)
    window.setTimeout(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' }), 50)
  }

  const handleFile = (file?: File) => {
    if (!file) return
    saveLocalMedia(`chat-upload-${Date.now()}`, file).catch(() => undefined)
    props.onSend('发来一个文件', file.name)
    setInputExpanded(false)
  }

  const toggleTranscription = () => {
    if (transcribing) {
      speechRecognition.current?.stop()
      setTranscribing(false)
      return
    }
    const SpeechRecognitionApi = (window as typeof window & { webkitSpeechRecognition?: new () => any; SpeechRecognition?: new () => any }).SpeechRecognition
      || (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition
    if (!SpeechRecognitionApi) {
      setPermissionMessage('当前浏览器不支持语音转文字，请使用系统键盘语音输入或直接输入文字。')
      return
    }
    const recognizer = new SpeechRecognitionApi()
    recognizer.lang = 'zh-CN'
    recognizer.interimResults = true
    recognizer.continuous = false
    recognizer.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<any>).map((result: any) => result[0].transcript).join('')
      props.onDraftChange(transcript)
    }
    recognizer.onend = () => setTranscribing(false)
    recognizer.onerror = () => { setTranscribing(false); setPermissionMessage('没有听清楚，你可以再试一次或直接输入文字。') }
    recognizer.start()
    speechRecognition.current = recognizer
    setTranscribing(true)
    setPermissionMessage(null)
  }

  let lastDate = ''
  return (
    <section className="chat-screen">
      <header className="chat-header">
        <div className="agent-identity"><span className="agent-orb" /><div><strong>Orbit</strong><small>你的成长伙伴</small></div></div>
        <button className="avatar-button" onClick={props.onOpenSettings} aria-label="账户设置"><img src={`${import.meta.env.BASE_URL}avatar-xucheng.png`} alt="" /></button>
      </header>

      <div className="chat-feed" ref={feedRef} onScroll={(event) => props.onScrollPosition(event.currentTarget.scrollTop)}>
        {props.events.map((event) => {
          const showDate = event.date !== lastDate
          lastDate = event.date
          const unread = event.id === props.firstUnreadEventId
          return (
            <div key={event.id} id={event.id} className="event-wrap">
              {showDate && <time className="date-divider">{formatChatTimestamp(event)}</time>}
              {unread && <div className="unread-divider">以下为新消息</div>}
              <EventCard
                event={event}
                proposal={props.proposal}
                onConfirmGrowth={props.onConfirmGrowth}
                onRejectGrowth={props.onRejectGrowth}
                selectedActivityId={props.selectedActivityId}
                onSelectActivity={props.onSelectActivity}
                onCancelActivity={props.onCancelActivity}
              />
            </div>
          )
        })}
        <div className="feed-bottom-space" />
      </div>

      {permissionMessage && <div className="permission-toast">{permissionMessage}</div>}
      {inputExpanded && (
        <div className="attachment-menu">
          <button onClick={() => imageInputRef.current?.click()}><Image size={19} /><span>照片</span></button>
          <button onClick={() => fileInputRef.current?.click()}><Paperclip size={19} /><span>文件</span></button>
          <input ref={imageInputRef} hidden type="file" accept="image/*" capture="environment" onChange={(event) => handleFile(event.target.files?.[0])} />
          <input ref={fileInputRef} hidden type="file" accept="audio/*,.pdf,.doc,.docx,.txt" onChange={(event) => handleFile(event.target.files?.[0])} />
        </div>
      )}
      <footer className="chat-bottom-dock">
        <div className={`composer ${transcribing ? 'is-transcribing' : ''}`}>
          <button className="composer-plus" onClick={() => setInputExpanded(!inputExpanded)} aria-label="添加图片或文件"><Plus size={21} /></button>
          <textarea
            rows={1}
            value={props.draft}
            onChange={(event) => props.onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() }
            }}
            placeholder={transcribing ? '正在听…' : '和 Orbit 聊聊…'}
            aria-label="消息"
          />
          {props.draft.trim() && !transcribing ? (
            <button className="send-button" onClick={send} aria-label="发送"><Send size={18} /></button>
          ) : (
            <button className="mic-button" onClick={toggleTranscription} aria-label={transcribing ? '停止语音输入' : '语音转文字'}>
              <Mic size={21} />
            </button>
          )}
        </div>
        <button className="map-return-button" onClick={props.onReturnMap} aria-label="返回成长地图">
          <OrbitMapIcon size={24} />
        </button>
      </footer>
    </section>
  )
}
