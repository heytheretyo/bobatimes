/* eslint-disable @typescript-eslint/no-explicit-any */
export function loadFromLocalStorage(key: string, defaultValue: any) {
  const stored = localStorage.getItem(key);

  if (key == "localSave" && !stored) {
    localStorage.setItem(key, JSON.stringify({}));
  }
  return stored ? JSON.parse(stored) : defaultValue;
}
export function saveToLocalStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function removeFromLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}
