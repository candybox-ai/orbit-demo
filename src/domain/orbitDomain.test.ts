import { describe, expect, it } from 'vitest'
import {
  buildSelectedActivityEvent,
  buildOrbitPath,
  buildDemoReply,
  confirmGrowthUpdate,
  createInitialOrbitState,
  currentNode,
  evaluateActivities,
  fitPhoneCanvas,
  formatChatTimestamp,
  layoutGrowthMap,
  placeMapPopover,
  isNodeLocked,
  rejectGrowthUpdate,
  visibleNodes,
} from './orbitDomain'
import { activityCandidates, chatEvents } from '../data/demoData'

describe('Orbit growth update boundary', () => {
  it('keeps Day 21 map at the last confirmed stage while the proposal awaits a response', () => {
    const state = createInitialOrbitState('day21')

    expect(state.themes.expression.stage).toBe('方向澄清')
    expect(currentNode(state, 'expression')?.id).toBe('expression-direction')
    expect(visibleNodes(state, 'expression').map((node) => node.id)).not.toContain('expression-environment')
    expect(visibleNodes(state, 'expression').map((node) => node.id)).not.toContain('expression-action-started')
    expect(visibleNodes(state, 'expression').filter((node) => isNodeLocked(node)).map((node) => node.id)).toEqual([
      'expression-preview-next',
      'expression-preview-later',
    ])
  })

  it('commits the proposed stage and new landmarks only after confirmation', () => {
    const state = confirmGrowthUpdate(createInitialOrbitState('day21'))

    expect(state.themes.expression.stage).toBe('行动启动')
    expect(state.themes.expression.trend).toBe('节奏尚未形成')
    expect(currentNode(state, 'expression')?.id).toBe('expression-action-started')
    expect(visibleNodes(state, 'expression').map((node) => node.id)).toContain('expression-environment')
    expect(isNodeLocked(visibleNodes(state, 'expression').find((node) => node.id === 'expression-environment')!)).toBe(false)
    expect(visibleNodes(state, 'expression').filter((node) => isNodeLocked(node)).map((node) => node.id)).toEqual([
      'expression-future-rhythm',
      'expression-future-feedback',
    ])
    expect(state.showUpdateAnimation).toBe(true)
  })

  it('keeps unopened landmarks generic instead of predicting future conclusions', () => {
    const state = confirmGrowthUpdate(createInitialOrbitState('day21'))
    const futureLabels = visibleNodes(state, 'expression')
      .filter((node) => isNodeLocked(node))
      .map((node) => node.label)

    expect(futureLabels).toEqual(['下一步', '尚未开启'])
  })

  it('keeps the current landmark available when switching to a theme without a new proposal', () => {
    const state = confirmGrowthUpdate(createInitialOrbitState('day21'))

    expect(currentNode(state, 'career')?.id).toBe('career-no-rush')
  })

  it('keeps the official map unchanged after rejection', () => {
    const state = rejectGrowthUpdate(createInitialOrbitState('day21'))

    expect(state.themes.expression.stage).toBe('方向澄清')
    expect(currentNode(state, 'expression')?.id).toBe('expression-direction')
    expect(visibleNodes(state, 'expression').map((node) => node.id)).not.toContain('expression-environment')
    expect(visibleNodes(state, 'expression').filter((node) => isNodeLocked(node))).toHaveLength(2)
  })

  it('resets Day 14 to matching with no selected activity or stage proposal', () => {
    const state = createInitialOrbitState('day14')

    expect(state.selectedActivityId).toBeNull()
    expect(state.growthProposal).toBeNull()
    expect(state.firstUnreadEventId).toBe('d14-m1')
    expect(state.chatEvents.at(-1)?.id).toBe('d14-m1')
  })
})

