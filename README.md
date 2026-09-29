# OralEval frontend

Next.js interface for the OralEval evidence-based oral assessment workflow.

## Backend connection

The interface sends the uploaded submission to the FastAPI workflow, displays the returned
evidence and questions, then submits each student answer as form data for evaluation.

The demonstration uses **Programming Fundamentals with Python / Data Structures** and
shows both the teacher knowledge aspects (`know-what`, `know-how`, `know-why`) and the
five evaluation criteria. The backend generates a private task pool with two tasks per
criterion. Every task is presented once, regardless of the score, following the cognitive
progression `What → How → Why → What-if`.

Copy the local configuration:

```bash
cp .env.local.example .env.local
```

The default configuration expects the backend at `http://localhost:8000`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run

Start the backend first, then launch the frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```
