# בינה מלאכותית בהוראה – אתר הלמידה

אתר סטטי (HTML/CSS/JS בלבד, בלי שלב בנייה).

## מבנה
- `index.html` – העמוד
- `assets/data.js` – **כל התוכן** (סדנאות, בונוס, מיני-סרטונים, ספריית מצגות). כאן עורכים.
- `assets/app.js` – הניווט וההצגה
- `assets/style.css` – העיצוב
- `serve.mjs` – שרת לתצוגה מקומית

## תצוגה מקומית
```
node serve.mjs
```
ואז לפתוח http://localhost:4321

## הוספת תוכן
- סדנה חדשה: להוסיף אובייקט למערך `workshops` ב-`data.js` (מזהה YouTube + מזהה Gamma).
- מיני-סרטון: להוסיף שורה תחת הכלי המתאים ב-`mini`.
- מצגת: להוסיף `["<gamma id>", "<כותרת>"]` לנושא המתאים ב-`library`.

## מסלולי למידה ("מאיפה להתחיל?")
מוגדרים ב-`journeys` בתוך `data.js`:
- `levels` – רמות הניסיון שהמבקר בוחר.
- `foundations` – צעדי יסוד (רק למתחילים). `responsibility` – צעדי אחריות ואתיקה (למתחילים ולבינוניים).
- `goals` – נושאים. לכל נושא שלוש רשימות: `core` (לכולם), `deeper` (בינוני ומתקדם), `advanced` (מתקדם בלבד).
- הפניות: `w3` / `d5` / `b2` לסדנה, מפגש או בונוס; `v:<מזהה יוטיוב>` למיני-סרטון; `g:<מזהה Gamma>` למצגת.
ההתקדמות (מה סומן כהושלם) נשמרת בדפדפן של המבקר בלבד.

## שימו לב
מצגת Gamma תוצג באתר רק אם השיתוף שלה מוגדר ל-"Anyone with the link can view".

## העלאה לאוויר
אפשר לגרור את התיקייה כמו שהיא ל-Netlify Drop (app.netlify.com/drop) או לחבר ל-Vercel / GitHub Pages.

## האתר באוויר
- כתובת: https://coldgoblin.github.io/ai-teaching-college/
- מאגר: https://github.com/ColdGoblin/ai-teaching-college (GitHub Pages מענף `main`, תיקיית השורש)

### פרסום עדכון
מתוך התיקייה `site`:
```
git add -A
git commit -m "תיאור השינוי"
git push
```
תוך כדקה האתר מתעדכן.
