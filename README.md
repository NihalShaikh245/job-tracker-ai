# 🚀 JobTracker AI – Technical README

An **AI-powered job tracking system** focused on intelligent job matching, application tracking, and scalable architecture.

---

## a) 🏗️ Architecture Diagram & Flow

```
User
  │
  ▼
React Frontend (Vercel)
  │  REST API Calls
  ▼
Fastify Backend (Render)
  │
  ├─ Job Data → RapidAPI / Mock API
  ├─ AI Matching Service (Keyword / GPT-ready)
  └─ Cache Layer (Redis – optional)
```

**Flow Explanation**:

1. User searches jobs or opens dashboard
2. Frontend requests job data from backend
3. Backend fetches jobs → runs AI matching
4. Scores + explanations returned to frontend
5. Apply actions stored in application state

---

## b) ⚙️ Setup Instructions (Local)

### Prerequisites

* Node.js 18+
* npm or yarn
* Git

### Environment Variables

**Backend (.env)**

```env
OPENAI_API_KEY=your_key_here
RAPIDAPI_KEY=your_key_here
```

**Frontend (.env)**

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Run Locally

```bash
git clone https://github.com/NihalShaikh245/job-tracker-ai.git
cd job-tracker-ai
npm install
npm run dev
```

---

## c) 🤖 AI Matching Logic

**Approach**:

* Extract skills from resume & job description
* Assign weighted scores to matched skills
* Normalize score to 0–100%

**Formula (Simplified)**:

```
Match % = (Matched Skills / Required Skills) × 100
```

**Efficiency Considerations**:

* Lightweight keyword matching (O(n))
* Cached job data reduces API calls
* GPT integration optional & async

---

## d) 🧠 Critical Thinking – Apply Popup Flow

**Why Popup?**

* Confirms real user intent
* Prevents accidental application tracking

**Flow**:

1. User clicks "Apply"
2. Popup asks for confirmation
3. Job opens in new tab
4. Status saved as "Applied"

**Edge Cases Handled**:

* Duplicate applications prevented
* Cancel action does not store data

**Alternatives Considered**:

* Auto-apply (rejected due to false positives)
* Manual form entry (slower UX)

---

## e) 📈 Scalability Considerations

* **100 jobs/search**: Client-side pagination + filtering
* **10,000 users**:

  * Stateless backend APIs
  * Redis caching for job searches
  * Horizontal scaling on Render

Future-ready for:

* Auth-based sharding
* Queue-based AI processing

---

## f) ⚖️ Tradeoffs & Limitations

**Current Tradeoffs**:

* Keyword-based AI instead of full NLP (faster, cheaper)
* No authentication (simpler demo focus)

**With More Time**:

* Resume parsing (PDF/Doc)
* True ML-based semantic matching
* Persistent database (PostgreSQL)
* User profiles & auth

---

## 👨‍💻 Author

**Nihal Shaikh**
MCA Student | Full Stack Developer | AI Enthusiast

---

⭐ Designed to demonstrate architecture, AI logic, and critical engineering thinking
