const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function getFormattedDate(date: Date, prefomattedDate?: string, hideYear?: boolean) {
    const day = date.getDate();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const month = MONTH_NAMES[date.getMonth()]!;
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes: string | number = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`;
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }

    if (hideYear) {
        // 10. January at 10:20
        return `${day}. ${month} at ${hours}:${minutes}`;
    }

    // 10. January 2017. at 10:20
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

// --- Main function
export function timeAgo(dateParam: Date | string | number | null | undefined) {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    // Not sure tbh
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const yesterday = new Date(today - DAY_IN_MS);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return "now";
    } else if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (seconds < 90) {
        return "about a minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, "Today"); // Today at 10:20
    } else if (isYesterday) {
        return getFormattedDate(date, "Yesterday"); // Yesterday at 10:20
    } else if (isThisYear) {
        return getFormattedDate(date, "", true); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}

export const timeUntil = (date: Date | string | number | null | undefined) => {
    if (!date) {
        return null;
    }

    const dateObj = typeof date === "object" ? date : new Date(date);
    const now = new Date();
    const diff = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    const diffHours = Math.ceil(diff / (1000 * 3600));
    const diffMinutes = Math.ceil(diff / (1000 * 60));
    const diffSeconds = Math.ceil(diff / 1000);

    if (diffSeconds < 60) {
        return `${diffSeconds} seconds`;
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} minutes`;
    }

    if (diffHours < 24) {
        return `${diffHours} hours`;
    }

    return `${diffDays} days`;
};
