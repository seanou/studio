"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Presentation } from "lucide-react";

// URL de votre Genially principal. Vous pouvez la modifier ici.
const MAIN_GENIALLY_URL = "https://view.genial.ly/668ba83234d3d30013a6d7f9";
const MAIN_GENIALLY_TITLE = "Ma Présentation Principale";

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Presentation className="h-6 w-6" />
            {MAIN_GENIALLY_TITLE}
          </CardTitle>
          <CardDescription>
            Voici votre présentation Genially intégrée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-accent shadow-lg">
            <iframe
              src={MAIN_GENIALLY_URL}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              className="animate-fade-in"
              title={MAIN_GENIALLY_TITLE}
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
