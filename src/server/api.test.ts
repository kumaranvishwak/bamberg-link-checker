import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { askServer } from "./api"

beforeEach(() => {
	vi.useFakeTimers()
})

afterEach(() => {
	vi.useRealTimers()
})

test("answers only after a delay", async () => {
	let done = false
	const answer = askServer("https://uni-bamberg.example/lectures/").then((a) => {
		done = true
		return a
	})

	await vi.advanceTimersByTimeAsync(100)
	expect(done).toBe(false)

	await vi.advanceTimersByTimeAsync(1000)
	await expect(answer).resolves.toEqual({ exists: true, kind: "folder" })
})

test("reports missing paths", async () => {
	const answer = askServer("https://uni-bamberg.example/mensa/")
	await vi.advanceTimersByTimeAsync(1000)
	await expect(answer).resolves.toEqual({ exists: false })
})

test("offline host always fails", async () => {
	const answer = askServer("https://offline.example/anything")
	const check = expect(answer).rejects.toThrow("Server did not answer")
	await vi.advanceTimersByTimeAsync(1000)
	await check
})
