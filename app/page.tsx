import FoodScanner from './components/FoodScanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <main className="w-full max-w-md mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Scanr</h1>
        </div>
        <FoodScanner />
      </main>
    </div>
  );
}
