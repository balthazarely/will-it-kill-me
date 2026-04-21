import FoodScanner from './components/FoodScanner';
import PageTransition from './components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <FoodScanner />
      </div>
    </PageTransition>
  );
}
