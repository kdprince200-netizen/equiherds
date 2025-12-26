import Link from 'next/link';
import Button from '../../components/base/Button';

export default function Podcasts() {
  const podcasts = [
    {
      id: 'bjj-chronicles',
      title: 'The BJJ Chronicles',
      description: 'Explore the gentle art with world-class black belts sharing techniques, philosophy, and competition insights.',
      episodes: 24,
      color: 'blue',
      image: '/images/podcasts/imgi_1_search-image.png'
    },
    {
      id: 'cage-talk',
      title: 'Cage Talk',
      description: 'Inside the octagon with UFC fighters, coaches, and analysts discussing the latest in mixed martial arts.',
      episodes: 18,
      color: 'red',
      image: '/images/podcasts/imgi_2_search-image.png'
    },
    {
      id: 'mat-masters',
      title: 'Mat Masters',
      description: 'From freestyle to folkstyle, Olympic champions share their journey and wrestling wisdom.',
      episodes: 31,
      color: 'green',
      image: '/images/podcasts/imgi_3_search-image.png'
    },
    {
      id: 'way-of-judo',
      title: 'The Way of Judo',
      description: 'Traditional techniques meet modern competition with Olympic judokas and sensei masters.',
      episodes: 15,
      color: 'yellow',
      image: '/images/podcasts/imgi_4_search-image.png'
    },
    {
      id: 'karate-conversations',
      title: 'Karate Conversations',
      description: 'Traditional kata, modern kumite, and the philosophy behind the empty hand martial art.',
      episodes: 22,
      color: 'orange',
      image: '/images/podcasts/imgi_5_search-image.png'
    },
    {
      id: 'submission-science',
      title: 'Submission Science',
      description: 'No-gi grappling evolution with ADCC champions and submission specialists breaking down techniques.',
      episodes: 19,
      color: 'purple',
      image: '/images/podcasts/imgi_6_search-image.png'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Grappling Podcast Series</h1>
            <p className="text-xl text-slate-200">
              Dive deep into the world of martial arts with our exclusive podcast series
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-full h-48 object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{podcast.title}</h3>
                  <p className="text-gray-600 mb-4">{podcast.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{podcast.episodes} Episodes</span>
                    <Link href={`/podcast/${podcast.id}`}>
                      <button className={`${colorClasses[podcast.color]} text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer`}>
                        Listen Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

