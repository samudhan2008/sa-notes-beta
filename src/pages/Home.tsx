import { Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Share Knowledge, <span className="text-primary">Ace Your Studies</span>
              </h1>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                SA Notes is the platform for students to share and discover high-quality study notes across all subjects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button as={Link} to="/dashboard" color="primary" size="lg">
                      Go to Dashboard
                    </Button>
                    <Button as={Link} to="/upload" variant="bordered" color="primary" size="lg">
                      Upload Notes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/register" color="primary" size="lg">
                      Sign Up Now
                    </Button>
                    <Button as={Link} to="/notes" variant="bordered" color="primary" size="lg">
                      Browse Notes
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:ml-10">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center px-4">
                      <div className="w-4 h-4 mr-2 bg-primary rounded"></div>
                      <div className="text-sm font-medium">Data Structures Notes</div>
                    </div>
                    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="h-2 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-5/6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="h-2 w-5/6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  A+
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SA Notes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Notes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access high-quality study materials created by top students and educators.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a community of students helping each other succeed through knowledge sharing.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find exactly what you need with our intelligent search and filtering system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to improve your grades?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already sharing knowledge and acing their studies with SA Notes.
          </p>
          {!isAuthenticated && (
            <Button as={Link} to="/register" color="default" size="lg" className="font-medium">
              Create Your Free Account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}