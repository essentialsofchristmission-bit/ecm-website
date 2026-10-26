# Essentials of Christ Mission (ECM) Website

This is the website for **Essentials of Christ Mission**, Lashibi, Tema.
It is built with Next.js and Tailwind CSS. You do **not** need to know how to code to update it.

All the words, times, sermons, events and photos live in two simple places:

| What you want to change | Where it lives |
| --- | --- |
| Words, service times, sermons, events, ministries, leaders, contact info, giving details | the `content` folder |
| Photos and the logo | the `public/images` folder |

---

## 1. Editing content (no coding needed)

The easiest way is to edit files directly on GitHub:

1. Open the project on GitHub and click into the `content` folder.
2. Click the file you want to change, then click the **pencil icon** (Edit).
3. Make your change, scroll down and click **Commit changes**.
4. The live website updates by itself in about 1 to 2 minutes.

**Golden rules for `.json` files**

- Only change the text **inside the quotes** on the right side of the colon.
- Keep the quotes `" "`, commas `,` and brackets `[ ] { }` exactly as they are.
- If you copy a block to add a new item (a new event, for example), make sure there is a comma between items.
- Want to double check? Paste the whole file into https://jsonlint.com and click Validate.

### What each file does

- **`content/site.json`** : the main settings
  - `theme` : the yearly theme headline and scripture shown at the top of the homepage
  - `serviceTimes` : service names, days and times (shown on the homepage, footer and contact page)
  - `contact` : address, phone, email and WhatsApp number (WhatsApp number in international format, no plus sign or spaces)
  - `social` : YouTube, Facebook, Instagram and TikTok links
  - `live` : set `"isLive": true` when you are streaming to show the red **WE ARE LIVE** banner. Set it back to `false` afterwards. If YouTube does not pick up the live stream automatically, paste the live video ID into `liveVideoId`.
  - `forms` : Formspree form IDs (see section 4)
  - `welcome` : the pastor's welcome message on the homepage
  - `outreach` : the Go Ye Train highlight on the homepage
  - `give` : Mobile Money and bank details
- **`content/about.json`** : our story, vision, mission, statement of faith and leaders
- **`content/sermons.json`** : the sermon list. To add a sermon, copy one block and change it. The `youtubeId` is the part after `v=` in a YouTube link. Example: for `https://www.youtube.com/watch?v=D0mW9TLUt1Q` the ID is `D0mW9TLUt1Q`. The newest date is automatically shown as the "Latest sermon" on the homepage.
- **`content/events.json`** : events. Dates must be written as `YYYY-MM-DD` (for example `2026-12-20`). Past events disappear automatically. For an event lasting several days, add `"endDate"` (also `YYYY-MM-DD`). If there is no set time, leave `"time"` empty (`""`) and only the date is shown. The `slug` is the web address of the event page, so use lowercase words joined by hyphens, for example `youth-conference-2026`.
- **`content/ministries.json`** : one block per ministry. `phone` is the ministry leader's WhatsApp number (for example `+233244096956`). It is not shown on the site; the Join this ministry and Contact us buttons on that ministry's page open WhatsApp to this number. Leave it out to use the main church contact. Optional extras: `"canJoin": false` hides the Join this ministry button (used for the Finance Team), `contactButton` changes the button text `contactMessage` sets the WhatsApp message, and `linkButton` with `linkHref` adds an extra button to another page (for example Giving details to `/give`).
- **`content/gallery.json`** : the photos in the homepage gallery, with a short description for each one (this helps blind visitors and Google)
- **`content/devotionals/`** : Moment With Jesus devotionals, one file per day

### Adding a new daily devotional

1. In the `content/devotionals` folder, click **Add file > Create new file**.
2. Name it with the date, for example `2026-10-26.md`.
3. Copy this template, fill it in and commit:

```
---
title: "Title of the devotional"
date: "2026-10-26"
keyVerse: "John 14:6"
keyVerseText: "Jesus saith unto him, I am the way, the truth, and the life."
prayer: "Write the prayer here."
proclamation: "Write the proclamation here."
---
Write the Daily Meal message here.

Leave an empty line between paragraphs.
```

The homepage always shows the devotional for today's date (or the most recent one). You can prepare devotionals in advance: files with a future date stay hidden until that day.

---

## 2. Replacing photos and the logo

All images are in `public/images`. Placeholder images say **"Replace: public/images/..."** on them.

1. Prepare your photo and give it **exactly the same file name** as the one you are replacing (for example `ministry-youth.jpg`).
2. On GitHub, open `public/images`, click **Add file > Upload files**, drag your photo in and commit. It will replace the old one.

Tips:
- Use `.jpg` for photos. Keep each photo under about 500 KB (use https://squoosh.app to shrink large photos).
- Landscape photos (wider than tall) work best, except leader photos, which should be portrait.
- Leader photos: upload the photo (for example `leader-jonathan-otoo.jpg`), then in `content/about.json` set that leader's `"image"` to `"/images/leader-jonathan-otoo.jpg"`. Leaders with an empty `"image"` show their initials instead.
- `logo.png` is used in the header, the footer and as the browser tab icon.
- `og-image.jpg` (1200 x 630) is the picture shown when someone shares the website on WhatsApp or Facebook.

Main image names: `hero-worship.jpg`, `pastor-samuel-tandoh.jpg`, `about-church.jpg`, `live-banner.jpg`, `give-banner.jpg`, `contact-banner.jpg`, `ministry-*.jpg`, `outreach-go-ye-train-1/2/3.jpg`, `gallery-01.jpg` to `gallery-09.jpg`, `event-*.jpg`.

You can also use a brand new file name, as long as you update the matching path in the `content` file (for example `"image": "/images/my-new-photo.jpg"`).

---

## 3. Redeploying

Live site: https://ecm-website-seven.vercel.app
GitHub: https://github.com/essentialsofchristmission-bit/ecm-website

If you later connect a custom domain, also update `siteUrl` in `content/site.json` so search engines and link previews use it.

The site is hosted on Vercel and connected to GitHub. **Every time you commit a change on GitHub, Vercel rebuilds and publishes the site automatically** (usually within 2 minutes). You can watch progress in your Vercel dashboard under **Deployments**.

If a deployment fails, it is almost always a missing comma or quote in a `.json` file. Open the failed deployment in Vercel to see which file, fix it, and commit again. The previous version of the site stays live until the fix is published.

---

## 4. Connecting the forms (free, using Formspree)

The contact form, prayer request form and newsletter signup send to your email through Formspree.

1. Create a free account at https://formspree.io using the church email.
2. Create three forms: "Contact", "Prayer Requests" and "Newsletter".
3. Each form has an ID like `xyzabcd` (from the form URL `https://formspree.io/f/xyzabcd`).
4. Paste the IDs into `content/site.json` under `forms`.

Until the IDs are added, the forms show a friendly message asking visitors to email the church directly.

---

## 5. For developers

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

- Pages live in `src/app`, shared components in `src/components`, content helpers in `src/lib/content.ts`.
- Pages that depend on today's date (homepage, events, devotionals) refresh every hour.
- `scripts/make-placeholders.py` regenerates the labelled placeholder images (requires Python and Pillow). It overwrites real photos with the same names, so only run it on a fresh project.
- Writing style: do not use em dashes or en dashes in site copy.
