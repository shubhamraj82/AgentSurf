export function getNormalizedHttpUrl(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error("Open URL requires a URL.")
  }

  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error(`Open URL received an invalid URL: ${value}`)
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Open URL only supports http and https URLs.")
  }

  // A bare hostname (for example, "invalid-rl") is syntactically valid to
  // URL, but it is not a usable public web address. Keep local development
  // URLs available for browser automation.
  const isLocalhost = url.hostname === "localhost"
  const isIpAddress = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(url.hostname)
  const isIpv6Address = url.hostname.includes(":")
  const isDomain = url.hostname.includes(".")

  if (!isLocalhost && !isIpAddress && !isIpv6Address && !isDomain) {
    throw new Error("Open URL requires a domain, localhost, or IP address.")
  }

  return url.toString()
}

export function getUrlValidationError(value: string): string | undefined {
  if (!value.trim() || value.includes("{{")) {
    return undefined
  }

  try {
    getNormalizedHttpUrl(value)
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid URL"
  }
}
