(function () {
  const S = window.SITE;
  const J = S.journeys;
  const app = document.getElementById("app");

  // ---------- storage (per visitor, this browser only) ----------
  const store = {
    get(key, fallback) {
      try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },
  };

  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  // ---------- language ----------
  // Content is Hebrew today. Any item may get *_en fields (title_en, summary_en, task_en…)
  // and the English interface will use them; until then it falls back to Hebrew.
  const T = {
    he: {
      dir: "rtl", skip: "דילוג לתוכן", search: "חיפוש סדנה, סרטון או מצגת", searchLabel: "חיפוש באתר", noResults: "לא נמצאו תוצאות",
      menu: "תפריט", langBtn: "EN", langTitle: "Switch to English",
      nav: { home: "ראשי", start: "המסלול שלי", portfolio: "התוצרים שלי", all: "כל החומרים", about: "אודות" },
      pr: {
        badge: "תרגול", goal: "המטרה", steps: "מה עושים", template: "תבנית להעתקה", copy: "העתקה", copied: "הועתק ✓",
        why: "למה זה חשוב", watch: "לפני שמתחילים, צפו בקטע:", tplN: (n) => `תבנית ${n}`, reflect: "שאלות לחשיבה (כתבו תשובה קצרה למטה)", pitfall: "מלכודת נפוצה",
        quiz: "שאלת הבנה", right: "נכון!", wrong: "לא בדיוק.", check: "בדיקה עצמית", output: (o) => `מה יצא לי? (${o})`,
        notePh: "הדביקו כאן קישור לתוצר, וכתבו תשובות קצרות לשאלות החשיבה", saved: "נשמר בדפדפן שלכם", allMine: "לכל התוצרים שלי",
        nudge: "רגע לפני שממשיכים: יש כאן תרגול קצר. עשר דקות של תרגול שוות יותר משעה של צפייה.", toPractice: "לתרגול", skip: "להמשיך בכל זאת",
        inPath: "✎ תרגול",
        pfTitle: "התוצרים שלי", pfIntro: "כל מה ששמרתם בתרגולים. הכל שמור רק בדפדפן הזה, אז כדאי להעתיק או להוריד מדי פעם.",
        pfEmpty: "עוד לא שמרתם תוצרים. התרגולים מופיעים בצעדים המרכזיים של המסלול.", pfCopy: "העתקת הכל", pfDownload: "הורדה כקובץ",
        pfChecks: (a, b) => `${a}/${b} בדיקות`, pfOpen: "לתרגול",
      },
      heroEyebrow: "פקולטה למורים סקרנים", heroH1a: "ללמוד ללמד עם", heroH1b: "בינה מלאכותית",
      heroLead: "מסורת של הוראה, עם מכונה שלא מתעייפת. שלוש שאלות קצרות, ואתם בדרך לתואר של כבוד – בקצב שלכם, על הקורס שלכם.",
      heroCta: "הרשמה לסמסטר · 2 דקות", heroBrowse: "או לעיין בקטלוג המלא",
      portraitCaption: "פרופ׳ (כמעט) עידן שביט, ראש הקתדרה",
      heroNote: "\"הרשמה\" זה רק בקריצה: אין חשבון, אין סיסמה ואין תשלום. עונים על שלוש שאלות קצרות ומקבלים מסלול למידה אישי, שנשמר בדפדפן שלכם בלבד.",
      examIntro: "שלוש שאלות קצרות, בלי ציון ובלי חשבון. התשובות רק קובעות איזה מסלול תקבלו, ואפשר לשנות אותן בכל רגע.",
      howTitle: "תקנון הלימודים",
      how: [["עונים על שלוש שאלות", "רמה, נושא, וכמה זמן יש לכם בשבוע."], ["לומדים ביחידות קצרות", "בכל פעם יחידה אחת, בגודל שמתאים לזמן שלכם."], ["מתרגלים על הקורס שלכם", "בכל צעד משימה קטנה של 5 דקות."]],
      qCount: (i, n) => `שאלה ${ROMAN[i - 1]} מתוך ${ROMAN[n - 1]}`, back: "חזרה", exam: "בחינת קבלה",
      q: ["מה רמת הניסיון שלך עם בינה מלאכותית?", "מה הכי חשוב לך ללמוד?", "כמה זמן יש לך ללמידה בשבוע?"],
      multiHint: "אפשר לבחור נושא אחד או כמה. המסלול יחבר ביניהם בלי לחזור על אותו חומר פעמיים.",
      goalsNext: (n) => n ? (n === 1 ? "המשך עם נושא אחד ←" : `המשך עם ${n} נושאים ←`) : "בחרו לפחות נושא אחד",
      pubRead: "לקריאת המאמר", pubSite: "להרצאה באתר",
      ready: "המסלול שלך מוכן", start: "נתחיל", continueBtn: "להמשיך", fullPath: "למסלול המלא", changePath: "לבנות מסלול אחר",
      pathSummary: (units, per, weeks) => `${units} יחידות · עד כ-${per} דק' כל אחת · בקצב שבחרתם כ-${weeks} שבועות`,
      unit: (n) => `יחידה ${n}`, unitDone: "הושלמה", optional: "לא חובה",
      nextTitle: "הצעד הבא שלך", hello: "ברוכים השבים",
      unitsProgress: (a, b) => `${a} מתוך ${b} יחידות הושלמו`,
      allDoneTitle: "סיימתם את המסלול!", allDoneText: "כל הכבוד. אפשר להוסיף נושא למסלול, וההתקדמות שלכם נשמרת.", otherGoal: "להוסיף נושא:",
      unitDoneToast: (n) => `כל הכבוד! סיימתם את יחידה ${n}.`, pathDoneToast: "כל הכבוד! סיימתם את כל המסלול.",
      exploreTitle: "לחקור עוד", exploreIntro: "כל החומרים באתר, למי שרוצה לדפדף בעצמו.",
      cards: {
        kaye: ["הכשרת קיי", "תשע סדנאות למרצי המכללה"],
        bonus: ["סדנאות בונוס", "סדנאות מלאות מחוץ לתוכנית"],
        mini: ["מיני-סרטונים", "איך עושים… בכמה דקות"],
        library: ["ספריית מצגות", "כל המצגות לפי נושא"],
      },
      progressOf: (a, b) => `${a} מתוך ${b} הושלמו`,
      kayeEyebrow: "המסלול המרכזי", kayeTitle: "סדנאות הכשרת קיי",
      kayeIntro: (n) => `${n} סדנאות למרצי המכללה, לפי סדר התוכנית.`,
      dataEyebrow: "השתלמות למורים", bonusEyebrow: "חומרי בונוס", bonusTitle: "סדנאות נוספות",
      miniEyebrow: "איך עושים…", miniTitle: "מיני-סרטונים לפי כלי", miniIntro: "סרטונים קצרים על פעולה אחת בכל פעם.",
      libEyebrow: "ספרייה", libTitle: "כל המצגות לפי נושא", libFilter: "סינון לפי שם מצגת", libNone: "אין מצגות שמתאימות לסינון.",
      aboutEyebrow: "אודות", aboutPubs: "פרסומים", aboutContact: "יצירת קשר",
      home: "ראשי", workshop: "סדנה", session: "מפגש", of: "מתוך",
      noVideo: "ללא הקלטה", noDeck: "ללא מצגת", done: "הושלם", recHidden: "ההקלטה אינה זמינה כרגע", recHiddenChip: "הקלטה לא זמינה כרגע",
      learnTitle: "בסוף תדעו", tabRec: "הקלטה", tabDeck: "מצגת", tabFiles: "חומרים",
      openYT: "צפייה ביוטיוב", openDrive: "פתיחה בדרייב", fullscreen: "פתיחה במסך מלא",
      noVideoText: (u) => `ל${u} הזה אין הקלטה.`, noDeckText: (u) => `ל${u} הזה עדיין לא צורפה מצגת.`,
      loadingDeck: "טוען מצגת…", play: "הפעלת הסרטון",
      hasHighlights: "יש קטעים מומלצים",
      chaptersTitle: "מה לראות", chaptersIntro: "אין צורך לראות הכל. אפשר לקפוץ ישר לקטעים האלה:",
      taskTitle: "נסו בעצמכם · 5 דקות",
      taskFallback: { video: "רשמו דבר אחד מהסרטון שתנסו השבוע.", deck: "רשמו רעיון אחד מהמצגת שתיישמו בקורס שלכם.", lesson: "רשמו דבר אחד מהסדנה שתנסו בשיעור הקרוב." },
      deeper: "להעמקה", shortVideos: "סרטונים קצרים", moreDecks: "מצגות נוספות", moreHere: "רוצים עוד?",
      prev: "הקודם", next: "הבא", markWatched: "סימנתי שסיימתי", watched: "✓ סיימתי",
      stepHead: (u, i, n, m) => `${u} · צעד ${i} מתוך ${n} · כ-${m} דק'`,
      finishNext: "סיימתי · לצעד הבא ←", finishLast: "סיימתי את המסלול", notYet: "עוד לא, אחזור לזה אחר כך", backToPath: "→ המסלול שלי",
      moreFrom: (t) => `עוד מ-${t}`, partOf: "מופיע בסדנה", moreInTopic: "עוד בנושא",
      kind: { rec: "הקלטת סדנה", recSession: "הקלטת מפגש", materials: "מצגת וחומרים", video: "סרטון קצר", deck: "מצגת לעיון" },
      mins: (m) => `${m} דק'`,
      enNotice: "", footerYT: "ערוץ היוטיוב",
    },
    en: {
      dir: "ltr", skip: "Skip to content", search: "Search workshops, videos, slides", searchLabel: "Search the site", noResults: "No results",
      menu: "Menu", langBtn: "עב", langTitle: "לעברית",
      nav: { home: "Home", start: "My path", portfolio: "My work", all: "All materials", about: "About" },
      pr: {
        badge: "Practice", goal: "Goal", steps: "What to do", template: "Template to copy", copy: "Copy", copied: "Copied ✓",
        why: "Why it matters", watch: "Before you start, watch:", tplN: (n) => `Template ${n}`, reflect: "Questions to think about (answer briefly below)", pitfall: "Common pitfall",
        quiz: "Check your understanding", right: "Correct!", wrong: "Not quite.", check: "Self-check", output: (o) => `What did you make? (${o})`,
        notePh: "Paste a link to your work, and answer the thinking questions briefly", saved: "Saved in your browser", allMine: "All my work",
        nudge: "Before you move on: there is a short practice here. Ten minutes of practice is worth more than an hour of watching.", toPractice: "Go to practice", skip: "Continue anyway",
        inPath: "✎ Practice",
        pfTitle: "My work", pfIntro: "Everything you saved in the practices. It is stored only in this browser, so copy or download it from time to time.",
        pfEmpty: "Nothing saved yet. Practices appear in the main steps of your path.", pfCopy: "Copy all", pfDownload: "Download as file",
        pfChecks: (a, b) => `${a}/${b} checks`, pfOpen: "Open practice",
      },
      heroEyebrow: "Faculty of Curious Teachers", heroH1a: "Learning to teach with", heroH1b: "artificial intelligence",
      heroLead: "A tradition of teaching, with a machine that never tires. Three short questions and you are on your way to an honorary degree – at your pace, on your own course.",
      heroCta: "Enrol for the semester · 2 min", heroBrowse: "or browse the full catalogue",
      portraitCaption: "Prof. (almost) Idan Shavit, Head of Chair",
      heroNote: "\"Enrol\" is tongue-in-cheek: no account, no password, no payment. Answer three short questions and get a personal learning path, saved only in your browser.",
      examIntro: "Three short questions, no grade and no account. Your answers only decide which path you get, and you can change them any time.",
      howTitle: "Course regulations",
      how: [["Answer three questions", "Your level, topic and weekly time."], ["Learn in short units", "One unit at a time, sized to your time."], ["Practise on your own course", "A 5-minute task at every step."]],
      qCount: (i, n) => `Question ${ROMAN[i - 1]} of ${ROMAN[n - 1]}`, back: "Back", exam: "Entrance exam",
      q: ["How much experience do you have with AI?", "What do you most want to learn?", "How much time do you have each week?"],
      multiHint: "Pick one topic or several. The path combines them without repeating material.",
      goalsNext: (n) => n ? (n === 1 ? "Continue with one topic →" : `Continue with ${n} topics →`) : "Pick at least one topic",
      pubRead: "Read the article", pubSite: "Talk on this site",
      ready: "Your path is ready", start: "Start", continueBtn: "Continue", fullPath: "Full path", changePath: "Build a different path",
      pathSummary: (units, per, weeks) => `${units} units · up to ~${per} min each · about ${weeks} weeks at your pace`,
      unit: (n) => `Unit ${n}`, unitDone: "Done", optional: "Optional",
      nextTitle: "Your next step", hello: "Welcome back",
      unitsProgress: (a, b) => `${a} of ${b} units done`,
      allDoneTitle: "You finished the path!", allDoneText: "Well done. Pick another topic; your progress is kept.", otherGoal: "Another topic:",
      unitDoneToast: (n) => `Well done! Unit ${n} complete.`, pathDoneToast: "Well done! You finished the whole path.",
      exploreTitle: "Explore more", exploreIntro: "Everything on the site, for browsing on your own.",
      cards: {
        kaye: ["Kaye training", "Nine workshops for lecturers"],
        bonus: ["Bonus workshops", "Full workshops outside the programme"],
        mini: ["Short videos", "How-to in a few minutes"],
        library: ["Slide library", "All decks by topic"],
      },
      progressOf: (a, b) => `${a} of ${b} done`,
      kayeEyebrow: "Core track", kayeTitle: "Kaye College training workshops",
      kayeIntro: (n) => `${n} workshops for lecturers, in programme order.`,
      dataEyebrow: "Teacher course", bonusEyebrow: "Bonus", bonusTitle: "More workshops",
      miniEyebrow: "How to…", miniTitle: "Short videos by tool", miniIntro: "Short videos, one task at a time.",
      libEyebrow: "Library", libTitle: "All slide decks by topic", libFilter: "Filter by title", libNone: "No decks match the filter.",
      aboutEyebrow: "About", aboutPubs: "Publications", aboutContact: "Contact",
      home: "Home", workshop: "workshop", session: "session", of: "of",
      noVideo: "No recording", noDeck: "No slides", done: "Done", recHidden: "The recording is not available at the moment.", recHiddenChip: "Recording unavailable",
      learnTitle: "You will learn", tabRec: "Recording", tabDeck: "Slides", tabFiles: "Materials",
      openYT: "Watch on YouTube", openDrive: "Open in Drive", fullscreen: "Open full screen",
      noVideoText: () => "There is no recording for this item.", noDeckText: () => "No slides have been added yet.",
      loadingDeck: "Loading slides…", play: "Play video",
      hasHighlights: "highlights available",
      chaptersTitle: "What to watch", chaptersIntro: "No need to watch it all. Jump straight to these parts:",
      taskTitle: "Try it yourself · 5 min",
      taskFallback: { video: "Note one thing from the video to try this week.", deck: "Note one idea from the slides to use in your course.", lesson: "Note one thing from the workshop to try in your next class." },
      deeper: "Going deeper", shortVideos: "Short videos", moreDecks: "More slides", moreHere: "Want more?",
      prev: "Previous", next: "Next", markWatched: "Mark as done", watched: "✓ Done",
      stepHead: (u, i, n, m) => `${u} · step ${i} of ${n} · ~${m} min`,
      finishNext: "Done · next step →", finishLast: "I finished the path", notYet: "Not yet, I'll come back later", backToPath: "← My path",
      moreFrom: (t) => `More from ${t}`, partOf: "Part of", moreInTopic: "More on this topic",
      kind: { rec: "Workshop recording", recSession: "Session recording", materials: "Slides and materials", video: "Short video", deck: "Slides" },
      mins: (m) => `${m} min`,
      enNotice: "English version in preparation: some content still appears in Hebrew.", footerYT: "YouTube channel",
    },
  };
  let lang = store.get("lang", "he") === "en" ? "en" : "he";
  const t = () => T[lang];
  const L = (obj, key) => (lang === "en" && obj?.[key + "_en"]) || obj?.[key];

  // ---------- helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (iso) =>
    iso ? new Date(iso + "T12:00:00").toLocaleDateString(lang === "en" ? "en-GB" : "he-IL", { day: "numeric", month: "long", year: "numeric" }) : "";
  const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
  const ytEmbed = (id, start) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ""}`;
  const gammaDoc = (id) => `https://gamma.app/docs/${id}`;
  const gammaEmbed = (id) => `https://gamma.app/embed/${id}`;
  const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview`;
  const driveView = (id) => `https://drive.google.com/file/d/${id}/view`;
  const driveThumb = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1280`;
  const fileUrl = (f) => (f.doc ? `https://docs.google.com/document/d/${f.doc}/edit` : driveView(f.drive));
  const toSec = (ts) => ts.split(":").map(Number).reduce((a, b) => a * 60 + b, 0);
  const toMinutes = (dur) => {
    if (!dur) return 10; // a deck ≈ 10 minutes of reading
    const p = dur.split(":").map(Number);
    return p.length === 3 ? p[0] * 60 + p[1] : Math.max(1, p[0] + Math.round(p[1] / 60));
  };

  // ---------- indexes ----------
  const lessons = [...S.workshops, ...S.bonus];
  const listOf = (w) => (S.workshops.includes(w) ? S.workshops : S.bonus);
  const sectionOf = (w) => (S.workshops.includes(w) ? "kaye" : "bonus");

  const allVideos = new Map();
  S.mini.forEach((g) => g.items.forEach((v) => allVideos.set(v.id, { ...v, tool: g.tool })));
  lessons.forEach((w) => w.video?.id && !allVideos.has(w.video.id) && allVideos.set(w.video.id, { id: w.video.id, title: w.title, dur: w.video.dur, lesson: w.id }));

  const allGammas = new Map();
  S.library.forEach((tp) => tp.items.forEach(([id, title]) => allGammas.set(id, { id, title, topic: tp.topic })));
  lessons.forEach((w) => w.gamma && !allGammas.has(w.gamma.id) && allGammas.set(w.gamma.id, { id: w.gamma.id, title: w.gamma.title }));
  Object.entries(S.extraGammas || {}).forEach(([id, title]) => !allGammas.has(id) && allGammas.set(id, { id, title }));
  const gammaTitle = (id) => allGammas.get(id)?.title || t().kind.deck;

  const lessonsUsingVideo = (id) => lessons.filter((w) => w.related?.videos?.includes(id));
  const lessonsUsingDeck = (id) => lessons.filter((w) => w.gamma?.id === id || w.related?.gammas?.includes(id));

  // ---------- learner state ----------
  // refs: lesson id ("w3"), "v:<youtube id>", "g:<gamma id>"
  let journey = { level: null, goal: null, goals: [], pace: null, done: [], ...store.get("journey-v1", {}) };
  if (!Array.isArray(journey.goals)) journey.goals = [];
  if (journey.goal && !journey.goals.length) journey.goals = [journey.goal]; // older single-topic paths
  const saveJourney = () => { journey.goal = journey.goals[0] || null; store.set("journey-v1", journey); };
  const hasPath = () => !!(journey.level && journey.goals.length && journey.pace);
  const myGoals = () => journey.goals.map((id) => J.goals.find((x) => x.id === id)).filter(Boolean);
  const goalLabels = () => myGoals().map((g) => L(g, "label")).join(" · ");
  let goalPick = null; // topics being picked in the onboarding (several allowed)
  const isDone = (ref) => journey.done.includes(ref);
  const setDone = (ref, on) => {
    journey.done = on ? [...new Set([...journey.done, ref])] : journey.done.filter((r) => r !== ref);
    saveJourney();
  };
  let flash = null; // one-time message shown on the next page
  let jumpToPractice = false; // scroll to the practice card after the next page renders

  function resolveRef(ref) {
    if (ref.startsWith("v:")) {
      const v = allVideos.get(ref.slice(2));
      return v && { ref, title: v.title, href: `#v-${v.id}`, kind: t().kind.video, mins: toMinutes(v.dur), type: "video" };
    }
    if (ref.startsWith("g:")) {
      const id = ref.slice(2);
      return { ref, title: gammaTitle(id), href: `#g-${id}`, kind: t().kind.deck, mins: 10, type: "deck" };
    }
    const w = lessons.find((x) => x.id === ref);
    if (!w) return null;
    const mins = w.video?.dur ? toMinutes(w.video.dur) : w.video ? 75 : 10;
    return { ref, title: L(w, "title"), href: `#${w.id}`, kind: !w.video ? t().kind.materials : t().kind.rec, mins, type: "lesson", highlights: !!w.chapters?.length };
  }

  // the path: stages → steps → units sized to the learner's weekly time
  function pathStages() {
    const gs = myGoals();
    if (!gs.length) return [];
    // several topics: their steps are merged stage by stage, without repeats
    const seen = new Set();
    const pick = (refs) => refs.filter((r) => !seen.has(r) && seen.add(r));
    const all = (k) => gs.flatMap((g) => g[k] || []);
    const st = (key, refs, optional = false) => ({ key, refs: pick(refs), optional });
    const stages =
      journey.level === "beginner"
        ? [st("foundations", J.foundations), st("extra", J.foundationsExtra || [], true), st("core", all("core")), st("responsibility", J.responsibility)]
        : journey.level === "intermediate"
        ? [st("core", all("core")), st("deeper", all("deeper")), st("responsibility", J.responsibility)]
        : [st("core", all("core")), st("deeper", all("deeper")), st("advanced", all("advanced"))];
    stages.push(st("bonus", all("bonus"), true));
    return stages.map((s) => ({ ...s, items: s.refs.map(resolveRef).filter(Boolean) }));
  }
  function pathSteps() {
    return pathStages().flatMap((s) => s.items.map((it) => ({ ...it, stage: s.key, optional: s.optional })));
  }
  function pathUnits() {
    const cap = Math.max(30, journey.pace || 60);
    const units = [];
    let cur = null;
    pathSteps().forEach((step) => {
      if (step.optional) { (cur || (cur = { steps: [], mins: 0 })).steps.push(step); return; }
      if (!cur || (cur.mins > 0 && cur.mins + step.mins > cap)) { cur = { steps: [], mins: 0 }; units.push(cur); }
      cur.steps.push(step);
      cur.mins += step.mins;
    });
    if (cur && !units.includes(cur)) units.push(cur);
    return units.map((u, i) => ({ ...u, n: i + 1, done: u.steps.filter((s) => !s.optional).every((s) => isDone(s.ref)) }));
  }
  const requiredSteps = () => pathSteps().filter((s) => !s.optional);
  const nextStep = () => requiredSteps().find((s) => !isDone(s.ref));
  function stepInfo(ref) {
    if (!hasPath()) return null;
    const req = requiredSteps();
    const all = pathSteps();
    const step = all.find((s) => s.ref === ref);
    if (!step) return null;
    const units = pathUnits();
    const unit = units.find((u) => u.steps.some((s) => s.ref === ref));
    return { step, unit, index: req.findIndex((s) => s.ref === ref) + 1, total: req.length };
  }
  const whyFor = (stageKey) => {
    if (stageKey === "core") return `${J.stageWhy.core}: ${goalLabels()}.`;
    return J.stageWhy[stageKey] || "";
  };
  function taskFor(ref) {
    const w = lessons.find((x) => x.id === ref);
    if (w) return L(w, "task") || t().taskFallback.lesson;
    return J.tasks?.[ref] || (ref.startsWith("v:") ? t().taskFallback.video : t().taskFallback.deck);
  }

  // ---------- shared pieces ----------
  const head = (eyebrow, title, intro) =>
    `<div class="section__head">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}<h2>${esc(title)}</h2>${intro ? `<p>${esc(intro)}</p>` : ""}</div>`;
  const crumbs = (items) =>
    `<nav class="crumbs" aria-label="breadcrumbs"><a href="#">${t().home}</a>${items.map(([href, label]) => `<span aria-hidden="true">›</span><a href="${href}">${esc(label)}</a>`).join("")}</nav>`;
  const missingChips = (w) => {
    const c = [];
    if (!w.video) c.push(`<span class="chip chip--off">${w.recording === "hidden" ? t().recHiddenChip : t().noVideo}</span>`);
    if (!w.gamma && !w.pdf) c.push(`<span class="chip chip--off">${t().noDeck}</span>`);
    return c.length ? `<span class="chips">${c.join("")}</span>` : "";
  };
  const dur = (w) => (w.video?.dur ? `<span class="time">${esc(w.video.dur)}</span>` : "");

  const HUES = ["teal", "amber", "plum", "blue", "green"];
  const hueFor = (key) => HUES[[...String(key)].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
  const poster = (label, title, key) =>
    `<span class="poster poster--${hueFor(key)}"><span class="poster__label">${esc(label)}</span><span class="poster__title">${esc(title)}</span></span>`;

  function trackList(list) {
    return `<ol class="track">${list
      .map(
        (w, i) => `<li><a class="row${isDone(w.id) ? " is-done" : ""}" href="#${w.id}">
          <span class="row__n"><span>${isDone(w.id) ? "✓" : i + 1}</span></span>
          <span class="row__body"><span class="row__title">${esc(L(w, "title"))}</span><span class="row__sum">${esc(L(w, "summary"))}</span></span>
          <span class="row__meta">${dur(w)}${missingChips(w)}${isDone(w.id) ? `<span class="chip">${t().done}</span>` : ""}</span>
        </a></li>`
      )
      .join("")}</ol>`;
  }

  function player(v, label, title) {
    const attr = v.drive ? `data-drive="${esc(v.drive)}"` : `data-yt="${esc(v.id)}"`;
    const img = v.drive ? driveThumb(v.drive) : ytThumb(v.id);
    return `<div class="player" ${attr}>
      ${poster(label, title, v.drive || v.id)}
      <img src="${img}" alt="" loading="lazy" onerror="this.remove()">
      <button type="button" aria-label="${t().play}"><span class="play"></span></button>
    </div>`;
  }
  const deck = (src) =>
    `<div class="deck" data-loading="${t().loadingDeck}"><iframe src="${src}" title="${t().kind.deck}" loading="lazy" allow="fullscreen" allowfullscreen></iframe></div>`;
  function linkList(items) {
    return `<ul class="links">${items
      .map((it) => `<li><a href="${it.href}"${it.ext ? ' target="_blank" rel="noopener"' : ""}><span>${esc(it.title)}</span><span class="time">${esc(it.meta || "")}</span></a></li>`)
      .join("")}</ul>`;
  }
  const videoItems = (ids) => ids.map((id) => allVideos.get(id)).filter(Boolean).map((v) => ({ href: `#v-${v.id}`, title: v.title, meta: v.dur }));
  const deckItems = (ids) => ids.map((id) => ({ href: `#g-${id}`, title: gammaTitle(id), meta: t().kind.deck }));
  const doneButton = (ref) =>
    `<button type="button" class="done-btn" data-toggle-done="${esc(ref)}" aria-pressed="${isDone(ref)}">${isDone(ref) ? t().watched : t().markWatched}</button>`;

  const chaptersBox = (w) =>
    w.chapters?.length && w.video?.id
      ? `<section class="chapters"><h2>${t().chaptersTitle}</h2><p>${t().chaptersIntro}</p><ol>${w.chapters
          .map(([ts, label]) => `<li><button type="button" data-seek="${toSec(ts)}" data-vid="${esc(w.video.id)}"><span class="time">${esc(ts)}</span><span>${esc(label)}</span></button></li>`)
          .join("")}</ol></section>`
      : "";
  // structured practice where one exists, otherwise the short task
  const PR = S.practices || {};
  const prState = (pid) => (journey.practice ||= {})[pid] ||= { checks: [], note: "", quiz: {} };
  const prTouched = (pid) => {
    const st = journey.practice?.[pid];
    return !!st && (st.note?.trim() || st.checks?.some(Boolean) || Object.keys(st.quiz || {}).length);
  };
  function practiceCard(ref) {
    const p = PR[ref];
    const x = t().pr;
    const st = journey.practice?.[p.id] || { checks: [], note: "", quiz: {} };
    return `<section class="practice" id="practice" data-pid="${p.id}">
      <div class="practice__head"><span class="practice__badge">✎ ${x.badge} · ${esc(L(p, "time"))}</span><h2>${esc(L(p, "title"))}</h2></div>
      <p class="practice__goal"><strong>${x.goal}:</strong> ${esc(L(p, "goal"))}</p>
      ${p.why ? `<p class="practice__why"><strong>${x.why}:</strong> ${esc(L(p, "why"))}</p>` : ""}
      ${(() => {
        const w = lessons.find((l) => l.id === ref);
        return p.watch && w?.video?.id
          ? `<p class="practice__watch">${x.watch} <button type="button" class="linkbtn" data-seek="${toSec(p.watch[0])}" data-vid="${esc(w.video.id)}"><span class="time">${esc(p.watch[0])}</span> · ${esc(p.watch[1])}</button></p>`
          : "";
      })()}
      <div class="practice__block"><h3>${x.steps}</h3><ol>${L(p, "steps").map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
      ${(() => {
        const tpls = L(p, "templates") || (p.template ? [L(p, "template")] : []);
        return tpls.length
          ? `<div class="practice__block"><h3>${x.template}</h3>${tpls
              .map((tp, ti) => `<div class="tpl">${tpls.length > 1 ? `<span class="tpl__n">${x.tplN(ti + 1)}</span>` : ""}<p class="tpl__text">${esc(tp)}</p><button type="button" class="tpl__copy" data-copy>${x.copy}</button></div>`)
              .join("")}</div>`
          : "";
      })()}
      ${L(p, "quiz")
        .map((q, qi) => {
          const ans = st.quiz?.[qi];
          return `<div class="practice__block quiz"><h3>${x.quiz}</h3><p class="quiz__q">${esc(q.q)}</p><div class="quiz__opts">${q.options
            .map((o, oi) => {
              const cls = ans == null ? "" : oi === q.answer ? " is-right" : oi === ans ? " is-wrong" : "";
              return `<button type="button" class="quiz__opt${cls}" data-quiz="${qi}" data-opt="${oi}" ${ans != null ? "disabled" : ""}>${esc(o)}</button>`;
            })
            .join("")}</div>${ans != null ? `<p class="quiz__fb ${ans === q.answer ? "ok" : "no"}"><strong>${ans === q.answer ? x.right : x.wrong}</strong> ${esc(q.explain)}</p>` : ""}</div>`;
        })
        .join("")}
      ${L(p, "reflect")?.length ? `<div class="practice__block"><h3>${x.reflect}</h3><ul class="reflect">${L(p, "reflect").map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>` : ""}
      ${p.pitfall ? `<p class="pitfall"><strong>${x.pitfall}:</strong> ${esc(L(p, "pitfall"))}</p>` : ""}
      <div class="practice__block"><h3>${x.check}</h3><ul class="checks">${L(p, "checks")
        .map((c, ci) => `<li><label><input type="checkbox" data-pcheck="${ci}" ${st.checks?.[ci] ? "checked" : ""}> <span>${esc(c)}</span></label></li>`)
        .join("")}</ul></div>
      <div class="practice__block"><label class="note-label" for="note-${p.id}">${x.output(esc(L(p, "output")))}</label>
        <textarea id="note-${p.id}" class="note" data-pnote rows="3" placeholder="${x.notePh}">${esc(st.note || "")}</textarea>
        <p class="practice__foot"><span class="meta" data-saved hidden>${x.saved}</span><a href="#portfolio">${x.allMine}</a></p></div>
    </section>`;
  }
  const taskBox = (ref) =>
    PR[ref] ? practiceCard(ref) : `<section class="task"><h2>${t().taskTitle}</h2><p>${esc(taskFor(ref))}</p></section>`;

  function portfolioPage() {
    const x = t().pr;
    const items = Object.entries(PR).filter(([, p]) => prTouched(p.id));
    const body = items.length
      ? `<div class="pf__tools"><button type="button" class="btn" data-pf-copy>${x.pfCopy}</button><button type="button" class="btn btn--ghost" data-pf-download>${x.pfDownload}</button></div>
         <ol class="pf">${items
           .map(([ref, p]) => {
             const st = journey.practice[p.id];
             const href = resolveRef(ref)?.href || "#";
             const n = (st.checks || []).filter(Boolean).length;
             return `<li class="pf__item"><div class="pf__head"><span class="practice__badge">✎ ${p.id}</span><h3>${esc(L(p, "title"))}</h3><span class="meta">${x.pfChecks(n, L(p, "checks").length)}</span></div>
               <p class="pf__label">${esc(L(p, "output"))}</p>
               <p class="pf__note">${st.note?.trim() ? linkify(st.note) : "—"}</p>
               <a href="${href}" data-jump>${x.pfOpen}</a></li>`;
           })
           .join("")}</ol>`
      : `<p class="empty">${x.pfEmpty}</p>`;
    return `${crumbs([])}<section class="section">${head("", x.pfTitle, x.pfIntro)}${body}</section>`;
  }
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g, "<br>");
  function portfolioText() {
    return Object.entries(PR)
      .filter(([, p]) => prTouched(p.id))
      .map(([, p]) => {
        const st = journey.practice[p.id];
        const checks = L(p, "checks").map((c, i) => `${st.checks?.[i] ? "[x]" : "[ ]"} ${c}`).join("\n");
        const qs = (L(p, "reflect") || []).map((r) => `- ${r}`).join("\n");
        return `## ${p.id} · ${L(p, "title")}\n${L(p, "output")}:\n${st.note || "—"}\n\n${checks}${qs ? `\n\n${qs}` : ""}`;
      })
      .join("\n\n---\n\n");
  }

  // the focused frame around any page that is a step of the learner's path
  function guidedFrame(ref, title, media, more) {
    const info = stepInfo(ref);
    const nxt = (() => {
      const req = requiredSteps();
      const i = req.findIndex((s) => s.ref === ref);
      return req.slice(i + 1).find((s) => !isDone(s.ref)) || null;
    })();
    const isLast = !nxt && info.step && !info.step.optional;
    return `
      ${crumbs([["#start", t().nav.start]])}
      <article class="lesson guided">
        <header class="lesson__head">
          <span class="eyebrow">${info.step.optional ? `${t().unit(info.unit.n)} · ${t().optional}` : t().stepHead(t().unit(info.unit.n), info.index, info.total, info.step.mins)}</span>
          <h1>${esc(title)}</h1>
          <p class="why">${esc(whyFor(info.step.stage))}</p>
        </header>
        ${media}
        ${taskBox(ref)}
        <div class="finish">
          <button type="button" class="btn btn--big" data-complete="${esc(ref)}">${isLast ? t().finishLast : t().finishNext}</button>
          <a href="#start" class="linkbtn">${t().notYet}</a>
        </div>
        ${more ? `<details class="more"><summary>${t().moreHere}</summary><div class="more__body">${more}</div></details>` : ""}
      </article>`;
  }

  // ---------- onboarding and path ----------
  function onboarding() {
    const steps = [
      ["level", J.levels.map((o) => ({ id: o.id, label: L(o, "label"), hint: L(o, "hint") }))],
      ["goal", J.goals.map((o) => ({ id: o.id, label: L(o, "label") }))],
      ["pace", J.paces.map((o) => ({ id: o.id, label: L(o, "label"), hint: L(o, "hint") }))],
    ];
    const i = !journey.level ? 0 : !journey.goals.length ? 1 : 2;
    const [key, opts] = steps[i];
    const multi = key === "goal";
    if (multi && !goalPick) goalPick = [];
    return `
      <section class="onboard" aria-live="polite">
        <div class="onboard__top">
          <span class="eyebrow">${t().qCount(i + 1, 3)}</span>
          <span class="dots" aria-hidden="true">${[0, 1, 2].map((j) => `<i class="${j <= i ? "on" : ""}"></i>`).join("")}</span>
        </div>
        <h1><span class="exam">${t().exam}:</span> ${t().q[i]}</h1>
        ${i === 0 ? `<p class="onboard__intro">${t().examIntro}</p>` : ""}
        ${multi ? `<p class="onboard__intro">${t().multiHint}</p>` : ""}
        <div class="choices ${multi ? "choices--goals" : "choices--arch"}">${opts
          .map(
            (o, oi) => multi
              ? `<button type="button" class="choice" data-pick-goal="${o.id}" aria-pressed="${goalPick.includes(o.id)}">
              <span class="choice__num">${goalPick.includes(o.id) ? "✓" : ROMAN[oi]}</span>
              <span class="choice__label">${esc(o.label)}</span>
            </button>`
              : `<button type="button" class="choice" data-set="${key}" data-val="${o.id}">
              <span class="choice__num">${ROMAN[oi]}</span>
              <span class="choice__label">${esc(o.label)}</span>${o.hint ? `<span class="choice__hint">${esc(o.hint)}</span>` : ""}
            </button>`
          )
          .join("")}</div>
        ${multi ? `<button type="button" class="btn btn--big" data-goals-next ${goalPick.length ? "" : "disabled"}>${t().goalsNext(goalPick.length)}</button>` : ""}
        ${i > 0 ? `<button type="button" class="linkbtn" data-back="${steps[i - 1][0]}">→ ${t().back}</button>` : ""}
      </section>`;
  }

  function pathPage() {
    const units = pathUnits();
    const req = requiredSteps();
    const total = req.reduce((s, x) => s + x.mins, 0);
    const doneN = req.filter((s) => isDone(s.ref)).length;
    const nxt = nextStep();
    const curUnit = units.find((u) => !u.done);
    const per = Math.max(30, journey.pace);
    const weeks = Math.max(1, Math.ceil(total / journey.pace));
    const lv = J.levels.find((x) => x.id === journey.level);
    return `
      ${crumbs([])}
      <section class="pathpage">
        <div class="section__head">
          <span class="eyebrow">${esc(L(lv, "label"))} · ${esc(goalLabels())}</span>
          <h1>${doneN ? t().nav.start : t().ready}</h1>
          <p>${t().pathSummary(units.length, per, weeks)}</p>
        </div>
        <div class="bar bar--big" role="progressbar" aria-valuemin="0" aria-valuemax="${req.length}" aria-valuenow="${doneN}"><span style="width:${(doneN / req.length) * 100}%"></span></div>
        ${nxt ? `<a class="btn btn--big" href="${nxt.href}">${doneN ? t().continueBtn : t().start}: ${esc(nxt.title)} ←</a>` : finishedBox()}
        <ol class="units">${units
          .map((u) => {
            const open = u === curUnit;
            return `<li class="unit${u.done ? " is-done" : ""}${open ? " is-current" : ""}">
              <details ${open ? "open" : ""}>
                <summary><span class="unit__n">${u.done ? "✓" : u.n}</span><span class="unit__title">${t().unit(u.n)}</span><span class="unit__meta">${u.done ? t().unitDone : t().mins(u.mins)}</span></summary>
                <ol class="unit__steps">${u.steps
                  .map(
                    (s) => `<li class="${isDone(s.ref) ? "is-done" : ""}">
                      <label class="check"><input type="checkbox" data-done="${esc(s.ref)}" ${isDone(s.ref) ? "checked" : ""}><span class="sr">${t().markWatched}</span></label>
                      <a href="${s.href}"><span class="path__title">${esc(s.title)}</span><span class="path__kind">${esc(s.kind)} · ${t().mins(s.mins)}${s.highlights ? ` · ${t().hasHighlights}` : ""}${s.optional ? ` · ${t().optional}` : ""}${PR[s.ref] ? ` · <strong class="pr-mark">${t().pr.inPath}</strong>` : ""}</span></a>
                    </li>`
                  )
                  .join("")}</ol>
              </details>
            </li>`;
          })
          .join("")}</ol>
        <button type="button" class="linkbtn" data-reset>${t().changePath}</button>
      </section>`;
  }

  function finishedBox() {
    return `<div class="finished"><h2>${t().allDoneTitle}</h2><p>${t().allDoneText}</p>
      <div class="finished__goals"><span>${t().otherGoal}</span>${J.goals
        .filter((g) => !journey.goals.includes(g.id))
        .map((g) => `<button type="button" class="choice choice--small" data-switch-goal="${g.id}">${esc(L(g, "label"))}</button>`)
        .join("")}</div></div>`;
  }

  // ---------- pages ----------
  function aboutSection() {
    const A = S.about;
    return `
      <section class="section about" id="about">
        ${head(t().aboutEyebrow, A.name)}
        <div class="about__body">
          <img class="about__photo" src="${A.photo}" alt="${esc(A.name)}" width="160" height="160">
          <div class="about__text">
            <p class="about__role">${esc(L(A, "role"))}</p>
            ${(L(A, "paragraphs") || []).map((p) => `<p>${esc(p)}</p>`).join("")}
            <h3>${t().aboutPubs}</h3>
            <ul class="pubs">${A.publications
              .map((p) => typeof p === "string" ? `<li>${esc(p)}</li>` : `<li>${esc(p.text)}${p.venue ? ` <span class="pubs__venue">${esc(p.venue)}</span>` : ""}${p.url ? ` <a href="${p.url}" target="_blank" rel="noopener">${t().pubRead}</a>` : ""}${p.site ? ` <a href="${p.site}">${t().pubSite}</a>` : ""}</li>`)
              .join("")}</ul>
            <h3>${t().aboutContact}</h3>
            <p class="about__links"><span class="email">${esc(A.email)}</span>${A.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</p>
          </div>
        </div>
      </section>`;
  }

  function materialCards() {
    const count = (list) => list.filter((w) => isDone(w.id)).length;
    const card = (key, n, list) => {
      const [title, sub] = t().cards[key];
      const prog = list ? `<span class="card2__prog"><span class="bar"><span style="width:${(count(list) / list.length) * 100}%"></span></span><span class="meta">${t().progressOf(count(list), list.length)}</span></span>` : "";
      return `<a class="card2 card2--${key}" href="#${key}"><span class="card2__n">${n}</span><span class="card2__title">${title}</span><span class="card2__sub">${sub}</span>${prog}</a>`;
    };
    return `<div class="cards2">
      ${card("kaye", S.workshops.length, S.workshops)}
      ${card("bonus", S.bonus.length)}
      ${card("mini", S.mini.reduce((n, g) => n + g.items.length, 0))}
      ${card("library", S.library.reduce((n, tp) => n + tp.items.length, 0))}
    </div>`;
  }

  function home() {
    if (!hasPath()) {
      return `
        <section class="hero hero--college">
          <div class="hero__text">
            <span class="eyebrow">${t().heroEyebrow}</span>
            <h1>${t().heroH1a}<br><em class="wine">${t().heroH1b}</em></h1>
            <p>${t().heroLead}</p>
            <div class="hero__cta"><a class="btn btn--big" href="#start">${t().heroCta}</a><a class="linkbtn" href="#all">${t().heroBrowse}</a></div>
            <p class="hero__note">${t().heroNote}</p>
          </div>
          <figure class="arch">
            <span class="arch__frame"><img src="${S.about.photo}" alt="${esc(S.about.name)}"></span>
            <figcaption>${t().portraitCaption}</figcaption>
          </figure>
        </section>
        <section class="section">
          <h2 class="small-h">${t().howTitle}</h2>
          <ol class="how">${t().how.map(([a, b], i) => `<li><span class="how__n">${ROMAN[i]}</span><strong>${a}</strong><span>${b}</span></li>`).join("")}</ol>
        </section>
        ${aboutSection()}`;
    }
    const nxt = nextStep();
    const units = pathUnits();
    const doneUnits = units.filter((u) => u.done).length;
    const info = nxt && stepInfo(nxt.ref);
    return `
      <section class="continue">
        <span class="eyebrow">${t().hello}</span>
        ${
          nxt
            ? `<div class="continue__card">
                <span class="continue__label">${t().nextTitle} · ${t().unit(info.unit.n)}</span>
                <h1>${esc(nxt.title)}</h1>
                <p class="continue__meta">${esc(nxt.kind)} · ${t().mins(nxt.mins)}</p>
                <p class="why">${esc(whyFor(nxt.stage))}</p>
                <div class="hero__cta"><a class="btn btn--big" href="${nxt.href}">${t().continueBtn} ←</a><a class="linkbtn" href="#start">${t().fullPath}</a></div>
              </div>`
            : finishedBox()
        }
        <div class="unitbar">
          <span class="meta">${t().unitsProgress(doneUnits, units.length)}</span>
          <span class="unitbar__cells" aria-hidden="true">${units.map((u) => `<i class="${u.done ? "on" : u === units.find((x) => !x.done) ? "here" : ""}"></i>`).join("")}</span>
        </div>
      </section>
      <section class="section">
        ${head("", t().exploreTitle, t().exploreIntro)}
        ${materialCards()}
      </section>
      ${aboutSection()}`;
  }

  const allPage = () => `${crumbs([])}<section class="section">${head("", t().nav.all, t().exploreIntro)}${materialCards()}</section>`;
  const kayePage = () => `${crumbs([["#all", t().nav.all]])}<section class="section">${head(t().kayeEyebrow, t().kayeTitle, t().kayeIntro(S.workshops.length))}${trackList(S.workshops)}</section>`;
  const bonusPage = () => `${crumbs([["#all", t().nav.all]])}<section class="section">${head(t().bonusEyebrow, t().bonusTitle)}
    <div class="cards">${S.bonus
      .map(
        (w) => `<a class="card${isDone(w.id) ? " is-done" : ""}" href="#${w.id}">
          <span class="thumb">${poster(t().bonusEyebrow, L(w, "title"), w.id)}${w.video?.dur ? `<span class="time">${esc(w.video.dur)}</span>` : ""}</span>
          <span class="card__body"><span class="card__title">${isDone(w.id) ? "✓ " : ""}${esc(L(w, "title"))}</span><span class="card__sum">${esc(L(w, "summary"))}</span></span>
        </a>`
      )
      .join("")}</div></section>`;
  const miniPage = () => `${crumbs([["#all", t().nav.all]])}<section class="section">${head(t().miniEyebrow, t().miniTitle, t().miniIntro)}
    <div class="shelves">${S.mini
      .map((g) => `<div class="shelf"><h3>${esc(g.tool)}</h3>${linkList(g.items.map((v) => ({ href: `#v-${v.id}`, title: (isDone("v:" + v.id) ? "✓ " : "") + v.title, meta: v.dur })))}</div>`)
      .join("")}</div></section>`;
  const libraryPage = () => `${crumbs([["#all", t().nav.all]])}<section class="section">${head(t().libEyebrow, t().libTitle)}
    <label class="sr" for="lib-filter">${t().libFilter}</label>
    <input class="filter" id="lib-filter" type="search" placeholder="${t().libFilter}">
    <div class="lib" id="lib">${S.library
      .map(
        (tp) => `<details data-topic>
          <summary>${esc(tp.topic)}<span class="count">${tp.items.length}</span></summary>
          <ul>${tp.items.map(([id, title]) => `<li data-title="${esc(title.toLowerCase())}"><a href="#g-${esc(id)}">${isDone("g:" + id) ? "✓ " : ""}${esc(title)}</a></li>`).join("")}</ul>
        </details>`
      )
      .join("")}<p class="empty" id="lib-none" hidden>${t().libNone}</p></div></section>`;

  function lessonMedia(w) {
    const list = listOf(w);
    const i = list.indexOf(w);
    const unit = t().workshop;
    const tabs = [];
    tabs.push([
      "rec",
      t().tabRec,
      w.video
        ? `<div class="panel__head"><span></span><a href="${w.video.drive ? driveView(w.video.drive) : ytWatch(w.video.id)}" target="_blank" rel="noopener">${w.video.drive ? t().openDrive : t().openYT}</a></div>${player(w.video, unit + " " + (i + 1), L(w, "title"))}`
        : `<p class="empty">${w.recording === "hidden" ? t().recHidden : t().noVideoText(unit)}</p>`,
    ]);
    tabs.push([
      "deck",
      t().tabDeck,
      w.gamma
        ? `<div class="panel__head"><span></span><a href="${gammaDoc(w.gamma.id)}" target="_blank" rel="noopener">${t().fullscreen}</a></div>${deck(gammaEmbed(w.gamma.id))}`
        : w.pdf
        ? `<div class="panel__head"><span></span><a href="${driveView(w.pdf.drive)}" target="_blank" rel="noopener">${t().fullscreen}</a></div>${deck(drivePreview(w.pdf.drive))}`
        : `<p class="empty">${t().noDeckText(unit)}</p>`,
    ]);
    if (w.files?.length) tabs.push(["files", t().tabFiles, linkList(w.files.map((f) => ({ href: fileUrl(f), title: f.title, meta: "↗", ext: true })))]);
    const first = w.video ? "rec" : "deck";
    return `<section class="tabs" data-tabs>
        <div class="tabs__list" role="tablist">${tabs
          .map(([id, name]) => `<button type="button" role="tab" id="tab-${id}" aria-controls="pane-${id}" aria-selected="${id === first}" data-tab="${id}">${name}</button>`)
          .join("")}</div>
        ${tabs.map(([id, , body]) => `<div class="tabs__pane" role="tabpanel" id="pane-${id}" aria-labelledby="tab-${id}" ${id === first ? "" : "hidden"}>${body}</div>`).join("")}
      </section>
      ${chaptersBox(w)}`;
  }

  function lessonExtras(w) {
    const list = listOf(w);
    const i = list.indexOf(w);
    const rel = w.related || { videos: [], gammas: [] };
    const learn = L(w, "learn");
    return `
      ${learn?.length ? `<section class="learn"><h2>${t().learnTitle}</h2><ul>${learn.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
      ${
        rel.videos.length || rel.gammas.length
          ? `<section class="panel"><div class="panel__head"><h2>${t().deeper}</h2></div><div class="related">
              ${rel.videos.length ? `<div class="shelf"><h3>${t().shortVideos}</h3>${linkList(videoItems(rel.videos))}</div>` : ""}
              ${rel.gammas.length ? `<div class="shelf"><h3>${t().moreDecks}</h3>${linkList(deckItems(rel.gammas))}</div>` : ""}
            </div></section>`
          : ""
      }
      <nav class="pager">
        ${list[i - 1] ? `<a href="#${list[i - 1].id}"><small>${t().prev}</small><strong>${esc(L(list[i - 1], "title"))}</strong></a>` : "<span></span>"}
        ${list[i + 1] ? `<a href="#${list[i + 1].id}"><small>${t().next}</small><strong>${esc(L(list[i + 1], "title"))}</strong></a>` : "<span></span>"}
      </nav>`;
  }

  // a dated note when a tool shown in the recording has changed since
  const updateNote = (w) => (L(w, "update") ? `<aside class="update-note" role="note">${esc(L(w, "update"))}</aside>` : "");

  function lessonPage(w) {
    if (stepInfo(w.id)) return guidedFrame(w.id, L(w, "title"), lessonMedia(w), `<p class="summary">${esc(L(w, "summary"))}</p>${updateNote(w)}${lessonExtras(w)}`);
    const list = listOf(w);
    const sec = sectionOf(w);
    const i = list.indexOf(w);
    const unit = t().workshop;
    const label = sec === "kaye" ? t().kayeTitle : t().bonusTitle;
    return `
      ${crumbs([["#all", t().nav.all], [`#${sec}`, label]])}
      <article class="lesson">
        <header class="lesson__head">
          <span class="eyebrow">${sec === "bonus" ? esc(t().bonusEyebrow) : `${unit} ${i + 1} ${t().of} ${list.length}`}</span>
          <h1>${esc(L(w, "title"))}</h1>
          <p>${esc(L(w, "summary"))}</p>
          <div class="lesson__meta">${w.date ? `<span class="meta">${fmtDate(w.date)}</span>` : ""}${dur(w)}${missingChips(w)}${doneButton(w.id)}</div>
        </header>
        ${updateNote(w)}
        ${lessonMedia(w)}
        ${taskBox(w.id)}
        ${lessonExtras(w)}
      </article>`;
  }

  function videoMore(v) {
    const group = S.mini.find((g) => g.items.some((x) => x.id === v.id));
    const others = group ? group.items.filter((x) => x.id !== v.id).map((x) => x.id) : [];
    const users = lessonsUsingVideo(v.id);
    return others.length || users.length
      ? `<section class="panel"><div class="related">
          ${others.length ? `<div class="shelf"><h3>${t().moreFrom(v.tool)}</h3>${linkList(videoItems(others))}</div>` : ""}
          ${users.length ? `<div class="shelf"><h3>${t().partOf}</h3>${linkList(users.map((w) => ({ href: `#${w.id}`, title: L(w, "title"), meta: w.video?.dur || "" })))}</div>` : ""}
        </div></section>`
      : "";
  }
  function videoPage(v) {
    const media = `<section class="panel"><div class="panel__head"><span></span><a href="${ytWatch(v.id)}" target="_blank" rel="noopener">${t().openYT}</a></div>${player(v, v.tool || t().kind.video, v.title)}</section>`;
    if (stepInfo("v:" + v.id)) return guidedFrame("v:" + v.id, v.title, media, videoMore(v));
    return `
      ${crumbs([["#all", t().nav.all], ["#mini", t().cards.mini[0]]])}
      <article class="lesson">
        <header class="lesson__head">
          ${v.tool ? `<span class="eyebrow">${esc(v.tool)}</span>` : ""}
          <h1>${esc(v.title)}</h1>
          <div class="lesson__meta">${v.dur ? `<span class="time">${esc(v.dur)}</span>` : ""}${doneButton("v:" + v.id)}</div>
        </header>
        ${media}
        ${taskBox("v:" + v.id)}
        ${videoMore(v)}
      </article>`;
  }

  function gammaMore(g) {
    const topic = S.library.find((tp) => tp.items.some(([id]) => id === g.id));
    const more = topic ? topic.items.filter(([id]) => id !== g.id).slice(0, 6).map(([id]) => id) : [];
    const users = lessonsUsingDeck(g.id);
    return more.length || users.length
      ? `<section class="panel"><div class="related">
          ${users.length ? `<div class="shelf"><h3>${t().partOf}</h3>${linkList(users.map((w) => ({ href: `#${w.id}`, title: L(w, "title"), meta: w.video?.dur || "" })))}</div>` : ""}
          ${more.length ? `<div class="shelf"><h3>${t().moreInTopic}</h3>${linkList(deckItems(more))}</div>` : ""}
        </div></section>`
      : "";
  }
  function gammaPage(g) {
    const media = `<section class="panel"><div class="panel__head"><span></span><a href="${gammaDoc(g.id)}" target="_blank" rel="noopener">${t().fullscreen}</a></div>${deck(gammaEmbed(g.id))}</section>`;
    if (stepInfo("g:" + g.id)) return guidedFrame("g:" + g.id, g.title, media, gammaMore(g));
    return `
      ${crumbs([["#all", t().nav.all], ["#library", t().cards.library[0]]])}
      <article class="lesson">
        <header class="lesson__head">
          ${g.topic ? `<span class="eyebrow">${esc(g.topic)}</span>` : ""}
          <h1>${esc(g.title)}</h1>
          <div class="lesson__meta">${doneButton("g:" + g.id)}</div>
        </header>
        ${media}
        ${taskBox("g:" + g.id)}
        ${gammaMore(g)}
      </article>`;
  }

  // ---------- search ----------
  const searchIndex = () => [
    ...lessons.map((w) => ({ title: L(w, "title"), text: [L(w, "summary"), ...(L(w, "learn") || []), ...(w.chapters || []).map((c) => c[1])].join(" "), href: `#${w.id}`, kind: resolveRef(w.id).kind })),
    ...[...allVideos.values()].filter((v) => v.tool).map((v) => ({ title: v.title, text: v.tool, href: `#v-${v.id}`, kind: t().kind.video })),
    ...[...allGammas.values()].map((g) => ({ title: g.title, text: g.topic || "", href: `#g-${g.id}`, kind: t().kind.deck })),
  ];
  // apostrophes are dropped so ג'ימיני and גימיני match each other
  const norm = (s) => String(s || "").toLowerCase().replace(/["'׳״`]/g, "").replace(/[\-–—]/g, " ");
  // Hebrew spellings of tool names → the names used in titles
  const ALIASES = { "נוטבוק": "notebooklm", "גימיני": "gemini", "גמיני": "gemini", "קנבה": "canva", "גאמא": "gamma", "גמא": "gamma",
    "נאפקין": "napkin", "וייב": "vibe", "צאט": "chatgpt", "פרפלקסיטי": "perplexity", "סטודיו": "studio", "בוט": "bot" };
  const variants = (w) => [w, ...Object.entries(ALIASES).filter(([he]) => he.startsWith(w) || w.startsWith(he)).map(([, en]) => en)];
  function runSearch(q) {
    const box = document.getElementById("q-results");
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) { box.hidden = true; box.innerHTML = ""; return; }
    const hits = searchIndex()
      .map((it) => {
        const ti = norm(it.title), tx = norm(it.text);
        const hit = (w) => variants(w).some((v) => ti.includes(v) || tx.includes(v));
        if (!words.every(hit)) return null;
        return { ...it, score: words.filter((w) => variants(w).some((v) => ti.includes(v))).length };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    box.innerHTML = hits.length
      ? hits.map((h) => `<a href="${h.href}"><span class="r__title">${esc(h.title)}</span><span class="r__kind">${esc(h.kind)}</span></a>`).join("")
      : `<p class="empty">${t().noResults}</p>`;
    box.hidden = false;
  }

  // ---------- router ----------
  const MATERIAL_ROUTES = new Set(["all", "kaye", "bonus", "mini", "library"]);
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const lesson = lessons.find((x) => x.id === h);
    let html, view = h || "home";
    if (lesson) html = lessonPage(lesson);
    else if (h === "start") html = hasPath() ? pathPage() : onboarding();
    else if (h === "all") html = allPage();
    else if (h === "portfolio") html = portfolioPage();
    else if (h === "kaye") html = kayePage();
    else if (h === "bonus") html = bonusPage();
    else if (h === "mini") html = miniPage();
    else if (h === "library") html = libraryPage();
    else if (h.startsWith("v-") && allVideos.has(h.slice(2))) html = videoPage(allVideos.get(h.slice(2)));
    else if (h.startsWith("g-")) html = gammaPage(allGammas.get(h.slice(2)) || { id: h.slice(2), title: t().kind.deck });
    else { html = home(); view = "home"; }

    const toast = flash ? `<p class="toast" role="status">${esc(flash)}</p>` : "";
    flash = null;
    app.innerHTML = (t().enNotice ? `<p class="notice">${t().enNotice}</p>` : "") + toast + html;
    app.dataset.view = view;
    if (jumpToPractice) { jumpToPractice = false; setTimeout(() => document.getElementById("practice")?.scrollIntoView(), 0); }
    else if (view === "home" && h) document.getElementById(h)?.scrollIntoView();
    else window.scrollTo(0, 0);

    const navKey = lesson || h.startsWith("v-") || h.startsWith("g-") ? (stepInfo(lesson ? lesson.id : h.replace(/^v-/, "v:").replace(/^g-/, "g:")) ? "start" : "all") : MATERIAL_ROUTES.has(h) ? "all" : h;
    document.querySelectorAll("#nav a").forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + navKey ? "page" : "false"));
    closeMenu();
    closeSearch();
    const h1 = (app.querySelector("h1") || app.querySelector("h2"))?.textContent;
    document.title = view === "home" ? `${L(S, "name")} | ${S.author}` : `${h1} | ${L(S, "name")}`;
  }

  // ---------- chrome ----------
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menu-btn");
  const q = document.getElementById("q");
  function chrome() {
    const x = t();
    document.documentElement.lang = lang;
    document.documentElement.dir = x.dir;
    document.getElementById("brand-name").textContent = L(S, "name");
    document.querySelector(".skip").textContent = x.skip;
    document.getElementById("q-label").textContent = x.searchLabel;
    q.placeholder = x.search;
    document.getElementById("menu-label").textContent = x.menu;
    const lb = document.getElementById("lang");
    lb.textContent = x.langBtn;
    lb.title = x.langTitle;
    nav.innerHTML = Object.entries(x.nav).map(([k, v]) => `<a href="#${k === "home" ? "" : k}">${v}</a>`).join("");
    document.getElementById("footer").innerHTML = `<span>© ${esc(S.author)}</span><span class="email">${esc(S.about.email)}</span><a href="https://www.youtube.com/@idanshavit3679" target="_blank" rel="noopener">${x.footerYT}</a>`;
  }
  const closeMenu = () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  const closeSearch = () => { document.getElementById("q-results").hidden = true; };

  menuBtn.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("lang").addEventListener("click", () => {
    lang = lang === "he" ? "en" : "he";
    store.set("lang", lang);
    chrome();
    route();
  });
  q.addEventListener("input", () => runSearch(q.value));
  q.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { q.value = ""; closeSearch(); }
    if (e.key === "Enter") document.querySelector("#q-results a")?.click();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) closeSearch();
    if (e.target.closest("#q-results a")) { q.value = ""; closeSearch(); }
  });

  // ---------- interactions inside pages ----------
  const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  app.addEventListener("click", (e) => {
    const set = e.target.closest("[data-set]");
    if (set) {
      const k = set.dataset.set;
      journey[k] = k === "pace" ? Number(set.dataset.val) : set.dataset.val;
      saveJourney();
      route();
      return;
    }
    const pg = e.target.closest("[data-pick-goal]");
    if (pg) {
      const id = pg.dataset.pickGoal;
      goalPick = goalPick.includes(id) ? goalPick.filter((x) => x !== id) : [...goalPick, id];
      route();
      return;
    }
    if (e.target.closest("[data-goals-next]") && goalPick?.length) {
      journey.goals = [...goalPick];
      goalPick = null;
      saveJourney();
      route();
      return;
    }
    const back = e.target.closest("[data-back]");
    if (back) {
      if (back.dataset.back === "goal") { goalPick = [...journey.goals]; journey.goals = []; }
      else journey[back.dataset.back] = null;
      saveJourney(); route(); return;
    }
    if (e.target.closest("[data-reset]")) {
      journey.level = journey.goal = journey.pace = null;
      journey.goals = [];
      goalPick = null;
      saveJourney();
      go("#start");
      return;
    }
    const sw = e.target.closest("[data-switch-goal]");
    if (sw) { journey.goals = [...journey.goals, sw.dataset.switchGoal]; saveJourney(); go("#start"); return; }

    // "done, next step"
    const fin = e.target.closest("[data-complete]");
    if (fin) {
      const ref = fin.dataset.complete;
      // gentle reminder, once, when a practice was skipped
      if (PR[ref] && !prTouched(PR[ref].id) && !fin.dataset.nudged) {
        fin.dataset.nudged = "1";
        const box = document.createElement("div");
        box.className = "nudge";
        box.setAttribute("role", "status");
        box.innerHTML = `<p>${t().pr.nudge}</p><div class="nudge__btns"><a class="btn" href="#practice" data-to-practice>${t().pr.toPractice}</a><button type="button" class="linkbtn" data-skip-practice="${esc(ref)}">${t().pr.skip}</button></div>`;
        fin.closest(".finish").after(box);
        return;
      }
      const before = pathUnits();
      setDone(ref, true);
      const after = pathUnits();
      const finishedUnit = after.find((u, i) => u.done && !before[i].done);
      const nxt = nextStep();
      if (!nxt) { flash = t().pathDoneToast; go("#start"); return; }
      if (finishedUnit) flash = t().unitDoneToast(finishedUnit.n);
      go(nxt.href);
      return;
    }
    if (e.target.closest("[data-jump]")) jumpToPractice = true;
    if (e.target.closest("[data-to-practice]")) {
      e.preventDefault();
      document.getElementById("practice")?.scrollIntoView({ block: "start" });
      return;
    }
    const skip = e.target.closest("[data-skip-practice]");
    if (skip) { app.querySelector(`[data-complete="${skip.dataset.skipPractice}"]`)?.click(); return; }

    // practice: copy template, answer quiz, portfolio export
    const cp = e.target.closest("[data-copy]");
    if (cp) {
      const text = cp.parentElement.querySelector(".tpl__text").textContent;
      const done = () => { cp.textContent = t().pr.copied; setTimeout(() => (cp.textContent = t().pr.copy), 1800); };
      navigator.clipboard?.writeText(text).then(done, () => {
        const r = document.createRange(); r.selectNodeContents(cp.parentElement.querySelector(".tpl__text"));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      });
      return;
    }
    const qo = e.target.closest("[data-quiz]");
    if (qo) {
      const pid = qo.closest("[data-pid]").dataset.pid;
      prState(pid).quiz[qo.dataset.quiz] = Number(qo.dataset.opt);
      saveJourney();
      const y = window.scrollY;
      route();
      window.scrollTo(0, y);
      return;
    }
    if (e.target.closest("[data-pf-copy]")) {
      const b = e.target.closest("[data-pf-copy]");
      navigator.clipboard?.writeText(portfolioText()).then(() => { b.textContent = t().pr.copied; }, () => {});
      return;
    }
    if (e.target.closest("[data-pf-download]")) {
      const blob = new Blob(["﻿" + portfolioText()], { type: "text/markdown;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "my-ai-teaching-work.md";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      return;
    }

    const db = e.target.closest("[data-toggle-done]");
    if (db) {
      setDone(db.dataset.toggleDone, !isDone(db.dataset.toggleDone));
      const y = window.scrollY;
      route();
      window.scrollTo(0, y);
      return;
    }
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      const box = tab.closest("[data-tabs]");
      box.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
      box.querySelectorAll(".tabs__pane").forEach((p) => (p.hidden = p.id !== "pane-" + tab.dataset.tab));
      return;
    }
    // jump to a highlight in the recording
    const seek = e.target.closest("[data-seek]");
    if (seek) {
      app.querySelector('[data-tab="rec"]')?.click();
      const box = app.querySelector(`.player[data-yt="${seek.dataset.vid}"]`) || app.querySelector(".player iframe")?.parentElement;
      if (box) {
        box.innerHTML = `<iframe src="${ytEmbed(seek.dataset.vid, seek.dataset.seek)}" title="${t().kind.video}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
        box.scrollIntoView({ block: "center" });
      }
      return;
    }
    const btn = e.target.closest(".player button");
    if (btn) {
      const box = btn.parentElement;
      const src = box.dataset.drive ? drivePreview(box.dataset.drive) : ytEmbed(box.dataset.yt);
      box.innerHTML = `<iframe src="${src}" title="${t().kind.video}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    }
  });
  app.addEventListener("change", (e) => {
    const pc = e.target.dataset?.pcheck;
    if (pc != null) {
      const pid = e.target.closest("[data-pid]").dataset.pid;
      prState(pid).checks[Number(pc)] = e.target.checked;
      saveJourney();
      return;
    }
    const ref = e.target.dataset?.done;
    if (!ref) return;
    setDone(ref, e.target.checked);
    const y = window.scrollY;
    route();
    window.scrollTo(0, y);
  });
  let noteTimer;
  app.addEventListener("input", (e) => {
    if (e.target.matches("[data-pnote]")) {
      const pid = e.target.closest("[data-pid]").dataset.pid;
      prState(pid).note = e.target.value;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        saveJourney();
        const s = e.target.closest("[data-pid]").querySelector("[data-saved]");
        if (s) s.hidden = false;
      }, 400);
      return;
    }
    if (e.target.id !== "lib-filter") return;
    const f = norm(e.target.value).trim();
    let any = false;
    document.querySelectorAll("#lib [data-topic]").forEach((d) => {
      let shown = 0;
      d.querySelectorAll("li").forEach((li) => {
        const ok = !f || norm(li.dataset.title).includes(f);
        li.hidden = !ok;
        if (ok) shown++;
      });
      d.hidden = !shown;
      d.open = !!f && shown > 0;
      if (shown) any = true;
    });
    document.getElementById("lib-none").hidden = any;
  });

  chrome();
  window.addEventListener("hashchange", route);
  route();
})();
