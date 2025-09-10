import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const NavLink = ({ href, children }:{href:string; children:React.ReactNode}) => {
  const { pathname } = useRouter();
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
  const className =
    'px-3 py-2 rounded-xl text-sm ' +
    (active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100');
  return (
    <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">Дзюдо CRM</Link>
        <nav className="flex gap-2">
          <NavLink href="/">Панель</NavLink>
          <NavLink href="/districts">Районы</NavLink>
          <NavLink href="/clients">Клиенты</NavLink>
          <NavLink href="/leads">Заявки</NavLink>
          <NavLink href="/payments">Платежи</NavLink>
          <NavLink href="/tasks">Задачи</NavLink>
          <NavLink href="/attendance">Журнал посещений</NavLink>
        </nav>
      </div>
    </header>
  );
}
