import type { ZineIssue as ZineIssueData } from "../types";
import "./ZineIssue.css";

type ZineIssueProps = {
  issue: ZineIssueData;
};

function ZineIssue({ issue }: ZineIssueProps) {
  const article = issue.articles[issue.current_article];

  if (!article) {
    return (
      <section className="zine-issue" aria-live="polite">
        <h1>{issue.title}</h1>
        <p>{issue.description}</p>
        <p>No articles are available in this issue yet.</p>
      </section>
    );
  }

  const hasArticles = issue.articles.length > 0;

  return (
    <section className="zine-issue" aria-live="polite">
      <header className="zine-issue__header">
        <p className="zine-issue__kicker">Monthly Zine</p>
        <h1>{issue.title}</h1>
        <p>{issue.description}</p>
      </header>

      <article className="zine-article">
        <img
          className="zine-article__image"
          src={article.img_url}
          alt={article.title}
          loading="lazy"
        />

        <div className="zine-article__content">
          <p className="zine-article__meta">
            Article {issue.current_article + 1} of {issue.articles.length}
          </p>
          <h2>{article.title}</h2>
          <blockquote>{article.quote}</blockquote>
          <p>{article.summary}</p>
          <p className="zine-article__byline">By {article.byline}</p>

          <div className="zine-article__body">{article.children}</div>
        </div>
      </article>

      <nav className="zine-issue__nav" aria-label="Article pagination">
        <button
          type="button"
          onClick={issue.previous_page}
          disabled={!hasArticles}
        >
          Previous
        </button>
        <button type="button" onClick={issue.next_page} disabled={!hasArticles}>
          Next
        </button>
      </nav>
    </section>
  );
}

export default ZineIssue;
