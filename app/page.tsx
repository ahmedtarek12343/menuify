import Preloader from "@/components/utils/Preloader";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="p-6">
      <Preloader />
      <Hero />
    </main>
  );
}
