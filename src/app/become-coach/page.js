import Link from 'next/link';
import Button from '../../components/base/Button';

export default function BecomeCoach() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Become a Coach</h1>
            <p className="text-xl text-slate-200">
              Share your expertise and build your coaching business
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Coaching Platform</h2>
              <p className="text-gray-600 mb-8">
                Connect with students worldwide and grow your coaching business. Our platform provides all the tools you need to succeed.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <i className="ri-check-line text-green-500 text-xl"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Profile</h3>
                    <p className="text-gray-600">Showcase your credentials and achievements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="ri-check-line text-green-500 text-xl"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Student Management</h3>
                    <p className="text-gray-600">Manage your students and track their progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="ri-check-line text-green-500 text-xl"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Payment Processing</h3>
                    <p className="text-gray-600">Secure payment handling for all your sessions</p>
                  </div>
                </div>
              </div>
              <Link href="/register">
                <Button size="lg" className="w-full">
                  Get Started as a Coach
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

