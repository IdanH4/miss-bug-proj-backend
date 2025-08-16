// Bug CRUDL API
import { log } from "console"
import { authService } from "../auth/auth.service.js"
import { bugService } from "./bug.service.js"

// List
export async function getBugs(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || "",
			minSpeed: +req.query.minSpeed || 0,
			pageIdx: req.query.pageIdx || undefined,
		}
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
	} catch (err) {
		res.status(400).send(`Couldn't get bugs`)
	}
}

// Get
export async function getBug(req, res) {
	const { bugId } = req.params

	try {
		const bug = await bugService.getById(bugId)
		res.send(bug)
	} catch (err) {
		res.status(400).send(`Couldn't get bug`)
	}
}

//Delete
export async function removeBug(req, res) {
	// const loggedinUser = authService.validateToken(req.cookies.loginToken)
	// if (!loggedinUser) return res.status(401).send('Cannot remove bug')
	// const loggedinUser = req.loggedinUser
	const { bugId } = req.params

	try {
		// await bugService.remove(bugId, loggedinUser)
		await bugService.remove(bugId)
		res.send("Deleted OK")
	} catch (err) {
		res.status(400).send(`Couldn't remove bug : ${err}`)
	}
}

// // Save
export async function addBug(req, res) {
	// const loggedinUser = authService.validateToken(req.cookies.loginToken)
	// if (!loggedinUser) return res.status(401).send('Login first')
	// const { loggedinUser } = req
	const { description, title, severity } = req.body

	console.log("req.body:", req.body)

	// Better use createBug()

	const bugToSave = { description, title, severity: +severity }
	console.log("bugToSave", bugToSave)
	try {
		// const savedBug = await bugService.save(bugToSave, loggedinUser)
		const savedBug = await bugService.save(bugToSave)
		res.send(savedBug)
	} catch (err) {
		console.log("Error in addBug Yoni the zain:", err)
		res.status(400).send(`Couldn't save bug from addBug: ${err}`)
	}
}

export async function updateBug(req, res) {
	// const loggedinUser = authService.validateToken(req.cookies.loginToken)
	// if (!loggedinUser) return res.status(401).send('Login first')
	const { loggedinUser } = req

	const { _id, vendor, speed, owner } = req.body
	const bugToSave = { _id, vendor, speed: +speed, owner }

	try {
		const savedBug = await bugService.save(bugToSave, loggedinUser)
		res.send(savedBug)
	} catch (err) {
		res.status(400).send(`Couldn't save bug from updateBug`)
	}
}
