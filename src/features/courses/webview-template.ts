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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${safeTitle}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
      
      :root {
        color-scheme: light;
      }
      
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #f8fafc;
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
      }

      .hero {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        padding: 40px 24px 60px;
        color: #ffffff;
        border-bottom-left-radius: 32px;
        border-bottom-right-radius: 32px;
        margin-bottom: -30px;
      }

      .badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        color: #ffffff;
        border-radius: 999px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-bottom: 16px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 32px;
        line-height: 1.2;
        font-weight: 800;
        letter-spacing: -0.5px;
      }

      .meta {
        font-size: 15px;
        color: #bfdbfe;
        font-weight: 600;
      }

      .wrap {
        padding: 0 20px 40px;
      }

      .card {
        background: #ffffff;
        border-radius: 24px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      }

      .card-title {
        display: flex;
        align-items: center;
        margin: 0 0 16px;
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
      }

      .card-title svg {
        margin-right: 8px;
        width: 20px;
        height: 20px;
        color: #3b82f6;
      }

      p {
        margin: 0;
        line-height: 1.8;
        font-size: 15px;
        color: #475569;
      }

      .lesson-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .lesson-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #f1f5f9;
      }

      .lesson-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .lesson-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: #eff6ff;
        color: #2563eb;
        font-weight: 800;
        font-size: 14px;
        margin-right: 16px;
      }

      .lesson-text {
        font-size: 15px;
        font-weight: 600;
        color: #334155;
      }

      .payload {
        margin-top: 12px;
        border-radius: 16px;
        background: #0f172a;
        color: #e2e8f0;
        padding: 16px;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <span class="badge">${safeCategory}</span>
      <h1>${safeTitle}</h1>
      <div class="meta">By ${safeInstructor}</div>
    </header>

    <main class="wrap">
      <section class="card">
        <h2 class="card-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Overview
        </h2>
        <p>${safeDescription}</p>
      </section>

      <section class="card">
        <h2 class="card-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          Lesson Plan
        </h2>
        <ul class="lesson-list">
          <li class="lesson-item">
            <div class="lesson-number">1</div>
            <div class="lesson-text">Foundation concepts and setup</div>
          </li>
          <li class="lesson-item">
            <div class="lesson-number">2</div>
            <div class="lesson-text">Guided implementation walkthrough</div>
          </li>
          <li class="lesson-item">
            <div class="lesson-number">3</div>
            <div class="lesson-text">Practical exercise and quiz</div>
          </li>
          <li class="lesson-item">
            <div class="lesson-number">4</div>
            <div class="lesson-text">Project assignment and next steps</div>
          </li>
        </ul>
      </section>

      <section class="card">
        <h2 class="card-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          Native Context Data
        </h2>
        <p>This data is injected seamlessly from React Native into this WebView environment.</p>
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
