"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Eye } from "lucide-react";

// Vous pouvez modifier cette liste pour inclure vos Geniallys
const historyItems = [
  {
    id: "668ba83234d3d30013a6d7f9",
    url: "https://view.genial.ly/668ba83234d3d30013a6d7f9",
    title: "Présentation sur l'Histoire",
    createdAt: "2023-10-27T10:00:00.000Z",
  },
  {
    id: "668ba8053f39380013f7b4e9",
    url: "https://view.genial.ly/668ba8053f39380013f7b4e9",
    title: "Leçon de Sciences",
    createdAt: "2023-10-26T14:30:00.000Z",
  },
  {
    id: "65f32a75e3532600142b6a5e",
    url: "https://view.genial.ly/65f32a75e3532600142b6a5e",
    title: "Projet d'Art",
    createdAt: "2023-10-25T09:15:00.000Z",
  },
];

export default function HistoryPage() {
  const handleView = (url: string) => {
    // Dans cette version simplifiée, nous ouvrons dans un nouvel onglet.
    window.open(url, "_blank");
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((genially) => (
            <Card key={genially.id} className="flex flex-col hover:shadow-accent/50 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-headline">{genially.title}</CardTitle>
                <CardDescription>
                  Créé le {new Date(genially.createdAt).toLocaleDateString('fr-FR')}
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
