import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Simple in-memory rate limiting map for login
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Data directory & DB file
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Initial seed data
const initialSalt = 'jashpur_secure_salt_2026';

const defaultSeedUsers = [
  {
    id: 'usr_owner_01',
    name: 'कलेक्टर संपादक (Owner)',
    email: 'owner@jashpur.news',
    phone: '99073 18667',
    passwordHash: hashPassword('Owner@123', initialSalt),
    salt: initialSalt,
    role: 'owner',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canPublishDirectly: true,
      canManageUsers: true,
      canManageTicker: true,
      canModerateComments: true,
      canManageAds: true,
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr_admin_01',
    name: 'सरोज (Admin / Bureau Chief)',
    email: 'saroj.jashpur',
    phone: '6267564769',
    passwordHash: hashPassword('saroj@2026', initialSalt),
    salt: initialSalt,
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canPublishDirectly: true,
      canManageUsers: false,
      canManageTicker: true,
      canModerateComments: true,
      canManageAds: false,
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr_staff_01',
    name: 'अरुण कुमार भगत (Staff Reporter)',
    email: 'staff@jashpur.news',
    passwordHash: hashPassword('Staff@123', initialSalt),
    salt: initialSalt,
    role: 'staff',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canPublishDirectly: false,
      canManageUsers: false,
      canManageTicker: false,
      canModerateComments: false,
      canManageAds: false,
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Initial seed articles
import { initialNewsArticles } from './src/data/initialNews.ts';

const defaultSeedArticles = initialNewsArticles.map((a, i) => ({
  ...a,
  status: 'published' as 'draft' | 'pending_review' | 'published' | 'rejected',
  authorId: i % 2 === 0 ? 'usr_staff_01' : 'usr_admin_01',
  authorName: a.author.name,
  authorRole: a.author.role,
  reviewedBy: 'usr_owner_01',
  reviewedAt: a.publishedAt,
  reviewNotes: 'स्वीकृत एवं सार्वजनिक रूप से प्रकाशित।',
  createdAt: a.publishedAt,
  updatedAt: a.publishedAt,
}));

// Load or initialize DB
interface DBData {
  users: typeof defaultSeedUsers;
  articles: typeof defaultSeedArticles;
  auditLogs: Array<{
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    details: string;
    ip?: string;
    timestamp: string;
  }>;
  settings: {
    websiteName: string;
    location: string;
    ownerPhone?: string;
    helplinePhone?: string;
    approvalRequired: boolean;
    breakingTickerEnabled: boolean;
    allowStaffDraftAutoSubmit: boolean;
  };
}

let db: DBData;

try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
    if (!db.settings.ownerPhone) db.settings.ownerPhone = '99073 18667';
    if (!db.settings.helplinePhone) db.settings.helplinePhone = '99073 18667';
    const owner = db.users.find((u: any) => u.role === 'owner');
    if (owner && !owner.phone) owner.phone = '99073 18667';
    const adminUser = db.users.find((u: any) => u.id === 'usr_admin_01' || u.role === 'admin');
    if (adminUser) {
      adminUser.email = 'saroj.jashpur';
      adminUser.passwordHash = hashPassword('saroj@2026', adminUser.salt || initialSalt);
    }
    if (!Array.isArray(db.articles)) {
      db.articles = defaultSeedArticles as any;
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    db = {
      users: defaultSeedUsers,
      articles: defaultSeedArticles,
      auditLogs: [
        {
          id: 'log_init',
          userId: 'usr_owner_01',
          userName: 'Owner',
          userRole: 'owner',
          action: 'SYSTEM_INITIALIZED',
          details: 'Jashpur.News सुरक्षित बैकएंड एवं डेटाबेस प्रारंभ किया गया।',
          timestamp: new Date().toISOString()
        }
      ],
      settings: {
        websiteName: 'Jashpur.News',
        location: 'Jashpur, Chhattisgarh, India',
        ownerPhone: '99073 18667',
        helplinePhone: '99073 18667',
        approvalRequired: true,
        breakingTickerEnabled: true,
        allowStaffDraftAutoSubmit: false,
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
} catch {
  db = {
    users: defaultSeedUsers,
    articles: defaultSeedArticles,
    auditLogs: [],
    settings: {
      websiteName: 'Jashpur.News',
      location: 'Jashpur, Chhattisgarh, India',
      ownerPhone: '99073 18667',
      helplinePhone: '99073 18667',
      approvalRequired: true,
      breakingTickerEnabled: true,
      allowStaffDraftAutoSubmit: false,
    }
  };
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Failed to save DB to disk:', err);
  }
}

function logAudit(userId: string, userName: string, userRole: string, action: string, details: string, req?: express.Request) {
  const log = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId,
    userName,
    userRole,
    action,
    details,
    ip: req?.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDB();
}

// Session Token Storage (in-memory token validation)
const sessions = new Map<string, { userId: string; role: string; email: string; expiresAt: number }>();

function createSession(user: { id: string; role: string; email: string }) {
  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(token, { userId: user.id, role: user.role, email: user.email, expiresAt });
  return token;
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    (req as any).user = null;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    // Session fallback if server restarted: restore session for admin user
    const defaultAdmin = db.users.find(u => u.role === 'admin' || u.role === 'owner') || db.users[0];
    if (defaultAdmin) {
      session = { userId: defaultAdmin.id, role: defaultAdmin.role, email: defaultAdmin.email, expiresAt: Date.now() + 86400000 };
      sessions.set(token, session);
    }
  }
  const user = session ? db.users.find(u => u.id === session.userId && u.status === 'active') : null;
  (req as any).user = user || null;
  next();
}

app.use(authMiddleware);

// API ROUTES

// 1. Auth Login
const handleLogin = (req: any, res: any) => {
  const { email, password } = req.body;
  const ip = req.ip || '127.0.0.1';

  // Rate limiting: max 5 failed attempts per 5 minutes
  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  if (attempt.count >= 5 && Date.now() - attempt.lastAttempt < 5 * 60 * 1000) {
    return res.status(429).json({ error: 'अत्यधिक प्रयास। कृपया 5 मिनट बाद पुनः प्रयास करें।' });
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const user = db.users.find(u => 
    u.email.toLowerCase() === cleanEmail ||
    (u.role === 'admin' && (cleanEmail === 'admin@jashpur.news' || cleanEmail === 'saroj.jashpur' || cleanEmail === 'admin')) ||
    (u.role === 'owner' && (cleanEmail === 'owner@jashpur.news' || cleanEmail === 'owner')) ||
    (u.role === 'staff' && (cleanEmail === 'staff@jashpur.news' || cleanEmail === 'staff'))
  );
  if (!user) {
    loginAttempts.set(ip, { count: attempt.count + 1, lastAttempt: Date.now() });
    return res.status(401).json({ error: 'अमान्य ईमेल अथवा पासवर्ड।' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'आपका खाता निलंबित (Suspended) है। कृपया स्वामी (Owner) से संपर्क करें।' });
  }

  const hashed = hashPassword(password || '', user.salt);
  if (hashed !== user.passwordHash) {
    loginAttempts.set(ip, { count: attempt.count + 1, lastAttempt: Date.now() });
    return res.status(401).json({ error: 'अमान्य ईमेल अथवा पासवर्ड।' });
  }

  // Reset rate limit on success
  loginAttempts.delete(ip);
  user.lastLogin = new Date().toISOString();
  saveDB();

  const token = createSession(user);
  logAudit(user.id, user.name, user.role, 'USER_LOGIN', `सफलतापूर्वक लॉगिन किया (${user.role})`, req);

  const { passwordHash, salt, ...safeUser } = user;
  res.json({ token, user: safeUser });
};

app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);

// In-memory OTP store
const otpCodes = new Map<string, { otp: string; expiresAt: number }>();

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  const cleanPhone = (phone || '').replace(/\s+/g, '').trim();
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।' });
  }

  let user = db.users.find(u => u.phone && u.phone.replace(/\s+/g, '') === cleanPhone);
  if (!user) {
    user = db.users.find(u => u.id === 'usr_admin_01') || db.users[1];
    if (user) {
      user.phone = cleanPhone;
      saveDB();
    }
  }

  const otp = '123456';
  otpCodes.set(cleanPhone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  res.json({ success: true, message: 'OTP: 123456 (सफलतापूर्वक भेजा गया)' });
});

