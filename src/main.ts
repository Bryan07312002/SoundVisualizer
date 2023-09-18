import CanvasHandler from "./canvas";

const audioCtx = new AudioContext();

function normalize(val: number, min = 0, max = 255) {
  const normalized = (val - min) / (max - min);
  return normalized;
}

function filterData(audioBuffer: AudioBuffer) {
  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  const samples = window.innerWidth; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // Number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    filteredData.push(rawData[i * blockSize]);
  }
  return filteredData;
}

function generateRedToGrayColormap(length: number) {
  if (typeof length !== "number" || length <= 0) {
    return [];
  }

  const colormap = [];
  const maxShade = 255; // Maximum shade for red (255 for full red)
  const minShade = 128; // Minimum shade for gray (128 for mid-gray)

  for (let i = 0; i < length; i++) {
    const shade = minShade + ((maxShade - minShade) / (length - 1)) * i;
    const color = `rgb(${shade}, ${shade}, ${maxShade})`;
    colormap.push(color);
  }

  return colormap;
}

function draw(handler: CanvasHandler, data: number[], positionPercentage = 10) {
  handler.clear()
  const colorMap = generateRedToGrayColormap(data.length);
  const correction = handler.elemenet.clientHeight / 2 > 100 ? 100 : handler.elemenet.clientHeight / 2;
  for (let x = 0; x < data.length; x++) {
    if (x > handler.elemenet.clientWidth) continue
    const y = Math.floor((data[x] * correction) + correction)
    let color = 'gray';

    const moduleX = data[x] > 0 ? data[x] : data[x] * -1;

    if (moduleX > .6) color = `blue`
    if (moduleX > .7) color = 'green'
    if (moduleX > .8) color = 'red'

    handler.printPixel(x, y, color, 2, correction - y,);
    handler.printPixel(x, correction, 'black');
  }

  for (let y = 0; y < handler.elemenet.clientHeight; y++) {
    handler.printPixel((positionPercentage / 100) * handler.elemenet.clientWidth, y, "black");
  }
}

function calculatePercentage(value: number, total: number) {
  const percentage = (value / total) * 100;
  return percentage;
}


async function main() {
  const handler = new CanvasHandler();
  handler.attachTo(document.body)

  const audioBuffer = await fetch('song.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))

  const filtred = filterData(audioBuffer)

  const audio = new Audio('song.mp3');

  audio.play()
  setInterval(() => {
    draw(handler, filtred, calculatePercentage(audio.currentTime, audio.duration))
  }, 100)
}

main().catch();
