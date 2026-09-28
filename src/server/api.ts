import { findEntry } from "./fakeFileSystem"

export type ServerAnswer = { exists: false } | { exists: true; kind: "file" | "folder" }

export const OFFLINE_HOST = "offline.example"

export function askServer(url: string): Promise<ServerAnswer> {
	const delay = 250 + Math.random() * 750

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const parsed = new URL(url)
			if (parsed.hostname === OFFLINE_HOST) {
				reject(new Error("Server did not answer"))
				return
			}
			const kind = findEntry(parsed)
			resolve(kind ? { exists: true, kind } : { exists: false })
		}, delay)
	})
}
