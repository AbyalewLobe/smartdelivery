import { Link } from 'react-router-dom';
import { Truck, Shield, Clock, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { useIsAuthenticated } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../api/categoryApi';
import { getLocalized } from '../../lib/utils';

export function Home() {
  const { t, i18n } = useTranslation();
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
      title: t('home.fast_delivery'),
      description: t('home.fast_delivery_desc'),
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('home.secure_payment'),
      description: t('home.secure_payment_desc'),
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('home.track_orders'),
      description: t('home.track_orders_desc'),
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: t('home.wide_selection'),
      description: t('home.wide_selection_desc'),
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
                {t('home.hero_title')}
                <br />
                <span className="text-primary-300">{t('home.hero_subtitle')}</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                {t('home.hero_desc')}
              </p>
              <Link to="/shops">
                <Button size="lg" className="text-lg px-10 shadow-xl shadow-primary-900/50">
                  {t('home.start_shopping')}
                </Button>
              </Link>
            </div>

            <div className="relative hidden md:block">
              {/* Ambient glow blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-500/25 rounded-full blur-3xl animate-glow-pulse pointer-events-none"></div>
              <div className="absolute top-1/4 right-0 w-40 h-40 bg-primary-300/15 rounded-full blur-2xl animate-float-slow pointer-events-none"></div>
              <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl animate-float pointer-events-none"></div>

              {/* Floating logo — no card, no circle */}
              <div className="relative flex items-center justify-center h-96 animate-float">
                <img
                  src="/sarah_andJoseph2-removebg-preview.png"
                  alt="Sarah and Joseph"
                  className="w-96 h-auto drop-shadow-[0_20px_60px_rgba(34,197,94,0.35)] animate-fade-up transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_30px_80px_rgba(34,197,94,0.6)] cursor-pointer"
                />
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
            {t('home.browse_by_category')}
          </span>
          <h2 className="text-4xl font-bold text-white mb-12">
            {t('home.shop_by_category').split(' ').slice(0, -1).join(' ')} <span className="text-primary-400">{t('home.shop_by_category').split(' ').slice(-1)}</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                to={`/shops?category=${category.name?.en || category.name}`}
              >
                <button className="px-7 py-3 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/50 font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-900/30">
                  {getLocalized(category.name, i18n.language)}
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
                {t('home.your_shopping')}
                <span className="text-primary-600"> {t('home.simplified')}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('home.shopping_desc')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('home.multiple_stores')}</h3>
                    <p className="text-gray-600">{t('home.multiple_stores_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('home.same_day')}</h3>
                    <p className="text-gray-600">{t('home.same_day_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('home.easy_returns')}</h3>
                    <p className="text-gray-600">{t('home.easy_returns_desc')}</p>
                  </div>
                </li>
              </ul>
              <Link to="/shops">
                <Button size="lg">
                  {t('home.explore_shops')}
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
              {t('home.why_choose')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {t('home.why_built')}<br />
              <span className="text-primary-400">{t('home.you_shop')}</span>
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
              {t('home.join_today')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {t('home.cta_title')}
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              {t('home.cta_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="px-10 shadow-xl shadow-primary-900/50">
                  {t('home.create_account')}
                </Button>
              </Link>
              <Link to="/shops">
                <button className="px-10 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
                  {t('home.browse_shops')}
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
