import HeroSlider from "./components/home/HeroSlider";
import HorseStable from "./components/home/HorseStable";
import Coach from "./components/home/Coach";
import OtherServices from "./components/home/OtherServices";
import Content from "./components/home/Content";
import OurClient from "./components/home/ourClient";
import AutoSubscriptionManager from "./components/AutoSubscriptionManager";
import MarketPlace from "./components/home/MarketPlace";
import HorseMarket from "./components/home/HourseMarket";

export default function Home() {
  return (
    <div className="font-sans">
      <AutoSubscriptionManager />
      <HeroSlider />
      <HorseMarket />
      <HorseStable />
      <Coach />
      <OtherServices />
      <MarketPlace />
      <Content />
      
      {/* <OurClient /> */}
    </div>
  );
}
