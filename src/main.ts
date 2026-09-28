import "./style.css"
import { findUrlProblem } from "./url/validate"
import { askServer, type ServerAnswer } from "./server/api"
import { throttle } from "./util/throttle"

const CHECK_GAP_MS = 700
const RECENT_LIMIT = 5
const CACHE_MS = 30_000

function mustFind<T extends HTMLElement>(id: string): T {
	const el = document.getElementById(id)
	if (!el) throw new Error(`#${id} is missing in index.html`)
	return el as T
}

const linkInput = mustFind<HTMLInputElement>("link")
const verdict = mustFind<HTMLOutputElement>("verdict")
const recentList = mustFind<HTMLUListElement>("recent")

type Look = "neutral" | "bad-format" | "waiting" | "found" | "not-found" | "error"

const answers = new Map<string, { answer: ServerAnswer; at: number }>()
const recent: string[] = []

function say(text: string, look: Look) {
	verdict.textContent = text
	verdict.dataset.state = look
}

function describe(answer: ServerAnswer): string {
	if (!answer.exists) return "Nothing there"
	return answer.kind === "file" ? "Found it - it's a file" : "Found it - it's a folder"
}

function showAnswer(answer: ServerAnswer) {
	say(describe(answer), answer.exists ? "found" : "not-found")
}

function rememberCheck(link: string, answer: ServerAnswer) {
	const line = `${answer.exists ? answer.kind : "missing"} · ${link}`
	const old = recent.indexOf(line)
	if (old !== -1) recent.splice(old, 1)
	recent.unshift(line)
	recent.length = Math.min(recent.length, RECENT_LIMIT)

	recentList.replaceChildren(
		...recent.map((text) => {
			const li = document.createElement("li")
			li.textContent = text
			return li
		}),
	)
}

let editCount = 0

function isLatestInput(link: string) {
	return linkInput.value.trim() === link
}

async function checkLink(link: string) {
	if (!isLatestInput(link)) return
	const editAtStart = editCount

const cached = answers.get(link)
if (cached && Date.now() - cached.at < CACHE_MS) {
	showAnswer(cached.answer)
	rememberCheck(link, cached.answer)
	return
}

	try {
		const answer = await askServer(link)
		answers.set(link, { answer, at: Date.now() })
		if (editCount !== editAtStart) return
		showAnswer(answer)
		rememberCheck(link, answer)
	} catch {
		if (editCount === editAtStart) say("The server didn't answer, press Enter to try again", "error")
	}
}

const checkWhileTyping = throttle(checkLink, CHECK_GAP_MS)

function readValidLink(): string | null {
	const link = linkInput.value.trim()

	if (link === "") {
		say("", "neutral")
		return null
	}

	const problem = findUrlProblem(link)
	if (problem) {
		say(problem, "bad-format")
		return null
	}

	return link
}

linkInput.addEventListener("input", () => {
	editCount++
	const link = readValidLink()
	if (!link) return
	say("Looks like a link, checking...", "waiting")
	checkWhileTyping(link)
})

linkInput.addEventListener("keydown", (event) => {
	if (event.key !== "Enter") return
	const link = readValidLink()
	if (!link) return
	say("Checking again...", "waiting")
	checkWhileTyping(link)
})
