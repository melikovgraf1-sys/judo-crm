import React from 'react';
import NavBar from './NavBar';

export default function Layout({ children }:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
