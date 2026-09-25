# Far Places & Late Nights

My little site for travel and cocktail photos. A dark, bar-inspired design built as a plain static page (HTML + CSS + JS) — no build tools, ready to host on GitHub Pages.

## File structure

```
index.html            Page structure
data/photos.js        ← All text and photo lists are edited here
photos/travel/        Travel photos
photos/cocktails/     Cocktail photos
assets/css/style.css  Styles
assets/js/main.js     Interactions (filters, lightbox, animations)
assets/fonts/         Self-hosted fonts
```

## Adding your own photos

1. Put photos in `photos/travel/` or `photos/cocktails/`
2. Open `data/photos.js`, copy an entry in the `TRAVEL` or `COCKTAILS` list, and change it to your photo's path and text
3. Hero background: change the image path in `index.html` (it appears in three places — search for `mirror-lake.jpg`). Landscape images work best
4. Delete any placeholder images you no longer use

Travel photo fields: `src` path, `place` place name, `country`, `region` (used for the filter buttons), `year`, `note` a one-line caption.

Cocktail fields: `src`, `name`, `bar`, `city`, `ingredients` list, `note` a one-line caption.

Contact links live in `SITE.links`. A link with `url` opens that address; a link with `copy` (like WeChat) copies the text to the clipboard when clicked.

### Photo tips

- Resize the long edge to about **2000px** and keep each file under 500KB so the site loads fast ([squoosh.app](https://squoosh.app) compresses for free)
- Portrait (4:5) works best for cocktails — the site crops them to that ratio
- Travel photos can be landscape or portrait; the masonry grid lays them out automatically

## Local preview

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Publishing

After pushing to GitHub, go to the repo's **Settings → Pages**, choose the `main` branch and the `/ (root)` folder. A few minutes later the site will be live at `https://<your-username>.github.io/<repo-name>/`. Every push after that updates it automatically.

## Fonts

Cormorant Garamond, Jost and Noto Serif SC, all under the SIL Open Font License, self-hosted in `assets/fonts/`.
