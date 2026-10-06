import { NextComponentType, NextPage, NextPageContext } from 'next';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Router } from 'next/router';

declare module 'next' {
  export interface NextApiRequest {
    user?: any;
  }
}

declare module 'next/app' {
  interface AppContextType {
    Component: NextComponentType<NextPageContext>;
    ctx: NextPageContext;
    router: Router;
  }
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => Promise<boolean>;
    back: () => void;
    replace: (url: string) => Promise<boolean>;
    refresh: () => void;
    prefetch: (url: string) => Promise<void>;
    pathname: string;
    query: Record<string, string>;
    asPath: string;
    events: {
      on: (event: string, handler: (...args: any[]) => void) => void;
      off: (event: string, handler: (...args: any[]) => void) => void;
    };
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string>;
  export function useSelectedLayoutSegment(): string | null;
  export function useSelectedLayoutSegments(): string[];
  export function useServerInsertedHTML(callback: () => React.ReactNode): void;
}
