import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp 
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsCategory } from '../types/news';
import { JashpurLogo } from './JashpurLogo';

const footerCategories: NewsCategory[] = [
  'छत्तीसगढ़',
  'जशपुर',
  'राजनीति',
  'अपराध',
  'शिक्षा',
  'खेल',
  'व्यापार',
  'मनोरंजन',
  'देश-दुनिया'
];

export const Footer: React.FC = () => {
  const { navigateToHome, navigateToCategory, navigateToStaticPage } = useNews();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#182230] text-gray-300 pt-12 pb-8 border-t-4 border-[#C71920]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-gray-700/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <div 
              onClick={navigateToHome}
              className="cursor-pointer inline-flex items-center gap-3"
            >
              <JashpurLogo className="w-12 h-12 shrink-0 drop-shadow-md" />
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  Jashpur<span className="text-[#C71920]">.News</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Jashpur.News छत्तीसगढ़ के जशपुर जिले का प्रमुख, स्वतंत्र एवं विश्वसनीय डिजिटल हिंदी समाचार पत्र है। हम निष्पक्ष, निर्भीक और सटीक पत्रकारिता के लिए प्रतिबद्ध हैं।
            </p>

            <div className="pt-2 text-xs space-y-2 text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>VW34+F4W, Narayanpur, Chhattisgarh 496225, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+919907318667" className="hover:text-emerald-300 transition-colors font-bold">
                  +91 99073 18667
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="mailto:sarojonlineworks@gmail.com" className="hover:text-blue-300 transition-colors">
                  sarojonlineworks@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C71920] pl-2.5">
              समाचार श्रेणियां
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {footerCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigateToCategory(cat)}
                  className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
                >
                  • {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick & Legal Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C71920] pl-2.5">
              महत्वपूर्ण नीतियां
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => navigateToStaticPage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  हमारे बारे में (About Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  संपर्क करें (Contact Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('editorial')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  संपादकीय नीति व आचार संहिता
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  अस्वीकरण (Disclaimer)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  नियम एवं शर्तें (Terms & Conditions)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToStaticPage('sitemap')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  XML Sitemap & Robots.txt
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong>Jashpur.News</strong> सर्वाधिकार सुरक्षित।
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors bg-gray-800/80 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-700"
          >
            <span>शीर्ष पर जाएं</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
