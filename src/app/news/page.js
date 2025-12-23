import TopSection from "../components/topSection";
import NewsFeed from "./NewsFeed";

export const metadata = {
  title: "News | Equiherds",
};

export default function NewsPage() {
  return (
    <div className="font-sans">
      <TopSection title="News" />
      <section className="mx-auto max-w-7xl px-4 py-10 text-brand">
        <NewsFeed />
      </section>
    </div>
  );
}


