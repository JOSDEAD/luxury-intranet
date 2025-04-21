import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './common/Sidebar';
import Header from './common/Header';
import PageHeader from './common/PageHeader';

function Layout() {
  const location = useLocation();
  const activeKey = location.pathname;
  const segment = activeKey.split('/')[1] || '';
  const headerTitle = segment.replace(/-/g, ' ');
  const headerTitleCap = headerTitle
    ? headerTitle.charAt(0).toUpperCase() + headerTitle.slice(1)
    : '';
  return (
    <div id="mytask-layout" className="theme-indigo">
      <Sidebar activekey={activeKey} />
      <div className="main px-lg-4 px-md-4">
        <Header />
        <div className="body d-flex py-lg-3 py-md-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;