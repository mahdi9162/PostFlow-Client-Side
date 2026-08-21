import React, { useState, useEffect } from 'react';
import { BrainCircuit, Save, AlertCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlatformSettings } from '../../../../hooks/usePlatformSettings';
import { useMe } from '../../../../hooks/useMe';
import AiTaskSettings from './AiTaskSettings';

const AiSettings = () => {
  const { isAdmin, isCreator } = useMe();
  const { data: serverData, isLoading, isError, updateSettingsAsync, isUpdating } = usePlatformSettings();
  const [localData, setLocalData] = useState(null);
  const [activeTab, setActiveTab] = useState('vision');

  useEffect(() => {
    if (serverData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalData({
        vision: {
          primaryProvider: serverData.ai?.vision?.primaryProvider ?? 'groq',
          fallbackProvider: serverData.ai?.vision?.fallbackProvider ?? 'gemini',
          providers: {
            groq: { models: serverData.ai?.vision?.providers?.groq?.models ?? [] },
            gemini: { models: serverData.ai?.vision?.providers?.gemini?.models ?? [] }
          }
        },
        caption: {
          primaryProvider: serverData.ai?.caption?.primaryProvider ?? 'groq',
          fallbackProvider: serverData.ai?.caption?.fallbackProvider ?? 'gemini',
          providers: {
            groq: { models: serverData.ai?.caption?.providers?.groq?.models ?? [] },
            gemini: { models: serverData.ai?.caption?.providers?.gemini?.models ?? [] }
          }
        }
      });
    }
  }, [serverData]);

  if (!isAdmin && !isCreator) {
    return <div className="p-6 text-center text-error">You do not have permission to view AI settings.</div>;
  }

  if (isLoading || !localData) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="h-8 bg-base-200 animate-pulse rounded w-1/4"></div>
        <div className="h-4 bg-base-200 animate-pulse rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-base-200 animate-pulse rounded w-64 mb-6"></div>
        <div className="h-[400px] bg-base-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-error">
        <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
        <h2 className="text-xl font-semibold">Unable to load AI settings.</h2>
      </div>
    );
  }

  const originalData = {
    vision: {
      primaryProvider: serverData.ai?.vision?.primaryProvider ?? 'groq',
      fallbackProvider: serverData.ai?.vision?.fallbackProvider ?? 'gemini',
      providers: {
        groq: { models: serverData.ai?.vision?.providers?.groq?.models ?? [] },
        gemini: { models: serverData.ai?.vision?.providers?.gemini?.models ?? [] }
      }
    },
    caption: {
      primaryProvider: serverData.ai?.caption?.primaryProvider ?? 'groq',
      fallbackProvider: serverData.ai?.caption?.fallbackProvider ?? 'gemini',
      providers: {
        groq: { models: serverData.ai?.caption?.providers?.groq?.models ?? [] },
        gemini: { models: serverData.ai?.caption?.providers?.gemini?.models ?? [] }
      }
    }
  };

  const isDirty = JSON.stringify(localData) !== JSON.stringify(originalData);

  const checkTaskValid = (taskConfig) => {
    if (taskConfig.primaryProvider === taskConfig.fallbackProvider) return false;
    const primaryModels = taskConfig.providers[taskConfig.primaryProvider].models;
    
    const trimmedPrimary = primaryModels.map(m => m.trim()).filter(Boolean);
    if (trimmedPrimary.length === 0) return false;
    
    // Check for blanks or duplicates
    const hasErrors = ['groq', 'gemini'].some(prov => {
      const models = taskConfig.providers[prov].models;
      const hasBlanks = models.some(m => m.trim() === '');
      if (hasBlanks) return true;
      
      const trimmed = models.map(m => m.trim());
      const hasDuplicates = new Set(trimmed).size !== trimmed.length;
      if (hasDuplicates) return true;
      
      return false;
    });
    
    return !hasErrors;
  };

  const isFormValid = checkTaskValid(localData.vision) && checkTaskValid(localData.caption);
  const canSave = isDirty && isFormValid && !isUpdating;

  const handleSave = async () => {
    if (!canSave) return;
    
    try {
      await updateSettingsAsync({ ai: localData });
      toast.success('AI settings updated.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save AI settings.');
    }
  };

  const handleReset = () => {
    setLocalData(JSON.parse(JSON.stringify(originalData)));
  };

  const handleTaskChange = (taskType, newConfig) => {
    setLocalData(prev => ({
      ...prev,
      [taskType]: newConfig
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5">
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          AI Settings
        </h1>
        <p className="text-sm text-base-content/60">
          Configure provider priority and ordered model fallback lists for Vision and Caption.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200/50 p-1 w-fit">
        <button 
          className={`tab px-8 transition-all ${activeTab === 'vision' ? 'tab-active font-medium' : ''}`}
          onClick={() => setActiveTab('vision')}
        >
          Vision
        </button>
        <button 
          className={`tab px-8 transition-all ${activeTab === 'caption' ? 'tab-active font-medium' : ''}`}
          onClick={() => setActiveTab('caption')}
        >
          Caption
        </button>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm text-primary flex items-start gap-2">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold block mb-0.5">How AI fallback works</span>
          Models are tried from top to bottom within the primary provider. If eligible failures exhaust that list, PostFlow moves to the fallback provider.
        </div>
      </div>

      {/* Active Task Config */}
      <div className="mt-6">
        {activeTab === 'vision' ? (
          <AiTaskSettings 
            taskConfig={localData.vision} 
            onChange={(cfg) => handleTaskChange('vision', cfg)} 
          />
        ) : (
          <AiTaskSettings 
            taskConfig={localData.caption} 
            onChange={(cfg) => handleTaskChange('caption', cfg)} 
          />
        )}
      </div>

      {/* Footer Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100/90 backdrop-blur border-t border-base-200 p-4 shadow-lg z-50 flex items-center justify-between lg:pl-72">
        <div className="text-sm font-medium">
          {isDirty ? (
            <span className="text-warning flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Unsaved changes
            </span>
          ) : (
            <span className="text-base-content/50">Settings are up to date</span>
          )}
        </div>
        <div className="flex gap-2">
          {isDirty && (
            <button 
              className="btn btn-ghost"
              onClick={handleReset}
              disabled={isUpdating}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
          )}
          <button 
            className="btn btn-primary min-w-[160px]"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isUpdating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save AI Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSettings;
