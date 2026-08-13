import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { activityCandidates } from '../data/demoData'
import {
  buildSelectedActivityEvent,
  buildDemoReply,
  confirmGrowthUpdate,
  createInitialOrbitState,
  rejectGrowthUpdate,
} from '../domain/orbitDomain'
import type { ChatEvent, DemoMoment, OrbitState, ThemeId } from '../domain/types'

type OrbitActions = {
  openChat: () => void
  closeChat: () => void
  switchTheme: (themeId: ThemeId) => void
  confirmGrowth: () => void
  rejectGrowth: () => void
  setDraft: (draft: string) => void
  setChatScrollTop: (top: number) => void
  markChatRead: () => void
  sendMessage: (text: string, attachment?: string) => void
  selectActivity: (activityId: string) => void
  cancelActivity: (eventId: string) => void
  resetDemo: (moment: DemoMoment) => void
  finishUpdateAnimation: () => void
}

const makeUserEvent = (text: string, attachment?: string): ChatEvent => ({
  id: `live-user-${Date.now()}`,
  day: 21,
  date: '现在',
  kind: 'message',
  speaker: 'user',
  text,
  attachment,
})

export const useOrbitStore = create<OrbitState & OrbitActions>()(
  persist(
    (set) => ({
      ...createInitialOrbitState('day21'),
      openChat: () => set({ appMode: 'chat', chatHasUnread: false }),
      closeChat: () => set({ appMode: 'map', firstUnreadEventId: null }),
      switchTheme: (themeId) => set({ activeThemeId: themeId }),
      confirmGrowth: () => set((state) => confirmGrowthUpdate(state)),
      rejectGrowth: () => set((state) => rejectGrowthUpdate(state)),
      setDraft: (chatDraft) => set({ chatDraft }),
      setChatScrollTop: (chatScrollTop) => set({ chatScrollTop }),
      markChatRead: () => set({ chatHasUnread: false }),
      sendMessage: (text, attachment) => {
        const cleanText = text.trim() || (attachment ? '发来一个文件' : '')
        if (!cleanText) return
        const userEvent = makeUserEvent(cleanText, attachment)
        const agentEvent: ChatEvent = {
          id: `live-agent-${Date.now() + 1}`,
          day: 21,
          date: '现在',
          kind: 'message',
          speaker: 'agent',
          text: attachment ? `我看到了你发来的「${attachment}」。它能说明哪一段情况？你可以直接告诉我，别让我只看文件名猜。` : buildDemoReply(cleanText),
        }
        set((state) => ({
          chatEvents: [...state.chatEvents, userEvent, agentEvent],
          chatDraft: '',
        }))
      },
      selectActivity: (selectedActivityId) =>
        set((state) => {
          const activity = activityCandidates.find((candidate) => candidate.id === selectedActivityId)
          if (!activity) return state
          return {
            selectedActivityId,
            chatEvents: [...state.chatEvents, buildSelectedActivityEvent(activity)],
          }
        }),
      cancelActivity: (eventId) => set((state) => ({
        selectedActivityId: null,
        chatEvents: state.chatEvents.map((event) => event.id === eventId ? { ...event, status: '预约已取消', canCancel: false } : event),
      })),
      resetDemo: (moment) => set(createInitialOrbitState(moment)),
      finishUpdateAnimation: () => set({ showUpdateAnimation: false }),
    }),
    {
      name: 'orbit-demo-state-v8',
      partialize: (state) => ({
        appMode: state.appMode,
        demoMoment: state.demoMoment,
        activeThemeId: state.activeThemeId,
        themes: state.themes,
        growthProposal: state.growthProposal,
        chatHasUnread: state.chatHasUnread,
        firstUnreadEventId: state.firstUnreadEventId,
        chatDraft: state.chatDraft,
        chatScrollTop: state.chatScrollTop,
        chatEvents: state.chatEvents,
        selectedActivityId: state.selectedActivityId,
        showUpdateAnimation: state.showUpdateAnimation,
      }),
    },
  ),
)
