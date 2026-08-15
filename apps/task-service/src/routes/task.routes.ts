import { Router } from "express";
import { validateBody } from "shared";
import { createTaskSchema } from "../schemas/task.schemas";
import * as taskController from "../controllers/task.controllers";

const router = Router();

router.post("/", validateBody(createTaskSchema), taskController.createTask);
router.get("/", taskController.listTasks);
router.get("/:id", taskController.getSingleTasks);
router.delete("/:id", taskController.deleteSingleTasks);

export default router;
