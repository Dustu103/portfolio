"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "/#about", label: "ABOUT" },
  { href: "/#experience", label: "EXPERIENCE" },
  { href: "/#skills", label: "SKILLS" },
  { href: "/#projects", label: "PROJECTS" },
  { href: "/#process", label: "PROCESS" },
  { href: "/#education", label: "EDUCATION" },
  { href: "/#contact", label: "CONTACT" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and past 50px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setMenuOpen(false); // Auto-close mobile menu on scroll down
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`sticky top-0 z-[100] transition-transform duration-300 ease-in-out bg-[#0a0d14]/90 backdrop-blur-md rounded-b-xl border-b border-[#353951]/50 ${
        isVisible ? 'translate-y-0' : '-translate-y-[120%]'
      }`} 
      role="navigation"
    >
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem]">
        <div className="flex items-center justify-between py-5">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="text-[#16f2b3] text-2xl lg:text-3xl font-bold">
            ARNAB PRAMANIK
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex md:items-center md:space-x-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                className="block px-4 py-2 no-underline outline-none hover:no-underline"
                href={link.href}
              >
                <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">
                  {link.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-[#1a1443] transition-colors duration-200"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1224] border border-[#353951] rounded-lg mb-4">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-6 py-3 text-sm text-white hover:text-pink-500 hover:bg-[#1a1443] transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </nav>
  );
}

export default Navbar;
