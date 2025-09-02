"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { History, Link as LinkIcon } from "lucide-react";

// Modifiez cette liste pour ajouter vos propres Geniallys avec un titre et une URL.
const historyItems = [
  {
    url: "https://view.genial.ly/668ba83234d3d30013a6d7f9",
    title: "Bientôt disponible !",
  },
  {
    url: "https://view.genial.ly/668ba8053f39380013f7b4e9",
    title: "Bientôt disponible !",
  },
  {
    url: "https://view.genial.ly/65f32a75e3532600142b6a5e",
    title: "Bientôt disponible !",
  },
  // Ajoutez d'autres Geniallys ici
  // {
  //   url: "VOTRE_URL_GENIALLY",
  //   title: "VOTRE_TITRE",
  // },
];

export default function HistoryPage() {

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
          <History className="h-8 w-8"/> Historique des Geniallys
        </h1>
      </div>

      {historyItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <History className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>L'historique est vide</CardTitle>
            <CardDescription className="mt-2 max-w-md">
                Modifiez le fichier `src/app/history/page.tsx` pour ajouter des éléments.
            </CardDescription>
        </Card>
      ) : (
        <div className="bg-card border rounded-lg p-6 shadow-sm">
            <ul className="space-y-4">
            {historyItems.map((genially, index) => (
                <li key={index}>
                    <a 
                        href={genially.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-lg text-foreground hover:text-accent hover:underline transition-colors duration-200"
                    >
                        <LinkIcon className="mr-3 h-5 w-5 text-primary" />
                        {genially.title}
                    </a>
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
}
