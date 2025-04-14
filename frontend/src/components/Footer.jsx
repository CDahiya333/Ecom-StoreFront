import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    about: {
      title: 'About Us',
      links: [
        { name: 'Our Story', href: '#' },
        { name: 'Design Philosophy', href: '#' },
        { name: 'Artisans & Craftsmen', href: '#' },
        { name: 'Press & Media', href: '#' },
        { name: 'Careers', href: '#' }
      ]
    },
    explore: {
      title: 'Explore',
      links: [
        { name: 'Collections', href: '#' },
        { name: 'Seasonal Editions', href: '#' },
        { name: 'Design Inspiration', href: '#' },
        { name: 'Material Guide', href: '#' },
        { name: 'Care Instructions', href: '#' }
      ]
    },
    community: {
      title: 'Community',
      links: [
        { name: 'Design Consultation', href: '#' },
        { name: 'Events & Exhibitions', href: '#' },
        { name: 'Customer Stories', href: '#' },
        { name: 'Design Blog', href: '#' },
        { name: 'Trade Program', href: '#' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Shipping & Delivery', href: '#' },
        { name: 'Returns Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
      ]
    }
  };

  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(footerSections).map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-amber-200/80 hover:text-amber-100 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-12 pt-8 border-t border-amber-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a href="#" className="text-amber-200/80 hover:text-amber-100 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-amber-200/80 hover:text-amber-100 transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-amber-200/80 hover:text-amber-100 transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-amber-200/80 hover:text-amber-100 transition-colors duration-200">
                <Youtube size={24} />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Subscribe to our News Letter"
                className="px-2 py-2.5 w-64 bg-amber-50 text-amber-900 rounded-lg border-2 border-amber-200 
                focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 
                font-medium shadow-sm hover:bg-amber-100/50 transition-all duration-200"
              />
              <button 
                className="px-4 py-2 bg-amber-700 text-amber-100 rounded-md hover:bg-amber-600 
                transition-all duration-300 transform hover:scale-105 active:scale-95 
                hover:shadow-lg active:shadow-inner"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-amber-800 text-center text-amber-200/80 text-sm">
          <p>© {currentYear} Maison Élégance. All rights reserved. Crafting premium living spaces since 2023.</p>
          <div className="mt-2 space-x-4">
            <Link to="#" className="hover:text-amber-100 transition-colors duration-200">Privacy</Link>
            <Link to="#" className="hover:text-amber-100 transition-colors duration-200">Terms</Link>
            <Link to="#" className="hover:text-amber-100 transition-colors duration-200">Cookies</Link>
            <Link to="#" className="hover:text-amber-100 transition-colors duration-200">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 