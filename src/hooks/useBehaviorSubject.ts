import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

/**
 * Updates the returned value with the latest value of the BehaviorSubject every time it changes.
 * Optionally, also calls a given callback at that time.
 */
export const useBehaviorSubject = <T>(observable: BehaviorSubject<T>): [T] => {
  const [value, setValue] = useState<T>(observable?.getValue());
  const [error, setError] = useState();

  useEffect(() => {
    if (!observable) {
      setValue(null);
      return
    }

    const subscription = observable.subscribe({
      next: val => {
        setValue(val);
      },
      error: setError
    });

    return () => subscription.unsubscribe()
  }, [observable]);

  return [value];
}
