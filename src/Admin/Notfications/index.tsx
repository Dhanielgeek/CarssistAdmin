import { useMemo, useRef, useState } from "react"
import axios from "../../Config/axiosconfig"
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  PaintBucket,
  Type,
  Quote,
  Code,
  List,
  ListOrdered,
} from "lucide-react"

// ---- Types -----------------------------------------------------------
// NOTE: this assumes a POST /admin/broadcast endpoint that accepts
// { audience, recipients?, message } and a GET that returns message
// history. Share the real endpoint shape and I'll wire the mapping in,
// the same way I did for Payments.

type Audience = "customers" | "riders" | "everyone" | "specific"

interface BroadcastMessage {
  id: string
  sender: string
  signature?: string
  timestamp: string
  content: string
}

const AUDIENCE_TABS: { key: Audience; label: string }[] = [
  { key: "customers", label: "Customers" },
  { key: "riders", label: "Riders" },
  { key: "everyone", label: "Everyonr" },
  { key: "specific", label: "Specific" },
]

// Formatting is applied as lightweight markdown wrapped around the
// current textarea selection, rather than contentEditable/execCommand —
// simpler to keep in sync with plain text sent to the backend.
type FormatAction =
  | { type: "wrap"; before: string; after?: string }
  | { type: "linePrefix"; prefix: string }

const TOOLBAR: { icon: React.ReactNode; label: string; action: FormatAction }[] = [
  { icon: <Bold size={16} />, label: "Bold", action: { type: "wrap", before: "**" } },
  { icon: <Italic size={16} />, label: "Italic", action: { type: "wrap", before: "_" } },
  { icon: <Strikethrough size={16} />, label: "Strikethrough", action: { type: "wrap", before: "~~" } },
  { icon: <Link size={16} />, label: "Link", action: { type: "wrap", before: "[", after: "](url)" } },
  { icon: <PaintBucket size={16} />, label: "Highlight", action: { type: "wrap", before: "==" } },
  { icon: <Type size={16} />, label: "Font size", action: { type: "wrap", before: "" } },
  { icon: <Quote size={16} />, label: "Quote", action: { type: "linePrefix", prefix: "> " } },
  { icon: <Code size={16} />, label: "Code", action: { type: "wrap", before: "`" } },
  { icon: <List size={16} />, label: "Bulleted list", action: { type: "linePrefix", prefix: "- " } },
  { icon: <ListOrdered size={16} />, label: "Numbered list", action: { type: "linePrefix", prefix: "1. " } },
]

// ---- Helpers -----------------------------------------------------------

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()

const formatDayLabel = (iso: string) => {
  const date = new Date(iso)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  if (isToday) return "Today"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

const groupByDay = (messages: BroadcastMessage[]) => {
  const groups: Record<string, BroadcastMessage[]> = {}
  messages.forEach((m) => {
    const label = formatDayLabel(m.timestamp)
    groups[label] = groups[label] ? [...groups[label], m] : [m]
  })
  return groups
}

// ---- Main component -----------------------------------------------------

const BroadcastMessages = () => {
  const token = localStorage.getItem("token")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [audience, setAudience] = useState<Audience>("customers")
  const [specificRecipients, setSpecificRecipients] = useState("")
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<BroadcastMessage[]>([])

  const grouped = useMemo(() => groupByDay(messages), [messages])

  const applyFormat = (action: FormatAction) => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd, value } = el
    const selected = value.slice(selectionStart, selectionEnd)

    let next = value
    let cursorStart = selectionStart
    let cursorEnd = selectionEnd

    if (action.type === "wrap") {
      const after = action.after ?? action.before
      next = value.slice(0, selectionStart) + action.before + selected + after + value.slice(selectionEnd)
      cursorStart = selectionStart + action.before.length
      cursorEnd = cursorStart + selected.length
    } else {
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1
      next = value.slice(0, lineStart) + action.prefix + value.slice(lineStart)
      cursorStart = selectionStart + action.prefix.length
      cursorEnd = selectionEnd + action.prefix.length
    }

    setDraft(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const handleSend = async () => {
    if (!draft.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await axios.post(
        "/admin/broadcast",
        {
          audience,
          recipients: audience === "specific" ? specificRecipients : undefined,
          message: draft,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessages((prev) => [
        ...prev,
        {
          id: res.data?.id ?? crypto.randomUUID(),
          sender: "Me",
          timestamp: new Date().toISOString(),
          content: draft,
        },
      ])
      setDraft("")
    } catch (err) {
      console.error("Failed to send broadcast:", err)
      setError("Couldn't send that message. Try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {Object.entries(grouped).map(([day, dayMessages]) => (
        <div key={day} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-200" />
            <p className="text-sm font-semibold text-neutral-800">{day}</p>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          {dayMessages.map((m) => (
            <div key={m.id} className="flex justify-end">
              <div className="flex max-w-2xl gap-3">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{formatTime(m.timestamp)}</span>
                    <span className="font-semibold text-neutral-600">{m.sender}</span>
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-blue-50 px-5 py-4 text-sm leading-relaxed text-neutral-700">
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.signature && <p className="mt-3 text-neutral-500">- {m.signature}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {messages.length === 0 && (
        <p className="py-10 text-center text-sm text-neutral-400">No broadcasts sent yet.</p>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-neutral-200">
        <div className="flex flex-wrap items-center gap-1 border-b border-neutral-100 px-3 py-2">
          {TOOLBAR.map((tool) => (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              onClick={() => applyFormat(tool.action)}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 px-3 pt-1">
          <span className="text-sm text-neutral-400">Send a message to</span>
          <div className="flex rounded-lg bg-neutral-100 p-1">
            {AUDIENCE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAudience(tab.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  audience === tab.key
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {audience === "specific" && (
          <input
            value={specificRecipients}
            onChange={(e) => setSpecificRecipients(e.target.value)}
            placeholder="Enter emails or user IDs, comma separated"
            className="mx-3 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        )}

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Write your message…"
          className="mx-3 mb-3 resize-none rounded-lg px-1 py-1 text-sm text-neutral-700 outline-none"
        />
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div>
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  )
}

export default BroadcastMessages