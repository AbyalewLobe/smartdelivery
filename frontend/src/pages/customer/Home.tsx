import { Link } from 'react-router-dom';
import { Truck, Shield, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useIsAuthenticated } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../api/categoryApi';

export function Home() {
  const isAuthenticated = useIsAuthenticated();

  const { data: categoriesData } = useQuery({
    queryKey: ['shop-categories-public'],
    queryFn: () => categoryApi.getCategories({ type: 'shop', activeOnly: true }),
    staleTime: 60000
  });
  const categories = categoriesData?.data || [];

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
      {/* Hero Section with Gradient */}
      <section className="relative min-h-[600px] py-20 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Discover
                <br />
                <span className="text-primary-400">Amazing Products,</span>
                <br />
                <span className="text-primary-300">From Trusted Local Shops</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Order from your favorite local shops and get everything delivered to your door.
                Fresh products, fast delivery, all in one place.
              </p>
              <Link to="/shops">
                <Button size="lg" className="text-lg px-10 shadow-xl shadow-primary-900/50">
                  Start Shopping
                </Button>
              </Link>
            </div>

            <div className="relative hidden md:block">
              <div className="w-full h-96 bg-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="text-8xl mb-4">🛍️</div>
                  <p className="text-2xl font-semibold text-white/90">Bazaar+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 px-4 bg-gray-950 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
            Browse by Category
          </span>
          <h2 className="text-4xl font-bold text-white mb-12">
            Shop by <span className="text-primary-400">Category</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                to={`/shops?category=${category.name}`}
              >
                <button className="px-7 py-3 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/50 font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-900/30">
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
                Experience the joy of hassle-free shopping with Bazaar+.
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
      <section className="relative py-24 px-4 bg-gray-950 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
              Why Bazaar+
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Built for the way<br />
              <span className="text-primary-400">you shop</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden
                  hover:bg-white/10 hover:border-primary-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/30
                  transition-all duration-300 ease-out cursor-default"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none"></div>

                {/* Icon */}
                <div className="relative w-14 h-14 mb-5 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center text-primary-400
                  group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Number watermark */}
                <span className="absolute top-4 right-5 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-all duration-300 select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-primary-300 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — hidden when logged in */}
      {!isAuthenticated && (
        <section className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-300 text-sm font-medium rounded-full mb-6 border border-white/10">
              Join Bazaar+ Today
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to Start<br />
              <span className="text-primary-400">Shopping Smarter?</span>
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Join thousands of happy customers and get your favorite products delivered today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="px-10 shadow-xl shadow-primary-900/50">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/shops">
                <button className="px-10 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
                  Browse Shops
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

