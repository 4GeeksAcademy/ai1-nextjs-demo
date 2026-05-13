import { useState } from "react";
import ZineIssue from "./components/ZineIssue";
import type { ZineArticle, ZineIssue as ZineIssueData } from "./types";
import "./App.css";

function App() {
  const [currentArticle, setCurrentArticle] = useState(0);

  const articles: ZineArticle[] = [
    {
      img_url:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
      title: "How To Start a One-Page Zine",
      quote:
        "Constraint makes style. One page is enough to say something sharp.",
      summary:
        "A practical framework to go from blank page to finished zine issue in one focused evening.",
      byline: "Nia Calder",
      children: (
        <p>
          Start with one strong question, collect three short supporting ideas,
          then cut anything that does not serve your central angle.
        </p>
      ),
    },
    {
      img_url:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80",
      title: "Designing Editorial Rhythm",
      quote: "Readers do not skim randomly. They follow cadence.",
      summary:
        "Learn how headline scale, white space, pull quotes, and caption density can guide attention across a spread.",
      byline: "Marina Holt",
      children: (
        <p>
          Treat each section like a beat in music: open with impact, sustain
          with clarity, and close with a memorable note.
        </p>
      ),
    },
    {
      img_url:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
      title: "Writing Better Closing Paragraphs",
      quote: "Endings should echo the beginning, not repeat it.",
      summary:
        "Tactics for ending pieces with emotional lift, practical takeaway, and a reason to return for the next issue.",
      byline: "Theo Evans",
      children: (
        <p>
          Revisit your opening promise in a new light and leave readers with one
          action they can take immediately.
        </p>
      ),
    },
  ];

  const nextPage = () => {
    if (articles.length === 0) return;
    setCurrentArticle((prev) => (prev + 1) % articles.length);
  };

  const previousPage = () => {
    if (articles.length === 0) return;
    setCurrentArticle((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const issue: ZineIssueData = {
    title: "The Side-Stapled Dispatch",
    description:
      "Issue 07 explores structure, pacing, and visual texture for small editorial projects.",
    articles,
    current_article: currentArticle,
    next_page: nextPage,
    previous_page: previousPage,
  };

  return (
    <main className="app-shell">
      <ZineIssue issue={issue} />
    </main>
  );
}

export default App;
