import React, { useState, useEffect, useCallback } from 'react';
import { Platform, FormData, GeminiResponse } from './types';
import { generateAppCode } from './services/geminiService';
import CodeBlock from './components/CodeBlock';

const PlatformIcons: React.FC<{ platform: Platform, className?: string }> = ({ platform, className }) => {
    const icons = {
        [Platform.Android]: <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16,18H8V6A2,2 0 0,1 10,4H14A2,2 0 0,1 16,6V18M11,7V8H13V7H11M11,9V10H13V9H11M21.19,21.19L19.78,22.6L18.36,21.19C17,22.54 15.11,23.36 13,23.36C10.89,23.36 9,22.54 7.64,21.19L6.22,22.6L4.81,21.19L6.22,19.78L4.81,18.36L6.22,16.95L4.81,15.54L6.22,14.12L4.81,12.71L6.22,11.3L4.81,9.88L6.22,8.47L4.81,7.05L6.22,5.64C7.57,4.28 9.46,3.46 11.57,3.46C13.68,3.46 15.57,4.28 16.93,5.64L18.34,7.05L19.75,5.64L21.16,7.05L19.75,8.47L21.16,9.88L19.75,11.3L21.16,12.71L19.75,14.12L21.16,15.54L19.75,16.95L21.16,18.36L19.75,19.78L21.19,21.19M19.07,18.36L17.66,16.95L19.07,15.54L17.66,14.12L19.07,12.71L17.66,11.3L19.07,9.88L17.66,8.47L16.25,7.05C15.18,6 13.47,5.46 11.57,5.46C9.67,5.46 7.96,6 6.9,7.05L5.47,8.47L4.06,7.05L5.47,5.64C6.83,4.28 8.72,3.46 10.83,3.46C12.94,3.46 14.83,4.28 16.19,5.64L17.6,7.05L16.19,8.47L17.6,9.88L16.19,11.3L17.6,12.71L16.19,14.12L17.6,15.54L16.19,16.95L17.6,18.36L16.19,19.78C15.1,20.84 13.4,21.36 11.5,21.36C9.6,21.36 7.9,20.84 6.81,19.78L5.4,18.36L6.81,16.95L5.4,15.54L6.81,14.12L5.4,12.71L6.81,11.3L5.4,9.88L6.81,8.47L8.22,7.05L6.81,5.64L8.22,4.22L9.64,5.64L11.05,4.22L12.46,5.64L13.88,4.22L15.29,5.64L16.71,4.22L18.12,5.64L19.53,4.22L20.94,5.64L19.53,7.05L20.94,8.47L19.53,9.88L20.94,11.3L19.53,12.71L20.94,14.12L19.53,15.54L20.94,16.95L19.53,18.36L20.94,19.78L19.53,21.19C18.18,22.55 16.28,23.36 14.17,23.36C12.06,23.36 10.17,22.55 8.81,21.19L7.4,19.78L8.81,18.36L7.4,16.95L8.81,15.54L7.4,14.12L8.81,12.71L7.4,11.3L8.81,9.88L7.4,8.47L8.81,7.05L10.22,8.47L11.64,7.05L13.05,8.47L14.46,7.05L15.88,8.47L17.29,7.05L18.71,8.47L17.29,9.88L18.71,11.3L17.29,12.71L18.71,14.12L17.29,15.54L18.71,16.95L17.29,18.36L18.71,19.78L19.07,19.42V19.42L19.07,18.36Z" /></svg>,
        [Platform.iOS]: <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.8,18.3C17.8,18.3,18.8,16.3,21,16C21,16,21.3,13.3,19.5,11.8C18.5,11.1,17.2,11.1,16.4,11.8C15.6,12.5,15.2,13.7,15.3,14.6C15.7,14.7,17,14.9,17.8,14.1C17.9,14.2,18.7,12,17.4,10.6C16.1,9.2,14.3,9.2,13.3,10.2C12.3,11.2,11.7,12.8,12.2,14.5C11,15.3,9.8,15.2,9.1,14.5C8.8,14.1,8.5,13.5,8.4,12.9C7.2,12.6,6,13.1,5.2,13.9C3,16.1,4.3,20,6.5,22C7.5,23,8.8,23.3,9.8,23C9.8,23,10.2,21.4,11.6,21.4C13,21.4,13.3,23,13.3,23C14.3,23.3,15.6,23,16.6,22C17.6,21.1,17.8,19.4,17.8,18.3M15.4,8.2C16.1,7.5,16.5,6.5,16.4,5.6C16.2,4.6,15.6,3.8,14.8,3.2C14.1,2.6,13,2.5,12.1,3C11.1,3.6,10.5,4.6,10.6,5.6C10.7,5.7,10.8,5.8,10.8,5.9C11,6,11.8,6.1,12.5,5.5C13.2,5,13.6,5.1,14,5.4C14.4,5.7,14.3,6.2,13.7,6.8C13.1,7.4,12.4,7.8,12.4,8.5C12.4,9.3,13.2,9.6,13.8,9.2C14.1,9,14.4,8.8,14.8,8.5C15,8.4,15.2,8.3,15.4,8.2Z" /></svg>,
        [Platform.Windows]: <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3,12V6.75L9,5.43V11.91L3,12M21,12V4.5L9,3V11.91L21,12M3,13L9,13.09V19.57L3,18.25V13M21,13L9,13.09V21L21,19.5V13Z" /></svg>,
    };
    return icons[platform] || null;
};

const Spinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
);

const allPlatforms = [Platform.Windows, Platform.Android, Platform.iOS];

