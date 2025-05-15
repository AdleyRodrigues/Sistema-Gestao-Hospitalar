// Mock para date-fns
export const format = (date: Date, formatStr: string, options?: any) => {
    return date.toISOString();
};

export const addDays = (date: Date, amount: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
};

export const subDays = (date: Date, amount: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - amount);
    return result;
};

export const isBefore = (date1: Date, date2: Date) => {
    return date1.getTime() < date2.getTime();
};

export const isAfter = (date1: Date, date2: Date) => {
    return date1.getTime() > date2.getTime();
};

export const parseISO = (dateStr: string) => {
    return new Date(dateStr);
};

export const differenceInCalendarDays = (date1: Date, date2: Date) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc1 - utc2) / millisecondsPerDay);
};

export const startOfMonth = (date: Date) => {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const endOfMonth = (date: Date) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
};

// Locale
export const ptBR = {}; 