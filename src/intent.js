/*
 * LabZero Mama: patient dialogue layer. MIT licence.
 *
 * Safety by design: the patient can only ever say lines from the approved case
 * script. The matcher (local keywords, or an optional language model) only
 * chooses WHICH approved line answers the trainee's question. It never writes
 * clinical content.
 */
(function () {
  "use strict";

  function normalise(text) {
    return (text || "").toLowerCase().replace(/[^a-z0-9À-ɏ\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  // Local matcher: keyword and phrase overlap. Works offline, no data leaves the device.
  function matchLocal(question, intents) {
    var q = " " + normalise(question) + " ";
    var best = null, bestScore = 0;
    intents.forEach(function (intent) {
      var score = 0;
      intent.keywords.forEach(function (kw) {
        var k = normalise(kw);
        if (!k) return;
        if (q.indexOf(" " + k + " ") !== -1) score += k.indexOf(" ") !== -1 ? 3 : 2;
        else if (k.length > 4 && q.indexOf(k) !== -1) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore >= 2 ? { intent: best, method: "local", confidence: Math.min(1, bestScore / 4) } : null;
  }

  // Optional language-model matcher (OpenAI-compatible chat completions endpoint).
  // It returns only an intent id from the approved list, or "none".
  async function matchLLM(question, intents, settings) {
    var list = intents.map(function (i) { return i.id + ": " + i.chip; }).join("\n");
    var body = {
      model: settings.model,
      temperature: 0,
      messages: [
        { role: "system", content: "You classify a health trainee's question to a simulated patient. Reply with exactly one id from this list, or none if nothing fits. Reply with the id only.\n" + list },
        { role: "user", content: question }
      ]
    };
    var res = await fetch(settings.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + settings.apiKey },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Language model returned " + res.status);
    var data = await res.json();
    var raw = (((data.choices || [])[0] || {}).message || {}).content || "";
    var id = normalise(raw).split(" ")[0];
    var intent = intents.find(function (i) { return i.id === id; });
    return intent ? { intent: intent, method: "llm", confidence: 0.9 } : null;
  }

  async function ask(question, intents, settings) {
    if (settings && settings.useLLM && settings.endpoint && settings.apiKey) {
      try {
        var r = await matchLLM(question, intents, settings);
        if (r) return r;
      } catch (e) {
        var local = matchLocal(question, intents);
        if (local) { local.note = "Language model unavailable; matched offline."; return local; }
        return { intent: null, method: "local", note: "Language model unavailable." };
      }
    }
    return matchLocal(question, intents) || { intent: null, method: "local" };
  }

  // Read the patient's approved line aloud with the device's built-in speech, if available.
  function speak(text, on) {
    try {
      if (!on || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech is optional */ }
  }

  window.MamaDialogue = { ask: ask, matchLocal: matchLocal, speak: speak };
})();
