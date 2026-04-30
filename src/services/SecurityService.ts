export const SecurityService = {
  /**
   * Validates the input PIN against the stored PIN.
   * Currently performs a simple string comparison.
   * In the future, this should handle hashing and secure validation.
   * @param inputPin The PIN entered by the user.
   * @param storedPin The PIN stored in the user's profile/secure storage.
   * @returns boolean indicating if the PIN is valid.
   */
  validatePin: (inputPin: string, storedPin: string): boolean => {
    // Default PIN is '1234' for development/MVP if not set
    const actualStoredPin = storedPin || '1234';
    return inputPin === actualStoredPin;
  },

  /**
   * Checks if the PIN meets complexity requirements.
   * @param pin The PIN to check.
   * @returns boolean indicating if the PIN is strong enough.
   */
  isPinStrong: (pin: string): boolean => {
    // Example: Prevent "1111", "1234" (optional, for future use)
    if (pin.length !== 4) return false;
    if (/^(\d)\1+$/.test(pin)) return false; // All same digits
    return true;
  }
};
