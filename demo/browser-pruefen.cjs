// Browserprüfung der Demo. Aufruf: node demo/browser-pruefen.cjs [Ordner] [--bild=<Präfix>]
// Ordner: die auszuliefernden Dateien (Standard: dieser demo/-Ordner, entspricht dem Inhalt von gh-pages).
// Die Seite wird wie auf GitHub Pages unter /werkstatt-datenqualitaet-bi/ ausgeliefert.
// Braucht puppeteer-core (NODE_PATH) und Chrome oder Edge (BROWSER_PFAD).
// Geprüft: Laufzeitfehler, Verstöße gegen die CSP, externe Anfragen, horizontaler Überlauf bei 390 px,
// Sprache DE (Standard), Wechsel auf FR und zurück, ?lang=fr, Eingabewahl per Tastatur, echte Zahlen.
const fs = require("node:fs"), path = require("node:path"), http = require("node:http"), assert = require("node:assert/strict");
const puppeteer = require("puppeteer-core");
const REPO = "werkstatt-datenqualitaet-bi";
const ordnerArg = process.argv.slice(2).find(a => !a.startsWith("--"));
const wurzel = path.resolve(ordnerArg || __dirname);
const bild = process.argv.find(a => a.startsWith("--bild="))?.slice(7);
const typen = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json" };
const server = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, "http://x").pathname);
  if (!p.startsWith("/" + REPO + "/")) { r.statusCode = 404; return r.end("nicht gefunden"); }
  p = p.slice(REPO.length + 1);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(wurzel, p);
  if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end("nicht gefunden"); }
  r.setHeader("Content-Type", typen[path.extname(f)] || "application/octet-stream");
  r.end(fs.readFileSync(f));
});
const browserPfad = process.env.BROWSER_PFAD || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(f => fs.existsSync(f));
if (!browserPfad) throw new Error("BROWSER_PFAD auf einen installierten Chrome oder Edge setzen.");
const warte = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const basis = `http://127.0.0.1:${server.address().port}/${REPO}/`;
  const browser = await puppeteer.launch({ executablePath: browserPfad, headless: true });
  const fehler = [], extern = [];
  try {
    const s = await browser.newPage();
    s.on("pageerror", e => fehler.push("Seitenfehler: " + e.message));
    s.on("console", m => { if (["error", "warning"].includes(m.type())) fehler.push("Konsole: " + m.text()); });
    s.on("requestfailed", r => fehler.push("Anfrage fehlgeschlagen: " + r.url()));
    s.on("response", r => { if (r.status() >= 400) fehler.push("HTTP " + r.status() + ": " + r.url()); });
    s.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:") ) extern.push(r.url()); });
    await s.setViewport({ width: 1280, height: 1000 });
    await s.goto(basis, { waitUntil: "networkidle0" });
    const text = async () => (await s.$eval("body", e => e.innerText)).replace(/[  ]/g, " ");
    const lang = () => s.evaluate(() => document.documentElement.lang);
    const ueberlauf = () => s.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    const knopf = async name => { const b = await s.evaluateHandle(n => [...document.querySelectorAll("button")].find(e => e.textContent.trim().startsWith(n)), name); assert(b.asElement(), "Knopf " + name); return b.asElement(); };

    // Deutsch als Standard, echte Zahlen der Beispieldatei
    assert.equal(await lang(), "de", "Standardsprache de");
    let t = await text();
    for (const w of ["Werkstattdaten: Datenqualität und Kennzahlen", "Gesamtumsatz", "820,00 €", "340,00 €", "480,00 €", "Ausgabe eines echten Laufs des Projekts", "Lernprojekt", "Power-BI-Bericht"]) assert(t.includes(w), "DE enthält: " + w);
    assert(!/ [–—] /.test(t), "keine Gedankenstriche als Satzverbinder");
    assert.equal(await s.$$eval("#csv-tabelle tbody tr", r => r.length), 13, "13 CSV-Zeilen inklusive Kopfzeile");
    assert.equal(await s.$$eval("#csv-tabelle tr.abgelehnt", r => r.length), 2, "2 abgelehnte Zeilen");
    assert(t.includes("Bestellkennung B10 bereits in CSV-Zeile 11 vorhanden."), "Originalmeldung des Programms");
    if (bild) await s.screenshot({ path: path.resolve(bild + "-desktop-de.png"), fullPage: true });

    // Auf Französisch wechseln
    await (await knopf("FR")).click(); await warte(150);
    assert.equal(await lang(), "fr", "lang=fr nach Wechsel");
    t = await text();
    for (const w of ["Données d'atelier", "Chiffre d'affaires total", "820,00", "Sortie d'une exécution réelle du projet", "Identifiant de commande B10 déjà présent à la ligne CSV 11."]) assert(t.includes(w), "FR enthält: " + w);
    assert(!t.includes("Zum Inhalt") && !t.includes("Quellcode auf GitHub"), "keine deutschen Rest-Beschriftungen");
    assert.equal(await s.title(), "Démo données d'atelier");
    assert(new URL(s.url()).searchParams.get("lang") === "fr", "?lang=fr in der Adresse");
    // Zurück auf Deutsch
    await (await knopf("DE")).click(); await warte(150);
    assert.equal(await lang(), "de", "zurück auf de");
    assert((await text()).includes("Gesamtumsatz"));
    assert(!new URL(s.url()).searchParams.has("lang"), "Parameter bei de entfernt");

    // Eingabe per Tastatur wählen: typische Fehler
    await s.focus("#auswahl button:nth-child(3)");
    await s.keyboard.press("Enter"); await warte(150);
    t = await text();
    assert(t.includes("212,80 €"), "Summe der Fehlerdatei 212,80 €");
    assert.equal(await s.$$eval("#csv-tabelle tr.abgelehnt", r => r.length), 6, "6 abgelehnte Zeilen");
    assert.equal(await s.evaluate(() => document.activeElement.textContent.includes("Typische Fehler")), true, "Fokus bleibt auf der Auswahl");
    // leere Datei
    await s.focus("#auswahl button:nth-child(4)");
    await s.keyboard.press("Enter"); await warte(150);
    assert((await text()).includes("0,00 €"), "leere Datei ergibt 0,00 €");

    // Handy bei 390 px: jede Eingabe in beiden Sprachen ohne horizontalen Überlauf
    await s.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    for (const sprache of ["de", "fr"]) {
      await s.goto(basis + (sprache === "fr" ? "?lang=fr" : ""), { waitUntil: "networkidle0" });
      assert.equal(await lang(), sprache, "Sprache per URL " + sprache);
      for (let i = 1; i <= 4; i++) {
        await s.click(`#auswahl button:nth-child(${i})`); await warte(100);
        assert(!(await ueberlauf()), `kein horizontaler Überlauf bei 390 px (${sprache}, Eingabe ${i})`);
      }
      await s.click("#auswahl button:nth-child(1)");
      for (const d of await s.$$("details")) await d.evaluate(e => { e.open = true; });
      await warte(100);
      assert(!(await ueberlauf()), `kein horizontaler Überlauf mit offenen Details (${sprache})`);
      if (bild) await s.screenshot({ path: path.resolve(`${bild}-handy-${sprache}.png`), captureBeyondViewport: true, clip: { x: 0, y: 0, width: 390, height: 2600 } });
    }
  } finally { await browser.close(); server.close(); }
  assert.deepEqual(fehler, [], "keine Laufzeitfehler");
  assert.deepEqual(extern, [], "keine externen Anfragen");
  console.log("Browserprüfung bestanden: DE Standard, Wechsel auf FR und zurück, ?lang=fr, Eingabewahl per Tastatur, Zahlen der echten Läufe, 390 px ohne Überlauf; keine Fehler, keine externen Anfragen.");
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
