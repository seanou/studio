
"use client";

import { useState, useEffect, useRef } from "react";
import { languageChat } from "@/ai/flows/language-chat-flow";
import { textToSpeech } from "@/ai/flows/tts-flow";
import type { LanguageChatInput } from "@/ai/flows/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Languages, Send, Mic, MicOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

type Language = "latin" | "grec";

interface ParsedWord {
  word: string;
  translation?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<ParsedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("latin");
  const [skillLevel, setSkillLevel] = useState([50]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSubmit(new Event('submit'), transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
        if (selectedLanguage === 'latin') {
            recognitionRef.current.lang = 'la';
        } else if (selectedLanguage === 'grec') {
            recognitionRef.current.lang = 'el-GR';
        } else {
            recognitionRef.current.lang = 'fr-FR';
        }
    }
  }, [selectedLanguage]);


  const toggleRecording = () => {
    if (recognitionRef.current) {
        if (selectedLanguage === 'latin') {
            recognitionRef.current.lang = 'la';
        } else if (selectedLanguage === 'grec') {
            recognitionRef.current.lang = 'el-GR';
        } else {
            recognitionRef.current.lang = 'fr-FR';
        }
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setResponse([]);
      setAudioUrl(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const parseResponse = (text: string): ParsedWord[] => {
    const regex = /\[\[(.*?):(.*?)\]\]/g;
    const parts: ParsedWord[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ word: text.substring(lastIndex, match.index) });
      }
      parts.push({ word: match[1], translation: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ word: text.substring(lastIndex) });
    }

    return parts;
  };

  const handleSubmit = async (e: React.FormEvent | Event, voiceQuery?: string) => {
    e.preventDefault();
    const currentQuery = voiceQuery || query;
    if (!currentQuery.trim()) return;

    setIsLoading(true);
    setResponse([]);
    setAudioUrl(null);
    try {
      const input: LanguageChatInput = { message: currentQuery, language: selectedLanguage, skillLevel: skillLevel[0] };
      const result = await languageChat(input);
      
      setResponse(parseResponse(result.response));

      const audioResult = await textToSpeech(result.response.replace(/\[\[(.*?):(.*?)\]\]/g, '$1'));
      if (audioResult.media) {
        setAudioUrl(audioResult.media);
      }

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = selectedLanguage === 'latin' 
        ? "Error: Non potui responsum obtinere." 
        : "Σφάλμα: Δεν μπόρεσα να λάβω απάντηση.";
      setResponse([{ word: errorMessage }]);
    } finally {
      setIsLoading(false);
      if (!voiceQuery) {
        setQuery("");
      }
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioUrl]);

  const getCardTexts = () => {
    if (selectedLanguage === 'latin') {
      return {
        title: "Interroga Magistrum Digitalem",
        description: "Posez votre question en français ou en latin, et l'IA vous répondra en latin.",
        placeholder: "Escribe hic..."
      }
    }
    return {
      title: "Ερώτησον τὸν Διδάσκαλον",
      description: "Posez votre question en français ou en grec ancien, et l'IA vous répondra en grec ancien.",
      placeholder: "Γράψον ἐνθάδε..."
    }
  }

  const { title, description, placeholder } = getCardTexts();

  return (
    <div className="flex justify-center items-start gap-8">
      <div className="w-full max-w-3xl animate-fade-in">
        <Card>
            <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <Bot className="h-6 w-6" />
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-grow"
                disabled={isLoading || isRecording}
                />
                <Button type="submit" disabled={isLoading || isRecording}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
                <Button type="button" onClick={toggleRecording} variant={isRecording ? 'destructive' : 'outline'} disabled={isLoading}>
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span className="sr-only">{isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}</span>
                </Button>
            </form>

            {(isLoading || response.length > 0) && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                        {selectedLanguage === 'latin' ? 'Responsum:' : 'Ἀπόκρισις:'}
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] text-foreground/80 italic">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                            <span>{selectedLanguage === 'latin' ? 'Cogitat...' : 'Φροντίζει...'}</span>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <p>
                            {response.map((part, index) =>
                                part.translation ? (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <span className="underline decoration-dotted cursor-pointer font-semibold text-accent">{part.word}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{part.translation}</p>
                                    </TooltipContent>
                                </Tooltip>
                                ) : (
                                <span key={index}>{part.word}</span>
                                )
                            )}
                            </p>
                        </TooltipProvider>
                    )}
                    </div>
                </div>
            )}
             {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-8 items-center w-40">
            <Button
                variant={selectedLanguage === 'latin' ? 'default' : 'outline'}
                onClick={() => setSelectedLanguage('latin')}
                className="w-full justify-start"
            >
                <Languages className="mr-2" />
                Latin
            </Button>
            <Button
                variant={selectedLanguage === 'grec' ? 'default' : 'outline'}
                onClick={() => setSelectedLanguage('grec')}
                className="w-full justify-start"
            >
                <Languages className="mr-2" />
                Grec ancien
            </Button>
            
            <div className="flex flex-col items-center gap-4 pt-4 w-full">
                <div className="flex flex-col items-center justify-between w-full text-xs text-muted-foreground px-2 h-40">
                    <span>Expert</span>
                    <div className="flex-grow flex items-center justify-center">
                        <Slider
                            defaultValue={skillLevel}
                            onValueChange={setSkillLevel}
                            max={100}
                            step={1}
                            orientation="vertical"
                        />
                    </div>
                    <span>Débutant</span>
                </div>
                <div className="text-sm font-medium text-center">
                    Niveau de compétence
                </div>
            </div>
      </div>
    </div>
  );
}
