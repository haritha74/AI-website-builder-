import json
import re
import ssl
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import certifi
from flask import current_app
from openai import OpenAI


SYSTEM_PROMPT = """You generate complete, production-ready single-page websites.
Return only strict JSON with keys: title, html, css, javascript, category, thumbnailColor.
HTML must be body content only. CSS and JavaScript must be plain strings.
Use semantic sections, responsive layout, accessible labels, and polished copy."""

_gemini_lock = Lock()
_gemini_next_index = 0


def generate_site(prompt):
    gemini_keys = current_app.config.get("GEMINI_API_KEYS") or []
    if gemini_keys:
        try:
            return _generate_with_gemini_round_robin(prompt, gemini_keys)
        except Exception as exc:
            current_app.logger.warning("Gemini generation failed; using local fallback: %s", _redact_error(str(exc)))
            return _generate_locally(prompt)

    openai_key = current_app.config.get("OPENAI_API_KEY")
    if openai_key:
        return _generate_with_openai(prompt, openai_key)
    return _generate_locally(prompt)


def _generate_with_openai(prompt, api_key):
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=current_app.config["OPENAI_MODEL"],
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )
    content = response.choices[0].message.content
    data = json.loads(content)
    return _normalize_generated_site(data, prompt)


def _generate_with_gemini_round_robin(prompt, api_keys):
    global _gemini_next_index

    with _gemini_lock:
        start_index = _gemini_next_index % len(api_keys)
        _gemini_next_index = (_gemini_next_index + 1) % len(api_keys)

    ordered_keys = api_keys[start_index:] + api_keys[:start_index]
    models = _gemini_model_order()
    last_error = None

    for model in models:
        for offset, api_key in enumerate(ordered_keys):
            try:
                result = _generate_with_gemini(prompt, api_key, model)
                with _gemini_lock:
                    _gemini_next_index = (start_index + offset + 1) % len(api_keys)
                return result
            except Exception as exc:
                last_error = exc
                current_app.logger.info(
                    "Gemini model/key attempt failed for %s; trying next option: %s",
                    model,
                    _redact_error(str(exc)),
                )

    raise RuntimeError(f"All configured Gemini API keys and models failed. Last error: {_redact_error(str(last_error))}")


def _generate_with_gemini(prompt, api_key, model):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "responseMimeType": "application/json",
        },
    }
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        ssl_context = _gemini_ssl_context()
        with urlopen(request, timeout=current_app.config["GEMINI_TIMEOUT_SECONDS"], context=ssl_context) as response:
            body = response.read().decode("utf-8")
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"Gemini connection failed: {exc.reason}") from exc

    parsed = json.loads(body)
    text = _extract_gemini_text(parsed)
    data = json.loads(_strip_json_fence(text))
    return _normalize_generated_site(data, prompt)


def _extract_gemini_text(payload):
    candidates = payload.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates.")
    parts = candidates[0].get("content", {}).get("parts") or []
    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise RuntimeError("Gemini returned an empty response.")
    return text


def _strip_json_fence(text):
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?\s*", "", stripped)
        stripped = re.sub(r"\s*```$", "", stripped)
    return stripped


def _is_retryable_gemini_error(exc):
    message = str(exc).lower()
    return any(
        marker in message
        for marker in [
            "429",
            "quota",
            "rate",
            "resource_exhausted",
            "too many requests",
            "api key not valid",
            "permission_denied",
            "403",
            "503",
            "unavailable",
            "overloaded",
            "high demand",
        ]
    )


def _gemini_model_order():
    configured = [current_app.config["GEMINI_MODEL"], *current_app.config.get("GEMINI_FALLBACK_MODELS", [])]
    ordered = []
    for model in configured:
        if model and model not in ordered:
            ordered.append(model)
    return ordered


def _redact_error(message):
    return re.sub(r"key=[A-Za-z0-9._-]+", "key=[redacted]", message or "")


def _gemini_ssl_context():
    if current_app.config.get("GEMINI_VERIFY_SSL", True):
        return ssl.create_default_context(cafile=certifi.where())
    current_app.logger.warning("Gemini SSL verification is disabled. Use this only for local development.")
    return ssl._create_unverified_context()


def _normalize_generated_site(data, prompt):
    return {
        "title": data.get("title") or _title_from_prompt(prompt),
        "html": data.get("html") or "",
        "css": data.get("css") or "",
        "javascript": data.get("javascript") or "",
        "category": data.get("category") or _category_from_prompt(prompt),
        "thumbnailColor": data.get("thumbnailColor") or "#0f172a",
    }


