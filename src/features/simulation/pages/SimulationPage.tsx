import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

import { useEnvironmentStore } from '@/features/environment/hooks/useEnvironmentStore'
import { useSimulationStore } from '../hooks/useSimulationStore'
import { useRunStatus } from '../hooks/useRunStatus'
import { useSimulationActions } from '../hooks/useSimulationActions'
import { useSimulationTimeline } from '../hooks/useSimulationTimeline'
import { useElapsedTime } from '../hooks/useElapsedTime'
import { useScrollAnchor } from '../hooks/useScrollAnchor'
import { simulationApi } from '@/api/simulation'

import { SimulationProgressBar } from '../components/SimulationProgressBar'
import { TwitterFeed } from '../components/TwitterFeed'
import { RedditFeed } from '../components/RedditFeed'
import { EventTimeline } from '../components/EventTimeline'
import { NewPostsIndicator } from '../components/NewPostsIndicator'

export function SimulationPage() {
  const { t } = useTranslation('simulation')
  const navigate = useNavigate()

  const envStore = useEnvironmentStore()
  const simStore = useSimulationStore()
  const simulationId = envStore.simulationId

  // Route guard
  useEffect(() => {
    if (!simulationId) {
      toast.error(t('empty.heading'))
      navigate('/environment')
    }
  }, [simulationId, navigate, t])

  // Sync simulation store with environment store
  useEffect(() => {
    if (simulationId) {
      simStore.setSimulationId(simulationId)
      if (simStore.step === 'idle') {
        simStore.setStep('running')
        simStore.setStartTime(Date.now())
      }
    }
  }, [simulationId])

  // Data hooks
  const runStatus = useRunStatus(simulationId)
  const twitterActions = useSimulationActions(simulationId, 'twitter')
  const redditActions = useSimulationActions(simulationId, 'reddit')
  const timeline = useSimulationTimeline(simulationId)

  const isRunning = runStatus.data?.data?.runner_status === 'running'
  const elapsed = useElapsedTime(simStore.startTime, isRunning)

  // Sync run status to store
  useEffect(() => {
    const status = runStatus.data?.data?.runner_status
    if (!status) return
    if (status === 'completed') simStore.setStep('completed')
    else if (status === 'failed') simStore.setStep('failed')
    else if (status === 'stopped') simStore.setStep('stopped')
  }, [runStatus.data?.data?.runner_status])

  // Scroll refs and anchors
  const twitterScrollRef = useRef<HTMLDivElement>(null)
  const redditScrollRef = useRef<HTMLDivElement>(null)
  const twitterAnchor = useScrollAnchor(twitterScrollRef)
  const redditAnchor = useScrollAnchor(redditScrollRef)

  // Track new post counts
  const prevTwitterCount = useRef(0)
  const prevRedditCount = useRef(0)
  const [newTwitterCount, setNewTwitterCount] = useState(0)
  const [newRedditCount, setNewRedditCount] = useState(0)

  const twitterActionsList = twitterActions.data?.data?.actions ?? []
  const redditActionsList = redditActions.data?.data?.actions ?? []

  useEffect(() => {
    const currentCount = twitterActionsList.length
    if (currentCount > prevTwitterCount.current) {
      setNewTwitterCount((prev) => prev + (currentCount - prevTwitterCount.current))
    }
    prevTwitterCount.current = currentCount
  }, [twitterActionsList.length])

  useEffect(() => {
    const currentCount = redditActionsList.length
    if (currentCount > prevRedditCount.current) {
      setNewRedditCount((prev) => prev + (currentCount - prevRedditCount.current))
    }
    prevRedditCount.current = currentCount
  }, [redditActionsList.length])

  // Reset counts when user scrolls to top
  useEffect(() => {
    if (twitterAnchor.isAtTop) setNewTwitterCount(0)
  }, [twitterAnchor.isAtTop])

  useEffect(() => {
    if (redditAnchor.isAtTop) setNewRedditCount(0)
  }, [redditAnchor.isAtTop])

  // Reset counts when round filter changes
  useEffect(() => {
    setNewTwitterCount(0)
    setNewRedditCount(0)
  }, [simStore.activeRoundFilter])

  // Compute activity counts
  const allActions = useMemo(
    () => [...twitterActionsList, ...redditActionsList],
    [twitterActionsList, redditActionsList],
  )

  const postCount = useMemo(
    () => allActions.filter((a) => a.action_type === 'post').length,
    [allActions],
  )
  const commentCount = useMemo(
    () => allActions.filter((a) => a.action_type === 'comment').length,
    [allActions],
  )
  const debateCount = useMemo(
    () => allActions.filter((a) => a.action_type === 'debate').length,
    [allActions],
  )
  const activeAgentCount = useMemo(
    () => new Set(allActions.map((a) => a.agent_id)).size,
    [allActions],
  )

  // Stop handler with AlertDialog state
  const [stopDialogOpen, setStopDialogOpen] = useState(false)

  const handleStopConfirm = async () => {
    if (!simulationId) return
    try {
      await simulationApi.stop({ simulation_id: simulationId })
    } catch {
      toast.error(t('error.heading'))
    }
    setStopDialogOpen(false)
  }

  // Navigation handlers
  const handleGoToReport = () => navigate('/report')
  const handleReturnToEnv = () => navigate('/environment')

  // Loading state
  if (!runStatus.data) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="text-center space-y-2">
          <LoadingSpinner />
          <p className="text-[13px] text-muted-foreground">{t('empty.heading')}</p>
          <p className="text-[13px] text-muted-foreground">{t('empty.body')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      {/* Stop confirmation dialog */}
      <AlertDialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('progress.stopConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('progress.stopConfirm.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('progress.stopConfirm.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleStopConfirm}>
              {t('progress.stopConfirm.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sticky progress bar */}
      <SimulationProgressBar
        runnerStatus={runStatus.data.data?.runner_status ?? 'running'}
        currentRound={runStatus.data.data?.current_round ?? 0}
        totalRounds={runStatus.data.data?.total_rounds ?? 0}
        progressPercent={runStatus.data.data?.progress_percent ?? 0}
        postCount={postCount}
        commentCount={commentCount}
        debateCount={debateCount}
        activeAgentCount={activeAgentCount}
        elapsed={elapsed}
        onStop={() => setStopDialogOpen(true)}
        onGoToReport={handleGoToReport}
        onReturnToEnv={handleReturnToEnv}
      />

      {/* Three-column content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Twitter feed -- left */}
        <div className="flex-1 border-r flex flex-col">
          <NewPostsIndicator
            count={newTwitterCount}
            onClick={() => { twitterAnchor.scrollToTop(); setNewTwitterCount(0) }}
            visible={!twitterAnchor.isAtTop && newTwitterCount > 0}
          />
          <ScrollArea className="flex-1" ref={twitterScrollRef}>
            <TwitterFeed
              actions={twitterActionsList}
              roundFilter={simStore.activeRoundFilter}
              highlightedEventId={simStore.highlightedEventId}
              scrollRef={twitterScrollRef}
            />
          </ScrollArea>
        </div>

        {/* Reddit feed -- middle */}
        <div className="flex-1 border-r flex flex-col">
          <NewPostsIndicator
            count={newRedditCount}
            onClick={() => { redditAnchor.scrollToTop(); setNewRedditCount(0) }}
            visible={!redditAnchor.isAtTop && newRedditCount > 0}
          />
          <ScrollArea className="flex-1" ref={redditScrollRef}>
            <RedditFeed
              actions={redditActionsList}
              roundFilter={simStore.activeRoundFilter}
              highlightedEventId={simStore.highlightedEventId}
              scrollRef={redditScrollRef}
            />
          </ScrollArea>
        </div>

        {/* Timeline -- right (288px fixed on xl, Sheet on smaller) */}
        <div className="hidden xl:block w-72 shrink-0">
          <ScrollArea className="h-full">
            <EventTimeline
              timeline={timeline.data?.data?.timeline ?? []}
              activeRoundFilter={simStore.activeRoundFilter}
              onRoundClick={(round) =>
                simStore.setActiveRoundFilter(round === simStore.activeRoundFilter ? null : round)
              }
              onEventClick={(eventId) => simStore.setHighlightedEventId(eventId)}
            />
          </ScrollArea>
        </div>

        {/* Tablet: Sheet drawer for timeline */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed right-4 bottom-4 z-20"
                aria-label={t('timeline.drawerToggle')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">{t('timeline.header')}</SheetTitle>
              <EventTimeline
                timeline={timeline.data?.data?.timeline ?? []}
                activeRoundFilter={simStore.activeRoundFilter}
                onRoundClick={(round) =>
                  simStore.setActiveRoundFilter(round === simStore.activeRoundFilter ? null : round)
                }
                onEventClick={(eventId) => simStore.setHighlightedEventId(eventId)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
