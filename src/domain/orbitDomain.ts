import { chatEvents, initialThemes } from '../data/demoData'
import type { ActivityCandidate, ChatEvent, DemoMoment, EvaluatedActivity, MapNode, OrbitState, ThemeId } from './types'

const cloneThemes = () => structuredClone(initialThemes)

export function formatChatTimestamp({ date, time }: Pick<ChatEvent, 'date' | 'time'>): string {
  return [date, time].filter(Boolean).join(' ')
}

export function createInitialOrbitState(moment: DemoMoment = 'day21'): OrbitState {
  const day21 = moment === 'day21'
  return {
    appMode: 'map',
    demoMoment: moment,
    activeThemeId: 'expression',
    themes: cloneThemes(),
    growthProposal: day21
      ? {
          id: 'growth-update-day21',
          themeId: 'expression',
          proposedStage: '行动启动',
          responseState: 'awaiting',
        }
      : null,
    chatHasUnread: true,
    firstUnreadEventId: day21 ? 'd21-g1' : 'd14-m1',
    chatDraft: '',
    chatScrollTop: 0,
    chatEvents: chatEvents.filter((event) => event.day <= (day21 ? 21 : 14)),
    selectedActivityId: day21 ? 'community-open-day' : null,
    showUpdateAnimation: false,
  }
}

export function visibleNodes(state: OrbitState, themeId: ThemeId): MapNode[] {
  const confirmed = state.growthProposal?.responseState === 'confirmed'
  const proposalThemeId = state.growthProposal?.themeId
  return state.themes[themeId].nodes.filter((node) => {
    if (node.state === 'preview') return node.themeId !== proposalThemeId || !confirmed
    if (node.state === 'proposed' || node.state === 'future') return confirmed
    return node.state === 'confirmed'
  })
}

export function layoutGrowthMap(nodes: MapNode[], viewportHeight: number) {
  const ordered = [...nodes].sort((left, right) => left.day - right.day)
  const edgeSpace = Math.min(124, Math.max(104, viewportHeight * 0.14))
  let travelled = 0
  const travelledByNode = ordered.map((node, index) => {
    if (index > 0) {
      const dayGap = Math.max(1, node.day - ordered[index - 1].day)
      travelled += Math.min(320, 45 + dayGap * 50)
    }
    return { node, travelled }
  })
  const routeLength = travelled
  const topSpace = routeLength + edgeSpace * 2 < viewportHeight
    ? Math.max(edgeSpace, viewportHeight / 2)
    : edgeSpace
  const positioned = travelledByNode.map(({ node, travelled: nodeTravelled }) => ({
    ...node,
    y: topSpace + routeLength - nodeTravelled,
  }))
  return {
    nodes: positioned,
    height: Math.ceil(topSpace + routeLength + edgeSpace),
  }
}

export function buildOrbitPath(nodes: Array<Pick<MapNode, 'x'> & { y: number }>): string {
  if (nodes.length === 0) return ''
  return nodes.slice(1).reduce((path, node, index) => {
    const previous = nodes[index]
    const midpoint = (previous.y + node.y) / 2
    return `${path} C ${previous.x} ${midpoint}, ${node.x} ${midpoint}, ${node.x} ${node.y}`
  }, `M ${nodes[0].x} ${nodes[0].y}`)
}

type PopoverPlacementInput = {
  anchorX: number
  anchorY: number
  popoverWidth: number
  popoverHeight: number
  viewportWidth: number
  viewportHeight: number
}

export function placeMapPopover({
  anchorX,
  anchorY,
  popoverWidth,
  popoverHeight,
  viewportWidth,
  viewportHeight,
}: PopoverPlacementInput): { left: number; top: number } {
  const horizontalSafeArea = 14
  const verticalSafeArea = 94
  const anchorGap = 24
  const preferredLeft = anchorX > viewportWidth / 2
    ? anchorX - popoverWidth - anchorGap
    : anchorX + anchorGap
  const left = Math.min(
    viewportWidth - popoverWidth - horizontalSafeArea,
    Math.max(horizontalSafeArea, preferredLeft),
  )
  const preferredTop = anchorY - popoverHeight * 0.45
  const top = Math.min(
    viewportHeight - popoverHeight - verticalSafeArea,
    Math.max(verticalSafeArea, preferredTop),
  )
  return { left: Math.round(left), top: Math.round(top) }
}

