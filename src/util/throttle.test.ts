import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { throttle } from "./throttle"

beforeEach(() => {
	vi.useFakeTimers()
})

afterEach(() => {
	vi.useRealTimers()
})

test("first call goes through right away", () => {
	const spy = vi.fn()
	throttle(spy, 700)("h")
	expect(spy).toHaveBeenCalledWith("h")
})

test("fast typing is grouped and the newest value is sent at the end", () => {
	const spy = vi.fn()
	const throttled = throttle(spy, 700)

	throttled("h")
	throttled("ht")
	throttled("htt")
	throttled("http")
	expect(spy).toHaveBeenCalledTimes(1)

	vi.advanceTimersByTime(700)
	expect(spy).toHaveBeenCalledTimes(2)
	expect(spy).toHaveBeenLastCalledWith("http")
})

test("after a quiet moment the next call is immediate again", () => {
	const spy = vi.fn()
	const throttled = throttle(spy, 700)

	throttled("a")
	vi.advanceTimersByTime(1000)
	throttled("b")
	expect(spy).toHaveBeenCalledTimes(2)
})
