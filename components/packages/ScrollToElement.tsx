export const scrollToElement = (elementId: string, scrollMarginTop = "22rem") => {
  let timeoutId: NodeJS.Timeout;

  const checkIfElementExists = (retries: number) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.scrollMarginTop = scrollMarginTop;
      element.scrollIntoView({ behavior: "smooth", block: "start"});
    } else if (retries > 0) {
      timeoutId = setTimeout(() => checkIfElementExists(retries - 1), 100);
    }
  };

  checkIfElementExists(10);

  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};
