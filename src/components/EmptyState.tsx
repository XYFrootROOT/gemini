import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Code2, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  Cpu, 
  Gauge,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { ChatRolePreset, GeminiModelId } from '../types';
import { GEMINI_MODELS } from '../data/roles';

interface EmptyStateProps {
  currentRole: ChatRolePreset;
  currentModel: GeminiModelId;
  onSelectPrompt: (promptText: string) => void;
  onOpenRoleModal: () => void;
  onSelectModel: (modelId: GeminiModelId) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentRole,
  currentModel,
  onSelectPrompt,
  onOpenRoleModal,
  onSelectModel,
}) => {
  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-amber-400" />;
      default:
        return <Bot className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div id="chat-empty-state" className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      {/* Hero Icon */}
      <div className="relative mb-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-xl">
          {getRoleIcon(currentRole.icon)}
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neutral-800 border border-neutral-700 text-sky-400">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      {/* Role Title & Description */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100 mb-2">
        {currentRole.name}
      </h2>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mb-4 leading-relaxed">
        {currentRole.description}
      </p>

      {/* Role config button pill */}
      <button
        onClick={onOpenRoleModal}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-xs text-neutral-300 transition-colors mb-8 cursor-pointer"
        id="empty-state-customize-role-btn"
      >
        <Sliders className="w-3.5 h-3.5 text-neutral-400" />
        <span>Customize System Prompt</span>
      </button>

      {/* Model Cards Guide */}
      <div className="w-full mb-8 text-left">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3 text-center sm:text-left">
          Available Gemini Models
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {GEMINI_MODELS.filter(m => ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite'].includes(m.id)).map((model) => {
            const isSelected = currentModel === model.id;
            return (
              <button
                key={model.id}
                onClick={() => onSelectModel(model.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-850 border-sky-500/80 shadow-md ring-1 ring-sky-500/20'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-850/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-200">{model.name}</span>
                  {model.id === 'gemini-3.5-flash' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                  {model.id === 'gemini-3.1-pro-preview' && <Cpu className="w-3.5 h-3.5 text-indigo-400" />}
                  {model.id === 'gemini-3.1-flash-lite' && <Gauge className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="text-[11px] font-medium text-neutral-400 mb-1">{model.tagline}</div>
                <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2">{model.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Starter Prompts */}
      {currentRole.starterPrompts && currentRole.starterPrompts.length > 0 && (
        <div className="w-full text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3 text-center sm:text-left">
            Suggested Conversation Starters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentRole.starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`starter-prompt-${idx}`}
                onClick={() => onSelectPrompt(prompt)}
                className="group p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
              >
                <span className="text-xs text-neutral-300 group-hover:text-white leading-relaxed">
                  {prompt}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-sky-400 shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
