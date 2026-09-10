// Analytics and Event Tracking helper

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    // 1. Console log in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Event] 📊 ${eventName}`, properties || {});
    }

    // 2. Vercel Analytics custom events (if available on window or dynamic import)
    if ((window as any).va) {
      (window as any).va("event", { name: eventName, data: properties });
    }
  } catch (err) {
    // Fail silently so user experience is never blocked
    console.warn("Analytics error:", err);
  }
}
