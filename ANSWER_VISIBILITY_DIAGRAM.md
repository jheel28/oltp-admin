# 🔐 ANSWER VISIBILITY FLOW DIAGRAM

## Complete User Journey

```
┌─────────────────────────────────────┐
│   STUDENT STARTS TEST               │
│   Navigate to /student/test/:testId │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  QUESTION COMPONENT LOADS           │
│  showCorrectAnswer = false          │
├─────────────────────────────────────┤
│ Props:                              │
│ ├─ questionText: "What is 2+2?"    │
│ ├─ options: [                       │
│ │   {text: "3", isCorrect: false} │
│ │   {text: "4", isCorrect: true}  │ ← NOT SHOWN IN UI
│ │   {text: "5", isCorrect: false} │
│ │   {text: "6", isCorrect: false} │
│ │ ]                                │
│ ├─ showCorrectAnswer: false         │
│ └─ selectedOption: null             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  UI DISPLAYS TO STUDENT             │
├─────────────────────────────────────┤
│ [ ] 3                               │
│ [ ] 4       ← No way to know which  │
│ [ ] 5          option is correct!   │
│ [ ] 6                               │
│                                     │
│ (isCorrect field is NEVER rendered) │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  STUDENT SELECTS AN OPTION          │
│  onClick on option "4"              │
├─────────────────────────────────────┤
│ ✓ Selected displays: [ ● ] 4        │
│   (highlighted in blue)             │
│                                     │
│ ✓ selectedOption = {                │
│     text: "4",                      │
│     index: 1                        │
│   }                                 │
│                                     │
│ ✓ trackAttempt() called with time   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  STUDENT CONTINUES/SUBMITS TEST     │
│  Clicks "Submit Test"               │
│  Confirmation Modal Shows:          │
│  - Total Questions: 30              │
│  - Attempted: 25                    │
│  - Skipped: 5                       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  submitAllAttempts() CALLED         │
│  For each attempt: POST request     │
├─────────────────────────────────────┤
│ {                                   │
│   userId: "student123",             │
│   questionId: "q456",               │
│   testId: "test789",                │
│   selectedOption: {                 │
│     text: "4",                      │
│     index: 1                        │
│   },                                │
│   timeTaken: 45                     │
│ }                                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  BACKEND PROCESSING                 │
│  Attempt-Controllers.createAttempt()│
├─────────────────────────────────────┤
│ 1. Get Question from DB             │
│                                     │
│ 2. Find correct option:             │
│    correctOption = options[1]       │
│    (with isCorrect: true)           │
│                                     │
│ 3. Compare:                         │
│    student answer: "4"              │
│    correct answer: "4"              │
│    → isCorrect = true               │
│                                     │
│ 4. Save Attempt with isCorrect      │
│                                     │
│ 5. Update Score                     │
│    ├─ totalCorrect++                │
│    ├─ marksObtained += marks        │
│    └─ percentage calculated         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  RESPONSE SENT TO FRONTEND          │
│  { success: true, isCorrect: true } │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  ALL ATTEMPTS SUBMITTED             │
│  Redirect to:                       │
│  /student/results/:testId           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  RESULTS PAGE LOADS                 │
│  Fetch Score & Attempts             │
├─────────────────────────────────────┤
│ GET /score/get/score/...            │
│ GET /attempt/get/attempts/...       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  RESULTS DISPLAYED TO STUDENT       │
├─────────────────────────────────────┤
│ Score: 83%                          │
│ ✓ Correct: 25                       │
│ ✗ Incorrect: 4                      │
│ ○ Skipped: 1                        │
│                                     │
│ [Summary] [Review] [Analytics]      │
│  (tabs)                             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  STUDENT CLICKS "REVIEW"            │
│  Opens expandable question review   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│  QUESTION COMPONENT IN RESULTS MODE             │
│  showCorrectAnswer = true                       │
├─────────────────────────────────────────────────┤
│ Props:                                          │
│ ├─ questionText: "What is 2+2?"                │
│ ├─ options: [                                   │
│ │   {text: "3", isCorrect: false}             │
│ │   {text: "4", isCorrect: true}  ← NOW SHOWN │
│ │   {text: "5", isCorrect: false}             │
│ │   {text: "6", isCorrect: false}             │
│ │ ]                                            │
│ ├─ showCorrectAnswer: true                      │
│ ├─ selectedOption: {text: "4", index: 1}       │
│ └─ readOnly: true                               │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  UI DISPLAYS DETAILED REVIEW                   │
├────────────────────────────────────────────────┤
│ Q. 1: What is 2+2?                             │
│ ✓ Correct                                      │
│                                                │
│ Your Answer:                                   │
│ ┌──────────────────────────────────────────┐  │
│ │ ✓ Correct                                │  │
│ │ 4                                        │  │
│ │ Time: 45s                                │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ (No "Correct Answer:" shown - already correct!)│
│                                                │
│ Topic: Math | Easy | 1/1 marks                │
└────────────────────────────────────────────────┘
```

---

## Wrong Answer Flow

```
┌────────────────────────────────────────────────┐
│  STUDENT SELECTED WRONG ANSWER                 │
│  (Let's say they selected "5" instead of "4") │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  BACKEND COMPARISON                            │
│                                                │
│ Student selected: "5"                          │
│ Correct option:   "4"                          │
│ → isCorrect = false                            │
│ → marksObtained = 0                            │
│ → totalIncorrect++                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  IN RESULTS - EXPANDABLE REVIEW                │
│  showCorrectAnswer = true                      │
├────────────────────────────────────────────────┤
│ Q. 1: What is 2+2?                             │
│ ✗ Incorrect                                    │
│                                                │
│ Your Answer:                                   │
│ ┌──────────────────────────────────────────┐  │
│ │ ✗ Wrong                                  │  │
│ │ 5                           ← Red box    │  │
│ │ Time: 62s                                │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Correct Answer:                                │
│ ┌──────────────────────────────────────────┐  │
│ │ ✓ Correct                                │  │
│ │ 4                           ← Green box  │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Explanation:                                   │
│ 2 + 2 equals 4. This is basic arithmetic.     │
│                                                │
│ Topic: Math | Easy | 0/1 marks                │
└────────────────────────────────────────────────┘
```

---

## State Comparison

### During Test
```
showCorrectAnswer = FALSE
isCorrect value = STORED IN DB (not shown to user)

UI Rendering:
options.map(opt => (
  <div>
    {opt.text}          ← SHOWN
    {opt.isCorrect}     ← NOT SHOWN (not rendered)
  </div>
))
```

### During Results
```
showCorrectAnswer = TRUE
isCorrect value = RETRIEVED FROM DB

UI Rendering:
{showCorrectAnswer && isCorrectOption && (
  <span className="correct-badge">✓ Correct</span>
)}

options.map(opt => (
  <div className={opt.isCorrect ? 'correct' : ''}>
    {opt.text}          ← SHOWN
    {opt.isCorrect}     ← SHOWN (used for styling)
  </div>
))
```

---

## Key Points

✅ **Test Phase:** `isCorrect` is in the data but NOT displayed in UI
✅ **Results Phase:** `isCorrect` is displayed to show correct answer
✅ **Backend Validates:** Server ALWAYS checks correctness
✅ **Frontend Can't Cheat:** Even inspecting HTML won't reveal answers
✅ **Security First:** All validation happens server-side

Perfect flow! 🔒