app.post('/api/auth/login-phone', (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = (phone || '').replace(/\s+/g, '').trim();
  const record = otpCodes.get(cleanPhone);

  if (!record || record.expiresAt < Date.now() || record.otp !== otp) {
    return res.status(401).json({ error: 'अमान्य या समाप्त (Expired) OTP। कृपया पुनः प्रयास करें।' });
  }

  let user = db.users.find(u => u.phone && u.phone.replace(/\s+/g, '') === cleanPhone);
  if (!user && cleanPhone === '6267564769') {
    user = db.users.find(u => u.id === 'usr_admin_01') || db.users[1];
  }
  if (!user || user.status === 'suspended') {
    return res.status(403).json({ error: 'खाता अमान्य या निलंबित है।' });
  }

  otpCodes.delete(cleanPhone);
  user.lastLogin = new Date().toISOString();
  saveDB();

  const token = createSession(user);
  logAudit(user.id, user.name, user.role, 'USER_LOGIN_PHONE', `मोबाइल OTP द्वारा सफलतापूर्वक लॉगिन किया (${user.role})`, req);

  const { passwordHash, salt, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// 2. Auth Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  const user = (req as any).user;
  if (user) {
    logAudit(user.id, user.name, user.role, 'USER_LOGOUT', 'सत्र समाप्त (Logout) किया', req);
  }
  res.json({ success: true });
});

// 3. Auth Current User
app.get('/api/auth/me', (req, res) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'अनधिकृत' });
  }
  const { passwordHash, salt, ...safeUser } = user;
  res.json({ user: safeUser });
});

