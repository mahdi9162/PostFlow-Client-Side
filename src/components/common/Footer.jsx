import React from 'react';
import Container from '../container/Container';


const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12 border-t border-white/5">
      <Container>
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo Section */}
          <aside className="flex flex-col items-center gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-black tracking-tight">PostFlow</p>
              <p className="text-sm text-muted/70 font-medium">
                Streamlining social workflows since 2025
              </p>
            </div>
            
            <p className="text-xs text-muted/40 uppercase tracking-widest mt-2">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </aside>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;