import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry, isLast }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(message.timestamp));

  return (
    <div
      id={`message-${message.id}`}
      className={`group relative w-full py-4 px-4 sm:px-6 transition-colors ${
        isUser
          ? 'bg-neutral-900/40 border-b border-neutral-800/40'
          : 'bg-neutral-950 border-b border-neutral-800/60'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-3 sm:gap-4 items-start">
        {/* Avatar */}
        <div
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-semibold select-none shadow-sm ${
            isUser
              ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
              : message.isError
              ? 'bg-red-950 text-red-300 border border-red-800/60'
              : 'bg-linear-to-tr from-sky-600 to-indigo-600 text-white shadow-sky-950/40'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-neutral-300" />
          ) : message.isError ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header row with role tag, model tag & actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-200">
                {isUser ? 'You' : 'Gemini'}
              </span>
              {!isUser && message.modelUsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-850 text-neutral-400 border border-neutral-800 font-mono">
                  {message.modelUsed}
                </span>
              )}
              <span className="text-[10px] text-neutral-500">{formattedTime}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={copyToClipboard}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy message content"
                id={`copy-btn-${message.id}`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {!isUser && isLast && onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Regenerate response"
                  id={`retry-btn-${message.id}`}
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Main text / Markdown */}
          {message.isError ? (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-red-300 text-sm leading-relaxed">
              <p className="font-medium text-red-200 mb-1">Failed to generate response</p>
              <p className="text-xs text-red-300/90">{message.content}</p>
            </div>
          ) : isUser ? (
            <div className="text-neutral-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words font-normal">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-neutral-200 leading-relaxed break-words">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="relative my-3 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-inner">
                      <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-neutral-200" {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => {
                    const isInline = !props.className;
                    return isInline ? (
                      <code className="px-1.5 py-0.5 rounded bg-neutral-850 text-sky-300 font-mono text-xs border border-neutral-800" {...props} />
                    ) : (
                      <code {...props} />
                    );
                  },
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-neutral-700 pl-3 my-2 text-neutral-400 italic">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="my-3 overflow-x-auto rounded-lg border border-neutral-800">
                      <table className="min-w-full divide-y divide-neutral-800 text-xs sm:text-sm text-left">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-neutral-850 px-3 py-2 text-neutral-300 font-semibold border-b border-neutral-800">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 border-b border-neutral-850/60 text-neutral-300">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
