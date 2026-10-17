// Content-only update for b2; does not alter practice checks or learner state.
(function () {
  const he = `<p>גאמא יוצרת מצגות, מסמכים ודפים בעזרת בינה מלאכותית. בגרסה החדשה שמו דגש על בעיה מוכרת: תוצרים שנראים דומים מדי זה לזה, עם מעט מדי שליטה בעיצוב.</p>
<ul>
<li><strong>סוכן שמפתח איתכם את הרעיון בשיחה:</strong> הוא שואל שאלות ועוזר לחדד את הסיפור לפני העיצוב, ושומר על ההקשר לאורך העריכות.</li>
<li><strong>סגנונות עיצוב:</strong> מגוון רחב יותר. במצב ״יצירה עם הסוכן״ בוחרים בין ארבעה סגנונות: <bdi dir="ltr">Minimal, Visual, Classic, Consultant</bdi>. הסגנון משפיע גם על הפריסה וגם על טון הכתיבה.</li>
<li><strong>שתי דרכי עריכה:</strong> עריכה בעזרת הסוכן, או מעבר לבד חופשי שבו מזיזים כל רכיב ידנית.</li>
<li><strong>ייבוא:</strong> קובצי <bdi dir="ltr">PowerPoint</bdi> ו־<bdi dir="ltr">PDF</bdi> נשארים עם הפריסה והעיצוב המקוריים וניתנים לעריכה. כדי לשמור על העיצוב, מייבאים ממסך הבית של גאמא 5. המחולל הקלאסי מייבא טקסט בלבד.</li>
</ul>
<p>אם ניסיתם בעבר והתוצאה הרגישה תבניתית, כדאי לנסות שוב.</p>
<p><strong>גאמא וקלוד:</strong> יש חיבור רשמי של גאמא לקלוד. מפעילים אותו בהגדרות של קלוד ולוחצים <bdi dir="ltr">Connect</bdi> ואז <bdi dir="ltr">Allow</bdi>, בלי מפתח <bdi dir="ltr">API</bdi> ובלי הגדרות טכניות. אחר כך אפשר ליצור מצגת מתוך שיחה: מפתחים שם רעיון להרצאה, מחדדים את המבנה, ומעבירים אותו לגאמא.</p>
<p class="meta">קישור הפניה של עידן. ההרשמה לגאמא חינמית וללא כרטיס אשראי. מי שנרשם דרך הקישור מקבל 200 קרדיטים נוספים, וגם עידן מקבל 200 קרדיטים, בכפוף לתנאי ההפניה של גאמא. אין חובה להירשם דרכו.</p>
<p><a href="https://gamma.app/signup?r=fbcs8qh5h5q4qby" target="_blank" rel="noopener">להרשמה בגאמא</a></p>`;
  const en = `<p>Gamma creates presentations, documents and pages with AI. The new version tackles a familiar problem: outputs that look too similar to each other, with too little control over design.</p>
<ul>
<li><strong>An agent that develops the idea with you in conversation:</strong> it asks questions and helps sharpen the story before the design, and keeps context across edits.</li>
<li><strong>Design styles:</strong> a wider range. In "Create with Agent" you choose among four styles (Minimal, Visual, Classic, Consultant); the style shapes both the layout and the writing voice.</li>
<li><strong>Two ways to edit:</strong> edit with the agent, or switch to a free canvas and move each element by hand.</li>
<li><strong>Import:</strong> PowerPoint and PDF files keep their original layout and design and stay editable. To keep the design, import from the Gamma 5 home screen; the classic generator imports text only.</li>
</ul>
<p>If you tried it before and the result felt formulaic, it is worth another look.</p>
<p><strong>Gamma and Claude:</strong> there is an official Gamma connector for Claude. Turn it on in Claude's settings, click Connect and then Allow; no API key or technical setup. Then you can create a presentation from the conversation: develop a lecture idea there, sharpen the structure, and pass it to Gamma.</p>
<p class="meta">Idan's referral link. Signing up for Gamma is free and needs no credit card. Anyone who signs up through the link gets 200 extra credits, and Idan also gets 200 credits, subject to Gamma's referral terms. You do not have to sign up through it.</p>
<p><a href="https://gamma.app/signup?r=fbcs8qh5h5q4qby" target="_blank" rel="noopener">Sign up for Gamma</a></p>`;
  window.GammaUpdate = { html(id) {
    if (id !== 'b2') return '';
    const english = window.SiteI18n?.language() === 'en';
    return `<details class="panel" data-gamma-update lang="${english ? 'en' : 'he'}" dir="${english ? 'ltr' : 'rtl'}"><summary>${english ? 'New in Gamma 5' : 'חדש בגאמא 5'}</summary>${english ? en : he}</details>`;
  }};
})();
