import { useState, useEffect } from 'react';

/**
 * useDebounce - Delays updating a value until after a specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useDebouncedCallback - Creates a debounced version of a callback
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @param {Array} deps - Dependencies array
 * @returns {Function} - Debounced callback
 */
export const useDebouncedCallback = (callback, delay = 500, deps = []) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = (...args) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const id = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(id);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};

/**
 * useDebouncedEffect - Runs an effect after a delay
 * @param {Function} effect - Effect to run
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 */
export const useDebouncedEffect = (effect, delay, deps = []) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay, effect]);
};

/**
 * useThrottle - Throttles a value update
 * @param {any} value - The value to throttle
 * @param {number} limit - Time limit in milliseconds (default: 500)
 * @returns {any} - The throttled value
 */
export const useThrottle = (value, limit = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRan, setLastRan] = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan >= limit) {
        setThrottledValue(value);
        setLastRan(Date.now());
      }
    }, limit - (Date.now() - lastRan));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastRan]);

  return throttledValue;
};

/**
 * useThrottledCallback - Creates a throttled version of a callback
 * @param {Function} callback - The function to throttle
 * @param {number} limit - Time limit in milliseconds (default: 500)
 * @returns {Function} - Throttled callback
 */
export const useThrottledCallback = (callback, limit = 500) => {
  const [lastRan, setLastRan] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  const throttledCallback = (...args) => {
    const now = Date.now();

    if (now - lastRan >= limit) {
      // If enough time has passed, run immediately
      callback(...args);
      setLastRan(now);
    } else if (!timeoutId) {
      // Otherwise, schedule for later
      const remaining = limit - (now - lastRan);
      const id = setTimeout(() => {
        callback(...args);
        setLastRan(Date.now());
        setTimeoutId(null);
      }, remaining);
      
      setTimeoutId(id);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return throttledCallback;
};

// Example usage:
// const SearchComponent = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const debouncedSearch = useDebounce(searchTerm, 500);
//
//   useEffect(() => {
//     // API call with debouncedSearch
//   }, [debouncedSearch]);
//
//   return (
//     <input
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   );
// };