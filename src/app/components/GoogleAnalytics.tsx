import { useEffect } from "react";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics 4 Component
 * 
 * Usage:
 * 1. Get your GA4 Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Add to .env file: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Import and use in App.tsx
 * 
 * Example:
 * <GoogleAnalytics measurementId={import.meta.env.VITE_GA_MEASUREMENT_ID} />
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Don't load in development
    if (import.meta.env.DEV) {
      console.log("📊 Google Analytics: Disabled in development mode");
      return;
    }

    // Use environment variable or provided ID
    const GA_MEASUREMENT_ID = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (!GA_MEASUREMENT_ID) {
      console.warn("⚠️ Google Analytics: No measurement ID provided");
      return;
    }

    // Check if already loaded
    if (window.gtag) {
      console.log("📊 Google Analytics: Already loaded");
      return;
    }

    console.log("📊 Loading Google Analytics...");

    // Load gtag script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    console.log("✅ Google Analytics loaded successfully");

    // Cleanup
    return () => {
      // Note: Scripts are not removed on unmount to preserve analytics
    };
  }, [measurementId]);

  return null;
}

/**
 * Track custom events
 * 
 * Usage:
 * trackEvent('purchase', {
 *   transaction_id: 'MUXION-123',
 *   value: 599,
 *   currency: 'INR',
 *   items: [{ item_name: 'UI/UX Course' }]
 * });
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`📊 Event tracked: ${eventName}`, eventParams);
  } else {
    console.warn('⚠️ Google Analytics not loaded');
  }
}

/**
 * Track page views
 * 
 * Usage:
 * trackPageView('/course/uiux');
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
    console.log(`📊 Page view tracked: ${pagePath}`);
  }
}

/**
 * Track course enrollment
 * 
 * Usage:
 * trackCourseEnrollment('uiux', 'UI/UX Mastery', 599);
 */
export function trackCourseEnrollment(courseId: string, courseName: string, price: number) {
  trackEvent('purchase', {
    transaction_id: `MUXION-${courseId}-${Date.now()}`,
    value: price,
    currency: 'INR',
    items: [{
      item_id: courseId,
      item_name: courseName,
      item_category: 'Course',
      price: price,
      quantity: 1
    }]
  });
}

/**
 * Track video completion
 * 
 * Usage:
 * trackVideoComplete('Introduction to UI/UX', 'UI/UX Mastery', 1);
 */
export function trackVideoComplete(videoTitle: string, courseName: string, lessonId: number) {
  trackEvent('video_complete', {
    video_title: videoTitle,
    course_name: courseName,
    lesson_id: lessonId,
    video_provider: 'MUXION'
  });
}

/**
 * Track user sign up
 * 
 * Usage:
 * trackSignUp('email');
 * trackSignUp('google');
 */
export function trackSignUp(method: 'email' | 'google' | 'facebook' | 'linkedin') {
  trackEvent('sign_up', {
    method: method
  });
}

/**
 * Track user login
 * 
 * Usage:
 * trackLogin('email');
 */
export function trackLogin(method: 'email' | 'google' | 'facebook' | 'linkedin') {
  trackEvent('login', {
    method: method
  });
}

/**
 * Track search
 * 
 * Usage:
 * trackSearch('ui ux course');
 */
export function trackSearch(searchTerm: string) {
  trackEvent('search', {
    search_term: searchTerm
  });
}

/**
 * Track course preview view
 * 
 * Usage:
 * trackCourseView('uiux', 'UI/UX Mastery');
 */
export function trackCourseView(courseId: string, courseName: string) {
  trackEvent('view_item', {
    items: [{
      item_id: courseId,
      item_name: courseName,
      item_category: 'Course'
    }]
  });
}

/**
 * Track button click
 * 
 * Usage:
 * trackButtonClick('Enroll Now', 'Hero Section');
 */
export function trackButtonClick(buttonName: string, location: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location
  });
}

/**
 * Track social share
 * 
 * Usage:
 * trackSocialShare('facebook', 'UI/UX Course');
 */
export function trackSocialShare(platform: string, content: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'course',
    content_id: content
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
