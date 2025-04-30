// components/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './menuComp.tsx';

const MenuLayout = () => {
  return (
    <>
      <Menu />
      <div style={{ paddingTop: '8px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default MenuLayout;
