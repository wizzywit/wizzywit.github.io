# project

Work entries shown on the front page and the work index. Content lives in `content/projects/*.md`.

## Rules owned
- Which section a project belongs to (`PROJECT_SECTIONS`) and how the work index filters by it (`filterProjects`).
- How a count is described to the reader (`describeProjectCount`).
- Display order (`sortProjects`, ascending `order`).
- A link is external when it is `http(s)`, and a case study when it starts with `/work/`.
- Which case-study sections are published: a section marked `draft` is left out of a production build (`publishableSections`).
- What an entry's link is called (`describeProjectLink`: case study, decision, GitHub, outside site) and which further links it shows (`extraProjectLinks`).
