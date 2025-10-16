// Bitcoin wallet provider interface
interface XverseProvider {
  request: <Method extends string>(
    method: Method,
    params?: any,
  ) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    BitcoinProvider?: XverseProvider;
    XverseProviders?: {
      BitcoinProvider?: XverseProvider;
    };
  }
}

export const getXverseFromWindow: () => Promise<
  XverseProvider | undefined
> = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  // Check for Xverse in window
  if (window.XverseProviders?.BitcoinProvider) {
    return window.XverseProviders.BitcoinProvider;
  }

  if (window.BitcoinProvider) {
    return window.BitcoinProvider;
  }

  if (document.readyState === "complete") {
    return window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(
          window.XverseProviders?.BitcoinProvider || window.BitcoinProvider,
        );
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

export const getXverseFromWindowSync: () => XverseProvider | undefined = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.XverseProviders?.BitcoinProvider) {
    return window.XverseProviders.BitcoinProvider;
  }

  if (window.BitcoinProvider) {
    return window.BitcoinProvider;
  }

  if (document.readyState === "complete") {
    return window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;
  }

  return undefined;
};
