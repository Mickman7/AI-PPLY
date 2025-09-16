import React from 'react';

const Footer = () => {
  return (
    <footer className="mx-12 my-4 flex justify-between">
      <div className="flex gap-2">
        <a href="#">Product</a>
        <a href="#">Resources</a>
        <a href="#">Company</a>
      </div>
      <div>© {new Date().getFullYear()} AI-PPLY. All rights reserved.</div>
      <div className="flex gap-2">
        <a href="#">LinkedIn</a>
        <a href="#">Instagram</a>
        <a href="#">Twitter</a>
      </div>
    </footer>
  );
};

export default Footer;
