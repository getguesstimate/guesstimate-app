import { useCallback, useEffect, useRef, useState } from "react";

// via https://stackoverflow.com/a/53837442
export function useForceUpdate() {
  const [, setValue] = useState(0);
  return useCallback(() => setValue((value) => value + 1), []);
}

export function useCallOnUnmount(fn: () => void) {
  const ref = useRef<() => void>(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    // on unmount
    return () => {
      ref.current();
    };
  }, []);
}
