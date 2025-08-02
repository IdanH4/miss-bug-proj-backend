import { loggerService } from "./logger.service.js"
import {
	makeId,
	makeRandomBugTitle,
	readJsonFile,
	writeJsonFile,
	makeRandomSeverity,
} from "./util.service.js"

const bugs = readJsonFile("./data/bugs.json")

export const bugsService = {
	query,
	getById,
	remove,
	save,
}

async function query() {
	return bugs
}

async function getById(bugId) {
	const bug = bugs.find(bug => bug._id === bugId)

	if (!bug) {
		loggerService.error(`Couldn't find bug with _id ${bugId}`)
		throw `Couldn't get bug`
	}
	return bug
}

async function remove(bugId) {
	const idx = bugs.findIndex(bug => bug._id === bugId)
	bugs.splice(idx, 1)

	return _saveBugs()
}

async function save(bugToSave) {
	if (bugToSave._id) {
		const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
		const createdAt = bugs[idx].createdAt
		const description = bugToSave.description || "Some Random description"
		bugToSave.createdAt = createdAt
		bugToSave.description = description
		bugs.splice(idx, 1, bugToSave)
	} else {
		bugToSave._id = makeId()
		bugToSave.title = bugToSave.title || makeRandomBugTitle()
		bugToSave.description =
			bugToSave.description || "Some random description"
		bugToSave.severity = bugToSave.severity || makeRandomSeverity()
		bugToSave.createdAt = Math.floor(new Date().getTime() / 1000)
		bugs.push(bugToSave)
	}
	await _saveBugs()
	return bugToSave
}

function _saveBugs() {
	return writeJsonFile("./data/bugs.json", bugs)
}
