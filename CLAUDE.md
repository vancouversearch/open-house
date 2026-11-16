# Open house sign-in pages — how to set one up

Chris Zenone (Oakwyn Realty) hosts open houses, often for other agents' listings. Each open house gets
a sign-in page here plus a printed QR door sign. Sign-ins go to Realtor OS as buyer leads (see README).
This repo is live on GitHub Pages: anything pushed to `main` is public within a few minutes.

## When Chris says "set up the open house for this listing"

He'll give you an MLS listing PDF, photos, and the day and time. Then:

1. **Read the listing PDF.** Pull: address, sub-area (e.g. Kitsilano), price, beds, baths, sq ft,
   strata fee and what it includes, yearly property tax, parking/locker, listing agent and brokerage.
2. **Make the folder.** Copy the newest folder in `oh/` (right now `oh/40-2375-w-broadway/`) to
   `oh/<slug>/`. Slug = unit-number-street, lowercase, e.g. `40-2375-w-broadway`, `904-590-nicola`.
3. **Photo.** Pick the strongest shot (the view, rooftop or best room). Resize to 1200px wide, JPEG
   quality ~78, save as `photo.jpg`. Aim for under ~250 KB; visitors load it on weak building signal.
4. **Floor plan.** If there is one, save it as `floorplan.jpg`. If not, leave it out; the page hides
   that section on its own.
5. **Edit `config.js`** in the new folder (every field is commented). Notes:
   - `taxMonthly` = yearly tax / 12, rounded. Also set `taxYearly`.
   - `facts`: 4 short items, e.g. `'2 bed · 2 bath', '1,136 sq ft', 'Private rooftop deck', '2 parking + locker'`.
   - `priceTag`: `'Just listed'` for new listings, `'Reduced'` only if the listing says so, else `''`.
   - `openHouse`: e.g. `'Sun, Nov 15, 2–4pm'`.
   - `sign.stats`: beds, baths, sq ft (price is added automatically). `sign.features`: list only what
     the page really has, e.g. `'Floor plan · Strata fee & taxes · Strata documents'`.
   - `listing`: the listing agent and brokerage from the PDF (credit them even when Chris is hosting).
   - `featureSheet`: `''` unless Chris gives the *public* MLS sheet (see rules).
6. **Check the page locally** if you can (open `oh/<slug>/index.html`), then **commit and push**.
7. **Make the sign PDF.** Open `oh/<slug>/sign.html` in Chrome → Print → Save as PDF, Margins: None,
   Background graphics: on. Or headless:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer --print-to-pdf=open-house-sign-<slug>.pdf "file://$PWD/oh/<slug>/sign.html"`
   Save the PDF somewhere Chris can find it (Desktop), not in the repo.
8. **Tell Chris to scan the sign with his phone** after GitHub Pages updates (a few minutes), do one
   test sign-in, and delete that test lead in Realtor OS.

## Rules (these matter)

- **Virtually staged photos get `staged: true`.** The page then shows a "Virtually staged" label.
  MLS listings say "virtually staged" in the remarks or photo notes. Never publish a staged photo unlabelled.
- **Never publish the realtor version of the MLS sheet.** "REA Full Realtor" / "Agent Full" sheets show the
  owner's name, commission and realtor remarks. Only the "REA Full Public" sheet can go up as
  `feature-sheet.pdf`. If unsure, check the PDF text for "Owner", "Commission" or "Realtor Remarks"
  and don't publish it if any appear.
- **Cost card = strata fee and property tax only**, straight from the listing. No mortgage, down
  payment or monthly-payment estimates, on the page or the sign.
- **Don't promise what isn't there.** If there's no floor plan, don't list "Floor plan" on the sign.
- **Keep the sign-in form short**: name, phone/email, "Already have a buyer's agent?", consent. Don't add questions back.
- **Don't change `assets/app.js` or `assets/style.css`** for a single listing; they're shared by every page.
- **Don't rewrite history** on `main` (no force-push, no amending pushed commits). It's the live site.
- Host details for every config: Chris Zenone, Oakwyn Realty, 778-883-1594, chriszenone@outlook.com.

## Files

- `oh/<slug>/index.html` sign-in page · `config.js` all listing details · `sign.html` printable door sign
- `assets/app.js`, `assets/style.css` shared page code · `assets/buyer-guide.pdf` the free guide
- `assets/logos/` Chris's logo (black for light backgrounds, white/gold for dark) and Oakwyn's logo
  (`oakwyn-logo-dark.png` has dark lettering for light backgrounds)
