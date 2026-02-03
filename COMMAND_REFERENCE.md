# ⚡ Command Reference - Quick Copy & Paste

## 🚀 Get Started (Copy & Paste)

### Terminal 1: Backend

```bash
cd backend
npm start
```

Expected output:
```
Server running on port 5000
```

### Terminal 2: Frontend

```bash
cd oltp-frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view oltp-frontend in the browser.
http://localhost:3000
```

---

## 🧪 Test APIs (Using cURL)

### Test 1: Get All Questions

```bash
curl http://localhost:5000/api/questions
```

### Test 2: Get Questions by Test ID

```bash
curl http://localhost:5000/api/questions/test123
```

### Test 3: Submit Answer

```bash
curl -X POST http://localhost:5000/api/answer \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "PASTE_QUESTION_ID_HERE",
    "selectedOption": 0,
    "userId": "student1",
    "testId": "test123"
  }'
```

### Test 4: Get Statistics

```bash
curl "http://localhost:5000/api/answer/stats?userId=student1&testId=test123"
```

---

## 📊 Test via Browser

### URL 1: View API Response
```
http://localhost:5000/api/questions
```

### URL 2: Test Frontend
```
http://localhost:3000/student/test/test123
```

---

## 📝 Files to Create/Update

### Create These Files

**Backend:**
```bash
# Copy file contents from provided code
touch backend/Controllers/QuestionAPI-Controllers.js
touch backend/Routes/QuestionAPI-Routes.js
```

**Frontend:**
```bash
# Create hooks folder
mkdir -p oltp-frontend/src/hooks

# Copy file contents
touch oltp-frontend/src/components/TestPage-Enhanced.jsx
touch oltp-frontend/src/components/TestPage-Enhanced.css
touch oltp-frontend/src/hooks/useTestQuestions.js
```

### Update These Files

**Backend (app.js):**

Add these lines:
```javascript
const questionAPIRoutes = require("./Routes/QuestionAPI-Routes");
```

And:
```javascript
app.use("/api", questionAPIRoutes);
```

**Frontend (studentRoutes.js):**

Add import:
```javascript
import TestPageEnhanced from "@/components/TestPage-Enhanced";
```

Add route:
```javascript
{
  path: "/test/:testId",
  element: <TestPageEnhanced />,
}
```

---

## 🔍 Debugging Commands

### Check Backend is Running

```bash
curl http://localhost:5000/
```

Expected: `{"message":"Hello World"}`

### Check Frontend is Running

```bash
curl http://localhost:3000/
```

Expected: HTML response

### View Backend Logs

```bash
# Terminal should show requests like:
GET /api/questions 200
POST /api/answer 200
GET /api/answer/stats 200
```

### Check Node Version

```bash
node -v
npm -v
```

### Install Dependencies (If needed)

```bash
cd backend && npm install
cd oltp-frontend && npm install
```

---

## 🛠️ Common Fixes

### Fix: "Cannot find module 'QuestionAPI-Routes'"

**Solution:** Check import in app.js
```bash
# Correct spelling and path
const questionAPIRoutes = require("./Routes/QuestionAPI-Routes");
```

### Fix: CORS Error in Browser

**Solution:** CORS already enabled in app.js, but verify:
```javascript
const cors = require("cors");
app.use(cors());
```

### Fix: "Module not found" for TestPage-Enhanced

**Solution:** Check path matches exactly:
```javascript
import TestPageEnhanced from "@/components/TestPage-Enhanced";
// or
import TestPageEnhanced from "./components/TestPage-Enhanced";
```

### Fix: CSS not Loading

**Solution:** Import CSS in component:
```javascript
import "./TestPage-Enhanced.css";
```

### Fix: API Returns 404

**Solution:** Verify route registered in app.js:
```javascript
app.use("/api", questionAPIRoutes);
```

---

## 📱 Test on Mobile

### Access from Phone (Same Network)

```
Find your computer IP:
Windows: ipconfig (look for IPv4 Address)
Mac: ifconfig (look for inet)

Then visit:
http://YOUR_IP:3000/student/test/test123
```

---

## 🗂️ File Checklist

### Backend Files
- ✅ `backend/Controllers/QuestionAPI-Controllers.js` (NEW)
- ✅ `backend/Routes/QuestionAPI-Routes.js` (NEW)
- ✅ `backend/app.js` (UPDATED - add 2 lines)

### Frontend Files
- ✅ `oltp-frontend/src/components/TestPage-Enhanced.jsx` (NEW)
- ✅ `oltp-frontend/src/components/TestPage-Enhanced.css` (NEW)
- ✅ `oltp-frontend/src/hooks/useTestQuestions.js` (NEW)
- ✅ `oltp-frontend/src/studentRoutes.js` (UPDATED)

### Documentation Files
- ✅ `API_DOCUMENTATION.md` (NEW)
- ✅ `QUICK_START_API.md` (NEW)
- ✅ `IMPLEMENTATION_COMPLETE.md` (NEW)
- ✅ `VISUAL_ARCHITECTURE.md` (NEW)

---

## 🔗 Important URLs

### Development URLs

