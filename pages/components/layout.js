import React from 'react';
import AuthButton from './buttons/auth_button'

export default function Layout({ children }) {
  return (
    <div className="flex bg-beige-100">
        <AuthButton></AuthButton>
      {children}
    </div>
  );
}
