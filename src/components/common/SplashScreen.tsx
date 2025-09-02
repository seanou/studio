import Image from 'next/image';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-fade-in">
      <Image
        src="https://i.ibb.co/1Wr1PtX/image-removebg-preview-47.png"
        alt="Logo Schola Ludus"
        width={400}
        height={400}
        priority
      />
      <h1 className="text-3xl font-bold font-headline text-primary mt-4">
        Schola Ludus : Le latin autrement !
      </h1>
      <div className="mt-8 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
