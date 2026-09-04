import {
  useCallback,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";

export interface Location {
  pathname: string;
  search: string;
}

// pushState/replaceState do not fire popstate, so navigate() dispatches this instead.
const NAVIGATION_EVENT = "app:navigation";

let snapshot: Location = readLocation();

function readLocation(): Location {
  return { pathname: window.location.pathname, search: window.location.search };
}

function subscribe(onStoreChange: () => void): () => void {
  const handler = () => {
    const next = readLocation();
    if (next.pathname !== snapshot.pathname || next.search !== snapshot.search) {
      snapshot = next;
    }
    onStoreChange();
  };
  window.addEventListener("popstate", handler);
  window.addEventListener(NAVIGATION_EVENT, handler);
  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener(NAVIGATION_EVENT, handler);
  };
}

function getSnapshot(): Location {
  return snapshot;
}

export function useLocation(): Location {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  if (options.replace) {
    window.history.replaceState(null, "", to);
  } else {
    window.history.pushState(null, "", to);
  }
  snapshot = readLocation();
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

interface LinkProps {
  to: string;
  replace?: boolean;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  ref?: Ref<HTMLAnchorElement>;
  onNavigate?: () => void;
}

/**
 * Renders a real anchor so middle-click, cmd-click and "open in new tab" keep working;
 * only plain left-clicks are intercepted for client-side navigation.
 */
export function Link({ to, replace, children, className, tabIndex, ref, onNavigate }: LinkProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      onNavigate?.();
      navigate(to, { replace });
    },
    [to, replace, onNavigate]
  );

  return (
    <a href={to} className={className} tabIndex={tabIndex} ref={ref} onClick={handleClick}>
      {children}
    </a>
  );
}
