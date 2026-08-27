import React from 'react';
import { 
  Sparkles, 
  Trash2, 
  Settings2, 
  ChevronDown, 
  Bot, 
  Code2, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  Cpu, 
  Gauge 
} from 'lucide-react';
import { GeminiModelId, ModelOption, ChatRolePreset } from '../types';
import { GEMINI_MODELS } from '../data/roles';

interface HeaderProps {
  currentModel: GeminiModelId;
  onSelectModel: (modelId: GeminiModelId) => void;
  currentRole: ChatRolePreset;
  onOpenRoleModal: () => void;
  onClearChat: () => void;
  messageCount: number;
  isStreaming: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  currentRole,
  onOpenRoleModal,
  onClearChat,
  messageCount,
  isStreaming,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModelObj = GEMINI_MODELS.find((m) => m.id === currentModel) || GEMINI_MODELS[0];

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-3.5 h-3.5" />;
      case 'PenTool':
        return <PenTool className="w-3.5 h-3.5" />;
      case 'Briefcase':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-3.5 h-3.5" />;
      default:
        return <Bot className="w-3.5 h-3.5" />;
    }
  };

  const getModelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Gauge':
        return <Gauge className="w-3.5 h-3.5 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <header id="chat-header" className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm sm:text-base tracking-tight text-neutral-100">
                Gemini Chat
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                Multi-Turn
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Model Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="model-selector-btn"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              disabled={isStreaming}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Change Gemini Model"
            >
              {getModelIcon(activeModelObj.iconName)}
              <span className="hidden sm:inline font-medium">{activeModelObj.name}</span>
              <span className="sm:hidden font-medium">{activeModelObj.speed}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {modelDropdownOpen && (
              <div 
                id="model-dropdown-menu"
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-neutral-900 border border-neutral-750 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                  Select Gemini Model
                </div>
                <div className="space-y-1">
                  {GEMINI_MODELS.map((model) => {
                    const isSelected = model.id === currentModel;
                    return (
                      <button
                        key={model.id}
                        id={`select-model-${model.id}`}
                        onClick={() => {
                          onSelectModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border border-neutral-700 text-white'
                            : 'hover:bg-neutral-850 text-neutral-300'
                        }`}
                      >
                        <div className="mt-0.5 p-1 rounded bg-neutral-800 border border-neutral-700">
                          {getModelIcon(model.iconName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-neutral-200">
                              {model.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                              {model.speed}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug truncate">
                            {model.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Role & System Instruction Button */}
          <button
            id="role-settings-btn"
            onClick={onOpenRoleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            title="Configure Chatbot Role & System Instructions"
          >
            {getRoleIcon(currentRole.icon)}
            <span className="hidden md:inline truncate max-w-[130px]">{currentRole.name}</span>
            <Settings2 className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
          </button>

          {/* Clear / Reset Chat Button */}
          {messageCount > 0 && (
            <button
              id="clear-chat-btn"
              onClick={onClearChat}
              disabled={isStreaming}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-800/50 border border-neutral-700 text-xs text-neutral-400 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Reset conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
