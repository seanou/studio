"use client";

import { useState } from "react";
import { latinChat } from "@/ai/flows/latin-chat-flow";
import type { LatinChatInput } from "@/ai/flows/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse("");
    try {
      const input: LatinChatInput = { message: query };
      const result = await latinChat(input);
      setResponse(result.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error: Non potui responsum obtinere.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Interroga Magistrum Digitalem
          </CardTitle>
          <CardDescription>
            Posez votre question en français, et l'IA vous répondra en latin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe hic..."
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
                <h3 className="text-lg font-semibold mb-2 text-primary">Responsum:</h3>
                <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] text-foreground/80 italic">
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                        <span>Cogitat...</span>
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
  );
}
