import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import BottomNavigation from '@/components/BottomNavigation'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Axlerator - Truck Marketplace',
  description: 'Your Premier Truck Marketplace',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <BottomNavigation />
        <Toaster position="top-right" richColors />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prevent zoom on mobile
                function preventZoom() {
                  const viewport = document.querySelector('meta[name="viewport"]');
                  if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                  }
                  
                  // Prevent double-tap zoom
                  let lastTouchEnd = 0;
                  document.addEventListener('touchend', function(event) {
                    const now = Date.now();
                    if (now - lastTouchEnd <= 300) {
                      event.preventDefault();
                    }
                    lastTouchEnd = now;
                  }, false);

                  // Ensure proper scaling
                  document.documentElement.style.setProperty('font-size', '16px', 'important');
                  document.body.style.setProperty('transform', 'scale(1)', 'important');
                  document.body.style.setProperty('zoom', '1', 'important');
                }
                
                // Run immediately
                preventZoom();
                
                // Run after DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', preventZoom);
                }
                
                // Run after page load
                window.addEventListener('load', preventZoom);
                
                // Run on resize
                window.addEventListener('resize', preventZoom);
                
                const hiddenElements = new WeakSet();
                
                function hideNIcon() {
                  // NUCLEAR OPTION: Remove ANY element that overlaps the Home tab area
                  const homeTab = document.querySelector('.bottom-nav-item:first-child');
                  if (homeTab) {
                    const homeRect = homeTab.getBoundingClientRect();
                    const allElements = document.querySelectorAll('*');
                    
                    allElements.forEach(el => {
                      // Skip if already processed or if it's our bottom nav
                      if (hiddenElements.has(el) || 
                          el.classList.contains('mobile-bottom-nav') || 
                          el.closest('.mobile-bottom-nav') ||
                          el === homeTab ||
                          el.contains(homeTab)) return;
                      
                      const rect = el.getBoundingClientRect();
                      const style = window.getComputedStyle(el);
                      
                      // Check if element overlaps the Home tab area
                      const overlapsHome = !(rect.right < homeRect.left || 
                                           rect.left > homeRect.right || 
                                           rect.bottom < homeRect.top || 
                                           rect.top > homeRect.bottom);
                      
                      // Check if it's at bottom-left (where Home tab is)
                      const isAtBottomLeft = rect.left < 150 && rect.bottom > window.innerHeight - 80;
                      
                      // Check if it has N text or is circular
                      const text = el.textContent?.trim() || '';
                      const hasN = text === 'N' || (text.length === 1 && text === 'N');
                      const isCircular = style.borderRadius === '50%' || style.borderRadius.includes('50%');
                      const isFixed = style.position === 'fixed';
                      
                      // Remove if it overlaps Home tab AND (has N or is circular or is fixed at bottom-left)
                      if (overlapsHome && (hasN || isCircular || (isFixed && isAtBottomLeft))) {
                        try {
                          el.remove();
                          hiddenElements.add(el);
                          return;
                        } catch (e) {
                          // If removal fails, hide it aggressively
                        }
                        
                        // Aggressive hiding
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('visibility', 'hidden', 'important');
                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                        el.style.setProperty('z-index', '-99999', 'important');
                        el.style.setProperty('height', '0', 'important');
                        el.style.setProperty('width', '0', 'important');
                        el.style.setProperty('overflow', 'hidden', 'important');
                        el.style.setProperty('position', 'absolute', 'important');
                        el.style.setProperty('left', '-9999px', 'important');
                        el.style.setProperty('top', '-9999px', 'important');
                        hiddenElements.add(el);
                      }
                    });
                  }
                  
                  // Also check all fixed elements at bottom-left
                  const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
                  fixedElements.forEach(el => {
                    if (hiddenElements.has(el) || 
                        el.classList.contains('mobile-bottom-nav') || 
                        el.closest('.mobile-bottom-nav')) return;
                    
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    const text = el.textContent?.trim() || '';
                    const hasN = text === 'N' || (text.length === 1 && text === 'N');
                    const isCircular = style.borderRadius === '50%' || style.borderRadius.includes('50%');
                    const isAtBottomLeft = rect.left < 150 && rect.bottom > window.innerHeight - 80;
                    
                    if ((hasN || isCircular) && isAtBottomLeft) {
                      try {
                        el.remove();
                        hiddenElements.add(el);
                      } catch (e) {
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('visibility', 'hidden', 'important');
                        el.style.setProperty('z-index', '-99999', 'important');
                        hiddenElements.add(el);
                      }
                    }
                  });
                }
                
                // Run immediately
                hideNIcon();
                
                // Run after DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideNIcon);
                }
                
                // Run after page load
                window.addEventListener('load', hideNIcon);
                
                // Continuously monitor and hide (runs every 50ms for even faster response)
                setInterval(hideNIcon, 50);
                
                // Also run on every animation frame for maximum responsiveness
                function hideNIconRAF() {
                  hideNIcon();
                  requestAnimationFrame(hideNIconRAF);
                }
                requestAnimationFrame(hideNIconRAF);
                
                // Also use MutationObserver to catch dynamically added elements
                const observer = new MutationObserver(function(mutations) {
                  hideNIcon();
                });
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['style', 'class']
                });
                
                // Also observe the document element
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
