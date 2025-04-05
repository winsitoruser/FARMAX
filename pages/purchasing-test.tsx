import React from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

export default function PurchasingTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <Head>
        <title>Test Page | FARMAX</title>
      </Head>
      
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text mb-4">
            Test Page for Purchasing Module
          </h1>
          <p className="text-gray-600 mb-8">Ini adalah halaman test untuk memastikan perubahan styling terlihat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-orange-100 shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-amber-500/20 rounded-full blur-xl -z-0"></div>
            
            <CardHeader className="border-b border-orange-100/50">
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                Test Card 1
              </h3>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <p className="text-gray-700 mb-4">
                Ini adalah test card dengan styling orange-amber sesuai dengan preferensi design.
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                Test Button
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-orange-100 shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-amber-500/20 rounded-full blur-xl -z-0"></div>
            
            <CardHeader className="border-b border-orange-100/50">
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                Test Card 2
              </h3>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <p className="text-gray-700 mb-4">
                Card ini menampilkan elemen dekoratif seperti gradient dan lingkaran blur.
              </p>
              <div className="flex space-x-3">
                <Link href="/purchasing" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-md">
                  Kembali ke Purchasing
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          Test page created at {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
