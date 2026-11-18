(() => {
  const storageKey = "campus-stores.shift.v2";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const dueOptions = ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"];
  // Minutes from Friday 00:00, so the desk can tell when a slip is overdue.
  const phaseMin = [945, 1170, 1980];
  const dueMin = { "Fri 8 pm": 1200, "Sat 9 am": 1980, "Sat 10 am": 2040, "Sat noon": 2160 };
  const original = () => ({
    version: 2,
    kitFor: "",
    returning: 0,
    handoff: 0,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const holderOf = (l) => l.holder || l.who;
  const isLate = (l) => !l.back && (dueMin[l.due] ?? Infinity) < phaseMin[s.phase];
  const late = () => '<span class="tag late">Overdue</span>';
  const loanSub = (l) =>
    l.req + " · " + holderOf(l) +
    (l.holder && l.holder !== l.who ? " (issued to " + l.who + ")" : "") +
    " · Due " + l.due + (l.expected ? " · expected back " + l.expected : "");
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>" +
        (s.kitFor === r.id ? kitForm(r) : kitStatus(r));
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  const todoItems = (r) =>
    r.items.filter(
      (t) => !s.loans.some((l) => l.req === r.id && getAsset(l.asset).type === t),
    );
  function kitStatus(r) {
    let html = '<div class="sectionhead"><div><h3>Kit status</h3><small>Every approved item, where it is, and who has it</small></div></div>';
    html += r.items
      .map((type) => {
        const ls = s.loans.filter((l) => l.req === r.id && getAsset(l.asset).type === type);
        const open = ls.find((l) => !l.back);
        const done = ls.find((l) => l.back);
        if (open)
          return row(
            type,
            open.asset + " · L-" + open.num + " · with " + holderOf(open) +
              (open.expected ? " · expected " + open.expected : " · due " + open.due),
            (isLate(open) ? late() : "") + badge("Out"),
          );
        if (done)
          return row(type, done.asset + " · L-" + done.num + " · returned", badge("Returned", true));
        return row(type, "Approved · not issued yet", badge("Not issued"));
      })
      .join("");
    if (todoItems(r).length)
      html += '<div class="buttons">' + btn("Issue the whole kit", "kit", r.id, "primary") + "</div>";
    return html;
  }
  function kitForm(r) {
    const todo = todoItems(r);
    const unitSelect = (type, i) => {
      const free = assets.filter((a) => a.type === type && !a.repair && !out(a.id));
      return (
        "<label><span>" + esc(type) + '</span><select name="u' + i + '" required>' +
        (free.length
          ? opts(free.map((a) => [a.id, a.id + " · " + a.model + " · " + a.bin]))
          : '<option value="">None on shelf</option>') +
        "</select></label>"
      );
    };
    return (
      '<form data-kit="' + esc(r.id) + '"><div class="sectionhead"><div><h3>Issue kit · ' + esc(r.id) +
      "</h3><small>One collector and one return time for every item. Units shown are on the shelf now.</small></div></div>" +
      '<div class="form"><label><span>Collected by</span><select name="who" required><option value="">Select…</option>' +
      opts(people.map((p) => [p, p])) + "</select></label>" +
      '<label><span>Return by</span><select name="due" required>' +
      opts(dueOptions.map((d) => [d, d])) + "</select></label>" +
      todo.map(unitSelect).join("") +
      '</div><div class="buttons"><button type="submit" class="primary">Issue ' + todo.length +
      " item" + (todo.length > 1 ? "s" : "") + "</button>" + btn("Cancel", "cancel") + "</div></form>"
    );
  }
  function returnPanel(l) {
    const a = getAsset(l.asset);
    const same = assets.filter((x) => x.type === a.type && !x.repair);
    return (
      '<form data-return class="record"><h3>Returning L-' + l.num + " · " + esc(a.type) + "</h3><p>The slip says " +
      esc(a.id) + " (" + esc(a.model) + ", bin " + esc(a.bin) + "). Read the label on the unit in your hand.</p>" +
      '<div class="form"><label><span>Unit being handed back</span><select name="unit">' +
      same.map((x) => '<option value="' + esc(x.id) + '"' + (x.id === a.id ? " selected" : "") + ">" + esc(x.id + " · " + x.model + " · " + x.bin) + "</option>").join("") +
      '</select></label></div><div class="buttons"><button type="submit" class="primary">Confirm return</button>' +
      btn("Not back yet: someone else has it", "holdopen", String(l.num)) + btn("Cancel", "cancel") + "</div></form>"
    );
  }
  function handoffPanel(l) {
    const a = getAsset(l.asset);
    return (
      '<form data-handoff class="record"><h3>L-' + l.num + " · " + esc(a.type) + " is still out</h3><p>Record who has it now so the next shift does not have to guess.</p>" +
      '<div class="form"><label><span>Who has it now</span><select name="holder" required><option value="">Select…</option>' +
      opts(people.map((p) => [p, p])) + '</select></label><label><span>Expected back</span><select name="expected" required><option value="">Select…</option>' +
      opts(dueOptions.map((d) => [d, d])) + '</select></label></div><div class="buttons"><button type="submit" class="primary">Save and add to desk book</button>' +
      btn("Cancel", "cancel") + "</div></form>"
    );
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    const pending = s.loans.find((l) => l.num === (s.handoff || s.returning) && !l.back);
    if (!s.editing && pending)
      return html + (s.handoff ? handoffPanel(pending) : returnPanel(pending));
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown)
      html += row(
        "L-" + l.num + " · " + l.asset,
        loanSub(l),
        l.back
          ? badge("Returned")
          : (isLate(l) ? late() : "") + btn("Record return", "return", String(l.num)),
      );
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, n.auto ? "Counter handover · logged from the register" : "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    const kd = q('[data-kit] [name="due"]');
    if (kd && s.kitFor) kd.value = getReq(s.kitFor).due;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.kitFor = "";
        s.returning = s.handoff = 0;
        break;
      case "close":
        s.selected = "";
        s.kitFor = "";
        break;
      case "request":
        s.selected = v;
        s.kitFor = "";
      break;
      case "kit":
        s.kitFor = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        s.kitFor = "";
        s.returning = s.handoff = 0;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        s.returning = l.num;
        s.handoff = 0;
        s.notice = "Check the unit in your hand against slip L-" + l.num + ".";
        break;
      }
      case "holdopen":
        s.handoff = Number(v);
        break;
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-kit]")) {
      const r = getReq(f.dataset.kit);
      const who = form.get("who"), due = form.get("due");
      const todo = r ? todoItems(r) : [];
      const picks = todo.map((t, i) => getAsset(form.get("u" + i)));
      if (!r || !todo.length || !people.includes(who) || !dueOptions.includes(due)) return;
      if (picks.some((u, i) => !u || u.type !== todo[i] || u.repair || out(u.id))) {
        q("[data-status]").textContent = "A selected unit is not on the shelf. Choose again.";
        return;
      }
      let num = Math.max(...s.loans.map((l) => l.num));
      const made = picks.map((u) => {
        s.loans.push({ num: ++num, req: r.id, asset: u.id, who, due, back: false });
        return u.id + " (L-" + num + ")";
      });
      s.kitFor = "";
      commit("Issued " + made.join(", ") + " to " + who + " for " + r.id + ".");
      return;
    }
    if (f.matches("[data-return]")) {
      const l = s.loans.find((l) => l.num === s.returning && !l.back);
      const unit = getAsset(form.get("unit"));
      if (!l || !unit || unit.repair || unit.type !== getAsset(l.asset).type) return;
      if (unit.id !== l.asset) {
        if (out(unit.id)) {
          q("[data-status]").textContent = unit.id + " is on another open slip. Check the label again.";
          return;
        }
        const was = l.asset;
        l.asset = unit.id;
        l.back = true;
        s.notes.push({ phase: s.phase, auto: true, text: "Slip L-" + l.num + " corrected: " + unit.id + " came back, the slip said " + was + ". Check that " + was + " is on its shelf (" + getAsset(was).bin + ")." });
        s.returning = 0;
        commit("Slip L-" + l.num + " corrected to " + unit.id + " and closed. Note added to the desk book.");
        return;
      }
      l.back = true;
      s.returning = 0;
      commit(l.asset + " returned to stock. Slip L-" + l.num + " closed.");
      return;
    }
    if (f.matches("[data-handoff]")) {
      const l = s.loans.find((l) => l.num === s.handoff && !l.back);
      const holder = form.get("holder"), expected = form.get("expected");
      if (!l || !people.includes(holder) || !dueOptions.includes(expected)) return;
      l.holder = holder;
      l.expected = expected;
      s.notes.push({ phase: s.phase, auto: true, text: getAsset(l.asset).type + " (" + l.asset + ", slip L-" + l.num + ") for " + l.req + " is with " + holder + ", expected back " + expected + ". It was due " + l.due + "." });
      s.handoff = s.returning = 0;
      commit("L-" + l.num + " is with " + holder + ". Handover line added to the desk book.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 2 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
