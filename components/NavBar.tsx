import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const NavLink = ({ href, children }:{href:string; children:React.ReactNode}) => {
  const { pathname } = useRouter();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={
        'px-3 py-2 rounded-xl text-sm ' +
        (active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      {children}
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">Judo CRM</Link>
        <nav className="flex gap-2">
          <NavLink href="/">Dashboard</NavLink>
          <NavLink href="/groups">Groups</NavLink>
          <NavLink href="/clients">Clients</NavLink>
          <NavLink href="/leads">Leads</NavLink>
          <NavLink href="/payments">Payments</NavLink>
          <NavLink href="/tasks">Tasks</NavLink>
        </nav>
      </div>
    </header>
  );
}
