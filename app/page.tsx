import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Hero />
      <HomeProducts />
    </main>
  );
}