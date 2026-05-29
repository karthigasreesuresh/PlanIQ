const db = require('../config/db');

// Create Task
exports.createTask = async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ msg: 'Due date is required' });
    }

    const newTask = await db.tasks.create({
      userId: req.user.id,
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: new Date(dueDate)
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Tasks (Filtered & Sorted)
exports.getTasks = async (req, res) => {
  const { search, status, priority, sortBy } = req.query;

  try {
    const tasks = await db.tasks.find({
      userId: req.user.id,
      search,
      status,
      priority,
      sortBy: sortBy || 'dueDate'
    });

    res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  try {
    let task = await db.tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check ownership
    // MongoDB _id or userId might be Objects or strings. Convert both to strings for safe comparison.
    const taskUserId = task.userId.toString();
    if (taskUserId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Build update object
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;
    if (dueDate !== undefined) updateFields.dueDate = new Date(dueDate);

    const updatedTask = await db.tasks.findByIdAndUpdate(req.params.id, updateFields);
    res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await db.tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check ownership
    const taskUserId = task.userId.toString();
    if (taskUserId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await db.tasks.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get Dashboard Stats
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user tasks to calculate stats dynamically
    const allTasks = await db.tasks.find({ userId });

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = allTasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
    const highPriorityTasks = allTasks.filter(t => t.priority === 'High').length;

    // Overdue tasks (due date is past today & status is not completed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = allTasks.filter(t => {
      const due = new Date(t.dueDate);
      return due < today && t.status !== 'Completed';
    }).length;

    // Completion percentage
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks (limit 5)
    // Sort tasks by created date descending
    const recentTasks = [...allTasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Productivity metrics for Charting:
    // Format status splits
    const statusData = [
      { name: 'Pending', value: pendingTasks },
      { name: 'In Progress', value: inProgressTasks },
      { name: 'Completed', value: completedTasks }
    ];

    // Format priority splits
    const priorityData = [
      { name: 'Low', value: allTasks.filter(t => t.priority === 'Low').length },
      { name: 'Medium', value: allTasks.filter(t => t.priority === 'Medium').length },
      { name: 'High', value: highPriorityTasks }
    ];

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      highPriorityTasks,
      overdueTasks,
      completionPercentage,
      recentTasks,
      statusData,
      priorityData
    });
  } catch (err) {
    console.error('Stats fetch error:', err.message);
    res.status(500).send('Server Error');
  }
};
