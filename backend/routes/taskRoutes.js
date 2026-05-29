const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All task routes require authentication
router.use(auth);

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', taskController.createTask);

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', taskController.getTasks);

// @route   GET api/tasks/stats
// @desc    Get dashboard stats
// @access  Private
router.get('/stats', taskController.getTaskStats);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', taskController.deleteTask);

module.exports = router;
