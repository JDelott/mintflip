import FeaturedSection from './components/FeaturedSection';
import RecentlyPlayedSection from './components/RecentlyPlayedSection';
import RecommendedSection from './components/RecommendedSection';
import WelcomeHeroSection from './components/WelcomeHeroSection';

const HomePage = () => {
  return (
    <div className="space-y-10 pb-20">
      <WelcomeHeroSection />
      <FeaturedSection />
      <RecentlyPlayedSection />
      <RecommendedSection />
    </div>
  );
};

export default HomePage;
