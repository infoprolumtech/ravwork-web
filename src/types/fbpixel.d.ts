// Facebook Pixel TypeScript declarations
// init: fbq('init', pixelId, advancedMatching?)
// track: fbq('track', eventName, parameters?, options?)
declare global {
    interface Window {
        fbq?: (
            action: string,
            ...args: unknown[]
        ) => void;
    }
}

export { };
