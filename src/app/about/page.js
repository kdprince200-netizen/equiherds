import Link from 'next/link';
import Button from '../../components/base/Button';

export default function About() {
  const teamMembers = [
    {
      name: 'Alex Rodriguez',
      role: 'Founder & CEO',
      bio: 'Former UFC fighter with 15 years in martial arts. Passionate about connecting the grappling community.',
      image: '/images/about/imgi_1_search-image.png'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product',
      bio: 'Tech veteran with black belt in BJJ. Focused on creating the best user experience for our community.',
      image: '/images/about/imgi_2_search-image.png'
    },
    {
      name: 'Marcus Johnson',
      role: 'Community Manager',
      bio: 'Wrestling coach and community builder. Dedicated to fostering connections between athletes.',
      image: '/images/about/imgi_3_search-image.png'
    },
    {
      name: 'Emma Thompson',
      role: 'Head of Operations',
      bio: 'Operations expert with background in sports management. Ensures smooth platform operations.',
      image: '/images/about/imgi_4_search-image.png'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Members' },
    { number: '500+', label: 'Certified Coaches' },
    { number: '200+', label: 'Partner Clubs' },
    { number: '50+', label: 'Countries Served' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-900 to-slate-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/about/imgi_6_search-image.png')`
          }}
        ></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Grapplers Community</h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              We're building the world's largest platform for grapplers, connecting coaches, students, 
              and clubs in a thriving community dedicated to martial arts excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Mission</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-12">
              To democratize access to high-quality martial arts training by connecting passionate 
              grapplers worldwide. We believe everyone deserves access to expert coaching, 
              supportive communities, and premium training resources.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-community-line text-2xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Connect</h3>
                <p className="text-slate-600">
                  Bringing together coaches, students, and clubs in one unified platform
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-graduation-cap-line text-2xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Learn</h3>
                <p className="text-slate-600">
                  Access world-class training from certified coaches and proven methodologies
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-trophy-line text-2xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Grow</h3>
                <p className="text-slate-600">
                  Develop your skills, build your network, and achieve your martial arts goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto mb-4 object-cover object-top"
                  />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-teal-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Our Story</h2>
            <div className="prose prose-lg mx-auto text-slate-600">
              <p className="text-xl leading-relaxed mb-6">
                Founded in 2023 by a group of passionate martial artists and tech enthusiasts, 
                Grapplers Community was born from a simple observation: the grappling world 
                needed a better way to connect.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                As practitioners ourselves, we experienced firsthand the challenges of finding 
                quality instruction, connecting with training partners, and accessing the right 
                equipment. We saw talented coaches struggling to reach students, and dedicated 
                students unable to find the guidance they needed.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Today, we're proud to serve thousands of grapplers worldwide, from beginners 
                taking their first steps on the mats to world champions sharing their expertise. 
                Our platform has facilitated countless connections, enabled numerous success 
                stories, and continues to grow the global grappling community.
              </p>
              <p className="text-lg leading-relaxed">
                This is just the beginning. We're committed to continuously improving our platform, 
                expanding our reach, and supporting the martial arts community in every way we can.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-shield-check-line text-xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Integrity</h3>
                <p className="text-slate-600">
                  We maintain the highest standards of honesty and transparency in all our interactions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-heart-line text-xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Passion</h3>
                <p className="text-slate-600">
                  Our love for martial arts drives everything we do and every decision we make.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-lightbulb-line text-xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
                <p className="text-slate-600">
                  We continuously seek new ways to improve the training experience for our community.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-group-2-line text-xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
                <p className="text-slate-600">
                  We believe in the power of community to elevate everyone's martial arts journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-slate-300 mb-8">
            Ready to take your grappling journey to the next level?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap">
                Get Started Today
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

