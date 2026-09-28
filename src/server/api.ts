import { findEntry } from "./fakeFileSystem"

export type ServerAnswer = { exists: false } | { exists: true; kind: "file" | "folder" }

export function askServer(url: string, errorChance = 0.03): Promise<ServerAnswer> {
	const delay = 250 + Math.random() * 750

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < errorChance) {
				reject(new Error("Server did not answer"))
				return
			}
			const kind = findEntry(new URL(url))
			resolve(kind ? { exists: true, kind } : { exists: false })
		}, delay)
	})
}
