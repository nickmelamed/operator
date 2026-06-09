const GmailLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
    />
  </svg>
);

const SlackLogo = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path
      fill="#E01E5A"
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
    />
    <path
      fill="#36C5F0"
      d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
    />
    <path
      fill="#2EB67D"
      d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.162 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
    />
    <path
      fill="#ECB22E"
      d="M15.162 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.162 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.271a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.162a2.528 2.528 0 0 1-2.525 2.523h-6.313z"
    />
  </svg>
);

function GmailModal({ action }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl">
      {/* Chrome-style tab bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#dee1e6]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-2 bg-white rounded-md px-3 py-1 text-xs text-gray-500 flex items-center gap-2">
          <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          </svg>
          mail.google.com
        </div>
      </div>

      {/* Gmail nav bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200">
        <GmailLogo />
        <span className="text-gray-600 text-xl font-normal tracking-tight" style={{ fontFamily: 'Google Sans, sans-serif' }}>Gmail</span>
        <div className="flex-1" />
        <div className="text-xs text-gray-400">sarah@meridiancreative.co</div>
      </div>

      {/* Email subject line bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-normal flex-1">{action.subject}</h2>
        <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full font-medium">Sent</span>
      </div>

      {/* Sender / metadata */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4285f4] flex items-center justify-center text-white text-sm font-medium shrink-0">
          SM
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Sarah Mitchell</span>
            <span className="text-xs text-gray-500">&lt;sarah@meridiancreative.co&gt;</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            to <span className="text-gray-700">{action.to}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 shrink-0">Mon, Jun 2, 2026, 3:14 PM</div>
      </div>

      {/* Email body */}
      <div className="px-6 py-5 bg-white text-sm text-gray-800 leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
        {action.draft}
      </div>

      {/* Copilot sent footer */}
      <div className="px-6 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-green-700 text-xs font-medium">Sent via Operations Copilot</span>
      </div>
    </div>
  );
}

function SlackModal({ action }) {
  return (
    <div className="bg-[#1a1d21] rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl border border-[#2c2e33]">
      {/* Chrome-style tab bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2c2e33]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-2 bg-[#1a1d21] rounded-md px-3 py-1 text-xs text-gray-400 flex items-center gap-2">
          <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          </svg>
          app.slack.com
        </div>
      </div>

      {/* Slack top nav */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2c2e33] bg-[#19171d]">
        <SlackLogo />
        <div>
          <div className="text-white text-sm font-bold">Meridian Creative</div>
          <div className="text-gray-400 text-xs flex items-center gap-1">
            <span className="text-green-400">●</span> Active
          </div>
        </div>
        <div className="flex-1" />
        <div className="text-gray-400 text-sm font-semibold">{action.to}</div>
      </div>

      {/* Channel header */}
      <div className="px-4 py-3 border-b border-[#2c2e33] flex items-center gap-2">
        <span className="text-gray-300 text-base font-bold"># {action.to.replace("#", "")}</span>
        <span className="text-gray-600 text-xs">3 members</span>
      </div>

      {/* Message */}
      <div className="px-4 py-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            SM
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white text-sm font-bold">sarah.mitchell</span>
              <span className="text-gray-500 text-xs">3:14 PM</span>
              <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-medium">
                via Copilot
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-1 whitespace-pre-line">
              {action.draft}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#2c2e33] flex items-center gap-2">
        <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-green-400 text-xs font-medium">Sent via Operations Copilot</span>
      </div>
    </div>
  );
}

export default function MessageModal({ action }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="absolute inset-0 backdrop-blur-md bg-black/70" />
      <div className="relative z-10 w-full max-w-2xl">
        {action.channel === "gmail" ? (
          <GmailModal action={action} />
        ) : (
          <SlackModal action={action} />
        )}
      </div>
    </div>
  );
}
