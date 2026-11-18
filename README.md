# Campus Stores: kit-centred desk (work sample)

Submitted by **Kukkala Ganesh**.

**Reviewers: start here.** The work is in `app.js` (logic) and `styles.css` (one small style). Run it with `index.html`, then:

1. **Requests → RQ-214 → View form.** The new **Kit status** panel shows every approved item, its unit, slip and current holder. **Issue the whole kit** opens one form for all three items.
2. Issue the kit to Kabir, press **Move to return time**, then in **Loan register** use **Record return** on the adapter and choose **Not back yet: someone else has it**.
3. Check **Desk book**, then **Move to next morning** and close the adapter slip with the other adapter (AD-15) to see the unit check.

## What I saw on the shift

**One moment the product handles well: the issue form only offers units that can leave the desk.**
At 3:45 pm the register's unit list leaves out PR-06 (in repair), and the app refused a second adapter against RQ-214 with "approved quantity … already on loan". The counter cannot hand Kabir a broken projector or over-issue a request while rushing at 3:45 for a 4 pm film. I would keep this.

**One moment I would change: the 7:30 pm partial return and the 9 am close.**
- Kabir returns the projector and speaker, and Leela holds the adapter. The register has no place for that: slip L-404 stays in *Outstanding* under "Kabir Sen", still due Fri 8 pm, so the only record is free text in the Desk book.
- Issuing the kit took three slips and three passes through the same form (request, collector, return time), and the request's own note ("USB-C-only laptop") never appears where the adapter is issued.
- At 9 am, **Record return** closed L-404 and put AD-12 back on the shelf without asking which adapter Leela actually held. AD-12 and AD-15 are both in bin C4, so a wrong close leaves the register and the shelf disagreeing, and nobody finds out until the next loan.

## The change
- **Overdue on the request row.** The Requests list flags a request with an overdue unit, so the morning shift sees it before opening anything.
- **Open at handover.** The top of the Desk book lists every unit still out with holder, due time and expected-back time. Free-text notes still work below it.
- **The request note stays in view.** *Issue the whole kit* opens under the request's own note ("USB-C-only laptop"), so it is visible when the adapter is picked.
The desk works from the **request**, not from one slip at a time.

- **Kit status** on the request: each approved item as *Not issued / Out (unit, slip, holder, expected back) / Returned*, with an *Overdue* flag.
- **Issue the whole kit**: one collector, one return time (defaults to the request's), a unit picked per item from what is on the shelf. It creates the same one-slip-per-unit records as before.
- **Return asks which unit is in your hand.** If it is not the unit on the slip, the slip is corrected (blocked if that unit is on another open slip), and the desk book gets a line telling the next shift to check the other unit's shelf.
- **Not back yet: someone else has it** records the current holder and expected return, and writes the handover line to the Desk book automatically. Free-text notes still work.

Not changed: one slip per physical unit, the existing guards, the manual **New issue slip** form.

## The same job with the change

3:45 pm: open RQ-214, press **Issue the whole kit**, pick Kabir, confirm PR-04, SP-02 and AD-12, save once. 7:30 pm: return the projector and speaker, and mark the adapter as with Leela, expected Sat 9 am. The request now reads *Returned, Returned, Out with Leela Das*, and the Desk book already has the handover line. 9 am: the adapter slip shows *Overdue* and "with Leela Das". Leela brings AD-15; the return form flags that the slip says AD-12, corrects it, and leaves a note to check AD-12 on C4. Tara's microphone slip is untouched.

**Keep:** one slip per unit, the shelf-only unit list, the approved-quantity guard, the Desk book for human notes.
**Not built:** scanning, reminders, notifications, editing a slip after the fact.

## What I would watch at a real counter

At the 9 am handover, count how many times the incoming person has to ask the outgoing person, or read free text in the Desk book, to find out who holds an outstanding item and whether it is overdue. If the change helped, that count drops to zero without anyone asking.

## Notes

I used an AI assistant (allowed by the brief) to help read the code, test the flows and draft this change, and I ran the shift myself to check what is written here. The shift observations above come from running the original app. The prototype stores state under a new key (`campus-stores.shift.v2`), so older saved shifts are ignored.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Original submission steps

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
