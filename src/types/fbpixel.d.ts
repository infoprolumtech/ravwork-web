// Facebook Pixel TypeScript declarations
declare global {
    interface Window {
        fbq?: (
            action: string,
            eventName: string,
            parameters?: Record<string, string | number>
        ) => void;
    }
}

export { };
