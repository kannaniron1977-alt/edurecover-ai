# EduRecover AI - Learn. Understand. Improve. Unlock.
Run (Node 18+):
```
npm install          # installs root + server + client
cp server/.env.example server/.env   # add ANTHROPIC_API_KEY (optional - rule-based fallback works without it)
npm run dev          # client http://localhost:5173  API :3001
```
Flow: Signup -> camera presence -> Dashboard -> lesson -> quiz (answer + reasoning) -> LLM diagnosis -> Socratic coaching (3 stages) -> fresh retest -> learner state/concept map/coins update -> unlock next course (80% or 1000 coins).
Teacher: signup with role "teacher" to see evidence, diagnosis, confidence, interventions, concept graphs.
Safety: API key only in server/.env; student text is treated as data; server blocks answer leakage in stages 1-2; no face images stored.
Not built yet: teacher notes editor, Tamil UI strings (AI replies follow language), charts, real face identity matching.
