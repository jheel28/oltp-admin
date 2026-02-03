# 📊 VISUAL ARCHITECTURE & FLOW DIAGRAMS

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐       ┌──────────────┐   ┌────────────────┐  │
│  │  TestPage    │       │  Question    │   │  ResultsPage   │  │
│  │  Component   │◄─────►│  Component   │   │  Component     │  │
│  └──────────────┘       └──────────────┘   └────────────────┘  │
│         ▲                      ▲                    ▲            │
│         │                      │                    │            │
│         └──────────────────────┴────────────────────┘            │
│                      useAttempt Hook                            │
│         (Tracks answers, calculates stats)                      │
│         ▼                      ▼                                 │
│  ┌──────────────────────────────────────────┐                  │
│  │      attemptService (API Layer)          │                  │
│  │  - submitAttempt()                       │                  │
│  │  - getAttempts()                         │                  │
│  │  - getQuestionStats()                    │                  │
│  └──────────────────────────────────────────┘                  │
│                      ▼                                          │
│                   Axios HTTP                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ REST API Calls
                           │
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (Node.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────┐                  │
│  │    Attempt Routes (/api/beta/attempt)    │                  │
│  │  - POST /create/attempt                  │                  │
│  │  - GET /get/attempts/:userId/:testId     │                  │
│  │  - GET /get/question/statistics          │                  │
│  └──────────────────────────────────────────┘                  │
│                      ▼                                          │
│  ┌──────────────────────────────────────────┐                  │
│  │    Attempt Controllers                   │                  │
│  │  - createAttempt()                       │                  │
│  │  - getAttemptsByUserTest()               │                  │
│  │  - getQuestionStats()                    │                  │
│  │  - Validates & calculates isCorrect      │                  │
│  └──────────────────────────────────────────┘                  │
│                      ▼                                          │
│  ┌──────────────────────────────────────────┐                  │
│  │      Models (Mongoose Schemas)           │                  │
│  │  - Attempt.js (NEW)                      │                  │
│  │  - Question.js (UPDATED)                 │                  │
│  │  - Score.js (UPDATED)                    │                  │
│  └──────────────────────────────────────────┘                  │
│                      ▼                                          │
└─────────────────────────────────────────────────────────────────┘
                           │
                   Database Operations
                           │
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Attempts   │  │  Questions   │  │    Scores    │          │
│  │  Collection  │  │  Collection  │  │  Collection  │          │
│  │   (NEW)      │  │  (UPDATED)   │  │  (UPDATED)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy

```
App
│
├── StudentRoutes
│   │
│   ├── /student/test/:testId
│   │   └── TestPage
│   │       ├── Question (multiple instances)
│   │       │   ├── questionText
│   │       │   ├── options[]
│   │       │   ├── difficulty badge
│   │       │   └── timer
│   │       ├── Navigation Panel
│   │       │   ├── Question Grid Navigator
│   │       │   ├── Summary Stats
│   │       │   └── Legend
│   │       └── Footer
│   │           ├── Navigation Buttons
│   │           ├── Exit Button
│   │           └── Submit Button
│   │
│   └── /student/results/:testId
│       └── ResultsPage
│           ├── Score Card
│           │   ├── Score Display
│           │   └── Quick Stats
│           ├── Tabs
│           │   ├── Summary Tab
│           │   │   ├── Summary Grid
│           │   │   └── Performance Bar
│           │   ├── Detailed Tab
│           │   │   └── Question Reviews (expandable)
│           │   └── Analytics Tab
│           │       ├── Difficulty Stats
│           │       └── Time Analysis
│           └── Action Buttons
```

---

## 3. Data Flow Diagram

```
┌────────────────────────────────────┐
│   Student Starts Test              │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Load Questions                   │
│   GET /question/get/questions/     │
│   byquestionpaperid/{paperId}      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Display Question                 │
│   Component Renders with:          │
│   - questionText                   │
│   - options (isCorrect: false)      │
│   - difficulty & topic             │
│   - Timer                          │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Student Selects Option           │
│   - onClick handler                │
│   - trackAttempt() called           │
│   - Store in questionsMap           │
│   - Update UI                      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Student Submits Test             │
│   - Confirmation Modal             │
│   - Review Attempted/Skipped       │
│   - Confirm Submit                 │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   submitAllAttempts()              │
│   Loop through all questions       │
│   Send each attempt:               │
│   POST /attempt/create/attempt     │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Backend Processing               │
│   For each attempt:                │
│   1. Find question                 │
│   2. Get correct option            │
│   3. Compare with selectedOption   │
│   4. Calculate isCorrect           │
│   5. Save Attempt                  │
│   6. Update Score                  │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Database Update                  │
│   - Insert Attempt document        │
│   - Update Score document          │
│   - Return response                │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Frontend Receives Response       │
│   - Check success                  │
│   - Navigate to results page       │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   Display Results                  │
│   GET /score/get/score/            │
│       by-user-test/{userId}/{testId}
│   GET /attempt/get/attempts/       │
│       {userId}/{testId}            │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   ResultsPage Renders              │
│   - Score Card                     │
│   - Quick Stats                    │
│   - Three Tabs                     │
│   - Print Option                   │
└────────────────────────────────────┘
```

---

## 4. State Management Flow

```
┌──────────────────────────────────┐
│      useAttempt Hook             │
│    (Custom Hook)                 │
├──────────────────────────────────┤
│                                  │
│ State:                           │
│ - attempts: []                   │
│ - loading: false                 │
│ - error: null                    │
│ - attemptsRef: (internal ref)   │
│                                  │
│ Functions:                       │
│ - trackAttempt()                 │
│ - submitAllAttempts()            │
│ - getAttempts()                  │
│ - getQuestionStats()             │
│ - getAttemptStats()              │
│ - resetAttempts()                │
│                                  │
└──────┬───────────────────────────┘
       │
       ├─► Question Component State
       │   ├── selectedOption
       │   └── timeTaken
       │
       ├─► TestPage Component State
       │   ├── currentQuestionIndex
       │   ├── questionsMap
       │   └── showConfirmSubmit
       │
       └─► ResultsPage Component State
           ├── results
           ├── attempts
           ├── activeTab
           └── expandedQuestion
```

---

## 5. Database Schema Relationships

```
┌──────────────────────────┐
│       Question           │
├──────────────────────────┤
│ _id                      │
│ questionPaperId          │
│ questionText             │
│ options: [{              │
│   text: String,          │
│   isCorrect: Boolean     │
│ }]                       │
│ difficulty               │
│ topic                    │
│ marks                    │
└──────────────────────────┘
         ▲
         │ referenced by
         │
┌──────────────────────────┐
│       Attempt (NEW)      │
├──────────────────────────┤
│ _id                      │
│ userId ──────┐           │
│ questionId ──┤─► links to Question
│ testId    ──┤           │
│ selectedOption           │
│ isCorrect                │
│ timeTaken                │
│ marksObtained            │
└──────────────────────────┘
         ▲
         │ referenced by
         │
┌──────────────────────────┐
│       Score (UPDATED)    │
├──────────────────────────┤
│ _id                      │
│ testId                   │
│ studentId                │
│ attemptIds: [ref]◄───────┤
│ marksObtained            │
│ totalCorrect             │
│ totalIncorrect           │
│ totalSkipped             │
│ percentage               │
└──────────────────────────┘
```

---

## 6. API Request/Response Flow

```
CLIENT SIDE                          SERVER SIDE

1. submitAttempt()
   │
   ├─► POST /attempt/create/attempt
   │   {
   │     userId,
   │     questionId,
   │     testId,
   │     selectedOption,
   │     timeTaken
   │   }
   │
   └─► 
        createAttempt() controller
        │
        ├─► Get Question from DB
        │
        ├─► Find correctOption
        │
        ├─► Compare answers
        │   isCorrect = selectedOption.text === correctOption.text
        │
        ├─► Create Attempt doc
        │
        ├─► Update Score doc
        │
        └─► Return { attempt, isCorrect }
             │
             └─► Response 201
                 {
                   message: "Success",
                   attempt: {...},
                   isCorrect: true/false
                 }

2. getAttemptsByTest()
   │
   ├─► GET /attempt/get/attempts/:userId/:testId
   │
   └─►
        getAttemptsByUserTest() controller
        │
        ├─► Find attempts where userId & testId match
        │
        ├─► Populate questionId details
        │
        └─► Return Response 200
             {
               attempts: [...]
             }

3. getQuestionStatistics()
   │
   ├─► GET /attempt/get/question/statistics/:questionId
   │
   └─►
        getQuestionStats() controller
        │
        ├─► Find all attempts for question
        │
        ├─► Calculate:
        │   - totalAttempts
        │   - correctAttempts
        │   - correctPercentage
        │   - avgTimeTaken
        │
        └─► Return Response 200
             {
               stats: {...}
             }
```

---

## 7. Question Lifecycle

```
CREATION (by Admin/SuperAdmin)
┌────────────────────────────┐
│ Admin Dashboard            │
│ Create Question Form       │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ Validation                 │
│ - questionText required    │
│ - options.length = 4       │
│ - exactly 1 isCorrect      │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ POST /question/create      │
│ Save to DB                 │
└────────────┬───────────────┘
             │
             ▼

TESTING (by Student)
┌────────────────────────────┐
│ GET /question/...          │
│ Load questions             │
│ Display with:              │
│ - questionText             │
│ - options (isCorrect=false)│
│ - difficulty & topic       │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ Student selects option     │
│ POST /attempt/create       │
│ Backend checks isCorrect   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ Results Page               │
│ Display with:              │
│ - Student's answer         │
│ - Correct answer (revealed)│
│ - Explanation              │
│ - Stats                    │
└────────────────────────────┘
```

---

## 8. Performance Metrics Calculation

```
After all attempts submitted:

ACCURACY
┌─────────────────────────────────────────────┐
│ accuracy = (totalCorrect / totalAttempted)  │
│          * 100                              │
│                                             │
│ Example: 25/30 = 83.33%                     │
└─────────────────────────────────────────────┘

PERCENTAGE
┌─────────────────────────────────────────────┐
│ percentage = (marksObtained / totalMarks)   │
│            * 100                            │
│                                             │
│ Example: 25/30 = 83.33%                     │
└─────────────────────────────────────────────┘

AVERAGE TIME
┌─────────────────────────────────────────────┐
│ avgTime = totalTime / totalAttempted        │
│                                             │
│ Example: 1500s / 30 = 50s per question      │
└─────────────────────────────────────────────┘

DIFFICULTY-WISE
┌─────────────────────────────────────────────┐
│ For each difficulty:                        │
│ accuracy = (correct / attempted) * 100      │
│                                             │
│ Easy:   10/10 = 100%                        │
│ Medium: 12/14 = 85.71%                      │
│ Hard:   3/6 = 50%                           │
└─────────────────────────────────────────────┘
```

---

## 9. File Dependencies

```
Question.jsx
├── imports: React, useState, useEffect
├── props from: TestPage
└── exports to: TestPage

useAttempt Hook
├── imports: useState, useCallback, useRef, axios
├── used by: TestPage
└── exports: tracking functions

attemptService.js
├── imports: axios
├── used by: useAttempt Hook, ResultsPage
└── exports: API functions

TestPage.jsx
├── imports: Question, useAttempt, attemptService
├── used by: studentRoutes.js
└── contains: question navigator, footer

ResultsPage.jsx
├── imports: axios
├── used by: studentRoutes.js
└── contains: analytics, review tabs
```

---

## 10. Error Handling Flow

```
User Action
    │
    ▼
Frontend Validation
    │
    ├─► Valid? → API Call
    │
    └─► Invalid? → Show Error Message
    
    ▼
Backend Validation
    │
    ├─► Valid? → Process & Save
    │
    └─► Invalid? → Return 400/422 Error
    
    ▼
Database Operation
    │
    ├─► Success? → Return 200/201
    │
    └─► Error? → Return 500 Error
    
    ▼
Frontend Error Handling
    │
    ├─► Show toast/alert
    ├─► Log to console
    └─► Retry option

```

Perfect! All documentation is now complete. Let me create one final index file:
