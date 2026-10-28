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
  - `visit` : the **Plan your visit** window that opens from the Plan a Visit buttons: its title and intro, how many upcoming Sundays to offer (`sundaysToShow`), the note under "Are you bringing children?", and the questions and answers (`faqs`). Add or remove a `{ "question": ..., "answer": ... }` block to change the questions. The WhatsApp us button sends the visitor's chosen Sunday (and whether they are bringing children) to the church WhatsApp number in `contact`.
  - `outreach` : the Go Ye Train highlight on the homepage
  - `give` : Mobile Money and bank details
- **`content/about.json`** : our story, vision, mission, statement of faith and leaders. `heroPhotos` is the photo collage behind "About Us" in the green banner at the top of the About page. Each photo has a `src` and a short description (`alt`). Use six photos: phones show the first 3, tablets the first 4, and computers all 6. On computers the 1st and 4th photos are tall and the 2nd and 6th are wide, so put photos with people in the middle in those spots.
- **Sermons** : see "Sermons" below (`extra-sermons.json`, `sermon-overrides.json`, `preachers.json`, `series.json`, `hidden-videos.json`)
- **`content/events.json`** : events. Dates must be written as `YYYY-MM-DD` (for example `2026-12-20`). Past events move to the "Past events" list at the bottom of the Events page automatically. For an event lasting several days, add `"endDate"` (also `YYYY-MM-DD`). If there is no set time, leave `"time"` empty (`""`) and only the date is shown. The `slug` is the web address of the event page, so use lowercase words joined by hyphens, for example `youth-conference-2026`.
- **`content/ministries.json`** : one block per ministry. `phone` is the ministry leader's WhatsApp number (for example `+233244096956`). It is not shown on the site; the Join this ministry and Contact us buttons on that ministry's page open WhatsApp to this number. Leave it out to use the main church contact. Leave `meetingTime` empty (`""`) to hide the We meet line. Optional extras: `"canJoin": false` hides the Join this ministry button (used for the Finance Team), `contactButton` changes the button text `contactMessage` sets the WhatsApp message, and `linkButton` with `linkHref` adds an extra button to another page (for example Giving details to `/give`).
- **`content/hero.json`** : the slideshow photos behind the yearly theme at the top of the homepage (see "Changing the homepage slideshow" below)
- **`content/gallery.json`** : the photos in the homepage gallery, with a short description for each one (this helps blind visitors and Google)
- **`content/devotionals/`** : Moment With Jesus devotionals, one file per day

### Sermons

New videos on the church YouTube channel appear on the Sermons page by themselves (within about 15 minutes to an hour). No YouTube key or YouTube setting is needed. The newest one is shown as "Latest sermon" on the homepage.

The website reads each video's YouTube title, for example `DAYS OF NOAH || WEDNESDAY SERVICE || PS. DR. SAMUEL TANDOH`:
- **Preacher:** a name after `||` or `|` (usually at the end, such as `|| MR. MAXWELL AZAFOKPE`) is the preacher. Only when there is no name is the video listed under Pastor Dr. Samuel E. Tandoh. Their role (Resident Pastor, ECM Leadership or Guest Preacher) comes from `content/preachers.json`. Anyone not in that file counts as a guest preacher.
- **Tab:** every video is in one tab on the Sermons page: **Sermons** (Pastor Tandoh), **ECM Leadership**, **Guest Preachers**, **Forum Discussions** (titles with "Panel Discussion" or "Forum Discussion", shown with "Panel" as the preacher), **Prayer Meetings** (titles with "Prayer Meeting") or **Outreach** (titles with "Outreach").
- **Series:** titles that start the same way before a colon (`Foundations of Our Walk: Humility`) or that have a part number (`Part 2`, `Pt 3`, `Episode 1`, `Day 4`) are grouped into a series automatically.
- **Hidden:** birthday wishes, hashtag clips, Shorts and repeat rebroadcasts are left out.

Everyone in ECM Leadership and every guest preacher gets one page listing all their messages, linked from the cards at the bottom of the Sermons page.

**Adding an old video (or any video):** open `content/extra-sermons.json` and add a block with the YouTube link. `preacher` and `series` are optional. The title, picture and date are fetched from YouTube automatically:

```
  {
    "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    "preacher": "Rev. John Mensah",
    "series": "Faith Series"
  },
```

This file already lists every video on the channel up to October 2026. You can also add `"title"` or `"date"` (`YYYY-MM-DD`) to a block to correct what YouTube shows.