const LoadingScreen: React.FC = () => {
    const messages = [
        "Consultando arquitetos de software...",
        "Compilando pixels em perfeição...",
        "Desdobrando o universo do código...",
        "Pedindo à IA para ser criativa...",
        "Construindo o futuro, um byte de cada vez...",
    ];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center gap-6">
            <Spinner />
            <p className="text-lg text-gray-300 transition-opacity duration-500">{message}</p>
        </div>
    );
};


const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    appName: '',
    platforms: [Platform.Android, Platform.iOS],
    appDescription: '',
    designStyle: 'Dark',
    primaryColor: '#00B8D9',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiResponse | null>(null);

  const handlePlatformToggle = (platform: Platform) => {
    setFormData(prev => {
      const newPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: newPlatforms };
    });
  };
  
  const canGoNext = () => {
    switch(step) {
        case 1: return formData.appName.trim() !== '' && formData.platforms.length > 0;
        case 2: return formData.appDescription.trim().length > 10;
        case 3: return true;
        default: return false;
    }
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateAppCode(formData);
      setResult(response);
      setStep(4);
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
        appName: '',
        platforms: [Platform.Android, Platform.iOS],
        appDescription: '',
        designStyle: 'Dark',
        primaryColor: '#00B8D9',
    });
    setResult(null);
    setError(null);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Informações Básicas</h2>
            <p className="text-gray-400 mb-6">Comece nomeando seu aplicativo e selecionando as plataformas.</p>
            <div className="space-y-6">
                <div>
                    <label htmlFor="appName" className="block text-sm font-medium text-gray-300 mb-2">Nome do Aplicativo</label>
                    <input type="text" id="appName" value={formData.appName} onChange={e => setFormData({...formData, appName: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="Ex: Meu App Incrível"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Plataformas Alvo</label>
                    <div className="grid grid-cols-3 gap-4">
                        {allPlatforms.map(p => (
                            <button key={p} onClick={() => handlePlatformToggle(p)} className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-lg transition-all duration-200 ${formData.platforms.includes(p) ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                                <PlatformIcons platform={p} className="w-8 h-8" />
                                <span className="text-sm font-medium">{p}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </>
        );
      case 2:
         return (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Funcionalidades do App</h2>
            <p className="text-gray-400 mb-6">Descreva o que seu aplicativo fará. Seja o mais detalhado possível!</p>
             <div>
                <label htmlFor="appDescription" className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea id="appDescription" value={formData.appDescription} onChange={e => setFormData({...formData, appDescription: e.target.value})} rows={6} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="Ex: 'Um aplicativo de lista de tarefas com login, categorias e notificações'"></textarea>
             </div>
          </>
        );
       case 3:
         return (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Design e Estilo</h2>
            <p className="text-gray-400 mb-6">Personalize a aparência do seu aplicativo.</p>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Tema Visual</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['Light', 'Dark'].map(style => (
                            <button key={style} onClick={() => setFormData({...formData, designStyle: style as 'Light' | 'Dark'})} className={`p-4 border rounded-lg transition-all duration-200 ${formData.designStyle === style ? 'bg-cyan-500/10 border-cyan-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                                <span className="text-white font-medium">{style === 'Light' ? 'Claro' : 'Escuro'}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                     <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-300 mb-2">Cor Principal</label>
                     <div className="relative">
                        <input type="text" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-12 pr-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"/>
                        <input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer bg-transparent" style={{'backgroundColor': 'transparent'}}/>
                     </div>
                </div>
            </div>
          </>
        );
      case 4:
        return (
            <>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Seu App está Pronto!</h2>
                        <p className="text-gray-400 mt-1">A IA gerou o seguinte plano e código para você.</p>
                    </div>
                    <button onClick={handleReset} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Criar Novo App</button>
                </div>
                
                {result && (
                    <div className="mt-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Framework Recomendado: <span className="text-cyan-400">{result.frameworkRecommendation}</span></h3>
                            <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700">{result.reasoning}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Próximos Passos</h3>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-2">
                                {result.nextSteps.map((s, i) => (
                                    <p key={i} className="text-gray-300 font-mono text-sm flex items-start">
                                        <span className="text-gray-500 mr-3">{i + 1}.</span>
                                        <code className="bg-gray-900/70 px-2 py-1 rounded">{s}</code>
                                    </p>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Arquivos de Código</h3>
                            {result.files.map(file => (
                                <CodeBlock key={file.fileName} fileName={file.fileName} language={file.language} code={file.code} />
                            ))}
                        </div>
                    </div>
                )}
            </>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Gerador de App com IA</h1>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">Transforme sua ideia em código multi-plataforma em minutos.</p>
        </header>
        
        <main className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/20 p-6 sm:p-10 min-h-[450px] flex flex-col justify-between">
            {isLoading ? <LoadingScreen /> : error ? (
                <div className="text-center text-red-400">
                    <h3 className="text-xl font-bold mb-2">Oops! Algo deu errado.</h3>
                    <p className="bg-red-900/50 p-3 rounded-lg">{error}</p>
                    <button onClick={handleReset} className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Tentar Novamente</button>
                </div>
            ) : (
                <>
                <div>{renderStep()}</div>
                
                {step < 4 && (
                    <div className="flex justify-between items-center mt-10">
                        <button onClick={handleBack} disabled={step === 1} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Voltar</button>
                        {step < 3 ? (
                            <button onClick={handleNext} disabled={!canGoNext()} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próximo</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={!canGoNext()} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Gerar App ✨</button>
                        )}
                    </div>
                )}
                </>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
