import { clsx, type ClassValue } from "clsx"
import { Message } from "postcss";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date_ms: number): string {
  // Convert milliseconds to seconds
  const date_seconds = date_ms / 1000; // Change to const since it's not reassigned

  // Convert to Date object
  const date_obj = new Date(date_seconds * 1000); // Change to const

  // Get current date and time
  const current_date = new Date(); // Change to const
  current_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  const current_time = current_date.getTime(); // Change to const

  // Get the date part of the provided date
  const provided_date = new Date(date_obj); // Change to const
  provided_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

  // Check if it's today
  if (provided_date.getTime() === current_time) {
    return date_obj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  // Check if it's yesterday
  const yesterday = new Date(); // Change to const
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  if (provided_date.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Check if it's a different day of the week
  if (provided_date.getDay() < current_date.getDay()) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Change to const
    return days[provided_date.getDay()];
  }

  // If none of the above conditions match, return in a different format
  return provided_date.getMonth() + 1 + "/" + provided_date.getDate() + "/" + provided_date.getFullYear();
}

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Define getRelativeDateTime function
export const getRelativeDateTime = (message: Message, previousMessage: Message) => {
  const today = new Date(); // Change to const
  const yesterday = new Date(today); // Change to const
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today); // Change to const
  lastWeek.setDate(lastWeek.getDate() - 7);

  const messageDate = new Date(message._creationTime);

  if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDate.getTime())) {
    if (isSameDay(messageDate.getTime(), today.getTime())) {
      return "Today";
    } else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
      return "Yesterday";
    } else if (messageDate.getTime() > lastWeek.getTime()) {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
      };
      return messageDate.toLocaleDateString(undefined, options);
    } else {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return messageDate.toLocaleDateString(undefined, options);
    }
  }
};

export function randomID(len: number) {
  let result = "";
  if (result) return result;
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP"; // Change to const
  const maxPos = chars.length; // Change to const
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
