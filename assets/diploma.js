// Diploma (Hexweaver's design, certificates-mockup.html, 15 Oct).
// Built in the learner's browser only: the name is never stored or sent, no network calls.
(function () {
  const LEVELS = {
    beginner: { c: "dp-l1", label: "מתחיל", stars: 1, line: "עמד/ה בהצלחה ב: מסלול ההכרות והיסודות", cheer: "ללמוד, להתנסות, ולהרחיב את גבולות האפשר." },
    intermediate: { c: "dp-l2", label: "בינוני", stars: 2, line: "עמד/ה בהצלחה ב: מסלול היישום בהוראה", cheer: "ללמוד, להתנסות, ולהרחיב את גבולות האפשר." },
    advanced: { c: "dp-l3", label: "מתקדם", stars: 3, line: "עמד/ה בהצלחה ב: מסלול בניית התהליכים והכלים", cheer: "ללמוד, להתנסות, ולהרחיב את גבולות האפשר." },
  };
  let uid = 0;
  const clean = (v) => String(v || "").trim().replace(/[<>&"]/g, "").slice(0, 40);
  const STAR_PATH = "M12 1l2.6 7.4L22 9l-6 4.8L18 22l-6-4.4L6 22l2-8.2L2 9l7.4-.6z";
  const STAR = `<svg viewBox="0 0 24 24" width="0.5em" height="0.5em" aria-hidden="true" style="color:var(--accent2)"><path fill="currentColor" d="${STAR_PATH}"/></svg>`;
  const STARS = (n) => `<div class="dp-stars" aria-hidden="true">${Array.from({ length: n }, () => `<svg viewBox="0 0 24 24"><path fill="currentColor" d="${STAR_PATH}"/></svg>`).join("")}</div>`;
  const corner = `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
 <path d="M0 0H78M0 0V78" stroke-width="2"/><path d="M8 8H66M8 8V66" stroke-width=".9"/>
 <path d="M8 56A48 48 0 0 0 56 8" stroke-width="1.4"/><path d="M8 42A34 34 0 0 0 42 8" stroke-width="1"/>
 <path d="M8 28A20 20 0 0 0 28 8" stroke-width=".8"/><path d="M8 8L40 40" stroke-width=".6" opacity=".7"/>
 <path d="M70 8l5 5-5 5-5-5zM8 70l5 5-5 5-5-5z" fill="currentColor" stroke="none"/>
 <path d="M3 3L9.5 3 9.5 9.5 3 9.5z" fill="currentColor" stroke="none"/></g>`;
  const bg = (k) => `<svg class="dp-bg" viewBox="0 0 297 210" preserveAspectRatio="none" aria-hidden="true">
 <defs><pattern id="gu${k}" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 4.5Q2.25 0 4.5 4.5T9 4.5M0 9Q2.25 4.5 4.5 9T9 9" fill="none" stroke="currentColor" stroke-width=".18" opacity=".35"/></pattern>
 <linearGradient id="band${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4d98a"/><stop offset=".5" stop-color="#b98c35"/><stop offset="1" stop-color="#f0d27f"/></linearGradient>
 <radialGradient id="sun${k}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d6" stop-opacity=".95"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient></defs>
 <g style="color:var(--accent2)"><rect x="9" y="9" width="279" height="192" fill="url(#gu${k})" opacity=".5"/></g>
 <rect x="3" y="3" width="291" height="204" fill="none" stroke="url(#band${k})" stroke-width="2.6"/>
 <g style="color:var(--accent2)" opacity=".4">${Array.from({ length: 36 }, (_, i) => { const a = i * 10 * Math.PI / 180; return `<path d="M148.5 176 L${(148.5 + 44 * Math.cos(a)).toFixed(1)} ${(176 + 44 * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width=".25"/>`; }).join("")}</g>
 <circle cx="148.5" cy="176" r="42" fill="url(#sun${k})"/>
 <g style="color:var(--accent)" fill="none"><rect x="6" y="6" width="285" height="198" stroke="currentColor" stroke-width="1.6"/><rect x="9.5" y="9.5" width="278" height="191" stroke="currentColor" stroke-width=".5"/></g>
 <g style="color:var(--accent2)">
  <g transform="translate(9.5 9.5) scale(.55)">${corner}</g><g transform="translate(287.5 9.5) scale(-.55 .55)">${corner}</g>
  <g transform="translate(9.5 200.5) scale(.55 -.55)">${corner}</g><g transform="translate(287.5 200.5) scale(-.55 -.55)">${corner}</g>
 </g></svg>`;
  const flourish = `<svg class="dp-flourish" viewBox="0 0 400 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
 <path d="M6 12H150C160 12 164 4 172 4C180 4 182 12 190 12"/><path d="M394 12H250C240 12 236 4 228 4C220 4 218 12 210 12"/></g>
 <path d="M200 2l8 10-8 10-8-10z" fill="currentColor"/><circle cx="178" cy="12" r="2.2" fill="currentColor"/><circle cx="222" cy="12" r="2.2" fill="currentColor"/></svg>`;
  const blob = (r0, amp, ph) => { let d = ""; for (let i = 0; i <= 120; i++) { const t = i / 120 * Math.PI * 2; const r = r0 + amp * (Math.sin(5 * t + ph) * .9 + Math.sin(9 * t + ph * 2) * .55 + Math.sin(14 * t + ph * 3) * .3); d += (i ? "L" : "M") + (50 + r * Math.cos(t)).toFixed(2) + " " + (52 + r * Math.sin(t)).toFixed(2); } return d + "Z"; };
  const wax = (L, k) => `<div class="dp-waxseal ${L.c}" role="img" aria-label="חותמת שעווה עם סמל גובלין, רמה ${L.label}">
 <svg viewBox="0 0 100 124" aria-hidden="true"><defs>
  <radialGradient id="wg${k}" cx=".35" cy=".28" r=".9"><stop offset="0" stop-color="var(--wax-hi)"/><stop offset=".45" stop-color="var(--wax-mid)"/><stop offset="1" stop-color="var(--wax-dark)"/></radialGradient>
  <linearGradient id="wr${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--wax-mid)"/><stop offset="1" stop-color="var(--wax-dark)"/></linearGradient></defs>
  <path d="M33 80L20 122l15-8 9 10 6-36z" fill="url(#wr${k})"/><path d="M67 80l13 42-15-8-9 10-6-36z" fill="url(#wr${k})" opacity=".92"/>
  <path d="${blob(38.5, 2.1, L.stars)}" fill="var(--wax-dark)" transform="translate(.9 1.6)" opacity=".75"/>
  <path d="${blob(38.5, 2.1, L.stars)}" fill="url(#wg${k})"/>
  <circle cx="50" cy="52" r="32.5" fill="none" stroke="var(--wax-dark)" stroke-width="1.1" opacity=".7"/><circle cx="50" cy="52" r="33.6" fill="none" stroke="var(--wax-hi)" stroke-width=".5" opacity=".55"/>
  <ellipse cx="36" cy="30" rx="13" ry="6" fill="#fff" opacity=".18" transform="rotate(-32 36 30)"/></svg>
 <div class="dp-logo"><img class="dp-a" src="assets/goblin-logo-640.jpg" alt=""><img class="dp-b" src="assets/goblin-logo-640.jpg" alt=""></div></div>`;
  const topicLine = (topics) => {
    const list = (topics || []).filter(Boolean);
    if (!list.length) return "";
    const shown = list.slice(0, 3).join(", ");
    return `<br>${list.length > 1 ? "נושאים" : "נושא"}: <b>${shown}${list.length === 4 ? " ועוד נושא אחד" : list.length > 4 ? ` ועוד ${list.length - 3} נושאים` : ""}</b>`;
  };

  // levelId: beginner | intermediate | advanced; topics: short topic names
  function html(levelId, name, topics, date) {
    const L = LEVELS[levelId] || LEVELS.beginner, k = "dp" + (++uid), v = clean(name);
    const d = date || new Date().toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `<section class="dp-cert ${L.c}" dir="rtl" lang="he" aria-label="דיפלומה, רמה ${L.label}">
 ${bg(k)}<div class="dp-inner">
  <div class="dp-brand">המכללה לבינה מלאכותית בהוראה</div>${flourish}
  <h2 class="dp-title">${STAR}<span>דיפלומה</span>${STAR}</h2>
  <div class="dp-cheer">${L.cheer}</div><div class="dp-grant">מוענקת בזאת ל</div>
  <div><div class="dp-name${v ? "" : " dp-empty"}${v.length > 30 ? " dp-xlong" : v.length > 22 ? " dp-long" : ""}">${v || "שם הלומד/ת"}</div>${flourish}</div>
  <div class="dp-track">${L.line}${topicLine(topics)}</div>
  <div class="dp-bottom"><div class="dp-side">${d}</div>
   <div class="dp-sealbox">${wax(L, k)}${STARS(L.stars)}<div class="dp-levelname">רמה: ${L.label}</div></div>
   <div class="dp-side">ללמוד ללמד עם בינה מלאכותית</div></div>
  <p class="dp-fine">דיפלומה פנימית של האתר. ההשלמה מדווחת על ידי הלומד/ת, ואינה מבחן, תואר או הסמכה אקדמית.</p>
 </div></section>`;
  }

  // Print only the diploma: copy it to a body-level holder, hide the rest while printing.
  function print(certHTML) {
    const holder = document.createElement("div");
    holder.className = "dp-print";
    holder.innerHTML = certHTML;
    document.body.append(holder);
    document.body.classList.add("dp-printing");
    const done = () => { holder.remove(); document.body.classList.remove("dp-printing"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    setTimeout(() => { if (holder.isConnected && !matchMedia("print").matches) done(); }, 1000);
  }

  // Render the existing certificate design locally. Text is painted by the browser,
  // preserving Hebrew/bidirectional shaping; the PDF embeds the finished page image.
  async function downloadPDF(levelId, name, topics) {
    const holder=document.createElement('div');
    holder.style.cssText='position:fixed;left:-100000px;top:0;width:1122px;pointer-events:none';
    holder.innerHTML=html(levelId,name,topics);document.body.append(holder);
    let canvas;
    try {
      await document.fonts.ready;
      const cert=holder.querySelector('.dp-cert');
      for(const img of cert.querySelectorAll('img'))await img.decode();
      const box=cert.getBoundingClientRect(),scale=2;
      canvas=document.createElement('canvas');canvas.width=Math.round(box.width*scale);canvas.height=Math.round(box.height*scale);
      const ctx=canvas.getContext('2d');ctx.scale(scale,scale);
      const grad=ctx.createRadialGradient(box.width/2,box.height*.45,0,box.width/2,box.height*.45,box.width*.65);
      grad.addColorStop(0,'#fffaf0');grad.addColorStop(.55,'#f7efdc');grad.addColorStop(1,'#efe2c4');ctx.fillStyle=grad;ctx.fillRect(0,0,box.width,box.height);
      // Resolve CSS variables before serializing pure SVG ornaments. No foreignObject.
      for(const svg of cert.querySelectorAll('svg')){
        const rect=svg.getBoundingClientRect();if(!rect.width||!rect.height)continue;
        const clone=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
        originals.forEach((el,i)=>{const st=getComputedStyle(el);for(const prop of ['color','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','opacity','stop-color','stop-opacity'])copies[i].style.setProperty(prop,st.getPropertyValue(prop));});
        clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',rect.width);clone.setAttribute('height',rect.height);
        const objectURL=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}));
        try{const image=new Image();image.src=objectURL;await image.decode();ctx.drawImage(image,rect.left-box.left,rect.top-box.top,rect.width,rect.height);}finally{URL.revokeObjectURL(objectURL);}
      }
      for(const logo of cert.querySelectorAll('.dp-logo')){
        const r=logo.getBoundingClientRect(),image=logo.querySelector('img');ctx.save();ctx.beginPath();ctx.arc(r.left-box.left+r.width/2,r.top-box.top+r.height/2,r.width/2,0,Math.PI*2);ctx.clip();ctx.filter='grayscale(1) contrast(1.45)';ctx.drawImage(image,r.left-box.left,r.top-box.top,r.width,r.height);ctx.restore();
      }
      const walker=document.createTreeWalker(cert,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const node=walker.currentNode,parent=node.parentElement;if(!node.textContent.trim()||parent.closest('svg'))continue;
        const style=getComputedStyle(parent),size=parseFloat(style.fontSize),lines=new Map();
        for(let i=0;i<node.textContent.length;i++){
          const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();if(!r.width||!r.height)continue;
          const key=Math.round(r.top*2)/2;let line=lines.get(key);if(!line){line={text:'',left:r.left,right:r.right,top:r.top,height:r.height};lines.set(key,line);}line.text+=node.textContent[i];line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);
        }
        ctx.font=`${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;ctx.direction=style.direction;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle=style.color==='rgba(0, 0, 0, 0)'?getComputedStyle(cert).getPropertyValue('--dp-gold').trim():style.color;
        for(const line of lines.values())ctx.fillText(line.text,(line.left+line.right)/2-box.left,line.top-box.top+line.height/2+size*.035);
      }
      const data=canvas.toDataURL('image/jpeg',.96),jpeg=Uint8Array.from(atob(data.split(',')[1]),c=>c.charCodeAt(0));
      // Minimal single-page image PDF. No learner name in metadata, URLs or filenames.
      const enc=new TextEncoder(),chunks=[],offsets=[0];let length=0;
      const add=b=>{if(typeof b==='string')b=enc.encode(b);chunks.push(b);length+=b.length;};
      const object=(n,b)=>{offsets[n]=length;add(`${n} 0 obj\n`);add(b);add('\nendobj\n');};
      add('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');object(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
      offsets[4]=length;add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);add(jpeg);add('\nendstream\nendobj\n');
      const commands='q 841.89 0 0 595.28 0 0 cm /Im0 Do Q';object(5,`<< /Length ${enc.encode(commands).length} >>\nstream\n${commands}\nendstream`);
      const xref=length;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(String(offsets[i]).padStart(10,'0')+' 00000 n \n');add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(chunks,{type:'application/pdf'}));a.download='diploma.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    } finally {holder.remove();if(canvas){canvas.width=0;canvas.height=0;}}
  }


  // Finish dialog: name field, live preview, print/close. Escape and close return focus to the opener.
  function open(levelId, topics) {
    if (document.querySelector(".dp-dialog[open]")) return;
    const opener = document.activeElement;
    const dlg = document.createElement("dialog");
    dlg.className = "dp-dialog";
    dlg.dir = "rtl";
    dlg.setAttribute("aria-labelledby", "dp-dlg-title");
    dlg.innerHTML = `<h2 id="dp-dlg-title">הדיפלומה שלכם</h2>
      <label for="dp-name">השם שיופיע בדיפלומה<input id="dp-name" maxlength="40" autocomplete="off"></label>
      <p class="dp-meta">השם לא נשמר ולא נשלח. הדיפלומה נוצרת במכשיר שלכם ונעלמת עם סגירת החלון.</p>
      <div data-dp-preview></div>
      <div class="dp-actions"><button type="button" class="btn" data-dp-download>הורדת PDF</button><button type="button" class="btn btn--ghost" data-dp-print>הדפסה או שמירה כ-PDF</button><button type="button" class="btn btn--ghost" data-dp-close>סגירה</button></div>`;
    const input = dlg.querySelector("#dp-name"), prev = dlg.querySelector("[data-dp-preview]");
    const draw = () => { prev.innerHTML = html(levelId, input.value, topics); };
    input.addEventListener("input", draw);
    dlg.querySelector('[data-dp-download]').addEventListener('click',async e=>{const button=e.currentTarget;button.disabled=true;button.textContent='מכין את הקובץ…';try{await downloadPDF(levelId,input.value,topics);button.textContent='הורדת PDF';}catch(error){button.textContent='ההורדה נכשלה, אפשר להדפיס ולשמור לקובץ';}finally{button.disabled=false;}});
    dlg.querySelector("[data-dp-print]").addEventListener("click", () => print(html(levelId, input.value, topics)));
    dlg.querySelector("[data-dp-close]").addEventListener("click", () => dlg.close());
    dlg.addEventListener("close", () => { dlg.remove(); if (opener && opener.isConnected) opener.focus({ preventScroll: true }); }, { once: true });
    draw();
    document.body.append(dlg);
    dlg.showModal();
    input.focus();
  }

  window.Diploma = { html, open, levels: Object.keys(LEVELS) };
})();
