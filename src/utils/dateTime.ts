import { useState, useEffect } from 'react';

export const HINDI_DAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
export const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

/**
 * Format a Date object into official Hindi format: "सोमवार, 12 अक्टूबर 2026"
 */
export function formatHindiDate(d: Date = new Date()): string {
  const dayName = HINDI_DAYS[d.getDay()];
  const dateNum = d.getDate();
  const monthName = HINDI_MONTHS[d.getMonth()];
  const yearNum = d.getFullYear();
  return `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
}

/**
 * Format a Date object into live ticking 12-hour time: "10:45:12 पूर्वाह्न" / "10:45:12 AM"
 */
export function formatLiveTime(d: Date = new Date()): string {
  try {
    return d.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }
}

/**
 * React hook that returns live real Date and ticking real Time updating every second
 */
export function useLiveDateTime() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Tick every second to keep real time exact and live
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    now,
    hindiDate: formatHindiDate(now),
    liveTime: formatLiveTime(now),
  };
}
