import { useEffect, useState } from 'react'
import { ChatMode } from './components/ChatMode'
import { DemoNotice } from './components/DemoNotice'
import { GrowthMap } from './components/GrowthMap'
import { ResetSheet } from './components/ResetSheet'
import { fitPhoneCanvas } from './domain/orbitDomain'
import { clearLocalMedia } from './lib/mediaStore'
import { useOrbitStore } from './store/useOrbitStore'

export default function App() {
  const store = useOrbitStore()
  const [showNotice, setShowNotice] = useState(() => sessionStorage.getItem('orbit-demo-notice-seen') !== 'yes')
  const [showReset, setShowReset] = useState(false)
  const [demoResetKey, setDemoResetKey] = useState(0)
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const desktopCanvas = viewport.width >= 620 ? fitPhoneCanvas(viewport.width, viewport.height) : null

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return (
    <div className="app-stage">
      <div
        className="phone-shell"
        style={desktopCanvas ? { width: desktopCanvas.width, height: desktopCanvas.height } : undefined}
      >
        <div
          className="phone-canvas"
          style={desktopCanvas ? { transform: `scale(${desktopCanvas.scale})` } : undefined}
        >
        {store.appMode === 'map' ? (
          <GrowthMap
            key={demoResetKey}
            state={store}
            onOpenChat={store.openChat}
            onSwitchTheme={store.switchTheme}
            onOpenSettings={() => setShowReset(true)}
            onFinishAnimation={store.finishUpdateAnimation}
          />
        ) : (
          <ChatMode
            events={store.chatEvents}
            draft={store.chatDraft}
            savedScrollTop={store.chatScrollTop}
            firstUnreadEventId={store.firstUnreadEventId}
            proposal={store.growthProposal}
            selectedActivityId={store.selectedActivityId}
            onDraftChange={store.setDraft}
            onScrollPosition={store.setChatScrollTop}
            onMarkRead={store.markChatRead}
            onSend={store.sendMessage}
            onConfirmGrowth={store.confirmGrowth}
            onRejectGrowth={store.rejectGrowth}
            onSelectActivity={store.selectActivity}
            onCancelActivity={store.cancelActivity}
            onReturnMap={store.closeChat}
            onOpenSettings={() => setShowReset(true)}
          />
        )}
        {showNotice && <DemoNotice days={store.demoMoment === 'day21' ? 21 : 14} onClose={() => { sessionStorage.setItem('orbit-demo-notice-seen', 'yes'); setShowNotice(false) }} />}
        <ResetSheet
          open={showReset}
          days={store.demoMoment === 'day21' ? 21 : 14}
          onClose={() => setShowReset(false)}
          onReset={(moment) => { void clearLocalMedia(); store.resetDemo(moment); setDemoResetKey((key) => key + 1); sessionStorage.removeItem('orbit-demo-notice-seen'); setShowReset(false); setShowNotice(true) }}
        />
        </div>
      </div>
    </div>
  )
}
