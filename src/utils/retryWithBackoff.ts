/**
 * Retries an async function with exponential backoff.
 * Specifically handles Gemini API 429 (rate limit) errors by
 * parsing the suggested retry delay from the error response.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 5000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.statusCode === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      if (!isRateLimit || attempt === maxRetries) {
        throw error;
      }

      // Try to extract the retry delay from the error message
      let delayMs = baseDelayMs * Math.pow(2, attempt);
      const retryMatch = error?.message?.match(
        /retry in ([\d.]+)s/i,
      );
      if (retryMatch) {
        delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000; // add 1s buffer
      }

      console.warn(
        `[Gemini] Rate limited (attempt ${attempt + 1}/${maxRetries}). Retrying in ${(delayMs / 1000).toFixed(1)}s...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Should not reach here, but TypeScript needs this
  throw new Error("retryWithBackoff: exhausted all retries");
}
