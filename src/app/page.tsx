"use client";

import { useState } from "react";
import { languageChat } from "@/ai/flows/language-chat-flow";
import type { LanguageChatInput } from "@/ai/flows/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Languages, Send } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";

type Language = "latin" | "grec";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("latin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse("");
    try {
      const input: LanguageChatInput = { message: query, language: selectedLanguage };
      const result = await languageChat(input);
      setResponse(result.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = selectedLanguage === 'latin' 
        ? "Error: Non potui responsum obtinere." 
        : "Σφάλμα: Δεν μπόρεσα να λάβω απάντηση.";
      setResponse(errorMessage);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  const getCardTexts = () => {
    if (selectedLanguage === 'latin') {
      return {
        title: "Interroga Magistrum Digitalem",
        description: "Posez votre question en français, et l'IA vous répondra en latin.",
        placeholder: "Escribe hic..."
      }
    }
    return {
      title: "Ερώτησον τὸν Διδάσκαλον",
      description: "Posez votre question en français, et l'IA vous répondra en grec ancien.",
      placeholder: "Γράψον ἐνθάδε..."
    }
  }

  const { title, description, placeholder } = getCardTexts();

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        onClick={() => setSelectedLanguage('latin')}
                        isActive={selectedLanguage === 'latin'}
                    >
                        <Languages />
                        Latin
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        onClick={() => setSelectedLanguage('grec')}
                        isActive={selectedLanguage === 'grec'}
                    >
                        <Languages />
                        Grec ancien
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </Sidebar>
        <SidebarInset>
            <div className="space-y-8 animate-fade-in">
            <Card className="max-w-3xl mx-auto">
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
                    disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Envoyer</span>
                    </Button>
                </form>

                {(isLoading || response) && (
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
                            <p>{response}</p>
                        )}
                        </div>
                    </div>
                )}
                </CardContent>
            </Card>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
