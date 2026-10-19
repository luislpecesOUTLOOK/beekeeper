import { useEffect, useRef, useState } from "react";
import { BeekeeperStore, store } from "./store";

export function useSnapshot<T>(select: (store: BeekeeperStore) => T): T {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => forceUpdate((x) => x + 1));
    return unsub;
  }, []);

  return select(store);
}

export function useNowStamp(compute: (now: number) => number): number {
  const computeRef = useRef(compute);
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    computeRef.current = compute;
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      setValue(computeRef.current(Date.now()));
      interval = setInterval(
        () => setValue(computeRef.current(Date.now())),
        60_000,
      );
    }, 0);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return value;
}
