"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Genially } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Presentation } from "lucide-react";

const FormSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit comporter au moins 3 caractères." }),
  url: z.string().url({ message: "Veuillez entrer une URL valide." }).startsWith("https://view.genial.ly/", {message: "L'URL doit commencer par https://view.genial.ly/"}),
});

export default function Home() {
  const { toast } = useToast();
  const [history, setHistory] = useState<Genially[]>([]);
  const [currentGenially, setCurrentGenially] = useState<Genially | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedHistory = localStorage.getItem("geniallyHistory");
      const parsedHistory: Genially[] = storedHistory ? JSON.parse(storedHistory) : [];
      setHistory(parsedHistory);

      const urlToLoad = localStorage.getItem("currentGeniallyUrl");
      if (urlToLoad) {
        const geniallyToLoad = parsedHistory.find(g => g.url === urlToLoad);
        if (geniallyToLoad) {
          setCurrentGenially(geniallyToLoad);
        }
        localStorage.removeItem("currentGeniallyUrl");
      } else if (parsedHistory.length > 0) {
        const sortedHistory = [...parsedHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCurrentGenially(sortedHistory[0]);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder à l'historique local.",
      });
    }
  }, [toast]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { title, url } = data;
    
    if (history.some(g => g.url === url)) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Ce Genially est déjà dans votre historique.",
        });
        return;
    }

    const idMatch = url.match(/view\.genial\.ly\/([a-zA-Z0-9]+)/);
    if (!idMatch) {
         toast({
            variant: "destructive",
            title: "Erreur",
            description: "URL Genially invalide, impossible d'extraire l'ID.",
        });
        return;
    }
    
    const newGenially: Genially = {
      id: idMatch[1],
      url: url,
      title: title,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [newGenially, ...history];
    setHistory(updatedHistory);
    setCurrentGenially(newGenially);
    localStorage.setItem("geniallyHistory", JSON.stringify(updatedHistory));

    toast({
      title: "Succès!",
      description: "Votre Genially a été ajouté et est affiché ci-dessous.",
    });
    form.reset();
  }
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            Ajouter un nouveau Genially
          </CardTitle>
          <CardDescription>
            Collez l'URL de votre présentation Genially et donnez-lui un titre pour l'ajouter à votre collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ma présentation d'histoire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Genially</FormLabel>
                    <FormControl>
                      <Input placeholder="https://view.genial.ly/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Afficher Genially
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {currentGenially ? (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{currentGenially.title}</CardTitle>
            <CardDescription>Ajouté le {new Date(currentGenially.createdAt).toLocaleDateString('fr-FR')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-accent shadow-lg">
                <iframe
                    key={currentGenially.id}
                    src={currentGenially.url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    className="animate-fade-in"
                    title={currentGenially.title}
                ></iframe>
            </div>
          </CardContent>
        </Card>
      ) : (
         <Card className="flex flex-col items-center justify-center p-12 text-center bg-card">
            <Presentation className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>Bienvenue sur Schola Ludus!</CardTitle>
            <CardDescription className="mt-2 max-w-md">
                Aucun Genially à afficher pour le moment. Ajoutez-en un en utilisant le formulaire ci-dessus pour commencer.
            </CardDescription>
        </Card>
      )}
    </div>
  );
}
