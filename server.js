import express from "express"
import cors from "cors"
import { bugsService } from "./services/bugs.service.js"
import { loggerService } from "./services/logger.service.js"

const app = express()

app.use(express.static("public"))

const corsOptions = {
	origin: [
		"http://127.0.0.1:5173",
		"http://localhost:5173",
		"http://127.0.0.1:5174",
		"http://localhost:5174",
	],
	credentials: true,
}

const appPort = 3030
app.listen(appPort, () => console.log(`Server ready at port ${appPort}`))

app.use(cors(corsOptions))

app.get("/", (req, res) => res.redirect("/api/bug"))

app.get("/api/bug", async (req, res) => {
	const bugs = await bugsService.query()
	res.send(bugs)
})

app.get("/api/bug/save", async (req, res) => {
	const { title, severity, _id, description } = req.query
	const bugToSave = { title, description, severity: +severity, _id }

	const savedBug = await bugsService.save(bugToSave)
	res.send(savedBug)
})

app.get("/api/bug/:id", async (req, res) => {
	const id = req.params.id
	try {
		const bug = await bugsService.getById(id)
		res.send(bug)
	} catch (err) {
		loggerService.error(err)
		res.status(404).send(err)
	}
})

app.get("/api/bug/:id/remove", async (req, res) => {
	const id = req.params.id
	await bugsService.remove(id)
	res.send("OK")
})
