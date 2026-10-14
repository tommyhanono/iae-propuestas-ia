import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NODES, WORLDS } from './data'
import { StageCtx, groupV } from './components/primitives'
import { NODE_VIEWS } from './views'
import { useReduced } from './lib/useReduced'

interface Props {
  index: number
  notesOpen: boolean
  onNext: () => void
  onPrev: () => void
  onSettled: (settled: boolean) => void
}

export default function MobileDeck({ index, notesOpen, onNext, onPrev, onSettled }: Props) {
  const reduced = useReduced()
  const prev = useRef(index)
  const [dir, setDir] = useState(1)
  const [run, setRun] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setDir(index >= prev.current ? 1 : -1)
    prev.current = index
    setRun(false)
    onSettled(false)
    scroller.current?.scrollTo({ top: 0 })
  }, [index, onSettled])

  const node = NODES[index]
  const View = NODE_VIEWS[index]

  return (
    <>
      <div className="canvas-bg" aria-hidden>
        <div className="glow gold" />
        <div className="glow cian" />
        <div className="glow silver" />
        <div className="grain" />
        <div className="vignette" />
      </div>
      <div
        ref={scroller}
        className="mobile-scroller fixed inset-x-0 top-14 overflow-y-auto overflow-x-hidden"
        style={{ bottom: 0, paddingBottom: notesOpen ? 'calc(45vh + 96px)' : 96 }}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
        onTouchEnd={(e) => {
          const t0 = touch.current
          touch.current = null
          if (!t0) return
          const dx = e.changedTouches[0].clientX - t0.x
          const dy = e.changedTouches[0].clientY - t0.y
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? onNext : onPrev)()
        }}
      >
        <div className="px-4 pb-4 pt-2">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.section
              key={node.key}
              data-node={node.key}
              data-active
              aria-label={node.world === 'lobby' ? 'Lobby' : `${WORLDS[node.world].name} ${node.n}: ${node.short}`}
              className={`node w-${node.world} relative mx-auto w-full max-w-[760px]`}
              style={{ position: 'relative', borderRadius: 22 }}
              custom={dir}
              variants={{
                enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, rotateY: d * 55, x: d * 70, scale: 0.86, transformPerspective: 1100 }),
                center: { opacity: 1, rotateY: 0, x: 0, scale: 1, transformPerspective: 1100 },
                exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, rotateY: d * -55, x: d * -70, scale: 0.86, transformPerspective: 1100 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.18 : 0.42, ease: [0.22, 0.9, 0.3, 1] }}
              onAnimationComplete={(def) => { if (def === 'center') { setRun(true); onSettled(true) } }}
            >
              <StageCtx.Provider value={{ run, compact: true }}>
                <motion.div className="node-inner !h-auto !overflow-visible !p-5" variants={groupV} initial="hidden" animate={run || reduced ? 'show' : 'hidden'}>
                  <View />
                </motion.div>
              </StageCtx.Provider>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
