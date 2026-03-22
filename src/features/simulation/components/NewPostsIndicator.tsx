import { useTranslation } from 'react-i18next'

interface NewPostsIndicatorProps {
  count: number
  onClick: () => void
  visible: boolean
}

export function NewPostsIndicator({ count, onClick, visible }: NewPostsIndicatorProps) {
  const { t } = useTranslation('simulation')

  if (!visible || count <= 0) return null

  return (
    <div
      className="sticky top-0 z-5 animate-in fade-in slide-in-from-top-1 duration-150 cursor-pointer bg-primary text-primary-foreground px-4 py-2 text-[13px] font-semibold text-center"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}
    >
      {t('feed.newPosts', { count })}
    </div>
  )
}
