import React, { useRef, useEffect } from 'react';
import { Send, Square, Zap, Cpu, Gauge } from 'lucide-react';
import { GeminiModelId } from '../types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  currentModel: GeminiModelId;
  onSelectModel: (modelId: GeminiModelId) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  currentModel,
  onSelectModel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isStreaming) {
        onSend();
      }
    }
  };

  return (
    <div id="chat-input-container" className="sticky bottom-0 z-20 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-850 px-4 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Model Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 shrink-0">Model:</span>
          
          <button
            type="button"
            id="pill-model-flash"
            onClick={() => onSelectModel('gemini-3.5-flash')}
            disabled={isStreaming}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
              currentModel === 'gemini-3.5-flash'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>3.5 Flash (General)</span>
          </button>

          <button
            type="button"
            id="pill-model-pro"
            onClick={() => onSelectModel('gemini-3.1-pro-preview')}
            disabled={isStreaming}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
              currentModel === 'gemini-3.1-pro-preview'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>3.1 Pro (Complex)</span>
          </button>

          <button
            type="button"
            id="pill-model-lite"
            onClick={() => onSelectModel('gemini-3.1-flash-lite')}
            disabled={isStreaming}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
              currentModel === 'gemini-3.1-flash-lite'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>3.1 Flash Lite (Fast)</span>
          </button>
        </div>

        {/* Input Textarea Form */}
        <div className="relative flex items-end gap-2 bg-neutral-900 border border-neutral-750 focus-within:border-sky-500/80 focus-within:ring-1 focus-within:ring-sky-500/30 rounded-2xl p-2 sm:p-2.5 shadow-lg transition-all">
          <textarea
            ref={textareaRef}
            id="chat-textarea"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini anything... (Shift+Enter for newline)"
            className="flex-1 max-h-44 bg-transparent border-0 text-neutral-100 placeholder-neutral-500 text-sm sm:text-base focus:outline-none resize-none px-2 py-1 leading-relaxed"
          />

          {isStreaming ? (
            <button
              type="button"
              id="stop-generation-btn"
              onClick={onStop}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium shadow-md transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Stop generating"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              type="button"
              id="send-message-btn"
              onClick={onSend}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 font-semibold shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Helper footer */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <span>Gemini multi-turn conversation retains full context.</span>
          <span>{input.length > 0 ? `${input.length} chars` : 'Enter to send'}</span>
        </div>
      </div>
    </div>
  );
};
