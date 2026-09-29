const CODES = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN' };

function getVoices() {
  return new Promise((res) => {
    const v = speechSynthesis.getVoices();
    if (v.length) return res(v);
    speechSynthesis.onvoiceschanged = () => res(speechSynthesis.getVoices());
    setTimeout(() => res(speechSynthesis.getVoices()), 1000);
  });
}

// Text-a andha language voice-la pesum.
// Voice irundha true, illaadha false return pannum.
export async function speak(text, lang, onEnd) {
  speechSynthesis.cancel();
  const code = CODES[lang] || 'en-IN';
  const voices = await getVoices();
  const voice =
    voices.find((v) => v.lang.replace('_', '-') === code) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(lang));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code;
  if (voice) u.voice = voice;
  u.rate = 0.95;
  u.onend = onEnd;
  speechSynthesis.speak(u);
  return !!voice;
}

export function stopSpeak() {
  speechSynthesis.cancel();
}