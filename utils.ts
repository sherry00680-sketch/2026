
export const safeEvaluate = (expression: string): number => {
  if (!expression) return 0;
  try {
    const sanitized = expression.toString().replace(/×/g, '*').replace(/÷/g, '/');
    // Only allow numbers and basic math operators
    if (!/^[\d+\-*/. ]+$/.test(sanitized)) return 0;
    // Use Function constructor instead of eval for a bit more isolation
    return new Function(`return (${sanitized})`)();
  } catch {
    return 0;
  }
};

export const saveToLocalStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

export const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};
