# Geniuses Model Academy — Static Site Template

This folder contains a professional, static website template for Geniuses Model Academy (GMA). Theme colors use a blue palette; the site includes a fixed, responsive navigation bar and clean content layout suitable for schools.

Structure:
- `index.html` — Home
- `about.html` — About
- `admissions.html` — Admissions
- `academics.html` — Academics
- `departments.html` — Departments
- `student-life.html` — Student Life
- `faculty.html` — Faculty
- `news.html` — News
- `contact.html` — Contact
- `css/styles.css` — Main stylesheet (blue theme; fixed navbar)
- `js/scripts.js` — Mobile menu toggle
- `assets/logo.svg` — Logo (GMA)

Preview:

Open `index.html` in a browser to preview. The navbar is fixed at the top; pages include spacing to avoid overlap.

To run locally (Windows):

```powershell
# from repository root
Start-Process "index.html"
```

Or use a simple static server such as `npx http-server` or `python -m http.server` in the folder.

Hero carousel notes:
- The homepage includes a hero banner with rotating slides. Slides support images and video elements; place additional hero media in `assets/` and update `index.html` markup if you add MP4 videos.
- Carousel autoplay is handled in `js/scripts.js` and will pause on hover.
