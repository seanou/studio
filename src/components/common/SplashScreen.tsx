import Image from 'next/image';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white animate-fade-in">
      <div className="animate-pulse">
        <Image
          src="https://i.ibb.co/1Wr1PtX/image-removebg-preview-47.png"
          alt="Logo Schola Ludus"
          width={300}
          height={300}
          priority
        />
      </div>
    </div>
  );
}
