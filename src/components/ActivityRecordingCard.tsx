import { Camera, Mic, Pause, Square, Tag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChatEvent } from '../domain/types'
import { saveLocalMedia } from '../lib/mediaStore'

export function ActivityRecordingCard({ event }: { event: ChatEvent }) {
  const photoInput = useRef<HTMLInputElement>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const activeStream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const [state, setState] = useState<'permission' | 'recording' | 'paused' | 'ended'>('permission')
  const [facts, setFacts] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => () => {
    if (recorder.current?.state === 'recording') recorder.current.stop()
    activeStream.current?.getTracks().forEach((track) => track.stop())
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      activeStream.current = stream
      const activeRecorder = new MediaRecorder(stream)
      chunks.current = []
      activeRecorder.ondataavailable = (recorded) => chunks.current.push(recorded.data)
      activeRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: activeRecorder.mimeType || 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        if (blob.size > 0) {
          try {
            await saveLocalMedia(`activity-audio-${Date.now()}`, blob)
            setFacts((current) => [...current, '一段个人语音 · 已存在本机'])
          } catch {
            setNotice('这段语音没有保存成功。你可以再录一次，或改用照片和标记。')
          }
        }
      }
      activeRecorder.start()
      recorder.current = activeRecorder
      setState('recording')
      setNotice(null)
    } catch {
      setNotice('麦克风暂时不能用。你仍可以拍照或标记一个时刻。')
    }
  }

  const stopRecording = (next: 'paused' | 'ended') => {
    if (recorder.current?.state === 'recording') recorder.current.stop()
    setState(next)
  }

  const addPhoto = async (file?: File) => {
    if (!file) return
    try {
      await saveLocalMedia(`activity-photo-${Date.now()}`, file)
      setFacts((current) => [...current, `${file.name} · 已存在本机`])
    } catch {
      setNotice('这张照片没有保存成功。你可以重新选择，或先标记这个时刻。')
    }
  }

  return (
    <article className="chat-message action-message message-agent activity-recording-message">
      <p>{event.title}</p>
      <p>{event.text}</p>
      {state === 'permission' && (
        <div className="record-actions">
          <button className="record-primary" onClick={startRecording}><Mic size={15} />允许并开始</button>
          <button onClick={() => setState('paused')}>先不录音</button>
        </div>
      )}
      {state === 'recording' && (
        <div className="record-live">
          <div><span />正在记录你的活动</div>
          <small>只保存到这个浏览器</small>
          <div className="record-actions">
            <button onClick={() => stopRecording('paused')}><Pause size={14} />暂停</button>
            <button onClick={() => stopRecording('ended')}><Square size={13} />结束记录</button>
          </div>
        </div>
      )}
      {state === 'paused' && <div className="card-status">录音已暂停。你还可以拍照或标记这一刻。</div>}
      {notice && <div className="record-notice">{notice}</div>}
      {state !== 'permission' && state !== 'ended' && (
        <div className="record-tool-row">
          <button onClick={() => photoInput.current?.click()}><Camera size={15} />拍一张</button>
          <button onClick={() => setFacts((current) => [...current, '标记：这一刻开始动笔了'])}><Tag size={15} />标记时刻</button>
          {state === 'paused' && <button onClick={startRecording}><Mic size={15} />开始录音</button>}
          <input ref={photoInput} hidden type="file" accept="image/*" capture="environment" onChange={(input) => addPhoto(input.target.files?.[0])} />
        </div>
      )}
      {facts.length > 0 && <ul className="record-facts">{facts.map((fact, index) => <li key={`${fact}-${index}`}>{fact}</li>)}</ul>}
      {state === 'ended' && <div className="card-status">记录已结束 · 这些内容会先由你确认，再成为成长证据</div>}
    </article>
  )
}
