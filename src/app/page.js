import Link from 'next/link';
import Button from '../components/base/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
     
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Diverse%20martial%20arts%20athletes%20standing%20in%20circular%20formation%20wearing%20different%20uniforms%20including%20white%20Brazilian%20Jiu-Jitsu%20gi%2C%20blue%20judo%20gi%2C%20MMA%20shorts%20and%20gloves%2C%20Muay%20Thai%20shorts%20and%20hand%20wraps%2C%20kickboxing%20gear%2C%20wrestling%20singlet%2C%20and%20karate%20gi%2C%20professional%20training%20facility%20with%20dramatic%20lighting%2C%20unity%20and%20diversity%20in%20martial%20arts%2C%20high-quality%20sports%20photography%20with%20clean%20composition&width=1920&height=1080&seq=hero-circle-uniforms&orientation=landscape')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect. Train. Excel.
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              The ultimate platform for grapplers worldwide. Find expert coaches,
              join elite clubs, and access premium training resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/coaches">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Find Coaches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Promoted Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full mb-4">
              <i className="ri-star-fill text-yellow-300" />
              <span className="font-semibold">Featured &amp; Promoted</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium content, top coaches, and exclusive opportunities handpicked for you
            </p>
          </div>

          {/* Promoted Live Classes */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-live-line text-red-600" />
                Live Classes
              </h3>
              <Link href="/live-classes" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Promoted Live Class 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-radio-button-line animate-pulse" />
                  LIVE NOW
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20Brazilian%20Jiu-Jitsu%20instructor%20teaching%20advanced%20guard%20techniques%20in%20modern%20training%20facility%2C%20students%20practicing%20on%20mats%2C%20dynamic%20action%20shot%2C%20high-quality%20sports%20photography%20with%20professional%20lighting&width=400&height=250&seq=promoted-live-bjj&orientation=landscape"
                  alt="Advanced BJJ Guard Techniques"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20Brazilian%20Jiu-Jitsu%20black%20belt%20instructor%20portrait%2C%20confident%20martial%20arts%20coach%2C%20athletic%20build%2C%20professional%20headshot&width=40&height=40&seq=coach-marcus-silva&orientation=squarish"
                      alt="Marcus Silva"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Marcus Silva</p>
                      <p className="text-xs text-gray-500">BJJ Black Belt</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Advanced Guard Techniques</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Master the art of guard retention and sweeps with world-class instruction
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line" />
                      124 watching
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line" />
                      45 min
                    </span>
                  </div>
                  <Link
                    href="/live-classes"
                    className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Join Live Class
                  </Link>
                </div>
              </div>

              {/* Promoted Live Class 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <div className="absolute top-3 right-3 z-10 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Starts in 15 min
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=MMA%20fighter%20demonstrating%20striking%20combinations%20in%20octagon%20training%20facility%2C%20dynamic%20movement%2C%20professional%20sports%20photography%20with%20dramatic%20lighting&width=400&height=250&seq=promoted-live-mma&orientation=landscape"
                  alt="MMA Striking Fundamentals"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20MMA%20coach%20portrait%2C%20experienced%20martial%20arts%20instructor%2C%20athletic%20build%2C%20confident%20expression&width=40&height=40&seq=coach-sarah-chen&orientation=squarish"
                      alt="Sarah Chen"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Sarah Chen</p>
                      <p className="text-xs text-gray-500">MMA Champion</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">MMA Striking Fundamentals</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn essential striking techniques from a UFC veteran
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line" />
                      89 registered
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line" />
                      60 min
                    </span>
                  </div>
                  <Link
                    href="/live-classes"
                    className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Reserve Spot
                  </Link>
                </div>
              </div>

              {/* Promoted Live Class 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=Wrestling%20coach%20teaching%20takedown%20techniques%20in%20professional%20training%20facility%2C%20athletes%20practicing%20wrestling%20moves%2C%20dynamic%20sports%20photography&width=400&height=250&seq=promoted-live-wrestling&orientation=landscape"
                  alt="Wrestling Takedowns Masterclass"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=Olympic%20wrestling%20coach%20portrait%2C%20experienced%20wrestling%20instructor%2C%20professional%20headshot&width=40&height=40&seq=coach-dmitri-volkov&orientation=squarish"
                      alt="Dmitri Volkov"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Dmitri Volkov</p>
                      <p className="text-xs text-gray-500">Olympic Medalist</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Wrestling Takedowns Masterclass</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Olympic-level takedown techniques and strategies
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line" />
                      Tomorrow 6 PM
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line" />
                      90 min
                    </span>
                  </div>
                  <Link
                    href="/live-classes"
                    className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Promoted Coaches & Clubs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Promoted Coaches */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-user-star-line text-green-600" />
                  Featured Coaches
                </h3>
                <Link href="/coaches" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {/* Coach 1 */}
                <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20Brazilian%20Jiu-Jitsu%20black%20belt%20instructor%20portrait%2C%20experienced%20martial%20arts%20coach%2C%20confident%20expression%2C%20athletic%20build&width=100&height=100&seq=promoted-coach-1&orientation=squarish"
                      alt="Rafael Santos"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Rafael Santos</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        BJJ 4th Degree Black Belt • 15 years experience
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400" />
                          4.9 (287 reviews)
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-user-line" />
                          450+ students
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap text-sm">
                          Book Session
                        </button>
                        <button className="px-4 border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coach 2 */}
                <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20female%20MMA%20coach%20portrait%2C%20experienced%20martial%20arts%20instructor%2C%20confident%20and%20strong%2C%20athletic%20build&width=100&height=100&seq=promoted-coach-2&orientation=squarish"
                      alt="Amanda Rodriguez"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Amanda Rodriguez</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        MMA Champion • UFC Veteran • 12 years experience
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400" />
                          5.0 (198 reviews)
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-user-line" />
                          320+ students
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap text-sm">
                          Book Session
                        </button>
                        <button className="px-4 border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promoted Clubs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-building-line text-purple-600" />
                  Featured Clubs
                </h3>
                <Link href="/clubs" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {/* Club 1 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 right-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <img
                    src="https://readdy.ai/api/search-image?query=Modern%20Brazilian%20Jiu-Jitsu%20training%20facility%20interior%2C%20professional%20gym%20with%20clean%20mats%2C%20training%20equipment%2C%20bright%20lighting%2C%20spacious%20martial%20arts%20dojo&width=400&height=150&seq=promoted-club-1&orientation=landscape"
                    alt="Elite Grappling Academy"
                    className="w-full h-32 object-cover object-top"
                  />
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Elite Grappling Academy</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Premier BJJ and MMA training facility with world-class instructors
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="ri-map-pin-line" />
                        Los Angeles, CA
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-user-line" />
                        500+ members
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                      View Club
                    </button>
                  </div>
                </div>

                {/* Club 2 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 right-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20wrestling%20training%20facility%20interior%2C%20Olympic-style%20wrestling%20mats%2C%20modern%20gym%20equipment%2C%20bright%20lighting%2C%20spacious%20training%20area&width=400&height=150&seq=promoted-club-2&orientation=landscape"
                    alt="Champions Wrestling Club"
                    className="w-full h-32 object-cover object-top"
                  />
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Champions Wrestling Club</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Olympic-level wrestling training with medalist coaches
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="ri-map-pin-line" />
                        New York, NY
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-user-line" />
                        350+ members
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                      View Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promoted Recorded Sessions & Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Promoted Recorded Sessions */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-video-line text-red-600" />
                  Premium Sessions
                </h3>
                <Link
                  href="/student-dashboard"
                  className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {/* Session 1 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Brazilian%20Jiu-Jitsu%20submission%20techniques%20demonstration%2C%20professional%20instructional%20video%20thumbnail%2C%20high-quality%20martial%20arts%20photography&width=150&height=100&seq=promoted-session-1&orientation=landscape"
                      alt="Complete Submission System"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">Complete Submission System</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Master 50+ submission techniques from every position
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line" />
                            8 hours
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            4.9
                          </span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$49.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session 2 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=MMA%20striking%20and%20grappling%20combination%20techniques%2C%20professional%20training%20video%20thumbnail%2C%20dynamic%20martial%20arts%20action&width=150&height=100&seq=promoted-session-2&orientation=landscape"
                      alt="MMA Fundamentals Course"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">MMA Fundamentals Course</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Complete beginner to intermediate MMA training program
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line" />
                            12 hours
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            5.0
                          </span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$79.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session 3 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Wrestling%20takedown%20techniques%20demonstration%2C%20professional%20instructional%20video%20thumbnail%2C%20Olympic%20wrestling%20training&width=150&height=100&seq=promoted-session-3&orientation=landscape"
                      alt="Wrestling Mastery Program"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">Wrestling Mastery Program</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Olympic-level wrestling techniques and strategies
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line" />
                            10 hours
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            4.8
                          </span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$59.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promoted Marketplace Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-shopping-bag-line text-orange-600" />
                  Featured Products
                </h3>
                <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {/* Product 1 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Premium%20white%20Brazilian%20Jiu-Jitsu%20gi%20kimono%2C%20high-quality%20martial%20arts%20uniform%2C%20professional%20product%20photography%20with%20clean%20white%20background&width=150&height=100&seq=promoted-product-1&orientation=squarish"
                      alt="Premium BJJ Gi"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">Premium Competition Gi</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        IBJJF approved, pearl weave, ultra-durable
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            4.9 (234)
                          </span>
                          <span className="text-green-600 font-semibold">In Stock</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$149.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20MMA%20training%20gloves%2C%20high-quality%20mixed%20martial%20arts%20equipment%2C%20black%20and%20red%20design%2C%20product%20photography%20with%20clean%20background&width=150&height=100&seq=promoted-product-2&orientation=squarish"
                      alt="Pro MMA Gloves"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">Pro MMA Training Gloves</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Premium leather, superior wrist support
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            5.0 (189)
                          </span>
                          <span className="text-green-600 font-semibold">In Stock</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$89.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill" />
                    PROMOTED
                  </div>
                  <div className="flex gap-4 p-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%20wrestling%20shoes%2C%20high-quality%20grappling%20footwear%2C%20black%20and%20gold%20design%2C%20product%20photography%20with%20clean%20background&width=150&height=100&seq=promoted-product-3&orientation=squarish"
                      alt="Elite Wrestling Shoes"
                      className="w-32 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">Elite Wrestling Shoes</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Superior grip, lightweight, competition-ready
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400" />
                            4.8 (156)
                          </span>
                          <span className="text-green-600 font-semibold">In Stock</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">$119.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promoted Seminars */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-presentation-line text-indigo-600" />
                Upcoming Seminars &amp; Events
              </h3>
              <Link href="/live-classes" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Seminar 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Limited Spots
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20Brazilian%20Jiu-Jitsu%20seminar%20with%20world%20champion%20instructor%20teaching%20large%20group%20of%20students%20in%20modern%20training%20facility%2C%20professional%20event%20photography&width=400&height=250&seq=promoted-seminar-1&orientation=landscape"
                  alt="World Champion BJJ Seminar"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=World%20champion%20Brazilian%20Jiu-Jitsu%20black%20belt%20portrait%2C%20legendary%20martial%20arts%20instructor%2C%20professional%20headshot&width=40&height=40&seq=seminar-instructor-1&orientation=squarish"
                      alt="Gordon Ryan"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Gordon Ryan</p>
                      <p className="text-xs text-gray-500">ADCC Champion</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No-Gi Mastery Seminar</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn championship-level techniques from the best in the world
                  </p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="flex items-center gap-1 text-gray-500">
                      <i className="ri-calendar-line" />
                      March 15, 2024
                    </span>
                    <span className="text-xl font-bold text-blue-600">$199</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <i className="ri-map-pin-line" />
                    <span>Los Angeles, CA • 3 hours</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                    Register Now
                  </button>
                </div>
              </div>

              {/* Seminar 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20MMA%20seminar%20with%20UFC%20champion%20teaching%20striking%20techniques%20to%20large%20group%20in%20modern%20training%20facility%2C%20professional%20event%20photography&width=400&height=250&seq=promoted-seminar-2&orientation=landscape"
                  alt="UFC Champion MMA Workshop"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=UFC%20champion%20fighter%20portrait%2C%20professional%20MMA%20athlete%2C%20confident%20expression%2C%20professional%20headshot&width=40&height=40&seq=seminar-instructor-2&orientation=squarish"
                      alt="Israel Adesanya"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Israel Adesanya</p>
                      <p className="text-xs text-gray-500">UFC Champion</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Striking Masterclass</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Advanced striking techniques and fight strategies from a champion
                  </p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="flex items-center gap-1 text-gray-500">
                      <i className="ri-calendar-line" />
                      March 22, 2024
                    </span>
                    <span className="text-xl font-bold text-blue-600">$249</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <i className="ri-map-pin-line" />
                    <span>Miami, FL • 4 hours</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                    Register Now
                  </button>
                </div>
              </div>

              {/* Seminar 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i className="ri-star-fill" />
                  PROMOTED
                </div>
                <div className="absolute top-3 right-3 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Early Bird
                </div>
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20wrestling%20seminar%20with%20Olympic%20medalist%20teaching%20techniques%20to%20large%20group%20in%20training%20facility%2C%20professional%20event%20photography&width=400&height=250&seq=promoted-seminar-3&orientation=landscape"
                  alt="Olympic Wrestling Camp"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=Olympic%20wrestling%20gold%20medalist%20portrait%2C%20legendary%20wrestling%20coach%2C%20professional%20headshot&width=40&height=40&seq=seminar-instructor-3&orientation=squarish"
                      alt="Jordan Burroughs"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Jordan Burroughs</p>
                      <p className="text-xs text-gray-500">Olympic Gold Medalist</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Wrestling Excellence Camp</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    3-day intensive training camp with Olympic champion
                  </p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="flex items-center gap-1 text-gray-500">
                      <i className="ri-calendar-line" />
                      April 5-7, 2024
                    </span>
                    <span className="text-xl font-bold text-blue-600">$399</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <i className="ri-map-pin-line" />
                    <span>Chicago, IL • 3 days</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a beginner or a seasoned competitor, our platform provides
              all the tools and connections you need to reach your grappling goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-user-line text-2xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Students</h3>
              <p className="text-gray-600 mb-6">
                Find qualified coaches, join live classes, track your progress,
                and connect with fellow grapplers in your area.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Find certified coaches
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Join live training sessions
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Track your progress
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Connect with community
                </li>
              </ul>
            </div>

            {/* For Coaches */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-user-star-line text-2xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Coaches</h3>
              <p className="text-gray-600 mb-6">
                Build your coaching business, manage students, host live classes,
                and grow your reputation in the grappling community.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Manage your students
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Host live classes
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Build your brand
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Earn revenue
                </li>
              </ul>
            </div>

            {/* For Clubs */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-building-line text-2xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Clubs</h3>
              <p className="text-gray-600 mb-6">
                Manage your gym, organize events, connect with members,
                and expand your reach to attract new students.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Manage memberships
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Organize events
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Attract new members
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2" />
                  Build community
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Premium Grappling Marketplace
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Discover high-quality grappling gear, training equipment, and exclusive
                products from trusted vendors in our curated marketplace.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <i className="ri-shield-check-line text-green-500 text-xl mr-3" />
                  <span className="text-gray-700">Verified vendors only</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-truck-line text-green-500 text-xl mr-3" />
                  <span className="text-gray-700">Fast shipping worldwide</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-star-line text-green-500 text-xl mr-3" />
                  <span className="text-gray-700">Premium quality guaranteed</span>
                </div>
              </div>
              <Link href="/marketplace">
                <Button size="lg">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=High-quality%20Brazilian%20Jiu-Jitsu%20and%20wrestling%20gear%20display%20including%20gis%2C%20rash%20guards%2C%20wrestling%20shoes%2C%20training%20equipment%2C%20and%20accessories%20arranged%20professionally%20in%20a%20modern%20sports%20store%20setting%20with%20clean%20white%20background&width=600&height=400&seq=marketplace-preview&orientation=landscape"
                alt="Grappling gear and equipment"
                className="rounded-xl shadow-lg object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2,500+</div>
              <div className="text-xl">Active Students</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">450+</div>
              <div className="text-xl">Certified Coaches</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">180+</div>
              <div className="text-xl">Partner Clubs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-xl">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Series Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grappling Podcast Series
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into the world of martial arts with our exclusive podcast series.
              Learn from legends, discover techniques, and stay updated with the latest in grappling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brazilian Jiu-Jitsu Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20Brazilian%20Jiu-Jitsu%20podcast%20studio%20setup%20with%20microphones%2C%20headphones%2C%20and%20BJJ%20gi%20in%20background%2C%20modern%20recording%20equipment%2C%20warm%20lighting%2C%20professional%20podcast%20atmosphere%20with%20martial%20arts%20elements&width=400&height=250&seq=bjj-podcast&orientation=landscape"
                  alt="Brazilian Jiu-Jitsu Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  BJJ
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">The BJJ Chronicles</h3>
                <p className="text-gray-600 mb-4">
                  Explore the gentle art with world-class black belts sharing techniques,
                  philosophy, and competition insights.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">24 Episodes</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>

            {/* MMA Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Mixed%20martial%20arts%20podcast%20recording%20studio%20with%20MMA%20gloves%2C%20octagon%20backdrop%2C%20professional%20microphones%20and%20audio%20equipment%2C%20dynamic%20lighting%2C%20modern%20sports%20podcast%20setup%20with%20fighting%20gear%20displayed&width=400&height=250&seq=mma-podcast&orientation=landscape"
                  alt="MMA Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  MMA
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cage Talk</h3>
                <p className="text-gray-600 mb-4">
                  Inside the octagon with UFC fighters, coaches, and analysts discussing
                  the latest in mixed martial arts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">18 Episodes</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>

            {/* Wrestling Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Wrestling%20podcast%20studio%20with%20wrestling%20mats%2C%20Olympic%20wrestling%20singlets%2C%20professional%20recording%20equipment%2C%20microphones%2C%20wrestling%20medals%20and%20trophies%20in%20background%2C%20athletic%20podcast%20setup&width=400&height=250&seq=wrestling-podcast&orientation=landscape"
                  alt="Wrestling Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Wrestling
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mat Masters</h3>
                <p className="text-gray-600 mb-4">
                  From freestyle to folkstyle, Olympic champions share their journey
                  and wrestling wisdom.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">31 Episodes</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>

            {/* Judo Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Judo%20podcast%20recording%20studio%20with%20traditional%20white%20judo%20gi%2C%20black%20belts%2C%20tatami%20mats%2C%20professional%20microphones%2C%20Japanese%20martial%20arts%20atmosphere%2C%20clean%20modern%20podcast%20setup%20with%20judo%20equipment&width=400&height=250&seq=judo-podcast&orientation=landscape"
                  alt="Judo Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Judo
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Way of Judo</h3>
                <p className="text-gray-600 mb-4">
                  Traditional techniques meet modern competition with Olympic judokas
                  and sensei masters.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">15 Episodes</span>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>

            {/* Karate Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Karate%20podcast%20studio%20with%20traditional%20white%20karate%20gi%2C%20black%20belt%2C%20wooden%20training%20equipment%2C%20professional%20recording%20setup%2C%20Japanese%20martial%20arts%20dojo%20atmosphere%2C%20modern%20podcast%20equipment%20with%20karate%20gear&width=400&height=250&seq=karate-podcast&orientation=landscape"
                  alt="Karate Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Karate
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Karate Conversations</h3>
                <p className="text-gray-600 mb-4">
                  Traditional kata, modern kumite, and the philosophy behind
                  the empty hand martial art.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">22 Episodes</span>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>

            {/* Submission Grappling Podcast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Submission%20grappling%20podcast%20studio%20with%20no-gi%20rash%20guards%2C%20grappling%20shorts%2C%20professional%20recording%20equipment%2C%20modern%20training%20facility%20background%2C%20athletic%20podcast%20setup%20with%20submission%20grappling%20gear&width=400&height=250&seq=submission-podcast&orientation=landscape"
                  alt="Submission Grappling Podcast"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  No-Gi
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submission Science</h3>
                <p className="text-gray-600 mb-4">
                  No-gi grappling evolution with ADCC champions and submission
                  specialists breaking down techniques.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">19 Episodes</span>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                    Listen Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/podcasts">
              <Button size="lg" className="text-lg px-8 py-4">
                View All Podcasts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Grappling Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of grapplers who are already using GrapplersHub to
            connect, learn, and excel in their martial arts journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


