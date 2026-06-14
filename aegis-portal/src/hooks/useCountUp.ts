import React from 'react'

export function useCountUp(target: number, isActive: boolean, duration = 1200) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!isActive) return

    let frame = 0
    const totalFrames = Math.max(1, Math.round(duration / 16))

    function tick() {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))

      if (progress < 1) {
        window.requestAnimationFrame(tick)
      }
    }

    tick()
  }, [duration, isActive, target])

  return value
}
