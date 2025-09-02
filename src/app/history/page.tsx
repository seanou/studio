"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Genially } from "@/types";
import { searchGeniallyHistory } from "@/ai/flows/search-genially-history";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { History, Search, Eye, Loader2 } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  const [fullHistory, setFullHistory] = useState<Genially[]>([]);
  const [displayedHistory, setDisplayedHistory] = useState<Genially[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedHistory = localStorage.getItem("geniallyHistory");
      const parsedHistory: Genially[] = storedHistory ? JSON.parse(storedHistory) : [];
      const sortedHistory = [...parsedHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFullHistory(sortedHistory);
      setDisplayedHistory(sortedHistory);
    } catch (error) {
      console.error("Failed to access localStorage", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique.",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === "") {
        setDisplayedHistory(fullHistory);
        return;
      }
      
      setIsSearching(true);
      try {
        const geniallyTitles = fullHistory.map(g => g.title);
        if (geniallyTitles.length === 0) {
            setDisplayedHistory([]);
            return;
        };

        const { searchResults } = await searchGeniallyHistory({ keywords: searchQuery, geniallyTitles });
        const filteredHistory = fullHistory.filter(g => searchResults.includes(g.title));
        setDisplayedHistory(filteredHistory);
      } catch (error) {
        console.error("AI search failed:", error);
        toast({
          variant: "destructive",
          title: "Erreur de recherche",
          description: "La recherche IA a échoué. Affichage des résultats de base.",
        });
        const lowercasedQuery = searchQuery.toLowerCase();
        const fallbackResults = fullHistory.filter(g => g.title.toLowerCase().includes(lowercasedQuery));
        setDisplayedHistory(fallbackResults);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
        if(isClient) handleSearch();
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, fullHistory, toast, isClient]);

  const handleView = (url: string) => {
    localStorage.setItem("currentGeniallyUrl", url);
    router.push("/");
  };
  
  if (!isClient) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <History className="h-8 w-8"/> Historique des Geniallys
        </h1>
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Rechercher par titre ou mot-clé..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin"/>}
        </div>
      </div>

      {!isSearching && displayedHistory.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle>{fullHistory.length === 0 ? "Votre historique est vide" : "Aucun résultat"}</CardTitle>
          <CardDescription className="mt-2 max-w-md">
            {fullHistory.length === 0 ? "Ajoutez un Genially depuis la page d'accueil pour commencer." : "Aucun Genially ne correspond à votre recherche."}
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHistory.map((genially) => (
            <Card key={genially.id} className="flex flex-col hover:shadow-accent/50 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-headline">{genially.title}</CardTitle>
                <CardDescription>
                  Ajouté le {new Date(genially.createdAt).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <Image data-ai-hint="presentation abstract" src={`https://picsum.photos/seed/${genially.id}/400/225`} alt={`Aperçu pour ${genially.title}`} width={400} height={225} className="w-full h-full object-cover" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleView(genially.url)} className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
