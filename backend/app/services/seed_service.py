from app.extensions import db
from app.models import Template


TEMPLATES = [
    ("Portfolio", "portfolio", "Personal portfolio with project case studies and contact flow.", "Create a polished portfolio website for a product designer with case studies, testimonials, resume section, and contact form.", "#2563eb"),
    ("Business", "business", "Professional service company website with conversion sections.", "Create a modern business website for a consulting firm with services, process, clients, team, and consultation request form.", "#0f766e"),
    ("Restaurant", "restaurant", "Restaurant site with menu, gallery, location, and reservations.", "Create a dark theme restaurant website with hero image area, online reservation, menu, gallery, chef story, and contact page.", "#b45309"),
    ("Startup", "startup", "Launch-ready startup landing page with pricing and product story.", "Create a startup landing page with product benefits, social proof, pricing tiers, FAQ, and signup CTA.", "#db2777"),
    ("SaaS", "saas", "SaaS marketing site with feature grid and pricing.", "Create a SaaS website with dashboard preview, feature sections, integrations, pricing, testimonials, and trial signup.", "#4f46e5"),
    ("Blog", "blog", "Editorial blog homepage with newsletter capture.", "Create a clean blog website with featured articles, category filters, author cards, and newsletter subscription.", "#7c3aed"),
    ("Ecommerce", "ecommerce", "Online storefront with products and promotional sections.", "Create an ecommerce website with product grid, featured collection, cart CTA, reviews, and shipping banner.", "#059669"),
    ("Education", "education", "Course website with modules, instructors, and enrollment CTA.", "Create an education website for an online academy with courses, curriculum, instructors, student outcomes, and enrollment form.", "#d97706"),
]


def seed_templates():
    if Template.query.count() > 0:
        return
    for name, category, description, prompt, accent in TEMPLATES:
        db.session.add(Template(name=name, category=category, description=description, prompt=prompt, accent_color=accent))
    db.session.commit()
