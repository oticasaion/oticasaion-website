import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';

// Configuração oficial do projeto Óticas Aion no Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjyGctUjnZW_EvAlM5xdHUdJPktbfuR2M",
  authDomain: "oticas-aion.firebaseapp.com",
  projectId: "oticas-aion",
  storageBucket: "oticas-aion.firebasestorage.app",
  messagingSenderId: "1032318255109",
  appId: "1:1032318255109:web:5a2ea49fc4da50f9721c6c",
  measurementId: "G-9W0RF71KCY"
};

// Inicialização segura do app Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicialização condicional do Google Analytics
let analyticsInstance: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Firebase Analytics not supported in this environment:', err);
  });
}

export const getAnalyticsInstance = () => analyticsInstance;

// Eventos de rastreamento de conversão da Óticas Aion
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, eventParams);
    } catch (e) {
      console.warn('Erro ao registrar evento no Firebase Analytics:', e);
    }
  }
};

export const trackWhatsAppLead = (context: string, details?: Record<string, any>) => {
  trackEvent('lead_whatsapp_click', {
    context,
    ...details,
  });
};

export const trackProductView = (productId: string, productName: string, price: number) => {
  trackEvent('view_item', {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        item_category: 'Óculos de Grau',
      },
    ],
  });
};

export const trackBeginCheckout = (productName: string, lensName: string, totalValue: number) => {
  trackEvent('begin_checkout', {
    value: totalValue,
    currency: 'BRL',
    items: [
      {
        item_name: productName,
        item_category: 'Armação',
      },
      {
        item_name: lensName,
        item_category: 'Lente de Grau',
      },
    ],
  });
};
