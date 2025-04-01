import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="relative h-10 w-auto mr-2">
                <Image
                  src="/farmanesia.png"
                  alt="Farmanesia Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-orange-600">FARMANESIA</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Farmanesia adalah sistem manajemen apotek terpadu yang membantu Anda mengelola inventaris, penjualan, dan layanan pelanggan dengan lebih efisien.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-orange-500">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pos" className="text-gray-600 hover:text-orange-500 text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pos/kasir" className="text-gray-600 hover:text-orange-500 text-sm">
                  Kasir
                </Link>
              </li>
              <li>
                <Link href="/pos/penjualan" className="text-gray-600 hover:text-orange-500 text-sm">
                  Penjualan
                </Link>
              </li>
              <li>
                <Link href="/pos/customer" className="text-gray-600 hover:text-orange-500 text-sm">
                  Customer
                </Link>
              </li>
              <li>
                <Link href="/pos/promo" className="text-gray-600 hover:text-orange-500 text-sm">
                  Promo
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                  Manajemen Inventaris
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                  Point of Sales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                  Manajemen Pelanggan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                  Laporan Keuangan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                  Integrasi E-Commerce
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                <span className="text-gray-600 text-sm">Jl. Farmasi No. 123, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-orange-500 mr-3" />
                <span className="text-gray-600 text-sm">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-orange-500 mr-3" />
                <span className="text-gray-600 text-sm">info@farmanesia.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} Farmanesia. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
