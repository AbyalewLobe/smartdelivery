import { Link } from 'react-router-dom';
import { Truck, Shield, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function Home() {
  const categories = [
    { name: 'Grocery' },
    { name: 'Restaurant' },
    { name: 'Pharmacy' },
    { name: 'Electronics' },
    { name: 'Fashion' },
    { name: 'Other' },
  ];

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly to your doorstep'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payment',
      description: 'Multiple payment options with secure transactions'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Track Orders',
      description: 'Real-time tracking of your order status'
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Wide Selection',
      description: 'Shop from multiple stores in one place'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover
                <br />
                <span className="text-primary-600">Amazing Products,</span>
                <br />
                <span className="text-primary-700">From Trusted Local Shops</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Order from your favorite local shops and get everything delivered to your door. 
                Fresh products, fast delivery, all in one place.
              </p>
              <Link to="/shops">
                <Button size="lg" className="text-lg px-10">
                  Start Shopping
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🛍️</div>
                  <p className="text-2xl font-semibold text-primary-800">Smart Deliver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/shops?category=${category.name.toLowerCase()}`}
              >
                <button className="px-8 py-3 bg-gray-100 hover:bg-gray-900 text-gray-700 hover:text-white font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                  {category.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Experience Section with Image */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative order-2 md:order-1">
              <div className="relative">
                {/* Abstract background shapes */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-200 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-green-200 rounded-full opacity-50 blur-2xl"></div>
                
                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/shop.jpg" 
                    alt="Shopping bags" 
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-600">1000+</p>
                    <p className="text-sm text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Shopping,
                <span className="text-primary-600"> Simplified</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Experience the joy of hassle-free shopping with Smart Deliver. 
                Browse thousands of products, compare prices, and get everything 
                delivered right to your doorstep.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Stores</h3>
                    <p className="text-gray-600">Shop from all your favorite stores in one place</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Same Day Delivery</h3>
                    <p className="text-gray-600">Get your orders delivered on the same day</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                    <p className="text-gray-600">Hassle-free returns and refunds</p>
                  </div>
                </li>
              </ul>
              <Link to="/shops">
                <Button size="lg">
                  Explore Shops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of happy customers and get your favorite products delivered today
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="text-lg px-10">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

