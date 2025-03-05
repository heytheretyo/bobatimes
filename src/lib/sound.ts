/* eslint-disable @typescript-eslint/no-explicit-any */
export const playPurchaseSound = () => {
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 2.0; // Boost volume (adjust as needed)

  fetch("/sound/purchase.wav")
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
    })
    .catch((error) => console.error("Audio playback error:", error));
};