describe('growth map layout', () => {
  it('shows two neutral future landmarks above the current career landmark', () => {
    const state = createInitialOrbitState('day21')
    const nodes = visibleNodes(state, 'career')

    expect(nodes.map(({ day, label, state }) => ({ day, label, state }))).toEqual([
      { day: 1, label: '想有属于自己的东西', state: 'confirmed' },
      { day: 12, label: '先不把表达等同于转型', state: 'confirmed' },
      { day: 17, label: '下一步', state: 'preview' },
      { day: 22, label: '尚未开启', state: 'preview' },
    ])
  })

  it('keeps career future landmarks visible when an expression update is confirmed', () => {
    const state = confirmGrowthUpdate(createInitialOrbitState('day21'))

    expect(visibleNodes(state, 'career').map((node) => node.id)).toEqual([
      'career-own-thing',
      'career-no-rush',
      'career-preview-next',
      'career-preview-later',
    ])
  })

  it('grows upward from Day 1 and makes longer day gaps visibly longer', () => {
    const state = createInitialOrbitState('day21')
    const layout = layoutGrowthMap(visibleNodes(state, 'expression'), 800)
    const byDay = new Map(layout.nodes.map((node) => [node.day, node.y]))

    expect(layout.nodes.map((node) => node.day)).toEqual([1, 3, 8, 11, 14, 18, 21])
    expect(byDay.get(1)!).toBeGreaterThan(byDay.get(21)!)
    expect(byDay.get(3)! - byDay.get(8)!).toBeGreaterThan(byDay.get(1)! - byDay.get(3)!)
    expect(byDay.get(8)! - byDay.get(11)!).toBeGreaterThan(byDay.get(1)! - byDay.get(3)!)
  })

  it('keeps compact but usable space above and below the route', () => {
    const state = createInitialOrbitState('day21')
    const layout = layoutGrowthMap(visibleNodes(state, 'expression'), 800)
    const topNodeY = Math.min(...layout.nodes.map((node) => node.y))
    const bottomNodeY = Math.max(...layout.nodes.map((node) => node.y))

    expect(topNodeY).toBeGreaterThanOrEqual(96)
    expect(topNodeY).toBeLessThanOrEqual(144)
    expect(layout.height - bottomNodeY).toBeGreaterThanOrEqual(96)
    expect(layout.height - bottomNodeY).toBeLessThanOrEqual(144)
  })

  it('keeps the current career landmark centerable after adding future landmarks', () => {
    const state = createInitialOrbitState('day21')
    const layout = layoutGrowthMap(visibleNodes(state, 'career'), 800)
    const currentY = layout.nodes.find((node) => node.id === 'career-no-rush')!.y
    const oldestY = Math.max(...layout.nodes.map((node) => node.y))

    expect(currentY).toBeGreaterThanOrEqual(400)
    expect(currentY - 400).toBeLessThanOrEqual(layout.height - 800)
    expect(layout.height - oldestY).toBeGreaterThanOrEqual(96)
    expect(layout.height - oldestY).toBeLessThanOrEqual(144)
  })

  it('draws a curved orbit rather than a straight polyline', () => {
    expect(buildOrbitPath([{ x: 40, y: 100 }, { x: 65, y: 240 }, { x: 35, y: 410 }])).toBe(
      'M 40 100 C 40 170, 65 170, 65 240 C 65 325, 35 325, 35 410',
    )
  })

  it('keeps a landmark popover inside the phone safe area near every edge', () => {
    expect(placeMapPopover({
      anchorX: 352,
      anchorY: 72,
      popoverWidth: 200,
      popoverHeight: 124,
      viewportWidth: 390,
      viewportHeight: 844,
    })).toEqual({ left: 128, top: 94 })

    expect(placeMapPopover({
      anchorX: 28,
      anchorY: 804,
      popoverWidth: 200,
      popoverHeight: 124,
      viewportWidth: 390,
      viewportHeight: 844,
    })).toEqual({ left: 52, top: 626 })
  })
})