```
Backend: http://localhost:5000
Frontend: http://localhost:3000

APIs:
GET  http://localhost:5000/api/questions
GET  http://localhost:5000/api/questions/:testId
POST http://localhost:5000/api/answer
GET  http://localhost:5000/api/answer/stats

Pages:
http://localhost:3000/student/test/test123
```

---

## 📊 Request Examples

### Minimal Question Submission

```bash
curl -X POST http://localhost:5000/api/answer \
  -H "Content-Type: application/json" \
  -d '{"questionId":"123","selectedOption":0}'
```

### Full Question Submission (With Tracking)

```bash
curl -X POST http://localhost:5000/api/answer \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "5f9c4ab08a0b9e5c8c6d7e8f",
    "selectedOption": 1,
    "userId": "student123",
    "testId": "test456"
  }'
```

### Get All Test Attempts

```bash
curl "http://localhost:5000/api/answer/stats?userId=student123&testId=test456"
```

---

## 🎯 Quick Integration Checklist

- [ ] Copy backend files
- [ ] Update app.js (2 lines)
- [ ] Copy frontend components
- [ ] Copy useTestQuestions hook
- [ ] Update studentRoutes.js
- [ ] Start backend: `npm start`
- [ ] Start frontend: `npm start`
- [ ] Test: http://localhost:3000/student/test/test123
- [ ] Select options and submit
- [ ] View results page
- [ ] Check browser console for errors
- [ ] Check backend terminal for logs

---

## 💾 Database Models (For Reference)

### Question Model

```javascript
{
  _id: ObjectId,
  questionText: String,
  difficulty: "Easy" | "Medium" | "Hard",
  topic: String,
  marks: Number,
  options: [
    {
      text: String,
      isCorrect: Boolean
    }
  ],
  explanation: String,
  createdBy: String,
  createdAt: Date
}
```

### Attempt Model

```javascript
{
  _id: ObjectId,
  userId: String,
  questionId: ObjectId,
  testId: ObjectId,
  selectedOption: String,
  isCorrect: Boolean,
  timeTaken: Number,
  marksObtained: Number,
  createdAt: Date
}
```

---

## 🎨 CSS Classes Reference

```css
/* Main container */
.test-container

/* Loading */
.loading-container
.loader
.spinner

/* Progress */
.progress-bar-container
.progress-bar

/* Question */
.question-card
.question-header
.question-text
.question-meta

/* Options */
.options-container
.option-btn
.option-btn.selected
.option-label
.option-text
.checkmark

/* Buttons */
.btn
.btn-primary
.btn-secondary
.button-group

/* Navigation */
.question-navigator
.navigator-grid
.nav-btn
.nav-btn.active

/* Results */
.results-container
.results-card
.results-stats
.stat
.stat-value
```

---

## 🚨 Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module 'QuestionAPI-Routes'` | Wrong path in require | Check exact filename and path |
| `API returns 404` | Route not registered | Add `app.use("/api", questionAPIRoutes)` to app.js |
| `CORS error in browser` | Missing CORS setup | Ensure `app.use(cors())` in app.js |
| `Questions not loading` | API not returning data | Check database has questions with correct schema |
| `isCorrect shown to student` | Frontend displaying it | Ensure backend doesn't send `isCorrect` in response |
| `CSS not applied` | CSS file not imported | Add `import "./TestPage-Enhanced.css"` to component |
| `Button click not working` | Missing onClick handler | Verify `handleOptionSelect` is called |
| `Loading bar doesn't move` | loading state not updating | Check `setLoading(false)` after API call |

---

## 📚 File Sizes Reference

| File | Lines | Size |
|------|-------|------|
| QuestionAPI-Controllers.js | 300 | ~12 KB |
| QuestionAPI-Routes.js | 20 | ~0.5 KB |
| TestPage-Enhanced.jsx | 280 | ~11 KB |
| TestPage-Enhanced.css | 600+ | ~25 KB |
| useTestQuestions.js | 150 | ~6 KB |

**Total New Code:** ~1100 lines, ~54 KB

---

## ✅ Completion Status

```
Backend:   ✅ Ready to run
Frontend:  ✅ Ready to run
APIs:      ✅ All 4 endpoints configured
Database:  ✅ Models in place
Security:  ✅ Server-side validation
UI:        ✅ Responsive with animations
Docs:      ✅ Complete documentation
Testing:   ✅ Ready for QA
```

---

## 🎯 Next Steps

1. **Setup Files** (10 minutes)
   - Copy all backend files
   - Copy all frontend files
   - Update app.js and routes

2. **Test Backend** (5 minutes)
   - Start backend
   - Test APIs with curl
   - Check database

3. **Test Frontend** (5 minutes)
   - Start frontend
   - Visit test page
   - Select options

4. **Verify** (5 minutes)
   - Check all questions load
   - Submit answers
   - View results
   - Check statistics

5. **Deploy** (Optional)
   - Build frontend: `npm run build`
   - Deploy to server
   - Configure production API URL

---

**Total Setup Time: 25 minutes ⏱️**

**Status: 🟢 READY TO DEPLOY**
