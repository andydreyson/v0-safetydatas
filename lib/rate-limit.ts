// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limit function
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= limit) {
    return false // Rate limit exceeded
  }

  record.count++
  return true
}

/**
 * Get rate limit identifier from request
 * Uses IP address from headers
 * @param request - Request object
 * @returns Identifier string
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  return 'unknown'
}

/**
 * Clear old rate limit records (cleanup function)
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitRecords(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Auto cleanup every 5 minutes
setInterval(cleanupRateLimitRecords, 5 * 60 * 1000)