describe('activity availability', () => {
  it('ships decision-ready details and a traceable matching basis for every candidate', () => {
    expect(activityCandidates).toHaveLength(3)
    for (const activity of activityCandidates) {
      expect(activity.durationType).toBeTruthy()
      expect(activity.feedbackForm).toBeTruthy()
      expect(activity.cancellationRule).toBeTruthy()
      expect(activity.recordingRule).toBeTruthy()
      expect(activity.arrangementEvidence.length).toBeGreaterThan(0)
      expect(activity.alternativeDifference).toBeTruthy()
    }
  })

  it('shows the exact budget gap without hiding candidates', () => {
    const results = evaluateActivities(activityCandidates, 100)

    expect(results.map(({ id, available, overBudgetBy }) => ({ id, available, overBudgetBy }))).toEqual([
      { id: 'community-open-day', available: true, overBudgetBy: 0 },
      { id: 'host-session', available: false, overBudgetBy: 29 },
      { id: 'workshop', available: false, overBudgetBy: 69 },
    ])
  })

  it('restores all candidates when the budget returns to 200', () => {
    expect(evaluateActivities(activityCandidates, 200).every((activity) => activity.available)).toBe(true)
  })

  it('builds the follow-up arrangement from the activity the user actually selected', () => {
    const workshop = activityCandidates.find((activity) => activity.id === 'workshop')!
    const event = buildSelectedActivityEvent(workshop, 123)

    expect(event.title).toBe(workshop.title)
    expect(event.activitySnapshot).toEqual({
      type: workshop.type,
      schedule: workshop.schedule,
      place: workshop.place,
      duration: '3.5 小时',
    })
    expect(event.status).toBe('已添加到日历，活动开始前会提醒')
    expect(event.canCancel).toBe(true)
  })

  it('puts the recommended activity first without hiding the alternatives', () => {
    const ordered = evaluateActivities(activityCandidates, 200)
    expect(ordered.map((activity) => activity.id)).toEqual(['community-open-day', 'host-session', 'workshop'])
  })
})

describe('demo conversation response', () => {
  it('responds to the meaning of an unfamiliar message instead of using a generic acknowledgement', () => {
    const reply = buildDemoReply('我每次写到一半就开始怀疑这个选题值不值得发')
    expect(reply).toContain('写到一半')
    expect(reply).not.toMatch(/收到了|我记下了|最想先聊哪一件/)
  })
})

describe('activity matching context', () => {
  it('uses authorized location and calendar context before asking the user for a time preference', () => {
    const day13Messages = chatEvents.filter((event) => event.day === 13).map((event) => event.text)

    expect(day13Messages[0]).toContain('你授权的定位和日历')
    expect(day13Messages[0]).toContain('上海')
    expect(day13Messages[0]).toContain('周六下午和周日全天')
    expect(day13Messages[0]).toContain('更倾向哪个时间段')
  })
})

describe('conversation continuity', () => {
  it('responds to the concrete progress after the user commits to a draft', () => {
    const userEventIndex = chatEvents.findIndex((event) => event.id === 'd6-u1')
    const response = chatEvents[userEventIndex + 1]

    expect(response.kind).toBe('message')
    expect(response.speaker).toBe('agent')
    expect(response.text).toContain('补了两段')
    expect(response.text).toContain('不再换')
  })

  it('renders the schedule check as a normal two-way conversation', () => {
    const day7Events = chatEvents.filter((event) => event.day === 7)

    expect(day7Events.map(({ kind, speaker, text }) => ({ kind, speaker, text }))).toEqual([
      { kind: 'message', speaker: 'agent', text: '明晚九点，约定还算数吗？' },
      { kind: 'message', speaker: 'user', text: '算，还是按原时间。' },
    ])
  })

  it('acknowledges both the action and relief after the first post is published', () => {
    const publishEventIndex = chatEvents.findIndex((event) => event.id === 'd8-u1')
    const response = chatEvents[publishEventIndex + 1]

    expect(response.kind).toBe('message')
    expect(response.speaker).toBe('agent')
    expect(response.text).toContain('真的发出去了')
    expect(response.text).toContain('也就这么过去了')
    expect(response.text).toContain('今天先到这儿')
  })

  it('formats date separators like an IM timestamp without exposing demo day numbers', () => {
    expect(formatChatTimestamp({ date: '8月3日', time: '10:24' })).toBe('8月3日 10:24')
    expect(formatChatTimestamp({ date: '今天', time: '10:20' })).toBe('今天 10:20')
  })
})

describe('phone canvas fitting', () => {
  it('scales the complete 390 × 844 app canvas as one unit in a short desktop viewport', () => {
    expect(fitPhoneCanvas(673, 719)).toEqual({
      scale: 0.8,
      width: 312,
      height: 675.2,
    })
  })

  it('never enlarges the canvas beyond its authored mobile size', () => {
    expect(fitPhoneCanvas(1366, 900)).toEqual({
      scale: 1,
      width: 390,
      height: 844,
    })
  })
})
