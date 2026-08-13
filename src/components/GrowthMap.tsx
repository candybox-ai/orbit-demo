import { ChevronLeft, ChevronRight, LocateFixed, LockKeyhole, MessageCircle } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildOrbitPath, currentNode, isNodeLocked, layoutGrowthMap, placeMapPopover, visibleNodes } from '../domain/orbitDomain'
import type { MapNode, OrbitState, ThemeId } from '../domain/types'

type Props = {
  state: OrbitState
  onOpenChat: () => void
  onSwitchTheme: (themeId: ThemeId) => void
  onOpenSettings: () => void
  onFinishAnimation: () => void
}

const themeOrder: ThemeId[] = ['expression', 'career']

export function GrowthMap({ state, onOpenChat, onSwitchTheme, onOpenSettings, onFinishAnimation }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const wheelIntent = useRef({ x: 0, y: 0, lastAt: 0 })
  const [activeNode, setActiveNode] = useState<MapNode | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(null)
  const [showLocator, setShowLocator] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(() => Math.min(window.innerHeight, 932))
  const theme = state.themes[state.activeThemeId]
  const nodes = useMemo(() => visibleNodes(state, state.activeThemeId), [state, state.activeThemeId])
  const activeCurrentNode = currentNode(state, state.activeThemeId)
  const mapLayout = useMemo(() => layoutGrowthMap(nodes, viewportHeight), [nodes, viewportHeight])
  const positionedCurrentNode = mapLayout.nodes.find((node) => node.id === activeCurrentNode?.id)
  const positionedActiveNode = mapLayout.nodes.find((node) => node.id === activeNode?.id)

  const focusCurrent = (behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollRef.current
    if (!scroller || !positionedCurrentNode) return
    scroller.scrollTo({ top: Math.max(0, positionedCurrentNode.y - scroller.clientHeight / 2), behavior })
    setShowLocator(false)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      focusCurrent(state.showUpdateAnimation ? 'smooth' : 'auto')
    }, 80)
    if (state.showUpdateAnimation) {
      const done = window.setTimeout(onFinishAnimation, 1500)
      return () => { window.clearTimeout(timer); window.clearTimeout(done) }
    }
    return () => window.clearTimeout(timer)
  }, [state.activeThemeId, state.showUpdateAnimation, positionedCurrentNode?.id, viewportHeight])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const observer = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height))
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (activeNode && !positionedActiveNode) {
      setActiveNode(null)
      setPopoverPosition(null)
    }
  }, [activeNode, positionedActiveNode])

  useLayoutEffect(() => {
    const scroller = scrollRef.current
    const popover = popoverRef.current
    if (!activeNode || !positionedActiveNode || !scroller || !popover) return
    setPopoverPosition(placeMapPopover({
      anchorX: scroller.clientWidth * positionedActiveNode.x / 100,
      anchorY: positionedActiveNode.y - scroller.scrollTop,
      popoverWidth: popover.offsetWidth,
      popoverHeight: popover.offsetHeight,
      viewportWidth: scroller.clientWidth,
      viewportHeight: scroller.clientHeight,
    }))
  }, [activeNode, positionedActiveNode, viewportHeight])

  const switchBy = (direction: -1 | 1) => {
    const index = themeOrder.indexOf(state.activeThemeId)
    const next = themeOrder[index + direction]
    if (next) {
      setActiveNode(null)
      onSwitchTheme(next)
    }
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!pointerStart.current) return
    const dx = event.clientX - pointerStart.current.x
    const dy = event.clientY - pointerStart.current.y
    pointerStart.current = null
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.35) switchBy(dx < 0 ? 1 : -1)
  }

  const reachedNodes = mapLayout.nodes.filter((node) => !isNodeLocked(node))
  const futureNodes = mapLayout.nodes.filter((node) => isNodeLocked(node))
  const pathData = buildOrbitPath(reachedNodes)
  const futurePathData = buildOrbitPath([positionedCurrentNode, ...futureNodes].filter(Boolean) as Array<MapNode & { y: number }>)

  return (
    <main className={`map-screen theme-${state.activeThemeId} ${state.showUpdateAnimation ? 'map-updating' : ''}`}>
      <header className="map-header">
        <button className="theme-arrow" onClick={() => switchBy(-1)} disabled={state.activeThemeId === themeOrder[0]} aria-label="上一个成长主题">
          <ChevronLeft size={19} />
        </button>
        <div className="theme-title">
          <strong>{theme.name}</strong>
          <small><i />{theme.trend}</small>
        </div>
        <button className="theme-arrow" onClick={() => switchBy(1)} disabled={state.activeThemeId === themeOrder.at(-1)} aria-label="下一个成长主题">
          <ChevronRight size={19} />
        </button>
      </header>

      <button className="profile-button" onClick={onOpenSettings} aria-label="账户设置"><img src={`${import.meta.env.BASE_URL}avatar-xucheng.png`} alt="" /></button>

      <div
        className="map-scroll"
        ref={scrollRef}
        onScroll={(event) => {
          setActiveNode(null)
          setPopoverPosition(null)
          if (positionedCurrentNode) {
            const target = positionedCurrentNode.y - event.currentTarget.clientHeight / 2
            setShowLocator(Math.abs(event.currentTarget.scrollTop - target) > event.currentTarget.clientHeight * 0.85)
          }
        }}
        onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY } }}
        onPointerUp={handlePointerUp}
        onWheel={(event) => {
          const now = performance.now()
          if (now - wheelIntent.current.lastAt > 240) wheelIntent.current = { x: 0, y: 0, lastAt: now }
          wheelIntent.current.x += event.deltaX
          wheelIntent.current.y += event.deltaY
          wheelIntent.current.lastAt = now
          if (Math.abs(wheelIntent.current.x) > 85 && Math.abs(wheelIntent.current.x) > Math.abs(wheelIntent.current.y) * 1.3) {
            switchBy(wheelIntent.current.x > 0 ? 1 : -1)
            wheelIntent.current = { x: 0, y: 0, lastAt: now }
          }
        }}
      >
        <div className="orbit-map" style={{ height: mapLayout.height }} onClick={() => { setActiveNode(null); setPopoverPosition(null) }}>
          <div className="map-nebula nebula-one" />
          <div className="map-nebula nebula-two" />
          <svg className="orbit-path" viewBox={`0 0 100 ${mapLayout.height}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="hand-drawn-line" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.11" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" />
              </filter>
            </defs>
            <path className="path-line path-line-offset" d={pathData} />
            <path className="path-line" d={pathData} />
            {futurePathData && <path className="path-future" d={futurePathData} />}
          </svg>
          {mapLayout.nodes.map((node) => {
            const current = node.id === activeCurrentNode?.id
            const locked = isNodeLocked(node)
            return (
              <button
                key={node.id}
                className={`map-node node-${node.tone} node-${node.size} ${node.x > 52 ? 'label-left' : 'label-right'} ${current ? 'is-current' : ''} ${locked ? 'is-future' : ''}`}
                style={{ left: `${node.x}%`, top: node.y }}
                onClick={(event) => {
                  event.stopPropagation()
                  if (activeNode?.id === node.id) {
                    setActiveNode(null)
                    setPopoverPosition(null)
                    return
                  }
                  setPopoverPosition(null)
                  setActiveNode(node)
                }}
                aria-expanded={activeNode?.id === node.id}
                aria-controls={activeNode?.id === node.id ? 'map-node-popover' : undefined}
                aria-label={`${node.label}${locked ? '，没有解锁' : current ? '，正在进行中' : node.date ? `，${node.date}` : ''}`}
              >
                <span className="node-core">{locked && <LockKeyhole size={10} />}</span>
                <span className="node-label"><small>Day {node.day}</small><strong>{node.label}</strong></span>
              </button>
            )
          })}
        </div>
      </div>

      {activeNode && positionedActiveNode && (
        <aside
          ref={popoverRef}
          id="map-node-popover"
          role="status"
          aria-live="polite"
          className="landmark-popover popover-viewport"
          style={{ left: popoverPosition?.left ?? 14, top: popoverPosition?.top ?? 94, visibility: popoverPosition ? 'visible' : 'hidden' }}
          onClick={(event) => event.stopPropagation()}
        >
          <time>{activeNode.date || `Day ${activeNode.day}`}</time>
          <strong>{isNodeLocked(activeNode) ? '没有解锁' : activeNode.id === activeCurrentNode?.id ? '正在进行中' : activeNode.conclusion}</strong>
          {!isNodeLocked(activeNode) && activeNode.id === activeCurrentNode?.id && <p>{activeNode.label}</p>}
          {!isNodeLocked(activeNode) && activeNode.id !== activeCurrentNode?.id && activeNode.evidence?.map((item) => <p key={item.id}>{item.text}</p>)}
        </aside>
      )}

      <div className="map-actions">
        {showLocator && (
          <button className="locator-button" onClick={() => focusCurrent()} aria-label="回到当前位置"><LocateFixed size={19} /></button>
        )}
        <button className="chat-launcher" onClick={onOpenChat} aria-label="打开与 Orbit 的对话">
          <MessageCircle size={25} strokeWidth={1.9} />
          {state.chatHasUnread && <span className="unread-dot" />}
        </button>
      </div>
      <div className="map-bottom-hint">上下看路径 · 左右换主题</div>
    </main>
  )
}
