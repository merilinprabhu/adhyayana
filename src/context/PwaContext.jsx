import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext(null);

export const PwaProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [hasDismissedBanner, setHasDismissedBanner] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true || 
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // Detect iOS
    const isIosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIosDevice);

    // Check if user dismissed banner recently
    const dismissed = localStorage.getItem('adhyayana_pwa_banner_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 24 * 60 * 60 * 1000) {
      setHasDismissedBanner(true);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('[Adhyayana PWA] ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('[Adhyayana PWA] ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // Listen to beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('[Adhyayana PWA] beforeinstallprompt captured and ready.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[Adhyayana PWA] Application was successfully installed on home screen!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[Adhyayana PWA] User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('[Adhyayana PWA] User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // If iOS or deferred prompt is not directly callable, show the visual guide modal
      setIsInstallModalOpen(true);
    }
  };

  const dismissBanner = () => {
    setHasDismissedBanner(true);
    try {
      localStorage.setItem('adhyayana_pwa_banner_dismissed', String(Date.now()));
    } catch (e) {}
  };

  return (
    <PwaContext.Provider
      value={{
        isInstalled,
        isInstallable: isInstallable || (!isInstalled && isIOS),
        isIOS,
        triggerInstall,
        isInstallModalOpen,
        setIsInstallModalOpen,
        hasDismissedBanner,
        dismissBanner
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
};
