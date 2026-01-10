/**
 * Stripe Security Utilities
 * Prevents raw card data from reaching the server and ensures PCI compliance
 */

// Credit card number patterns (common lengths: 13-19 digits)
const CARD_NUMBER_PATTERNS = [
  /^\d{13,19}$/,  // Standard card numbers
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,  // Formatted: 1234 5678 9012 3456
  /\b\d{16}\b/,  // 16 digits
];

// Card data keywords that should not be in request bodies
const CARD_DATA_KEYWORDS = [
  'card_number',
  'cardNumber',
  'cardnumber',
  'number',
  'card_cvc',
  'cardCvc',
  'cardcvc',
  'cvc',
  'cvv',
  'cv2',
  'card_exp_month',
  'cardExpMonth',
  'exp_month',
  'expMonth',
  'card_exp_year',
  'cardExpYear',
  'exp_year',
  'expYear',
];

/**
 * Checks if a string contains a credit card number
 */
export function containsCardNumber(value) {
  if (typeof value !== 'string') return false;
  
  // Remove spaces and dashes for pattern matching
  const cleaned = value.replace(/[\s-]/g, '');
  
  // Check against card number patterns
  for (const pattern of CARD_NUMBER_PATTERNS) {
    if (pattern.test(cleaned)) {
      // Basic Luhn check to avoid false positives
      if (isValidLuhn(cleaned)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Luhn algorithm validation
 */
function isValidLuhn(cardNumber) {
  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Recursively checks an object for card data
 */
export function containsCardData(obj, path = '') {
  if (obj === null || obj === undefined) return false;

  // Check if it's a string that might contain a card number
  if (typeof obj === 'string' && containsCardNumber(obj)) {
    return true;
  }

  // Check if it's an array
  if (Array.isArray(obj)) {
    return obj.some((item, index) => containsCardData(item, `${path}[${index}]`));
  }

  // Check if it's an object
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        
        // Check if the key itself suggests card data
        if (CARD_DATA_KEYWORDS.some(keyword => lowerKey.includes(keyword.toLowerCase()))) {
          return true;
        }

        // Recursively check the value
        if (containsCardData(obj[key], `${path}.${key}`)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Middleware to validate that no card data is in the request
 */
export function validateNoCardData(requestBody) {
  if (containsCardData(requestBody)) {
    throw new Error('SECURITY_VIOLATION: Credit card data detected in request. Card data must be collected using Stripe Elements on the client side.');
  }
}

/**
 * Sanitizes data before logging to prevent card data from appearing in logs
 */
export function sanitizeForLogging(data) {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    if (containsCardNumber(data)) {
      return '[CARD_NUMBER_REDACTED]';
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeForLogging(item));
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        
        // Redact sensitive fields
        if (CARD_DATA_KEYWORDS.some(keyword => lowerKey.includes(keyword.toLowerCase()))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeForLogging(data[key]);
        }
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Validates that only allowed payment parameters are in the request
 */
export function validatePaymentRequest(requestBody) {
  // Allowed fields for payment-related requests
  const allowedFields = [
    'amount',
    'currency',
    'customerId',
    'userId',
    'email',
    'name',
    'metadata',
    'payment_method', // Payment method ID only, not card data
    'paymentMethodId',
    'bookingId',
    'setupIntentId',
    'paymentIntentId',
    'clientSecret',
  ];

  // Check for card data keywords
  for (const key in requestBody) {
    if (CARD_DATA_KEYWORDS.some(keyword => key.toLowerCase().includes(keyword.toLowerCase()))) {
      throw new Error(`SECURITY_VIOLATION: Field "${key}" contains card data keywords. Card data must be collected using Stripe Elements.`);
    }
  }

  // Validate that payment_method is an ID, not card data
  if (requestBody.payment_method && typeof requestBody.payment_method === 'object') {
    throw new Error('SECURITY_VIOLATION: payment_method must be a payment method ID string, not an object. Use Stripe Elements to collect card data.');
  }
}

