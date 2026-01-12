export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void;
        MainButton: {
          show(): void;
          hide(): void;
          setText(text: string): void;
          onClick(cb: () => void): void;
          offClick(cb: () => void): void;
        };
      };
    };
  }
}
