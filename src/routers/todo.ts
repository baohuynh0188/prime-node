import express from 'express';
import { listTodos, createTodo, deleteTodo } from '../controllers/todo';

const router = express.Router();

// GET: /todos
router.get('/', listTodos);

// POST: /todos
router.post('/', createTodo);

// Delete: /todos
router.delete('/', deleteTodo);

export default router;
