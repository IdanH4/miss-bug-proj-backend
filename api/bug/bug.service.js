import fs from "fs"

import { loggerService } from "../../services/logger.service.js"
import {
	getRandomIntInclusive,
	makeId,
	readJsonFile,
} from "../../services/util.service.js"

export const bugService = {
	query,
	getById,
	remove,
	save,
}

var bugs = readJsonFile("./data/bug.json")
const PAGE_SIZE = 4

async function query(filterBy = {}) {
	try {
		let bugsToReturn = [...bugs]
		if (filterBy.txt) {
			const regExp = new RegExp(filterBy.txt, "i")
			bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.vendor))
		}

		if (filterBy.minSpeed) {
			bugsToReturn = bugsToReturn.filter(
				bug => bug.speed >= filterBy.minSpeed
			)
		}

		if (filterBy.pageIdx !== undefined) {
			const startIdx = filterBy.pageIdx * PAGE_SIZE
			bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
		}

		return bugsToReturn
	} catch (err) {
		loggerService.error(err)
		throw err
	}
}

async function getById(bugId) {
	try {
		var bug = bugs.find(bug => bug._id === bugId)
		if (!bug) throw `Couldn't find bug with _id ${bugId}`
		return bug
	} catch (err) {
		loggerService.error("bugService[getById]: ", err)
		throw err
	}
}

async function remove(bugId, loggedinUser) {
	try {
		const bugToRemove = await getById(bugId)
		// if (!loggedinUser.isAdmin && bugToRemove?.owner?._id !== loggedinUser._id)
		//   throw "Cant remove bug"
		const idx = bugs.findIndex(bug => bug._id === bugId)
		if (idx === -1) throw `Couldn't find bug with _id ${bugId}`

		bugs.splice(idx, 1)
		await _saveBugsToFile()
	} catch (err) {
		loggerService.error("bugService[remove]:", err)
		throw err
	}
}

// async function save(bugToSave, loggedinUser) {
async function save(bugToSave) {
	try {
		if (bugToSave._id) {
			if (
				!loggedinUser.isAdmin &&
				bugToSave?.owner?._id !== loggedinUser._id
			)
				throw "Cant update bug"
			const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
			if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
			const bugFieldsToUpdate = {
				vendor: bugToSave.vendor,
				speed: bugToSave.speed,
			}
			bugs[idx] = { ...bugs[idx], ...bugFieldsToUpdate }
		} else {
			bugToSave._id = makeId()
			bugToSave.createdAt = Date.now()
			// bugToSave.owner = {
			// 	_id: loggedinUser._id,
			// 	fullname: loggedinUser.fullname,
			// }
			bugs.push(bugToSave)
		}
		await _saveBugsToFile()
		return bugToSave
	} catch (err) {
		loggerService.error("bugService[save]:", err)
		throw err
	}
}

function _saveBugsToFile(path = "./data/bug.json") {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify(bugs, null, 4)
		fs.writeFile(path, data, err => {
			if (err) return reject(err)
			resolve()
		})
	})
}
