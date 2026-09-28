export function throttle<T>(action: (value: T) => void, gapMs: number): (value: T) => void {
	let nextAllowed = 0
	let planned: ReturnType<typeof setTimeout> | undefined
	let newest: T

	return (value: T) => {
		newest = value
		if (planned !== undefined) return // already waiting, `newest` will be used

		const waitFor = nextAllowed - Date.now()
		if (waitFor <= 0) {
			nextAllowed = Date.now() + gapMs
			action(value)
			return
		}

		planned = setTimeout(() => {
			planned = undefined
			nextAllowed = Date.now() + gapMs
			action(newest)
		}, waitFor)
	}
}
