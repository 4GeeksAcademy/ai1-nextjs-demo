import type React from "react";

export interface ZineIssue {
  title: string;
  description: string;
  articles: ZineArticle[];
  current_article: number;
  next_page: () => void;
  previous_page: () => void;
}

export interface ZineArticle {
  img_url: string;
  title: string;
  quote: string;
  summary: string;
  byline: string;
  children: React.ReactNode;
}
