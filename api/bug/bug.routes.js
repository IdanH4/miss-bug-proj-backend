import express from "express"
import {
	addBug,
	getBug,
	getBugs,
	removeBug,
	updateBug,
} from "./bug.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"
import { log } from "../../middlewares/log.middleware.js"

const router = express.Router()

router.get("/", log, getBugs)
router.get("/:bugId", getBug)
router.delete("/:bugId", removeBug)
// router.post("/", requireAuth, addBug)
router.post("/", addBug)
router.put("/:bugId", requireAuth, updateBug)

export const bugRoutes = router
