import React from 'react';
import { AlertCircle } from 'lucide-react';
import ProviderModelsCard from './ProviderModelsCard';

const AiTaskSettings = ({ taskConfig, onChange }) => {
  const { primaryProvider, fallbackProvider, providers } = taskConfig;

  const handlePrimaryChange = (e) => {
    const newPrimary = e.target.value;
    const newFallback = newPrimary === 'groq' ? 'gemini' : 'groq';
    
    onChange({
      ...taskConfig,
      primaryProvider: newPrimary,
      fallbackProvider: newFallback
    });
  };

  const handleModelsChange = (providerName, newModels) => {
    onChange({
      ...taskConfig,
      providers: {
        ...providers,
        [providerName]: {
          ...providers[providerName],
          models: newModels
        }
      }
    });
  };

  const groqHasModels = providers.groq.models.length > 0;
  const geminiHasModels = providers.gemini.models.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-base-200/30 p-4 rounded-xl border border-base-200">
        <div className="flex-1">
          <label className="block text-sm font-medium text-base-content/80 mb-2">
            Primary Provider
          </label>
          <select 
            className="select select-bordered w-full md:max-w-xs"
            value={primaryProvider}
            onChange={handlePrimaryChange}
          >
            <option value="groq" disabled={!groqHasModels}>
              Groq {!groqHasModels && '(No models)'}
            </option>
            <option value="gemini" disabled={!geminiHasModels}>
              Gemini {!geminiHasModels && '(No models)'}
            </option>
          </select>
          {((!groqHasModels && primaryProvider !== 'groq') || (!geminiHasModels && primaryProvider !== 'gemini')) && (
            <p className="text-xs text-base-content/50 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Add at least one model before using a provider as Primary.
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-base-content/80 mb-2">
            Fallback Provider
          </label>
          <div className="px-4 py-3 bg-base-200 rounded-lg border border-base-300 text-base-content/60 font-medium w-full md:max-w-xs capitalize cursor-not-allowed">
            {fallbackProvider}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProviderModelsCard 
          providerName="groq"
          isPrimary={primaryProvider === 'groq'}
          models={providers.groq.models}
          onChange={(m) => handleModelsChange('groq', m)}
        />
        <ProviderModelsCard 
          providerName="gemini"
          isPrimary={primaryProvider === 'gemini'}
          models={providers.gemini.models}
          onChange={(m) => handleModelsChange('gemini', m)}
        />
      </div>
    </div>
  );
};

export default AiTaskSettings;
