const ALLOWED_SCHEMES = new Set(["http:", "https:"])

export function findUrlProblem(text: string): string | null {
	const link = text.trim()
	if (link === "") return "Type a link first"

	let parsed: URL
	try {
		parsed = new URL(link)
	} catch {
		return "Hmm, that's not a link yet"
	}

	if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
		return `Only http and https please (you used ${parsed.protocol})`
	}

	const host = parsed.hostname
	if (host === "localhost") return null
	const isIp = /^\d+(\.\d+){3}$/.test(host) || host.startsWith("[")
	if (isIp) return link.includes(host) ? null : "The IP address is not complete yet"

	const parts = host.split(".")
	const ending = parts[parts.length - 1]
	if (parts.length < 2 || parts.includes("") || ending.length < 2) {
		return "The domain is not complete yet"
	}

	return null
}
