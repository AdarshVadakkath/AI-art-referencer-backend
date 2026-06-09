/**
 * Retries an async function with exponential backoff.
 * Handles Gemini API 429 (rate limit) and 503 (server overload) errors.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const { maxRetries = 5, baseDelayMs = 8000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.statusCode === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      const isUnavailable =
        error?.status === 503 ||
        error?.statusCode === 503 ||
        error?.message?.includes("503") ||
        error?.message?.includes("UNAVAILABLE");

      const shouldRetry = isRateLimit || isUnavailable;

      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }

      let delayMs = baseDelayMs * Math.pow(2, attempt);

      // For 429s, try to extract the suggested retry delay from the error
      if (isRateLimit) {
        const retryMatch = error?.message?.match(/retry in ([\d.]+)s/i);
        if (retryMatch) {
          delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000;
        }
      }

      // For 503s, use a fixed 10s base delay since it's a server issue
      if (isUnavailable) {
        delayMs = Math.max(delayMs, 10000);
      }

      const reason = isRateLimit
        ? "Rate limited (429)"
        : "Server unavailable (503)";
      console.warn(
        `[Gemini] ${reason} (attempt ${attempt + 1}/${maxRetries}). Retrying in ${(delayMs / 1000).toFixed(1)}s...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("retryWithBackoff: exhausted all retries");
}
