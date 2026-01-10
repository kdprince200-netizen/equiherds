"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=majestic%20horses%20running%20freely%20across%20vast%20open%20meadow%20during%20golden%20sunset%20hour%20with%20dramatic%20sky%20warm%20orange%20and%20pink%20tones%20creating%20strong%20contrast%20for%20text%20readability%20artistic%20painterly%20style&width=1920&height=1080&seq=hero1&orientation=landscape"
          alt="Hero Background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Where Horse Lovers Unite
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 drop-shadow-lg max-w-2xl mx-auto">
            Share your equestrian journey, connect with fellow riders, and celebrate the bond between horse and human
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-teal-600 text-white px-8 py-4 rounded-full hover:bg-teal-700 transition-all text-lg font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105">
              Explore Stories
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/20 transition-all text-lg font-medium whitespace-nowrap border-2 border-white/30">
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}





