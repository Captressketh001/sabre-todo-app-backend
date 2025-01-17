import express, { Request, Response } from "express";
import Task, { ITask } from "../models/Task";

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The todo was successfully created
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const task: ITask = new Task({ text });
    await task.save();
    res.status(201).json({
      response: task, 
      status: 201,
      msg: 'Todo Created',
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the todo
 *         text:
 *           type: string
 *           description: Task description
 *         completed:
 *           type: boolean
 *           description: Task completion status
 *       example:
 *         id: 12345
 *         text: Complete the project
 *         completed: false
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === "active") {
      filter = { completed: false };
    } else if (status === "completed") {
      filter = { completed: true };
    }

    // Fetch tasks based on the filter
    const tasks: ITask[] = await Task.find(filter);

    res.status(200).json({
      response: tasks,
      status: 200,
      msg: "success",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

/**
 * @swagger
 * /api/todos/filter:
 *   get:
 *     summary: Filter todos by status
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *         required: false
 *         description: Filter tasks by their status (active or completed)
 *     responses:
 *       200:
 *         description: Successfully retrieved the filtered list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal server error
 */
router.get("/filter", async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter =
      status === "active"
        ? { completed: false }
        : status === "completed"
        ? { completed: true }
        : {};
    const tasks: ITask[] = await Task.find(filter);
    res.status(200).json({
      response: tasks, 
      status: 200,
      msg: 'success',
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to filter todos" });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The todo was updated
 */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const task: ITask | null = await Task.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json({
      response: task, 
      status: 200,
      msg: 'Todo Updated',
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: The todo was deleted
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task: ITask | null = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json({
      response: task, 
      status: 200,
      msg:"Todo deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
