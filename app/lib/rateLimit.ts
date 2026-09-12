type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, RateLimitEntry>();

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 1000) {
    return;
  }

  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request: Request) {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();

  pruneExpiredBuckets(now);

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      retryAfter: 0,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(
        (current.resetAt - now) / 1000
      ),
    };
  }

  current.count += 1;

  return {
    allowed: true,
    remaining: limit - current.count,
    retryAfter: 0,
  };
}
