export const validateEmail = (email: string): { valid: boolean; message: string } => {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  // Check for common email providers and valid domains
  const domain = email.split('@')[1]?.toLowerCase();
  const commonProviders = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
    'icloud.com', 'protonmail.com', 'aol.com', 'mail.com',
    'zoho.com', 'yandex.com', 'gmx.com', 'live.com', 'msn.com'
  ];

  // Check if it's a common provider or has valid TLD
  const validTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.co', '.in', '.uk', '.us'];
  const hasValidTLD = validTLDs.some(tld => domain.endsWith(tld));
  const isCommonProvider = commonProviders.includes(domain);

  if (!isCommonProvider && !hasValidTLD) {
    return { valid: false, message: 'Please use a valid email provider (e.g., Gmail, Yahoo, Outlook)' };
  }

  return { valid: true, message: '' };
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  // Minimum 10 characters
  if (password.length < 10) {
    return { valid: false, message: 'Password must be at least 10 characters long' };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
  }

  return { valid: true, message: '' };
};

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  
  if (password.length >= 10) strength++;
  if (password.length >= 14) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  if (password.length >= 16) strength++;

  if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
  if (strength <= 4) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
  if (strength <= 5) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
  return { strength: 4, label: 'Strong', color: 'bg-green-500' };
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};