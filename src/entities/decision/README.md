# decision

Architecture decision records shown in the decision log and on each ADR page. Content lives in `content/decisions/*.yaml`.

## Rules owned
- How a decision number is shown (`formatDecisionNumber`: "ADR 02") and the order of the log (`sortDecisions`).
- Which decisions count as related to one another (`relatedDecisions`: known slugs only, never itself).
- The status vocabulary: proposed, accepted, superseded, and how each is shown (`formatDecisionStatus`).
- The `TechArticle` structured data for an ADR page (`buildTechArticleJsonLd`).
