import express from 'express';
import {
    createTodo,
    deleteTodo,
    getTodo,
    listTodos,
    updateTodo,
} from '../controllers/todo-controller';

const router = express.Router();

// GET: /todos
router.get('/', listTodos);

// GET: /todos/:id
router.get('/:id', getTodo);

// POST: /todos
router.post('/', createTodo);

// PUT: /todos/:id
router.put('/:id', updateTodo);

// DELETE: /todos/:id
router.delete('/:id', deleteTodo);

export default router;
