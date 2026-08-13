export type AppMode = 'map' | 'chat'
export type DemoMoment = 'day21' | 'day14'
export type ThemeId = 'expression' | 'career'
export type GrowthStage = '意图萌生' | '方向澄清' | '行动启动'
export type GrowthTrend = '正在推进' | '正在积累' | '节奏尚未形成'
export type NodeTone = 'insight' | 'challenge' | 'reflection' | 'action' | 'environment' | 'current'
export type NodeSize = 'small' | 'medium' | 'large'
export type MapNodeState = 'confirmed' | 'proposed' | 'preview' | 'future'

export type EvidencePreview = {
  id: string
  text: string
}

export type MapNode = {
  id: string
  themeId: ThemeId
  day: number
  label: string
  date?: string
  conclusion?: string
  evidence?: EvidencePreview[]
  tone: NodeTone
  size: NodeSize
  state: MapNodeState
  x: number
  currentWhen?: 'before-confirmation' | 'after-confirmation'
}

export type GrowthTheme = {
  id: ThemeId
  name: string
  stage: GrowthStage
  trend: GrowthTrend
  mapHeight: number
  nodes: MapNode[]
}

export type ActivityCandidate = {
  id: string
  type: string
  title: string
  schedule: string
  place: string
  commute: string
  price: number
  remaining: string
  deadline: string
  requirement: string
  reason: string
  friction: string
  durationType: string
  feedbackForm: string
  cancellationRule: string
  recordingRule: string
  arrangementEvidence: string[]
  alternativeDifference: string
  recommended?: boolean
}

export type EvaluatedActivity = ActivityCandidate & {
  available: boolean
  overBudgetBy: number
}

export type ChatEventKind =
  | 'message'
  | 'insight'
  | 'commitment'
  | 'review'
  | 'match'
  | 'selected-activity'
  | 'recording'
  | 'activity-memory'
  | 'growth-update'
  | 'system'

export type ChatEvent = {
  id: string
  day: number
  date: string
  time?: string
  kind: ChatEventKind
  speaker: 'agent' | 'user' | 'system'
  text?: string
  title?: string
  eyebrow?: string
  bullets?: string[]
  attachment?: string
  status?: string
  activitySnapshot?: {
    type: string
    schedule: string
    place: string
    duration: string
  }
  canCancel?: boolean
}

export type GrowthUpdateProposal = {
  id: string
  themeId: ThemeId
  proposedStage: GrowthStage
  responseState: 'awaiting' | 'confirmed' | 'corrected' | 'rejected'
}

export type OrbitState = {
  appMode: AppMode
  demoMoment: DemoMoment
  activeThemeId: ThemeId
  themes: Record<ThemeId, GrowthTheme>
  growthProposal: GrowthUpdateProposal | null
  chatHasUnread: boolean
  firstUnreadEventId: string | null
  chatDraft: string
  chatScrollTop: number
  chatEvents: ChatEvent[]
  selectedActivityId: string | null
  showUpdateAnimation: boolean
}
