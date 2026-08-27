import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { RoleSettingsModal } from './components/RoleSettingsModal';
import { ChatMessage as ChatMessageType, GeminiModelId, ChatRolePreset } from './types';
import { ROLE_PRESETS } from './data/roles';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_chat_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentModel, setCurrentModel] = useState<GeminiModelId>('gemini-3.5-flash');
  const [currentRole, setCurrentRole] = useState<ChatRolePreset>(ROLE_PRESETS[0]);
  const [customInstruction, setCustomInstruction] = useState<string>(ROLE_PRESETS[0].systemInstruction);
  const [temperature, setTemperature] = useState<number>(0.7);

  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gemini_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to local storage:', e);
    }
  }, [messages]);

  // Smooth auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isStreaming]);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isStreaming) return;

    // Reset input field if we sent from state
    if (!textToSend) {
      setInput('');
    }

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    const newMessagesHistory = [...messages, userMessage];
    setMessages(newMessagesHistory);

    // Prepare assistant placeholder message
    const assistantMessageId = `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const assistantPlaceholder: ChatMessageType = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      modelUsed: currentModel,
    };

    setMessages([...newMessagesHistory, assistantPlaceholder]);
    setIsStreaming(true);

    // Create abort controller for streaming
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessagesHistory.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            text: m.content,
          })),
          systemInstruction: customInstruction || currentRole.systemInstruction,
          model: currentModel,
          temperature,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedContent += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (parseErr) {
              // Ignore non-JSON partial data lines
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
      } else {
        console.error('Chat stream error:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: err.message || 'An error occurred while generating response.',
                  isError: true,
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    handleStopGeneration();
    setMessages([]);
    try {
      localStorage.removeItem('gemini_chat_messages');
    } catch (e) {
      console.warn('Failed to clear local storage:', e);
    }
  };

  const handleRetryLast = () => {
    if (messages.length === 0 || isStreaming) return;
    
    // Find the last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    const actualUserIdx = messages.length - 1 - lastUserIndex;
    const userPrompt = messages[actualUserIdx].content;

    // Prune messages up to that user message
    const pruned = messages.slice(0, actualUserIdx);
    setMessages(pruned);
    handleSendMessage(userPrompt);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Header */}
      <Header
        currentModel={currentModel}
        onSelectModel={setCurrentModel}
        currentRole={currentRole}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onClearChat={handleClearChat}
        messageCount={messages.length}
        isStreaming={isStreaming}
      />

      {/* Main Chat Thread Container */}
      <main id="chat-thread-container" className="flex-1 flex flex-col justify-between overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState
            currentRole={currentRole}
            currentModel={currentModel}
            onSelectPrompt={(prompt) => {
              setInput(prompt);
              handleSendMessage(prompt);
            }}
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
            onSelectModel={setCurrentModel}
          />
        ) : (
          <div className="w-full flex-1 divide-y divide-neutral-900/60 pb-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                onRetry={handleRetryLast}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Bottom Sticky Chat Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        onStop={handleStopGeneration}
        isStreaming={isStreaming}
        currentModel={currentModel}
        onSelectModel={setCurrentModel}
      />

      {/* Role & System Instruction Settings Modal */}
      <RoleSettingsModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        customInstruction={customInstruction}
        onChangeCustomInstruction={setCustomInstruction}
        temperature={temperature}
        onChangeTemperature={setTemperature}
      />
    </div>
  );
}