export function fitPhoneCanvas(viewportWidth: number, viewportHeight: number) {
  const authoredWidth = 390
  const authoredHeight = 844
  const stageGutter = 44
  const scale = Math.round(Math.min(
    1,
    Math.max(0, (viewportWidth - stageGutter) / authoredWidth),
    Math.max(0, (viewportHeight - stageGutter) / authoredHeight),
  ) * 1000) / 1000

  return {
    scale,
    width: Math.round(authoredWidth * scale * 10) / 10,
    height: Math.round(authoredHeight * scale * 10) / 10,
  }
}

export function isNodeLocked(node: MapNode): boolean {
  return node.state === 'preview' || node.state === 'future'
}

export function currentNode(state: OrbitState, themeId: ThemeId): MapNode | undefined {
  const confirmed = state.growthProposal?.responseState === 'confirmed'
  const currentWhen = confirmed ? 'after-confirmation' : 'before-confirmation'
  return state.themes[themeId].nodes.find((node) => node.currentWhen === currentWhen)
    ?? state.themes[themeId].nodes.find((node) => node.currentWhen === 'before-confirmation')
}

export function confirmGrowthUpdate(state: OrbitState): OrbitState {
  if (!state.growthProposal || state.growthProposal.responseState !== 'awaiting') return state
  return {
    ...state,
    themes: {
      ...state.themes,
      expression: {
        ...state.themes.expression,
        stage: '行动启动',
        trend: '节奏尚未形成',
      },
    },
    growthProposal: { ...state.growthProposal, responseState: 'confirmed' },
    chatHasUnread: false,
    firstUnreadEventId: null,
    showUpdateAnimation: true,
  }
}

export function rejectGrowthUpdate(state: OrbitState): OrbitState {
  if (!state.growthProposal || state.growthProposal.responseState !== 'awaiting') return state
  return {
    ...state,
    growthProposal: { ...state.growthProposal, responseState: 'rejected' },
    chatHasUnread: false,
    firstUnreadEventId: null,
    showUpdateAnimation: false,
  }
}

export function evaluateActivities(candidates: ActivityCandidate[], budget: number): EvaluatedActivity[] {
  return candidates
    .map((activity) => ({
      ...activity,
      available: activity.price <= budget,
      overBudgetBy: Math.max(0, activity.price - budget),
    }))
    .sort((left, right) => Number(Boolean(right.recommended)) - Number(Boolean(left.recommended)))
}

export function buildDemoReply(text: string): string {
  if (/写到一半|选题|值不值得|怀疑/.test(text)) return '你不是没有开始，而是写到一半又回到了“这个选题值不值得”的判断里。下次这种念头出现时，先别换题，只把这一版写完，再决定发不发，怎么样？'
  if (/时间|周末|晚上/.test(text)) return '可以。你具体方便哪一天、哪个时段？我只保留那个时间能参加的活动。'
  if (/预算|价格|贵|元/.test(text)) return '那这次你愿意花到多少？我会把完整价格和取消条件一起算进去。'
  if (/不想|不要|不喜欢/.test(text)) return '明白。你最不想遇到的是哪种安排？比如听课太多、陌生人社交，还是没有时间真的动手？'
  if (/没感觉|不符合|还没有/.test(text)) return '那地图先不改。你觉得不准确的是阶段结论，还是我用来判断它的那几件事？'
  if (/发了|完成|写完|做完/.test(text)) return '先别急着评价做得好不好。你这次能完成，和上一次卡住相比，哪一点不一样？'
  return `你刚才说“${text.slice(0, 18)}${text.length > 18 ? '…' : ''}”。如果只挑一个最影响你往下做的地方，会是哪一个？`
}

export function buildSelectedActivityEvent(activity: ActivityCandidate, timestamp = Date.now()): ChatEvent {
  const selectedAt = new Date(timestamp)
  return {
    id: `selected-${activity.id}-${timestamp}`,
    day: 14,
    date: '今天',
    time: `${String(selectedAt.getHours()).padStart(2, '0')}:${String(selectedAt.getMinutes()).padStart(2, '0')}`,
    kind: 'selected-activity',
    speaker: 'agent',
    eyebrow: '已预约',
    title: activity.title,
    activitySnapshot: {
      type: activity.type,
      schedule: activity.schedule,
      place: activity.place,
      duration: activity.durationType.replace(/^单次(?:开放体验)?\s*·\s*/, ''),
    },
    status: '已添加到日历，活动开始前会提醒',
    canCancel: true,
  }
}