def _generate_locally(prompt):
    title = _title_from_prompt(prompt)
    category = _category_from_prompt(prompt)
    accent = _accent_for_category(category)
    html = f"""
<header class="site-header">
  <nav class="nav">
    <strong>{title}</strong>
    <div>
      <a href="#work">Work</a>
      <a href="#features">Features</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>
  <section class="hero">
    <p class="eyebrow">{category.title()} website</p>
    <h1>{title}</h1>
    <p>Built around your brief: {prompt[:180]}</p>
    <a class="button" href="#contact">Start a conversation</a>
  </section>
</header>
<main>
  <section id="features" class="grid-section">
    <article><h2>Fast Experience</h2><p>Responsive pages, focused content, and smooth interactions for every visitor.</p></article>
    <article><h2>Conversion Ready</h2><p>Clear calls to action, structured sections, and accessible forms.</p></article>
    <article><h2>Brand System</h2><p>Consistent colors, spacing, typography, and reusable content blocks.</p></article>
  </section>
  <section id="work" class="showcase">
    <div><h2>Designed to feel custom</h2><p>Every section is arranged to support the business goal described in the prompt.</p></div>
    <ul>
      <li>Mobile-first layout</li>
      <li>SEO-friendly structure</li>
      <li>Editable HTML, CSS, and JavaScript</li>
    </ul>
  </section>
  <section id="contact" class="contact">
    <h2>Ready to launch?</h2>
    <form>
      <label>Name<input placeholder="Your name" /></label>
      <label>Email<input type="email" placeholder="you@example.com" /></label>
      <label>Message<textarea placeholder="Tell us what you need"></textarea></label>
      <button type="button">Send request</button>
    </form>
  </section>
</main>
"""
    css = f"""
:root {{ color-scheme: light; --accent: {accent}; --ink: #111827; --muted: #5b6472; --paper: #fffaf3; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--paper); }}
a {{ color: inherit; text-decoration: none; }}
.site-header {{ min-height: 72vh; padding: 28px clamp(20px, 5vw, 72px); background: linear-gradient(135deg, #fffaf3 0%, #eef7ff 52%, #f8fbf4 100%); }}
.nav {{ display: flex; align-items: center; justify-content: space-between; gap: 18px; }}
.nav div {{ display: flex; gap: 18px; flex-wrap: wrap; color: var(--muted); }}
.hero {{ max-width: 760px; padding-top: clamp(72px, 14vw, 150px); }}
.eyebrow {{ color: var(--accent); font-weight: 800; text-transform: uppercase; letter-spacing: .12em; font-size: .78rem; }}
h1 {{ font-size: clamp(3rem, 8vw, 6.8rem); line-height: .94; margin: 0 0 24px; letter-spacing: 0; }}
h2 {{ font-size: clamp(1.6rem, 4vw, 3rem); line-height: 1; margin: 0 0 14px; }}
p, li {{ color: var(--muted); font-size: 1.02rem; line-height: 1.75; }}
.button, button {{ display: inline-flex; border: 0; border-radius: 999px; padding: 14px 22px; color: white; background: var(--accent); font-weight: 800; cursor: pointer; }}
.grid-section {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: #d8dee7; padding: 1px; }}
.grid-section article {{ background: white; padding: clamp(22px, 4vw, 48px); min-height: 240px; }}
.showcase {{ display: grid; grid-template-columns: 1.4fr .8fr; gap: 36px; padding: clamp(36px, 8vw, 92px); align-items: center; }}
.showcase ul {{ list-style: none; padding: 0; display: grid; gap: 12px; }}
.showcase li {{ background: white; border: 1px solid #e5e7eb; padding: 16px 18px; border-radius: 8px; }}
.contact {{ padding: clamp(36px, 8vw, 92px); background: #111827; color: white; }}
.contact p, .contact label {{ color: #cbd5e1; }}
form {{ max-width: 720px; display: grid; gap: 14px; }}
label {{ display: grid; gap: 8px; }}
input, textarea {{ width: 100%; border: 1px solid #384256; border-radius: 8px; padding: 14px; background: #172033; color: white; font: inherit; }}
textarea {{ min-height: 120px; resize: vertical; }}
@media (max-width: 760px) {{ .nav {{ align-items: flex-start; flex-direction: column; }} .grid-section, .showcase {{ grid-template-columns: 1fr; }} }}
"""
    javascript = """
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
"""
    return {
        "title": title,
        "html": html.strip(),
        "css": css.strip(),
        "javascript": javascript.strip(),
        "category": category,
        "thumbnailColor": accent,
    }


def _title_from_prompt(prompt):
    words = re.sub(r"[^A-Za-z0-9 ]", "", prompt or "AI Website").split()
    useful = [word for word in words if word.lower() not in {"create", "build", "make", "a", "an", "the", "website", "site"}]
    return " ".join(useful[:4]).title() or "AI Website"


def _category_from_prompt(prompt):
    lowered = (prompt or "").lower()
    for category in ["restaurant", "portfolio", "business", "startup", "saas", "blog", "ecommerce", "education"]:
        if category in lowered:
            return category
    return "custom"


def _accent_for_category(category):
    return {
        "restaurant": "#b45309",
        "portfolio": "#2563eb",
        "business": "#0f766e",
        "startup": "#db2777",
        "saas": "#4f46e5",
        "blog": "#7c3aed",
        "ecommerce": "#059669",
        "education": "#d97706",
    }.get(category, "#2563eb")
