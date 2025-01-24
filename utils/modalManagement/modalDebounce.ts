 const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let inDebounce: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (inDebounce !== undefined) {
      clearTimeout(inDebounce);
    }
    inDebounce = setTimeout(() => { func(...args); }, delay);
  };
};


export default debounce;
