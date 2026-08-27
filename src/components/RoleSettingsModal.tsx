import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Code2, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Check, 
  RotateCcw,
  Sliders,
  Info
} from 'lucide-react';
import { ChatRolePreset } from '../types';
import { ROLE_PRESETS } from '../data/roles';

interface RoleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: ChatRolePreset;
  onSelectRole: (role: ChatRolePreset) => void;
  customInstruction: string;
  onChangeCustomInstruction: (text: string) => void;
  temperature: number;
  onChangeTemperature: (val: number) => void;
}

export const RoleSettingsModal: React.FC<RoleSettingsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  customInstruction,
  onChangeCustomInstruction,
  temperature,
  onChangeTemperature,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentRole.id);
  const [tempInstruction, setTempInstruction] = useState<string>(customInstruction);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: ChatRolePreset) => {
    setSelectedPresetId(preset.id);
    setTempInstruction(preset.systemInstruction);
  };

  const handleSave = () => {
    const activePreset = ROLE_PRESETS.find((p) => p.id === selectedPresetId) || {
      id: 'custom',
      name: 'Custom Persona',
      icon: 'Sparkles',
      description: 'Customized system instruction',
      systemInstruction: tempInstruction,
      starterPrompts: [],
    };

    onSelectRole({
      ...activePreset,
      systemInstruction: tempInstruction,
    });
    onChangeCustomInstruction(tempInstruction);
    onClose();
  };

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-4 h-4" />;
      case 'PenTool':
        return <PenTool className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="role-settings-modal"
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-neutral-800 text-sky-400 border border-neutral-700">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">Chatbot Persona & System Prompt</h2>
              <p className="text-xs text-neutral-400">Define the tone, specialty, and rules for Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            id="close-role-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-200 text-sm">
          {/* Preset Roles Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
              Choose a Role Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-neutral-800/90 border-sky-500/80 shadow-xs'
                        : 'bg-neutral-850/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {getRoleIcon(preset.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-neutral-200">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Instruction Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="system-instruction-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <span>Active System Instruction</span>
                <span className="text-[10px] text-neutral-500 lowercase font-normal">(Sent with each request)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const defaultAssistant = ROLE_PRESETS[0];
                  setTempInstruction(defaultAssistant.systemInstruction);
                  setSelectedPresetId(defaultAssistant.id);
                }}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Default
              </button>
            </div>
            <textarea
              id="system-instruction-input"
              rows={4}
              value={tempInstruction}
              onChange={(e) => setTempInstruction(e.target.value)}
              placeholder="e.g., You are an expert Python and TypeScript tutor..."
              className="w-full p-3 text-xs sm:text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 resize-none font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Guides Gemini's tone, formatting style, and behavioral constraints.
              </span>
              <span>{tempInstruction.length} chars</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label htmlFor="temperature-slider" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Temperature ({temperature})
              </label>
              <span className="text-xs text-neutral-400 font-mono">
                {temperature <= 0.3 ? 'Deterministic & Exact' : temperature <= 0.7 ? 'Balanced & Natural' : 'Creative & Exploratory'}
              </span>
            </div>
            <input
              id="temperature-slider"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer bg-neutral-800 h-1.5 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-role-btn"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-sky-500 hover:bg-sky-400 text-neutral-950 font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
