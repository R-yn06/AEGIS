import React from 'react'

export function useScrollState(threshold = 12) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
