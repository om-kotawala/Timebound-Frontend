const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ─── DB Connection ────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Schemas ──────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  occupation: String,
  monthlyGoal: { type: Number, default: 0 },
}, { timestamps: true });

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  priority: { type: String, enum: ['Important', 'Urgent', 'Medium'], default: 'Medium' },
  creationTime: { type: Date, required: true, default: Date.now },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  isLocked: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const OTP = mongoose.model('OTP', OTPSchema);
const Task = mongoose.model('Task', TaskSchema);

// ─── Email Setup ──────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, html });
};

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email' });
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });
    // Send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });
    await sendEmail(email, 'Your TimeBound OTP',
      `<h2>Your OTP: <strong>${otp}</strong></h2><p>Expires in 5 minutes.</p>`);
    res.json({ message: 'OTP sent' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });
    await sendEmail(email, 'Your TimeBound OTP',
      `<h2>Your OTP: <strong>${otp}</strong></h2><p>Expires in 5 minutes.</p>`);
    res.json({ message: 'OTP sent' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, isUsed: false }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'No OTP found' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    await OTP.updateOne({ _id: record._id }, { isUsed: true });
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── Profile Routes ───────────────────────────────────────────────────────────
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-__v');
  res.json(user);
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  const { name, occupation, monthlyGoal } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId, { name, occupation, monthlyGoal }, { new: true }
  );
  res.json(user);
});

// ─── Task Routes ─────────────────────────────────────────────────────────────
const getStartOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const getEndOfDay = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title required' });
    const deadline = new Date(); deadline.setHours(23,59,0,0);
    const task = await Task.create({
      userId: req.user.userId, title: title.trim(), priority: priority || 'Medium',
      creationTime: new Date(), deadline,
    });
    res.status(201).json(task);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/tasks/today', authMiddleware, async (req, res) => {
  const today = new Date();
  const tasks = await Task.find({
    userId: req.user.userId,
    creationTime: { $gte: getStartOfDay(today), $lte: getEndOfDay(today) },
  }).sort({ createdAt: -1 });
  res.json(tasks);
});

app.get('/api/tasks/date/:date', authMiddleware, async (req, res) => {
  const date = new Date(req.params.date);
  if (isNaN(date)) return res.status(400).json({ message: 'Invalid date' });
  const tasks = await Task.find({
    userId: req.user.userId,
    creationTime: { $gte: getStartOfDay(date), $lte: getEndOfDay(date) },
  }).sort({ createdAt: -1 });
  res.json(tasks);
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.isLocked) return res.status(403).json({ message: 'Task is locked' });
    const { title, priority } = req.body;
    Object.assign(task, { title: title || task.title, priority: priority || task.priority });
    await task.save();
    res.json(task);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.isLocked) return res.status(403).json({ message: 'Cannot delete locked task' });
    await task.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/tasks/:id/complete', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.isLocked) return res.status(403).json({ message: 'Task is locked' });
    if (task.status === 'Completed') return res.status(400).json({ message: 'Already completed' });
    task.status = 'Completed';
    task.completedAt = new Date();
    await task.save();
    res.json(task);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── Progress Routes ──────────────────────────────────────────────────────────
app.get('/api/progress/daily/:date', authMiddleware, async (req, res) => {
  const date = new Date(req.params.date);
  const tasks = await Task.find({
    userId: req.user.userId,
    creationTime: { $gte: getStartOfDay(date), $lte: getEndOfDay(date) },
  });
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  res.json({ date, total, completed, pending: total - completed, percentage });
});

app.get('/api/progress/monthly/:month/:year', authMiddleware, async (req, res) => {
  const { month, year } = req.params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const tasks = await Task.find({
    userId: req.user.userId,
    creationTime: { $gte: startDate, $lte: endDate },
  });
  // Group by day
  const byDay = {};
  tasks.forEach(t => {
    const day = new Date(t.creationTime).getDate();
    if (!byDay[day]) byDay[day] = { total: 0, completed: 0 };
    byDay[day].total++;
    if (t.status === 'Completed') byDay[day].completed++;
  });
  const data = Object.entries(byDay).map(([day, d]) => ({
    day: Number(day),
    progress: Math.round((d.completed / d.total) * 100),
  })).sort((a, b) => a.day - b.day);
  const avg = data.length ? Math.round(data.reduce((s, d) => s + d.progress, 0) / data.length) : 0;
  res.json({ data, average: avg });
});

app.get('/api/progress/yearly/:year', authMiddleware, async (req, res) => {
  const year = req.params.year;
  const tasks = await Task.find({
    userId: req.user.userId,
    creationTime: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) },
  });
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const byMonth = {};
  tasks.forEach(t => {
    const m = new Date(t.creationTime).getMonth();
    if (!byMonth[m]) byMonth[m] = { total: 0, completed: 0 };
    byMonth[m].total++;
    if (t.status === 'Completed') byMonth[m].completed++;
  });
  const data = Object.entries(byMonth).map(([m, d]) => ({
    month: months[Number(m)],
    progress: Math.round((d.completed / d.total) * 100),
  }));
  const avg = data.length ? Math.round(data.reduce((s,d) => s + d.progress, 0) / data.length) : 0;
  res.json({ data, average: avg });
});

// ─── Cron Jobs ────────────────────────────────────────────────────────────────
// Lock expired tasks every minute
cron.schedule('* * * * *', async () => {
  try {
    await Task.updateMany(
      { deadline: { $lt: new Date() }, isLocked: false },
      { $set: { isLocked: true } }
    );
  } catch (e) { console.error('Cron lock error:', e); }
});

// Send deadline warnings 2h before (runs every 10 min)
cron.schedule('*/10 * * * *', async () => {
  try {
    const in2h = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const tasks = await Task.find({
      deadline: { $lte: in2h, $gt: new Date() },
      status: 'Pending', isLocked: false,
    }).populate('userId', 'email name');
    for (const task of tasks) {
      if (task.userId?.email) {
        await sendEmail(task.userId.email, `⚠️ Task deadline in 2 hours: ${task.title}`,
          `<h3>Deadline Warning</h3><p><strong>${task.title}</strong> (${task.priority}) is due at ${task.deadline.toLocaleTimeString()}</p>`
        ).catch(console.error);
      }
    }
  } catch (e) { console.error('Warning cron error:', e); }
});

// Daily report at 11:59 PM
cron.schedule('59 23 * * *', async () => {
  const users = await User.find();
  for (const user of users) {
    const tasks = await Task.find({
      userId: user._id,
      creationTime: { $gte: new Date().setHours(0,0,0,0) },
    });
    if (!tasks.length) continue;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pct = Math.round((completed / tasks.length) * 100);
    await sendEmail(user.email, `TimeBound Daily Report — ${pct}% Complete`,
      `<h2>Daily Report</h2><p>Total: ${tasks.length} | Done: ${completed} | Pending: ${tasks.length - completed}</p><p>Progress: <strong>${pct}%</strong></p>`
    ).catch(console.error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TimeBound API running on port ${PORT}`));