**Fixing one video's preacher, tab or series:** open `content/sermon-overrides.json`. Each block starts with the video's ID, the 11 characters after `v=` in its YouTube link (`https://www.youtube.com/watch?v=Iftw9CaVGOg` has the ID `Iftw9CaVGOg`). What you write here always wins over what the website reads from the title. Every field is optional:

```
  "Iftw9CaVGOg": {
    "note": "The Responsible Father (21 Jun 2026)",
    "preacher": "Mr. Maxwell Azafokpe",
    "category": "ECM Leadership",
    "series": "Faith Series",
    "event": "childrens-day-celebration-2025"
  },
```

- `note` is just a reminder for you of which video it is.
- `preacher` is the person's name (use the same name as in `preachers.json`), or `Panel` for a discussion.
- `leader` is used for prayer meetings: type the name of who led it between the quotes, for example `"leader": "Mrs. Eva O. Tandoh"`. While it is empty the card says "Led by: To be updated" (prayer meetings are never given to Pastor Tandoh automatically). Once a name is filled in, the prayer meeting also appears on that person's page.
- `category` is the tab: `Sermons`, `ECM Leadership`, `Guest Preachers`, `Forum Discussions`, `Prayer Meetings` or `Outreach`. Leave it out to use the tab that matches the preacher's role.
- `series` puts the video in a series.
- `event` links the video to an event in `content/events.json` (use the event's `slug`). The event page then shows a "Watch ... service" button.

Remember the comma between blocks, and no comma after the last one.

**Fixing a preacher's name or role:** open `content/preachers.json`. Each block is one preacher:
- `name` is how the name is shown. Change it to correct the spelling or add a title (Rev., Apostle and so on).
- `role` is one of `Resident Pastor`, `ECM Leadership` or `Guest Preacher`. To move someone between groups, change this one word, and all their videos move with them (unless a video has its own `category` in `sermon-overrides.json`).
- `aliases` lists other ways the name is written in YouTube titles, so they all count as the same person. For example, Rev. Dr. Kissinger Joe Anokye also appears as "Rev. Joe Anokye". Small differences are matched on their own: `Mr` and `Mr.`, titles such as Rev. or Dr., single initials, and doubled letters (`Scoffray` and `Scofray`).
- `photo` is a picture for their card, for example `/images/preachers/john-mensah.jpg`, uploaded to `public/images/preachers`. Leave it empty to use their latest video's picture.

A guest with no block in this file still appears, using the name from the YouTube title.

**Naming a series:** open `content/series.json`. Each block is one series: `name`, `titles` (words that, if a sermon title contains them, put it in the series) and `videos` (YouTube links that belong to it).

**Hiding a video:** add its link to `content/hidden-videos.json`. The `note` is just a reminder for you of why it is hidden.

### Adding a new daily devotional

**Many at once (a week, a month or more):** name each devotional image with its date and title, then upload them all together. Each one appears on the website by itself on its date, so nobody has to update the website every day.

1. Name each image like this: `2026-11-02 Walking in Love.png` (year-month-day, a space, then the title). `2026-11-02-walking-in-love.png` also works. PNG, JPG and WEBP are accepted.
2. On GitHub, open `public/images/devotionals`, click **Add file > Upload files**, drag in all the images at once and click **Commit changes**.

That is all. A devotional with a future date stays hidden (not listed, and its page cannot be opened) until that day in Ghana. On its day it becomes the homepage devotional and is added to the Moment With Jesus page within about an hour. If two images have the same date, only the first one (in alphabetical order) is used.

Until the text is added, the page shows the image itself. Want the text (key verse, Daily Meal, prayer, proclamation) or a title with characters a file name cannot hold, such as `?` or `:`? Add a text file for that date as shown below. It uses the image with the same date automatically, so you can leave out the `image` line.

**The easy way (Pages CMS):** go to https://app.pagescms.org, sign in, open the website and click **Moment With Jesus**. Click **Add an entry**, fill in the title and date, upload the devotional PNG, and fill in the text boxes if you have the text. Click **Save**. The website updates in about 2 minutes.

Only the title and date are required. When the text is typed in, the devotional page shows the text, and the PNG is offered as a **Download devotional** button (it is also the picture shown when the link is shared on WhatsApp or Facebook). If there is no text yet, the page shows the PNG itself instead, so it is never empty. Typing the text is recommended: it helps people with poor eyesight, people on slow phones, and Google.

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

The homepage always shows the devotional for today's date (or the most recent one). You can prepare devotionals in advance: anything with a future date stays hidden until that day.

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
