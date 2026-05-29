const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const JSON_DB_PATH = path.join(__dirname, '../data/db.json');
let isMongo = false;

// Initialize MongoDB or JSON Database
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB Connected successfully.');
      isMongo = true;
      return true;
    } catch (err) {
      console.error('MongoDB connection failed. Falling back to JSON database.', err.message);
    }
  }

  // Fallback to JSON DB
  console.log('Using zero-config Local JSON Database.');
  await ensureJsonDbExists();
  isMongo = false;
  return false;
}

// Ensure JSON file exists
async function ensureJsonDbExists() {
  try {
    await fs.mkdir(path.dirname(JSON_DB_PATH), { recursive: true });
    try {
      await fs.access(JSON_DB_PATH);
    } catch {
      await fs.writeFile(JSON_DB_PATH, JSON.stringify({ users: [], tasks: [] }, null, 2));
    }
  } catch (err) {
    console.error('Error creating JSON DB file:', err);
  }
}

// Helpers for JSON DB
async function readJsonDb() {
  await ensureJsonDbExists();
  const data = await fs.readFile(JSON_DB_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeJsonDb(data) {
  await ensureJsonDbExists();
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

// Mongoose Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.model('User', UserSchema);
const MongooseTask = mongoose.model('Task', TaskSchema);

// Unified Database API
const db = {
  isMongoMode: () => isMongo,
  connect: connectDB,

  users: {
    async findOne({ email }) {
      if (isMongo) {
        return await MongooseUser.findOne({ email: email.toLowerCase() });
      } else {
        const data = await readJsonDb();
        const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user ? { ...user } : null;
      }
    },

    async findById(id) {
      if (isMongo) {
        return await MongooseUser.findById(id);
      } else {
        const data = await readJsonDb();
        const user = data.users.find(u => u._id === id);
        return user ? { ...user } : null;
      }
    },

    async create(userData) {
      if (isMongo) {
        const user = new MongooseUser({
          ...userData,
          email: userData.email.toLowerCase()
        });
        return await user.save();
      } else {
        const data = await readJsonDb();
        const newUser = {
          _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: userData.password,
          createdAt: new Date().toISOString()
        };
        data.users.push(newUser);
        await writeJsonDb(data);
        return { ...newUser };
      }
    }
  },

  tasks: {
    async find({ userId, search = '', status = '', priority = '', sortBy = 'dueDate' }) {
      if (isMongo) {
        let query = { userId };
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        if (status) query.status = status;
        if (priority) query.priority = priority;

        let sortOption = {};
        if (sortBy === 'dueDate') {
          sortOption.dueDate = 1;
        } else if (sortBy === 'recent') {
          sortOption.createdAt = -1;
        }

        return await MongooseTask.find(query).sort(sortOption);
      } else {
        const data = await readJsonDb();
        let userTasks = data.tasks.filter(t => t.userId === userId);

        // Filter search
        if (search) {
          const q = search.toLowerCase();
          userTasks = userTasks.filter(t => 
            (t.title && t.title.toLowerCase().includes(q)) || 
            (t.description && t.description.toLowerCase().includes(q))
          );
        }

        // Filter status
        if (status) {
          userTasks = userTasks.filter(t => t.status === status);
        }

        // Filter priority
        if (priority) {
          userTasks = userTasks.filter(t => t.priority === priority);
        }

        // Sort
        if (sortBy === 'dueDate') {
          userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === 'recent') {
          userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return userTasks.map(t => ({ ...t }));
      }
    },

    async findById(id) {
      if (isMongo) {
        return await MongooseTask.findById(id);
      } else {
        const data = await readJsonDb();
        const task = data.tasks.find(t => t._id === id);
        return task ? { ...task } : null;
      }
    },

    async create(taskData) {
      if (isMongo) {
        const task = new MongooseTask(taskData);
        return await task.save();
      } else {
        const data = await readJsonDb();
        const newTask = {
          _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          userId: taskData.userId,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'Medium',
          status: taskData.status || 'Pending',
          dueDate: new Date(taskData.dueDate).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        data.tasks.push(newTask);
        await writeJsonDb(data);
        return { ...newTask };
      }
    },

    async findByIdAndUpdate(id, updateData) {
      if (isMongo) {
        return await MongooseTask.findByIdAndUpdate(
          id,
          { ...updateData, updatedAt: Date.now() },
          { new: true }
        );
      } else {
        const data = await readJsonDb();
        const idx = data.tasks.findIndex(t => t._id === id);
        if (idx === -1) return null;

        const updatedTask = {
          ...data.tasks[idx],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        // Preserve un-updatable fields
        updatedTask._id = data.tasks[idx]._id;
        updatedTask.userId = data.tasks[idx].userId;
        updatedTask.createdAt = data.tasks[idx].createdAt;

        data.tasks[idx] = updatedTask;
        await writeJsonDb(data);
        return { ...updatedTask };
      }
    },

    async findByIdAndDelete(id) {
      if (isMongo) {
        return await MongooseTask.findByIdAndDelete(id);
      } else {
        const data = await readJsonDb();
        const idx = data.tasks.findIndex(t => t._id === id);
        if (idx === -1) return null;
        const deletedTask = data.tasks.splice(idx, 1)[0];
        await writeJsonDb(data);
        return { ...deletedTask };
      }
    },

    async countDocuments(filter) {
      if (isMongo) {
        return await MongooseTask.countDocuments(filter);
      } else {
        const data = await readJsonDb();
        let userTasks = data.tasks.filter(t => t.userId === filter.userId);
        
        if (filter.status) {
          userTasks = userTasks.filter(t => t.status === filter.status);
        }
        if (filter.priority) {
          userTasks = userTasks.filter(t => t.priority === filter.priority);
        }
        
        return userTasks.length;
      }
    }
  }
};

module.exports = db;
