import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      setIsLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openRazorpay = (options: RazorpayOptions) => {
    if (!isLoaded || !window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return { isLoaded, openRazorpay };
}
