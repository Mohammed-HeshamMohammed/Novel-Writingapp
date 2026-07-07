import React, { useState } from 'react';
import { 
  X, BookOpen, MessageCircle, Book, Users, Gamepad2, Palette, Settings, 
  Bot, Home, Layout, Sliders, Plus, Eye, Grid3X3, List, 
  Edit3, RefreshCw, Lightbulb, Image, Target, Focus, Coffee, PenTool,
  Zap, Wand2, Key, Search, Bell, Paintbrush, Activity,
  Shuffle, Heart, Rocket, Zap as Lightning, Ghost, FileText
} from 'lucide-react';

type WritingMode = 'focus' | 'normal' | 'distraction-free' | 'typewriter' | 'guided' | 'describe' | 'rewrite' | 'brainstorm' | 'visualize';

interface ModeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface WritingModeOption {
  id: WritingMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SectionConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  modes: ModeOption[];
}

interface CustomizeModalProps {
  onClose: () => void;
  onModeSelect: (mode: string) => void;
  onSectionConfigChange?: (section: string, config: any) => void;
  currentMode?: string;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({ 
  onClose, 
  onModeSelect, 
  onSectionConfigChange,
  currentMode = 'writing' 
}) => {
  const [selectedModes, setSelectedModes] = useState<string[]>([currentMode]);
  const [selectedWritingModes, setSelectedWritingModes] = useState<WritingMode[]>(['normal']);
  const [useOpenAIInsteadOfOurAI, setUseOpenAIInsteadOfOurAI] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  
  const [homeLayoutSettings, setHomeLayoutSettings] = useState({
    showRecentProjects: true,
    showQuickActions: true,
    showStatistics: false,
    favoriteLayoutStyle: 'grid' as 'grid' | 'list',
    showProgressBars: false,
    showMotivationalQuotes: true
  });

  const [storyButtonSettings, setStoryButtonSettings] = useState({
    showRandomStoryButton: true,
    showFantasyStoryButton: true,
    showRomanceStoryButton: true,
    showSciFiStoryButton: false,
    showMysteryStoryButton: true,
    showHorrorStoryButton: false
  });

  const [customInterfaceSettings, setCustomInterfaceSettings] = useState({
    showGlobalSearchBar: true,
    showQuickSearchBar: false,
    showAdvancedSearchBar: false,
    showProgressVisuals: true,
    showThemeSelector: true,
    showNotificationCenter: false
  });

  const creativeModes: ModeOption[] = [
    {
      id: 'writing',
      title: 'Novel Writing',
      description: 'Traditional novel writing with chapters, characters, and storylines for authors.',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      id: 'roleplay',
      title: 'Role-Play Mode',
      description: 'Interactive storytelling with custom chatbots and character interactions.',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      id: 'reading',
      title: 'Story Reader',
      description: 'Browse, read, and discover stories created by other users.',
      icon: <Book className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 'community',
      title: 'Community Hub',
      description: 'Connect with writers, share feedback, join groups, and participate in challenges.',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    {
      id: 'chatbot-rp',
      title: 'Published Chatbot RP',
      description: 'Role-play with community-created chatbots through interactive dialogues.',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'bg-red-500'
    },
    {
      id: 'creative',
      title: 'Creative Workshop',
      description: 'Access writing prompts, character generators, plot tools, and creative exercises.',
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-pink-500'
    },
    {
      id: 'analytics',
      title: 'Writer Analytics',
      description: 'Track writing progress, analyze style, view statistics, and set goals.',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-indigo-500'
    }
  ];

  const writingModes: WritingModeOption[] = [
    {
      id: 'normal',
      title: 'Normal Mode',
      description: 'Standard writing experience with all features available.',
      icon: <Edit3 className="w-6 h-6" />,
      color: 'bg-gray-500'
    },
    {
      id: 'focus',
      title: 'Focus Mode',
      description: 'Minimized distractions with focus-enhancing tools.',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'distraction-free',
      title: 'Distraction-Free',
      description: 'Clean, minimal interface for pure writing flow.',
      icon: <Focus className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'typewriter',
      title: 'Typewriter Mode',
      description: 'Classic typewriter experience with authentic feel.',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-amber-500'
    },
    {
      id: 'guided',
      title: 'Guided Writing',
      description: 'Step-by-step assistance for structured writing.',
      icon: <Coffee className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'describe',
      title: 'Describe Mode',
      description: 'AI assistance for detailed descriptions and scenes.',
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-teal-500'
    },
    {
      id: 'rewrite',
      title: 'Rewrite Assistant',
      description: 'AI-powered text improvement and rewriting suggestions.',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'brainstorm',
      title: 'Brainstorm Mode',
      description: 'Creative idea generation and plot development tools.',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'visualize',
      title: 'Visualize Mode',
      description: 'Visual aids and mind mapping for story planning.',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-pink-500'
    }
  ];

  const sections: SectionConfig[] = [
    {
      title: 'Creative Modes',
      description: 'Select your primary creative workflow modes',
      icon: <Palette className="w-6 h-6" />,
      modes: creativeModes
    }
  ];

  const handleModeToggle = (modeId: string) => {
    try {
      setSelectedModes(prev => {
        const newSelection = prev.includes(modeId) 
          ? prev.filter(id => id !== modeId)
          : [...prev, modeId];
        
        if (newSelection.length > 0) {
          onModeSelect(newSelection[0]);
        }
        return newSelection;
      });
    } catch (error) {
      console.error('Error toggling mode:', error);
    }
  };

  const handleWritingModeToggle = (modeId: WritingMode) => {
    try {
      setSelectedWritingModes(prev => {
        return prev.includes(modeId) 
          ? prev.filter(id => id !== modeId)
          : [...prev, modeId];
      });
    } catch (error) {
      console.error('Error toggling writing mode:', error);
    }
  };

  const handleHomeLayoutChange = (setting: string, value: any) => {
    try {
      const newSettings = { ...homeLayoutSettings, [setting]: value };
      setHomeLayoutSettings(newSettings);
      onSectionConfigChange?.('homeLayout', newSettings);
    } catch (error) {
      console.error('Error updating home layout settings:', error);
    }
  };

  const handleStoryButtonChange = (setting: string, value: boolean) => {
    try {
      const newSettings = { ...storyButtonSettings, [setting]: value };
      setStoryButtonSettings(newSettings);
      onSectionConfigChange?.('storyButtons', newSettings);
    } catch (error) {
      console.error('Error updating story button settings:', error);
    }
  };

  const handleCustomInterfaceChange = (setting: string, value: boolean) => {
    try {
      const newSettings = { ...customInterfaceSettings, [setting]: value };
      setCustomInterfaceSettings(newSettings);
      onSectionConfigChange?.('customInterface', newSettings);
    } catch (error) {
      console.error('Error updating custom interface settings:', error);
    }
  };

  const handleOpenAIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOpenAIKey(value);
    onSectionConfigChange?.('openAIKey', value);
  };

  const handleApplyChanges = () => {
    try {
      selectedModes.forEach(mode => onModeSelect(mode));
      onSectionConfigChange?.('writingModes', selectedWritingModes);
      onSectionConfigChange?.('useOpenAI', { enabled: useOpenAIInsteadOfOurAI, key: openAIKey });
      onClose();
    } catch (error) {
      console.error('Error applying changes:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const ToggleSwitch = ({ checked, onChange, color = 'blue' }: { 
    checked: boolean; 
    onChange: () => void; 
    color?: string; 
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? `bg-${color}-600` : 'bg-gray-200 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SectionHeader = ({ icon, title, description }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
  }) => (
    <div className="flex items-center space-x-3 mb-6">
      <div className="text-purple-600 dark:text-purple-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );

  const ConfigCard = ({ children, className = "" }: { 
    children: React.ReactNode; 
    className?: string; 
  }) => (
    <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-7xl w-full max-h-[95vh] shadow-2xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Sliders className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customize Your Experience</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tailor the interface to match your creative workflow</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(95vh - 200px)' }}>
          <div className="p-8 space-y-10">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <SectionHeader 
                  icon={section.icon}
                  title={section.title}
                  description={section.description}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.modes.map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => handleModeToggle(mode.id)}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none transform hover:scale-[1.02] ${
                        selectedModes.includes(mode.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } bg-white dark:bg-gray-700 hover:shadow-lg`}
                    >
                      {selectedModes.includes(mode.id) && (
                        <div className="absolute top-3 right-3">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                      
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl text-white mb-4 ${mode.color} shadow-md`}>
                        {mode.icon}
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {mode.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {mode.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-6">
              <SectionHeader 
                icon={<Wand2 className="w-6 h-6" />}
                title="AI Writing Assistant Modes"
                description="Configure specialized AI writing modes for different creative needs"
              />
              
              <ConfigCard>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {writingModes.map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => handleWritingModeToggle(mode.id)}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedWritingModes.includes(mode.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      } bg-white dark:bg-gray-800`}
                    >
                      {selectedWritingModes.includes(mode.id) && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                      
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-white mb-3 ${mode.color}`}>
                        {mode.icon}
                      </div>
                      
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                        {mode.title}
                      </h5>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {mode.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ConfigCard>
            </div>

            <div className="space-y-6">
              <SectionHeader 
                icon={<Key className="w-6 h-6" />}
                title="AI Provider Configuration"
                description="Choose between our AI or OpenAI services with API key setup"
              />
              
              <ConfigCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-lg">
                        <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Use OpenAI Instead of Our AI</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Switch to OpenAI GPT models for AI assistance</p>
                      </div>
                    </div>
                    <ToggleSwitch 
                      checked={useOpenAIInsteadOfOurAI}
                      onChange={() => setUseOpenAIInsteadOfOurAI(!useOpenAIInsteadOfOurAI)}
                      color="orange"
                    />
                  </div>
                  
                  {useOpenAIInsteadOfOurAI && (
                    <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            OpenAI API Key
                          </label>
                          <input
                            type="password"
                            value={openAIKey}
                            onChange={handleOpenAIKeyChange}
                            placeholder="sk-..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            minLength={20}
                            maxLength={200}
                          />
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            <p>• Must start with "sk-"</p>
                            <p>• Keep your API key secure and never share it</p>
                            <p>• Get your API key from <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">platform.openai.com</span></p>
                          </div>
                        </div>
                        
                        {openAIKey && (
                          <div className="flex items-center space-x-2 text-sm">
                            {openAIKey.startsWith('sk-') && openAIKey.length >= 20 ? (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Valid API key format
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600 dark:text-red-400">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                Invalid API key format
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ConfigCard>
            </div>

            <div className="space-y-6">
              <SectionHeader 
                icon={<Home className="w-6 h-6" />}
                title="Home Layout & Interface Control"
                description="Customize your home page appearance and layout preferences"
              />
              
              <ConfigCard className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Layout className="w-5 h-5 mr-2" />
                    Layout Preferences
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Favorite Layout Style
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleHomeLayoutChange('favoriteLayoutStyle', 'grid')}
                          className={`p-2 rounded-lg border transition-colors ${
                            homeLayoutSettings.favoriteLayoutStyle === 'grid'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHomeLayoutChange('favoriteLayoutStyle', 'list')}
                          className={`p-2 rounded-lg border transition-colors ${
                            homeLayoutSettings.favoriteLayoutStyle === 'list'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(homeLayoutSettings).map(([key, value]) => {
                        if (key === 'favoriteLayoutStyle') return null;
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <ToggleSwitch 
                              checked={value as boolean}
                              onChange={() => handleHomeLayoutChange(key, !value)}
                              color="blue"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ConfigCard>
            </div>

            <div className="space-y-6">
              <SectionHeader 
                icon={<FileText className="w-6 h-6" />}
                title="Story Creation Buttons"
                description="Configure quick story creation buttons for different genres and random options"
              />
              
              <ConfigCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shuffle className="w-5 h-5 mr-2" />
                      Genre Story Buttons
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: 'showRandomStoryButton', label: 'Random Story', icon: <Shuffle className="w-4 h-4" /> },
                        { key: 'showFantasyStoryButton', label: 'Fantasy Story', icon: <Wand2 className="w-4 h-4" /> },
                        { key: 'showRomanceStoryButton', label: 'Romance Story', icon: <Heart className="w-4 h-4" /> },
                        { key: 'showSciFiStoryButton', label: 'Sci-Fi Story', icon: <Rocket className="w-4 h-4" /> },
                        { key: 'showMysteryStoryButton', label: 'Mystery Story', icon: <Eye className="w-4 h-4" /> },
                        { key: 'showHorrorStoryButton', label: 'Horror Story', icon: <Ghost className="w-4 h-4" /> }
                      ].map(({ key, label, icon }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="text-gray-600 dark:text-gray-400">
                              {icon}
                            </div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {label}
                            </label>
                          </div>
                          <ToggleSwitch 
                            checked={storyButtonSettings[key as keyof typeof storyButtonSettings]}
                            onChange={() => handleStoryButtonChange(key, !storyButtonSettings[key as keyof typeof storyButtonSettings])}
                            color="purple"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Custom Interface Elements
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: 'showGlobalSearchBar', label: 'Global Search Bar', icon: <Search className="w-4 h-4" /> },
                        { key: 'showQuickSearchBar', label: 'Quick Search Bar', icon: <Lightning className="w-4 h-4" /> },
                        { key: 'showAdvancedSearchBar', label: 'Advanced Search Bar', icon: <Settings className="w-4 h-4" /> },
                        { key: 'showProgressVisuals', label: 'Progress Visuals', icon: <Activity className="w-4 h-4" /> },
                        { key: 'showThemeSelector', label: 'Theme Selector', icon: <Paintbrush className="w-4 h-4" /> },
                        { key: 'showNotificationCenter', label: 'Notification Center', icon: <Bell className="w-4 h-4" /> }
                      ].map(({ key, label, icon }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="text-gray-600 dark:text-gray-400">
                              {icon}
                            </div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {label}
                            </label>
                          </div>
                          <ToggleSwitch 
                            checked={customInterfaceSettings[key as keyof typeof customInterfaceSettings]}
                            onChange={() => handleCustomInterfaceChange(key, !customInterfaceSettings[key as keyof typeof customInterfaceSettings])}
                            color="teal"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Future Enhancements
                  </h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    More visual elements, advanced search filters, and interactive widgets will be added in future updates to enhance your creative workflow.
                  </p>
                </div>
              </ConfigCard>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{selectedModes.length} creative mode{selectedModes.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{selectedWritingModes.length} writing mode{selectedWritingModes.length !== 1 ? 's' : ''}</span>
              </div>
              {useOpenAIInsteadOfOurAI && openAIKey && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>OpenAI integration active</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleApplyChanges}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply Changes
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};