
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-black/50 mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Copyright © {new Date().getFullYear()} CodeHustlers. All rights reserved.</p>
        <a href="mailto:teamcodehustlers@gmail.com" className="hover:underline">teamcodehustlers@gmail.com</a>
      </div>
    </footer>
  );
};

export default Footer;