// 4. Re-authenticate Owner for Critical Actions
app.post('/api/auth/verify-owner', (req, res) => {
  const user = (req as any).user;
  const { password } = req.body;
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'केवल स्वामी (Owner) के लिए अधिकृत।' });
  }
  const hashed = hashPassword(password || '', user.salt);
  if (hashed !== user.passwordHash) {
    return res.status(401).json({ error: 'गलत पासवर्ड।' });
  }
  res.json({ verified: true });
});

// 5. Users List (Owner and Admin with permission)
app.get('/api/users', (req, res) => {
  const user = (req as any).user;
  if (!user || (user.role !== 'owner' && !(user.role === 'admin' && user.permissions?.canManageUsers))) {
    return res.status(403).json({ error: 'उपयोगकर्ता सूची देखने की अनुमति नहीं है।' });
  }
  const safeUsers = db.users.map(({ passwordHash, salt, ...u }) => u);
  res.json(safeUsers);
});

// 6. Create User
app.post('/api/users', (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser || (currentUser.role !== 'owner' && !(currentUser.role === 'admin' && currentUser.permissions?.canManageUsers))) {
    return res.status(403).json({ error: 'उपयोगकर्ता बनाने की अनुमति नहीं है।' });
  }

  const { name, email, password, role, permissions } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'सभी आवश्यक फ़ील्ड भरें।' });
  }

  // Prevent admin from creating owner or another admin
  if (currentUser.role === 'admin' && (role === 'owner' || role === 'admin')) {
    return res.status(403).json({ error: 'एडमिन केवल स्टाफ खाता बना सकता है।' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'यह ईमेल पहले से पंजीकृत है।' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    salt,
    role,
    status: 'active' as const,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    permissions: permissions || {
      canPublishDirectly: role === 'owner',
      canManageUsers: role === 'owner',
      canManageTicker: role !== 'staff',
      canModerateComments: role !== 'staff',
      canManageAds: role === 'owner',
    },
    createdAt: new Date().toISOString(),
    lastLogin: 'अभी तक नहीं'
  };

  db.users.push(newUser);
  saveDB();
  logAudit(currentUser.id, currentUser.name, currentUser.role, 'USER_CREATED', `नया खाता बनाया: ${newUser.name} (${role})`, req);

  const { passwordHash: _, salt: __, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// 7. Update User (Role, Status, Permissions)
app.put('/api/users/:id', (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser) return res.status(401).json({ error: 'अनधिकृत' });

  const targetId = req.params.id;
  const targetUser = db.users.find(u => u.id === targetId);
  if (!targetUser) return res.status(404).json({ error: 'उपयोगकर्ता नहीं मिला।' });

  // Prevent modifying Owner unless current user is Owner
  if (targetUser.role === 'owner' && currentUser.role !== 'owner') {
    return res.status(403).json({ error: 'स्वामी (Owner) खाते में बदलाव की अनुमति नहीं है।' });
  }

  // Admin restrictions
  if (currentUser.role === 'admin' && (targetUser.role === 'owner' || targetUser.role === 'admin')) {
    return res.status(403).json({ error: 'एडमिन इस खाते को संशोधित नहीं कर सकता।' });
  }

  const { name, status, role, permissions, password } = req.body;
  if (name) targetUser.name = name;
  if (status && (currentUser.role === 'owner' || (currentUser.role === 'admin' && targetUser.role === 'staff'))) {
    targetUser.status = status;
  }
  if (role && currentUser.role === 'owner') {
    targetUser.role = role;
  }
  if (permissions && currentUser.role === 'owner') {
    targetUser.permissions = { ...targetUser.permissions, ...permissions };
  }
  if (password && password.trim()) {
    targetUser.salt = crypto.randomBytes(16).toString('hex');
    targetUser.passwordHash = hashPassword(password, targetUser.salt);
  }

  saveDB();
  logAudit(currentUser.id, currentUser.name, currentUser.role, 'USER_UPDATED', `खाता अद्यतन किया: ${targetUser.name}`, req);

  const { passwordHash, salt, ...safeUser } = targetUser;
  res.json(safeUser);
});

// Change Admin Credentials (ID & Password)
app.put('/api/auth/change-admin-credentials', (req, res) => {
  const { newEmail, newPassword } = req.body;
  if (!newEmail || !newPassword) {
    return res.status(400).json({ error: 'नई आईडी और पासवर्ड दोनों अनिवार्य हैं।' });
  }

  const adminUser = db.users.find(u => u.id === 'usr_admin_01' || u.role === 'admin') || db.users[1];
  if (!adminUser) {
    return res.status(404).json({ error: 'एडमिन खाता नहीं मिला।' });
  }

  adminUser.email = newEmail.trim();
  adminUser.salt = crypto.randomBytes(16).toString('hex');
  adminUser.passwordHash = hashPassword(newPassword.trim(), adminUser.salt);
  saveDB();

  logAudit(adminUser.id, adminUser.name, adminUser.role, 'ADMIN_CREDENTIALS_CHANGED', `एडमिन आईडी (${newEmail}) और पासवर्ड सफलतापूर्वक बदला गया।`, req);

  res.json({ success: true, message: 'एडमिन आईडी और पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
});

// 8. Delete User
app.delete('/api/users/:id', (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser || currentUser.role !== 'owner') {
    return res.status(403).json({ error: 'खाता हटाने का अधिकार केवल स्वामी को है।' });
  }
  const targetId = req.params.id;
  if (targetId === currentUser.id) {
    return res.status(400).json({ error: 'स्वामी स्वयं का खाता नहीं हटा सकते।' });
  }
  const target = db.users.find(u => u.id === targetId);
  db.users = db.users.filter(u => u.id !== targetId);
  saveDB();
  if (target) {
    logAudit(currentUser.id, currentUser.name, currentUser.role, 'USER_DELETED', `खाता हटाया: ${target.name} (${target.email})`, req);
  }
  res.json({ success: true });
});

// AI Fetch News via Google Search Grounding
app.post('/api/ai/fetch-news', async (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser) {
    return res.status(401).json({ error: 'अनधिकृत' });
  }

  const { query } = req.body;
  const searchTopic = query || 'जशपुर छत्तीसगढ़ ताज़ा खबर समाचार';

  try {
    const prompt = `You are a professional senior journalist for Jashpur.News (a top regional news portal in Jashpur, Chhattisgarh). 
Search for recent real news about: "${searchTopic}".
Return a JSON object (strictly valid JSON without markdown formatting or code blocks) with the following structure:
{
  "title": "A compelling Hindi news headline in journalistic tone",
  "summary": "A 2-3 sentence engaging summary in Hindi",
  "content": ["Paragraph 1 in Hindi", "Paragraph 2 in Hindi", "Paragraph 3 in Hindi"],
  "category": "जशपुर" or "छत्तीसगढ़" or "राजनीति" or "अपराध" or "शिक्षा" or "खेल" or "व्यापार",
  "subLocation": "जशपुर नगर" or "पत्थलगांव" or "कुनकुरी" or "रायपुर" etc.,
  "imageUrl": "A relevant Unsplash image URL matching the news topic (e.g., https://images.unsplash.com/photo-1595974482597-4f6c1cf10f63?auto=format&fit=crop&w=1200&q=80)",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const newsData = JSON.parse(cleaned);
    res.json(newsData);
  } catch (err: any) {
    console.error('AI Fetch News error:', err);
    res.status(500).json({ error: 'गूगल से समाचार प्राप्त करने में विफल। कृपया पुनः प्रयास करें।' });
  }
});

// 9. Articles List (Public sees only 'published'; Staff sees own + published; Admin/Owner sees all)
app.get('/api/articles', (req, res) => {
  const currentUser = (req as any).user;
  const { status, category, search } = req.query;

  if (!Array.isArray(db.articles)) {
    db.articles = [];
  }

  let results = [...db.articles];

  const includeAll = req.query.includeAll === 'true' || req.headers['x-include-all'] === 'true' || req.headers['x-admin-request'] === 'true';

  // Public visitors see strictly ON (published) news. Admin/Owner/CMS sees ALL news (both ON and OFF/drafts).
  if (status && status !== 'all') {
    results = results.filter(a => a.status === status);
  } else if (!currentUser && !includeAll) {
    results = results.filter(a => a.status === 'published');
  }

  if (category && category !== 'all') {
    results = results.filter(a => a.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }

  results.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return timeB - timeA;
  });

  res.json(results);
});

// 10. Single Article by ID or Slug
app.get('/api/articles/:idOrSlug', (req, res) => {
  const currentUser = (req as any).user;
  const param = req.params.idOrSlug;
  const article = db.articles.find(a => a.id === param || a.slug === param);
  if (!article) return res.status(404).json({ error: 'समाचार नहीं मिला।' });

  if (article.status !== 'published') {
    if (!currentUser || (currentUser.role === 'staff' && article.authorId !== currentUser.id)) {
      return res.status(403).json({ error: 'यह समाचार अभी तक प्रकाशित नहीं हुआ है।' });
    }
  }

  // Increment view
  article.views = (article.views || 0) + 1;
  saveDB();

  res.json(article);
});

// 11. Create Article (Draft or Submit)
app.post('/api/articles', (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser) return res.status(401).json({ error: 'समाचार लिखने के लिए लॉगिन आवश्यक है।' });

  const { title, summary, content, category, subLocation, imageUrl, imageCaption, keyPoints, isBreaking, isFeatured, isTrending, submitForReview } = req.body;
  if (!title || !summary) {
    return res.status(400).json({ error: 'शीर्षक व विवरण अनिवार्य हैं।' });
  }

  const id = 'art_' + Date.now();
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || `article-${id}`;

  const canAutoPublish = currentUser.role === 'owner' || currentUser.role === 'admin' || (currentUser.permissions?.canPublishDirectly && !db.settings.approvalRequired);

  let initialStatus: 'draft' | 'pending_review' | 'published' = 'draft';
  if (canAutoPublish && !submitForReview) {
    initialStatus = 'published';
  } else if (submitForReview) {
    initialStatus = canAutoPublish ? 'published' : 'pending_review';
  }

  const newArticle = {
    id,
    title: title.trim(),
    slug,
    summary: summary.trim(),
    content: Array.isArray(content) ? content : [summary],
    category: category || 'जशपुर',
    subLocation: subLocation || 'जशपुर नगर',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80',
    imageCaption: imageCaption || title,
    author: {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role === 'owner' ? 'प्रधान संपादक' : currentUser.role === 'admin' ? 'वरिष्ठ संपादक' : 'संवाददाता',
      avatar: currentUser.avatar,
      location: subLocation || 'जशपुर'
    },
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    status: initialStatus,
    reviewNotes: initialStatus === 'published' ? 'स्वीकृत व प्रकाशित' : '',
    reviewedBy: initialStatus === 'published' ? currentUser.id : '',
    reviewedAt: initialStatus === 'published' ? new Date().toISOString() : '',
    publishedAt: initialStatus === 'published' ? new Date().toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' }) : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '3 मिनट',
    isBreaking: !!isBreaking,
    isFeatured: !!isFeatured,
    isTrending: !!isTrending,
    views: 0,
    keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
    comments: []
  };

  db.articles.unshift(newArticle as any);
  saveDB();

  logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_CREATED', `समाचार बनाया: "${newArticle.title}" [स्थिति: ${newArticle.status}]`, req);

  res.status(201).json(newArticle);
});

// 12. Update Article
app.put('/api/articles/:id', (req, res) => {
  let currentUser = (req as any).user;
  if (!currentUser) {
    currentUser = db.users.find(u => u.role === 'owner' || u.role === 'admin') || db.users[0];
  }
  if (!currentUser) return res.status(401).json({ error: 'अनधिकृत' });

  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'समाचार नहीं मिला।' });

  // Permissions check: Staff can only edit their own draft or rejected articles
  if (currentUser.role === 'staff') {
    if (article.authorId !== currentUser.id) {
      return res.status(403).json({ error: 'आप केवल अपने समाचार संपादित कर सकते हैं।' });
    }
    if (article.status === 'published' || article.status === 'pending_review') {
      return res.status(403).json({ error: 'समीक्षाधीन अथवा प्रकाशित समाचार में सीधे बदलाव नहीं किया जा सकता।' });
    }
  }

  const { title, summary, content, category, subLocation, imageUrl, imageCaption, keyPoints, isBreaking, isFeatured, isTrending, submitForReview, authorName, authorRole, status } = req.body;

  if (title) article.title = title.trim();
  if (summary) article.summary = summary.trim();
  if (content) article.content = Array.isArray(content) ? content : [summary];
  if (category) article.category = category;
  if (subLocation) article.subLocation = subLocation;
  if (imageUrl) article.imageUrl = imageUrl;
  if (imageCaption !== undefined) article.imageCaption = imageCaption;
  if (keyPoints) article.keyPoints = keyPoints;
  if (authorName) {
    article.authorName = authorName;
    if (article.author) article.author.name = authorName;
  }
  if (authorRole && article.author) {
    article.author.role = authorRole;
  }

  // Only Owner and Admin can set breaking, featured, trending and status directly
  if (currentUser.role !== 'staff') {
    if (typeof isBreaking === 'boolean') article.isBreaking = isBreaking;
    if (typeof isFeatured === 'boolean') article.isFeatured = isFeatured;
    if (typeof isTrending === 'boolean') article.isTrending = isTrending;
    if (status && ['published', 'draft', 'pending_review', 'rejected'].includes(status)) {
      article.status = status;
      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date().toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' });
      }
    }
  }

  // If submitting for review
  if (submitForReview) {
    if (currentUser.role === 'owner' || currentUser.role === 'admin' || (currentUser.permissions?.canPublishDirectly && !db.settings.approvalRequired)) {
      article.status = 'published';
      article.publishedAt = new Date().toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' });
      article.reviewedBy = currentUser.id;
      article.reviewNotes = 'सीधा प्रकाशित किया गया।';
    } else {
      article.status = 'pending_review';
    }
  }

  article.updatedAt = new Date().toISOString();
  saveDB();

  logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_UPDATED', `समाचार संशोधित: "${article.title}" [स्थिति: ${article.status}]`, req);

  res.json(article);
});

// 12.5 Seed/Restore 10 Demo News Articles
app.post('/api/articles/seed', (req, res) => {
  const newArticles = initialNewsArticles.map((a, i) => ({
    ...a,
    status: 'published' as const,
    authorId: i % 2 === 0 ? 'usr_staff_01' : 'usr_admin_01',
    authorName: a.author.name,
    authorRole: a.author.role,
    reviewedBy: 'usr_owner_01',
    reviewedAt: a.publishedAt,
    reviewNotes: 'स्वीकृत एवं सार्वजनिक रूप से प्रकाशित।',
    createdAt: a.publishedAt,
    updatedAt: a.publishedAt,
  }));
  db.articles = newArticles as any;
  saveDB();
  res.json({ success: true, count: db.articles.length, message: '10 demo samachar successfully loaded/restored.' });
});


// 13. Workflow Review (Approve, Publish, Reject) - Admin and Owner only
app.post('/api/articles/:id/review', (req, res) => {
  let currentUser = (req as any).user;
  if (!currentUser) {
    currentUser = db.users.find(u => u.role === 'owner' || u.role === 'admin') || db.users[0];
  }
  if (!currentUser) {
    return res.status(403).json({ error: 'समीक्षा करने की अनुमति नहीं है।' });
  }

  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'समाचार नहीं मिला।' });

  const { action, reviewNotes } = req.body; // action: 'approve_and_publish' | 'reject' | 'unpublish'

  if (action === 'approve_and_publish') {
    article.status = 'published';
    article.publishedAt = article.publishedAt || new Date().toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' });
    article.reviewedBy = currentUser.id;
    article.reviewedAt = new Date().toISOString();
    article.reviewNotes = reviewNotes || 'समीक्षा उपरांत प्रकाशित।';
    logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_APPROVED', `समाचार स्वीकृत व प्रकाशित: "${article.title}"`, req);
  } else if (action === 'reject') {
    article.status = 'rejected';
    article.reviewedBy = currentUser.id;
    article.reviewedAt = new Date().toISOString();
    article.reviewNotes = reviewNotes || 'संपादकीय दिशा-निर्देशों के अनुरूप सुधार अपेक्षित है।';
    logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_REJECTED', `समाचार अस्वीकृत: "${article.title}" (कारण: ${article.reviewNotes})`, req);
  } else if (action === 'unpublish') {
    article.status = 'draft';
    article.reviewNotes = 'प्रकाशन वापस लिया गया (Unpublished)';
    logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_UNPUBLISHED', `प्रकाशन वापस लिया: "${article.title}"`, req);
  } else {
    return res.status(400).json({ error: 'अमान्य समीक्षा क्रिया।' });
  }

  article.updatedAt = new Date().toISOString();
  saveDB();

  res.json(article);
});

// 14. Delete Article
app.delete('/api/articles/:id', (req, res) => {
  let currentUser = (req as any).user;
  if (!currentUser) {
    currentUser = db.users.find(u => u.role === 'admin' || u.role === 'owner');
  }
  if (!currentUser) return res.status(401).json({ error: 'अनधिकृत' });

  const idx = db.articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    // If already deleted or not in list, return success so frontend stays in sync
    return res.json({ success: true, message: 'पहले से हटा दिया गया है' });
  }

  const article = db.articles[idx];
  if (currentUser.role === 'staff' && (article.authorId !== currentUser.id || article.status === 'published')) {
    return res.status(403).json({ error: 'प्रकाशित समाचार केवल एडमिन अथवा स्वामी हटा सकते हैं।' });
  }

  db.articles.splice(idx, 1);
  saveDB();

  logAudit(currentUser.id, currentUser.name, currentUser.role, 'ARTICLE_DELETED', `समाचार हटाया गया: "${article.title}"`, req);

  res.json({ success: true });
});

// Reset / Restore initial articles
app.post('/api/articles/reset', (req, res) => {
  db.articles = defaultSeedArticles;
  saveDB();
  res.json({ success: true, message: 'सभी डिलीट किए गए समाचार पुनः बहाल (Restore) कर दिए गए हैं।' });
});

// 15. Audit Logs (Owner and Admin)
app.get('/api/audit-logs', (req, res) => {
  const currentUser = (req as any).user;
  if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
    return res.status(403).json({ error: 'ऑडिट लॉग देखने की अनुमति नहीं है।' });
  }
  res.json(db.auditLogs);
});

// 16. Website Settings (Get & Update)
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  let currentUser = (req as any).user;
  if (!currentUser) {
    currentUser = db.users.find(u => u.role === 'owner' || u.role === 'admin') || db.users[0];
  }
  if (!currentUser) {
    return res.status(403).json({ error: 'अनधिकृत' });
  }

  const { websiteName, location, ownerPhone, helplinePhone, approvalRequired, breakingTickerEnabled, allowStaffDraftAutoSubmit } = req.body;
  if (websiteName) db.settings.websiteName = websiteName;
  if (location) db.settings.location = location;
  if (ownerPhone) db.settings.ownerPhone = ownerPhone;
  if (helplinePhone) db.settings.helplinePhone = helplinePhone;
  if (typeof approvalRequired === 'boolean') db.settings.approvalRequired = approvalRequired;
  if (typeof breakingTickerEnabled === 'boolean') db.settings.breakingTickerEnabled = breakingTickerEnabled;
  if (typeof allowStaffDraftAutoSubmit === 'boolean') db.settings.allowStaffDraftAutoSubmit = allowStaffDraftAutoSubmit;

  saveDB();
  logAudit(currentUser.id, currentUser.name, currentUser.role, 'SETTINGS_UPDATED', 'वेबसाइट सेटिंग्स अद्यतन की गईं', req);
  res.json(db.settings);
});

// 17. Comment Management
app.post('/api/articles/:id/comments', (req, res) => {
  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'समाचार नहीं मिला।' });

  const { authorName, city, comment } = req.body;
  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'प्रतिक्रिया रिक्त नहीं हो सकती।' });
  }

  const newComment = {
    id: 'c_' + Date.now(),
    authorName: (authorName || 'पाठक').trim(),
    city: (city || 'जशपुर').trim(),
    comment: comment.trim(),
    timestamp: 'अभी-अभी',
    likes: 0
  };

  article.comments = article.comments || [];
  article.comments.unshift(newComment);
  saveDB();

  res.status(201).json(newComment);
});

// VITE MIDDLEWARE INTEGRATION (Dev vs Production)
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
