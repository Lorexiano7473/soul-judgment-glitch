import shopMusicSrc from "@/assets/shop-music.mp3";

let audio: HTMLAudioElement | null = null;

function ensure(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(shopMusicSrc);
    audio.loop = true;
    audio.volume = 0.55;
  }
  return audio;
}

export function playShopMusic() {
  const a = ensure();
  a.currentTime = 0;
  // play() può essere bloccato se l'utente non ha ancora interagito —
  // nello Shop si arriva via click, quindi va bene.
  a.play().catch(() => {});
}

export function stopShopMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}