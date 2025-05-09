/**
 * Validator utility functions for form validation
 */

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateEmail = (
  email: string,
): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

/**
 * Validates a password
 * @param password - The password to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validatePassword = (
  password: string,
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true };
};

/**
 * Validates that two passwords match
 * @param password - The first password
 * @param confirmPassword - The confirmation password
 * @returns An object with isValid boolean and error message if invalid
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): { isValid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
};

/**
 * Validates a name field
 * @param name - The name to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateName = (
  name: string,
): { isValid: boolean; error?: string } => {
  if (!name || name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }

  return { isValid: true };
};

/**
 * Validates an address field
 * @param address - The address to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateAddress = (
  address: string,
): { isValid: boolean; error?: string } => {
  if (!address || address.trim() === "") {
    return { isValid: false, error: "Address is required" };
  }

  return { isValid: true };
};

/**
 * Validates a phone number
 * @param phoneNumber - The phone number to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validatePhoneNumber = (
  phoneNumber: string,
): { isValid: boolean; error?: string } => {
  if (!phoneNumber) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Basic phone number validation - can be adjusted based on your requirements
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  return { isValid: true };
};

/**
 * Validates a business name field
 * @param businessName - The business name to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateBusinessName = (
  businessName: string,
): { isValid: boolean; error?: string } => {
  if (!businessName || businessName.trim() === "") {
    return { isValid: false, error: "Business name is required" };
  }

  return { isValid: true };
};

/**
 * Validates a business address field
 * @param businessAddress - The business address to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateBusinessAddress = (
  businessAddress: string,
): { isValid: boolean; error?: string } => {
  if (!businessAddress || businessAddress.trim() === "") {
    return { isValid: false, error: "Business address is required" };
  }

  return { isValid: true };
};
