
"use client";

import { useState, useRef, useEffect } from "react";
import { languageChat } from "@/ai/flows/language-chat-flow";
import type { LanguageChatInput } from "@/ai/flows/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Languages, Send, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

type Language = "latin" | "grec";

interface ParsedWord {
  word: string;
  translation?: string;
}

interface Message {
    sender: 'user' | 'ai';
    content: string | ParsedWord[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("latin");
  const [skillLevel, setSkillLevel] = useState([50]);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { sender: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    
    try {
      const input: LanguageChatInput = { message: query, language: selectedLanguage, skillLevel: skillLevel[0] };
      
      const chatResult = await languageChat(input);
      
      const aiMessage: Message = { sender: 'ai', content: parseResponse(chatResult.response) };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessageContent = selectedLanguage === 'latin' 
        ? "Error: Non potui responsum obtinere." 
        : "Σφάλμα: Δεν μπόρεσα να λάβω απάντηση.";
      const errorMessage: Message = { sender: 'ai', content: [{ word: errorMessageContent }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardTexts = () => {
    if (selectedLanguage === 'latin') {
      return {
        title: "Interroga Magistrum Digitalem",
        description: "Posez votre question en français et l'IA vous répondra en latin.",
        placeholder: "Escribe hic..."
      }
    }
    return {
      title: "Ερώτησον τὸν Διδάσκαλον",
      description: "Posez votre question en français et l'IA vous répondra en grec ancien.",
      placeholder: "Γράψον ἐνθάδε..."
    }
  }

  const { title, description, placeholder } = getCardTexts();

  return (
    <div className="flex justify-center items-start gap-8">
      <div className="w-full max-w-3xl animate-fade-in">
        <Card className="flex flex-col h-[75vh]">
            <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <Bot className="h-6 w-6" />
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow overflow-hidden p-0">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {message.sender === 'ai' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                            <div className={`rounded-lg p-3 max-w-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {typeof message.content === 'string' ? (
                                    <p>{message.content}</p>
                                ) : (
                                    <TooltipProvider>
                                        <p className="italic">
                                        {message.content.map((part, i) =>
                                            part.translation ? (
                                            <Tooltip key={i}>
                                                <TooltipTrigger asChild>
                                                    <span className="underline decoration-dotted cursor-pointer font-semibold text-accent">{part.word}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{part.translation}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            ) : (
                                            <span key={i}>{part.word}</span>
                                            )
                                        )}
                                        </p>
                                    </TooltipProvider>
                                )}
                            </div>
                            {message.sender === 'user' && <User className="h-6 w-6 text-primary flex-shrink-0" />}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start gap-3">
                            <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                            <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                                <span>{selectedLanguage === 'latin' ? 'Cogitat...' : 'Φροντίζει...'}</span>
                            </div>
                        </div>
                    )}
                    <div ref={conversationEndRef} />
                </div>

                <div className="p-6 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="flex-grow"
                        disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Envoyer</span>
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-8 items-center w-40">
            <Button
                variant={selectedLanguage === 'latin' ? 'default' : 'outline'}
                onClick={() => { setMessages([]); setSelectedLanguage('latin'); }}
                className="w-full justify-start"
            >
                <Languages className="mr-2" />
                Latin
            </Button>
            <Button
                variant={selectedLanguage === 'grec' ? 'default' : 'outline'}
                onClick={() => { setMessages([]); setSelectedLanguage('grec'); }}
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
