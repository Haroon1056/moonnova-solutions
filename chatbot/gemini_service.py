# chatbot/gemini_service.py

import google.generativeai as genai

from django.conf import settings
from django.core.cache import cache
from django.db.utils import OperationalError, ProgrammingError

from blog.models import BlogPost
from portfolio.models import Project


if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)


class MoonNovaChatbot:
    """Professional AI Chatbot for MoonNova Solutions"""

    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.5-flash")
        self.system_prompt = self._build_system_prompt()

    def _build_system_prompt(self):
        """Build comprehensive system prompt"""

        cached_content = cache.get("moonnova_chatbot_context")
        if cached_content:
            return cached_content

        try:
            blog_posts = BlogPost.objects.filter(
                is_published=True
            ).order_by("-published_at")[:10]

            blog_list = "\n".join([
                f"- {post.title} (slug: {post.slug})"
                for post in blog_posts
            ])

        except (OperationalError, ProgrammingError):
            blog_list = ""

        try:
            portfolio_projects = Project.objects.filter(
                status="published"
            ).order_by("-published_at")[:10]

            portfolio_list = "\n".join([
                f"- {project.title} (slug: {project.slug})"
                for project in portfolio_projects
            ])

        except (OperationalError, ProgrammingError):
            portfolio_list = ""

        system_prompt = f"""You are MoonNova Assistant, the official AI chatbot for MoonNova Solutions.

## IMPORTANT - HOW TO FORMAT RESPONSES WITH LINKS

When you need to share a page link, use this format ONLY:
- Write the page name as a clickable word
- Use markdown link format: [Text](URL)
- NEVER show raw URLs like /contact/ or https://example.com

## CORRECT LINK FORMAT EXAMPLES:

✅ CORRECT: "Visit our [Contact](/contact/) page to reach us."
✅ CORRECT: "Check out our [Portfolio](/portfolio/) to see our work."
✅ CORRECT: "Learn more about [Custom Web Development](/custom-web-development/)."
✅ CORRECT: "Read our latest blog post: [First Testing Blog](/blog/post/first-testing-blog/)"

❌ WRONG: "Visit /contact/"
❌ WRONG: "Check out https://example.com/portfolio/"
❌ WRONG: "Go to /blog/post/first-testing-blog/"

## WEBSITE PAGES WITH URLs
- Home: /
- About: /about/
- Contact: /contact/
- Portfolio: /portfolio/
- Blog: /blog/
- Consulting: /consulting/

## SERVICES WITH URLs
- Custom Web Development: /custom-web-development/
- E-Commerce Development: /ecommerce-web-development/
- Mobile App Development: /mobile-app-development/
- Custom Software Development: /custom-software-development/
- AI & ML Solutions: /ai-ml-solutions/
- Data Analytics: /data-analytics/
- SEO & Digital Growth: /digital-marketing-seo/

## BLOG POSTS
Use format: [Post Title](/blog/post/{{slug}}/)
{blog_list if blog_list else "No blog posts yet"}

## PORTFOLIO PROJECTS
Use format: [Project Title](/portfolio/project/{{slug}}/)
{portfolio_list if portfolio_list else "No portfolio projects yet"}

## CONTACT INFO
- Email: info@moonnovasolutions.com
- Phone: +92 318 704 0877

## RESPONSE GUIDELINES

1. ALWAYS use the link format [Page Name](/path/) when sharing any page
2. For blog posts: use [Post Title](/blog/post/{{slug}}/) where {{slug}} is the actual slug
3. For portfolio: use [Project Title](/portfolio/project/{{slug}}/)
4. For contact: say "email us at info@moonnovasolutions.com or call +92 318 704 0877"
5. For pricing: "Projects are custom-quoted. A typical website starts around $3,000-5,000. Schedule a [free consultation](/consulting/)."
6. For timeline: "Typical projects take 3-6 weeks. Complex ones 2-4 months. See our [Portfolio](/portfolio/) for examples."
7. For services: "We offer [Custom Web Development](/custom-web-development/) and more. Which interests you?"

Keep responses natural, helpful, and professional. Always use the link format when mentioning any page."""

        cache.set("moonnova_chatbot_context", system_prompt, 3600)

        return system_prompt

    def get_response(self, user_message, conversation_history=None):
        """Get response from Gemini AI"""

        messages = [
            {
                "role": "user",
                "parts": [self.system_prompt],
            },
            {
                "role": "model",
                "parts": [
                    "I understand. I'll use [Page Name](URL) format for all links and never show raw URLs."
                ],
            },
        ]

        if conversation_history:
            recent = conversation_history[-8:]

            for msg in recent:
                role = "user" if msg.get("role") == "user" else "model"
                content = msg.get("content", "")

                if content:
                    messages.append({
                        "role": role,
                        "parts": [content],
                    })

        messages.append({
            "role": "user",
            "parts": [user_message],
        })

        try:
            response = self.model.generate_content(messages)
            return response.text.strip()

        except Exception as e:
            print(f"Gemini API Error: {e}")
            return "I'm having trouble connecting. Please email us at info@moonnovasolutions.com or call +92 318 704 0877."

    def refresh_context(self):
        cache.delete("moonnova_chatbot_context")
        self.system_prompt = self._build_system_prompt()
        return True