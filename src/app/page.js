import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundBeamsWithCollision className="fixed inset-0 min-h-screen w-full z-0">
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <Header />
          <Hero />
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
