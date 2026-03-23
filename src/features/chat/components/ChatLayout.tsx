interface ChatLayoutProps {
  selector: React.ReactNode
  messageArea: React.ReactNode
  inputArea: React.ReactNode
  contextPanel: React.ReactNode
}

export function ChatLayout({
  selector,
  messageArea,
  inputArea,
  contextPanel,
}: ChatLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col min-w-0">
        {selector}
        <div className="flex-1 overflow-hidden">{messageArea}</div>
        {inputArea}
      </div>
      <div className="hidden xl:block">{contextPanel}</div>
    </div>
  )
}
