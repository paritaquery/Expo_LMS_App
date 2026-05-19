import type { Course } from '@/types/course';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildCourseWebviewHtml(course: Course) {
  const safeTitle = escapeHtml(course.title);
  const safeDescription = escapeHtml(course.description);
  const safeInstructor = escapeHtml(course.instructorName);
  const safeCategory = escapeHtml(course.category ?? 'General');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        color: #0f172a;
      }
      .wrap {
        max-width: 860px;
        margin: 0 auto;
        padding: 24px 20px 40px;
      }
      .badge {
        display: inline-block;
        background: #dbeafe;
        color: #1d4ed8;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.3px;
      }
      h1 {
        margin: 14px 0 10px;
        font-size: 32px;
        line-height: 1.2;
      }
      .meta {
        margin-bottom: 20px;
        font-size: 14px;
        color: #475569;
      }
      .card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 18px;
        margin-top: 12px;
      }
      .payload {
        margin-top: 16px;
        border-radius: 12px;
        background: #0f172a;
        color: #e2e8f0;
        padding: 12px;
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
      }
      h2 {
        margin: 0 0 10px;
        font-size: 18px;
      }
      p {
        margin: 0;
        line-height: 1.7;
      }
      ul {
        margin: 0;
        padding-left: 20px;
      }
      li {
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <span class="badge">${safeCategory}</span>
      <h1>${safeTitle}</h1>
      <div class="meta">Instructor: ${safeInstructor}</div>

      <section class="card">
        <h2>Overview</h2>
        <p>${safeDescription}</p>
      </section>

      <section class="card">
        <h2>Lesson Plan</h2>
        <ul>
          <li>Lesson 1: Foundation concepts and setup</li>
          <li>Lesson 2: Guided implementation walkthrough</li>
          <li>Lesson 3: Practical exercise and quiz</li>
          <li>Lesson 4: Project assignment and next steps</li>
        </ul>
      </section>

      <section class="card">
        <h2>Native Payload (Headers)</h2>
        <div id="native-payload" class="payload">Waiting for native payload...</div>
      </section>
    </main>
    <script>
      (function () {
        try {
          var payload = window.__NATIVE_PAYLOAD__ || null;
          var node = document.getElementById('native-payload');
          if (!node) return;
          if (!payload) {
            node.textContent = 'No native payload found.';
            return;
          }
          node.textContent = JSON.stringify(payload, null, 2);
        } catch (error) {
          var fallback = document.getElementById('native-payload');
          if (fallback) {
            fallback.textContent = 'Payload read failed.';
          }
        }
      })();
    </script>
  </body>
</html>`;
}
