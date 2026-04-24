import { useEffect } from 'react'

export function useReveal(ref) {
  useEffect(() => {
    const el = ref?.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.reveal').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [ref])
}

export function useSkillBars(ref) {
  useEffect(() => {
    const el = ref?.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.currentTarget.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.dataset.w
          })
          observer.disconnect()
        }
      })
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}
