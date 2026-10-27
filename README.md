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
  - `forms` : Formspree form links (see section 4)
  - `welcome` : the pastor's welcome message on the homepage
  - `outreach` : the Go Ye Train highlight on the homepage
  - `give` : Mobile Money and bank details
- **`content/about.json`** : our story, vision, mission, statement of faith and leaders. `storyPhotos` is the photo collage beside "Our story" at the top of the About page: each photo has a `src`, a short description (`alt`) and a small `label` (for example "Worship"). The first photo is shown largest. Six photos fit the collage best.
- **`content/sermons.json`** : the sermon list. To add a sermon, copy one block and change it. The `youtubeId` is the part after `v=` in a YouTube link. Example: for `https://www.youtube.com/watch?v=D0mW9TLUt1Q` the ID is `D0mW9TLUt1Q`. The newest date is automatically shown as the "Latest sermon" on the homepage.
- **`content/events.json`** : events. Dates must be written as `YYYY-MM-DD` (for example `2026-12-20`). Past events disappear automatically. For an event lasting several days, add `"endDate"` (also `YYYY-MM-DD`). If there is no set time, leave `"time"` empty (`""`) and only the date is shown. The `slug` is the web address of the event page, so use lowercase words joined by hyphens, for example `youth-conference-2026`.
- **`content/ministries.json`** : one block per ministry. `phone` is the ministry leader's WhatsApp number (for example `+233244096956`). It is not shown on the site; the Join this ministry and Contact us buttons on that ministry's page open WhatsApp to this number. Leave it out to use the main church contact. Leave `meetingTime` empty (`""`) to hide the We meet line. Optional extras: `"canJoin": false` hides the Join this ministry button (used for the Finance Team), `contactButton` changes the button text `contactMessage` sets the WhatsApp message, and `linkButton` with `linkHref` adds an extra button to another page (for example Giving details to `/give`).
- **`content/hero.json`** : the slideshow photos behind the yearly theme at the top of the homepage (see "Changing the homepage slideshow" below)
- **`content/gallery.json`** : the photos in the homepage gallery, with a short description for each one (this helps blind visitors and Google)
- **`content/devotionals/`** : Moment With Jesus devotionals, one file per day

### Adding a new daily devotional

**The easy way (Pages CMS):** go to https://app.pagescms.org, sign in, open the website and click **Moment With Jesus**. Click **Add an entry**, fill in the title and date, upload the devotional PNG, and fill in the text boxes if you have the text. Click **Save**. The website updates in about 2 minutes.

Only the title and date are required. If you upload the PNG, it is shown on the devotional page with a **Download devotional** button, and it becomes the picture shown when the link is shared on WhatsApp or Facebook. Typing the text as well is recommended: it helps people with poor eyesight, people on slow phones, and Google.

Giving someone access: in Pages CMS, open the website's settings and invite them as a collaborator by email. They can then edit content without seeing the code.

**The manual way (GitHub):**

1. Upload the PNG to `public/images/devotionals`, for example `2026-10-26.png`.
2. In the `content/devotionals` folder, click **Add file > Create new file**.
3. Name it with the date, for example `2026-10-26.md`.
4. Copy this template, fill it in and commit. Every line except `title` and `date` is optional; delete any you do not need.

```
---
title: "Title of the devotional"
date: "2026-10-26"
image: "/images/devotionals/2026-10-26.png"
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

Main image names: `hero/hero-1.jpg` to `hero/hero-5.jpg` (homepage slideshow), `pastor-samuel-tandoh.jpg`, `about-church.jpg`, `live-banner.jpg`, `give-banner.jpg`, `contact-banner.jpg`, `ministry-*.jpg`, `outreach-go-ye-train-1/2/3.jpg`, `gallery-01.jpg` to `gallery-09.jpg`, `event-*.jpg`.

You can also use a brand new file name, as long as you update the matching path in the `content` file (for example `"image": "/images/my-new-photo.jpg"`).

### Changing the homepage slideshow

The photos that fade behind the yearly theme at the top of the homepage live in `public/images/hero`, and the list of slides is in `content/hero.json`. Each slide shows for 4 seconds, then fades to the next one.

**Replace a photo:** upload your new photo to `public/images/hero` with exactly the same name (for example `hero-3.jpg`). Nothing else needs to change.

**Add a photo:**
1. Upload it to `public/images/hero`, for example `hero-6.jpg`.
2. In `content/hero.json`, copy one block, paste it at the end and change it:

```
  {
    "src": "/images/hero/hero-6.jpg",
    "alt": "Short description of the photo"
  }
```

Remember the comma between blocks, and no comma after the last one.

**Remove a photo:** delete its block from `content/hero.json` (and fix the commas). You can delete the photo file too, but you do not have to.

**Change the order:** move the blocks around in `content/hero.json`. The first block is the photo visitors see first, so make it a strong one.

Tips for slideshow photos:
- Use landscape photos (wider than tall), at least 1400 pixels wide, under about 300 KB.
- The left side of the photo sits behind the green shade and the text, so photos with the main subject on the right side look best.
- The website automatically converts the photos to a smaller format (WebP) for phones, so you only need to upload a normal `.jpg`.
- Visitors who have turned on "reduce motion" on their phone or computer only see the first photo, with no movement.

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
3. Each form has a link like `https://formspree.io/f/xyzabcd`.
4. Paste each link into `content/site.json` under `forms`:

```
  "forms": {
    "contact": "https://formspree.io/f/xyzabcd",
    "prayer": "https://formspree.io/f/abcdxyz",
    "newsletter": "https://formspree.io/f/qwerty1"
  },
```

`contact` is the Send a Message form, `prayer` is the Prayer Request form (both on the Contact page) and `newsletter` is the signup in the footer. To move a form to a different Formspree account later, just replace its link.

Until a link is added, that form shows a friendly message asking visitors to email the church directly. Each form also has a hidden spam trap, so most robot submissions are blocked automatically.

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
