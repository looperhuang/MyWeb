<template>
  <div class="wheel-wrapper" ref="playgroundContainer">
    <div ref="cursor" class="cursor">
      <slot name="cursor"></slot>
    </div>
    <canvas ref="playgroundCanvas"></canvas>
    <div class="centered">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";

export interface Slice {
  color: string;
  text: string;
}

export interface Sounds {
  spinning: HTMLAudioElement | null;
  won: HTMLAudioElement | null;
  spinButtonClick?: HTMLAudioElement | null;
  spinButtonHover?: HTMLAudioElement | null;
  spinButtonLeave?: HTMLAudioElement | null;
}

const playgroundContainer = ref<HTMLDivElement | null>(null);
const playgroundCanvas = ref<HTMLCanvasElement | null>(null);
const isSpinning = ref(false);
const cursor = ref<HTMLDivElement | null>(null);
const currentAngle = ref(0);
const spinningAudio = ref<HTMLAudioElement | null>(null);
const wonAudio = ref<HTMLAudioElement | null>(null);

const emits = defineEmits(["spin-start", "spin-end"]);

const props = withDefaults(
  defineProps<{
    slices: Slice[];
    winnerIndex?: number;
    extraSpins?: number;
    spinDuration?: number;
    cursorAngle?: number;
    cursorPosition?: "center" | "edge";
    cursorDistance?: number;
    sounds?: Sounds;
  }>(),
  {
    winnerIndex: 0,
    extraSpins: 10,
    spinDuration: 4000,
    cursorAngle: 270,
    cursorPosition: "center",
    cursorDistance: 50,
    sounds: () => ({
      spinning: null,
      won: null,
    }),
  }
);

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function getSlices(): Slice[] {
  return props.slices;
}

function getContrastingColor(bgColor: string): string {
  let color = bgColor;
  if (bgColor.charAt(0) === "#") {
    color = bgColor.substring(1, 7);
  }

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? "black" : "white";
}

function getAnglePerSlice(): number {
  return 360 / getSlices().length;
}

function getCursorAngle(): number {
  return props.cursorAngle;
}

function getRandomBetween(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNormalizedAngle(angle: number): number {
  return angle % 360;
}

function getSliceAngles(sliceIndex: number, currentCanvasAngle: number) {
  const slices = getSlices();
  const anglePerSlice = 360 / slices.length;
  const startAngle = getNormalizedAngle(currentCanvasAngle + anglePerSlice * sliceIndex);
  const endAngle = getNormalizedAngle(currentCanvasAngle + startAngle + anglePerSlice);

  return {
    startAngle,
    endAngle,
  };
}

function getEaseInOutQuart(progress: number): number {
  return progress < 0.5
    ? 8 * Math.pow(progress, 4)
    : 1 - Math.pow(-2 * progress + 2, 4) / 2;
}

function drawSlice(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  fillColor: string
) {
  // Draw pie slice
  context.beginPath();
  context.moveTo(centerX, centerY);
  context.arc(
    centerX,
    centerY,
    radius,
    degreesToRadians(startAngle),
    degreesToRadians(endAngle)
  );
  context.strokeStyle = fillColor;
  context.stroke();
  context.fillStyle = fillColor;
  context.fill();
  context.closePath();
  context.save();
}

function drawLabel(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  fillColor: string,
  sliceLabel: string
) {
  // Draw label
  const textRotateAngle = (endAngle - startAngle) / 2 + startAngle;
  context.translate(centerX, centerY);
  context.rotate(degreesToRadians(textRotateAngle));
  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillStyle = getContrastingColor(fillColor);
  context.font = "bold 16px Arial";
  context.fillText(sliceLabel, radius - 10, 0);
  context.restore();
}

function getContainer(): HTMLDivElement | null {
  return playgroundContainer.value;
}

function getCanvas(): HTMLCanvasElement | null {
  return playgroundCanvas.value;
}

function drawWheel() {
  const container = getContainer();
  const canvas = getCanvas();
  const slices = getSlices();

  if (!canvas || !container) return;
  // Access canvas and context.
  const context = canvas.getContext("2d");
  if (!context) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientWidth;

  canvas.width = containerWidth;
  canvas.height = containerHeight;

  // Adjust width and height
  const width = containerWidth;
  const height = containerHeight;
  context.scale(1, 1);

  // Calculate centroids
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2;

  // Calculate angle per slice
  const anglePerSlice = 360 / slices.length;

  // Draw slices
  slices.forEach(function (slice, sliceIndex) {
    const startAngle = anglePerSlice * sliceIndex;
    const endAngle = startAngle + anglePerSlice;

    // Draw slice
    drawSlice(context, centerX, centerY, radius, startAngle, endAngle, slice.color);

    // Draw slice label
    drawLabel(
      context,
      centerX,
      centerY,
      radius,
      startAngle,
      endAngle,
      slice.color,
      slice.text
    );
  });

  // Position cursor
  positionCursor();
}

function spinWheel(winnerIndex: number) {
  // If already spinning do nothing
  if (isSpinning.value) {
    return false;
  }

  // Set spinning true
  isSpinning.value = true;

  // Play spinning sound
  if (spinningAudio.value) {
    playAudio(spinningAudio.value);
  }

  // Emit spin start event
  emits("spin-start");

  // Get canvas and container
  const canvas = playgroundCanvas.value;
  if (!canvas) {
    console.log("Canvas not found");
    return;
  }

  // Get random spins count
  const extraSpins = props.extraSpins;

  // Get random spins count
  const extraSpinsAngle = extraSpins * 360;

  // Get winner start and end angle with current status
  const { endAngle: winnerEndAngle } = getSliceAngles(winnerIndex, currentAngle.value);

  // Calculate target angle
  const targetAngle =
    currentAngle.value +
    extraSpinsAngle +
    (getCursorAngle() - winnerEndAngle) +
    getRandomBetween(0, getAnglePerSlice());

  // Get start time to finish spinning
  const startTime = performance.now();

  // Create animation
  const animate = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / props.spinDuration, 1);

    let rotationAngle = currentAngle.value + targetAngle * getEaseInOutQuart(progress);
    canvas.style.transform = `rotate3d(0, 0, 1, ${rotationAngle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      rotationAngle = getNormalizedAngle(rotationAngle);
      canvas.style.transform = `rotate3d(0, 0, 1, ${rotationAngle}deg)`;
      currentAngle.value = rotationAngle;

      isSpinning.value = false;

      if (wonAudio.value) {
        wonAudio.value.play();
      }

      emits("spin-end", winnerIndex);

      // Stop spinning sound
      if (spinningAudio.value) {
        stopAudio(spinningAudio.value);
      }
    }
  };

  // Run animation
  requestAnimationFrame(animate);
}

function playAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    audio.volume = 0.5;
    audio.play();
  }
}

function stopAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function getCursorXY() {
  if (!cursor.value) {
    console.log("Cursor not found");
    return;
  }
  const cursorAngle = getCursorAngle();
  const cursorPosition = props.cursorPosition;

  if (cursorPosition === "edge") {
    const rotate = getNormalizedAngle(cursorAngle + 90);
    const cursorWidth = cursor.value.clientWidth;
    const cursorHeight = cursor.value.clientHeight;
    const top = Math.sin(degreesToRadians(cursorAngle)) * 50 + 50 + "%";
    const left = Math.cos(degreesToRadians(cursorAngle)) * 50 + 50 + "%";
    const additionalX =
      Math.cos(degreesToRadians(cursorAngle)) * (props.cursorDistance + cursorWidth / 2);
    const additionalY =
      Math.sin(degreesToRadians(cursorAngle)) * (props.cursorDistance + cursorHeight / 2);

    return {
      top: top,
      left: left,
      translateX: "calc(-50% - " + additionalX + "px)",
      translateY: "calc(-50% - " + additionalY + "px)",
      rotate: rotate + "deg",
    };
  } else {
    const rotate = getNormalizedAngle(cursorAngle + 270);
    const additionalX = Math.cos(degreesToRadians(cursorAngle)) * props.cursorDistance;
    const additionalY = Math.sin(degreesToRadians(cursorAngle)) * props.cursorDistance;

    return {
      top: "50%",
      left: "50%",
      translateX: "calc(-50% + " + additionalX + "px)",
      translateY: "calc(-50% + " + additionalY + "px)",
      rotate: rotate + "deg",
    };
  }
}

function positionCursor() {
  // Set cursor position
  const cursorXY = getCursorXY();
  if (!cursorXY || !cursor.value) {
    console.log("Cursor not found");
    return;
  }
  const { top, left, translateX, translateY, rotate } = cursorXY;

  cursor.value.style.top = top;
  cursor.value.style.left = left;
  cursor.value.style.transform = `translate3d(${translateX}, ${translateY}, 0) rotate3d(0, 0, 1, ${rotate})`;
}

function handleResize() {
  drawWheel();
}

watch(
  () => props.slices,
  () => {
    drawWheel();
  },
  {
    deep: true,
  }
);

watch(
  () => props.cursorAngle,
  () => {
    positionCursor();
  }
);

watch(
  () => props.cursorPosition,
  () => {
    positionCursor();
  }
);

watch(
  () => props.cursorDistance,
  () => {
    positionCursor();
  }
);

onBeforeMount(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

onMounted(() => {
  if (props.sounds?.spinning) {
    spinningAudio.value = props.sounds?.spinning;
  }

  if (props.sounds?.won) {
    wonAudio.value = props.sounds?.won;
  }

  drawWheel();
});

defineExpose({
  spinWheel,
  drawWheel,
});
</script>

<style scoped>
.wheel-wrapper {
  max-width: 100vw;
  width: 100%;
  position: relative;
  aspect-ratio: 1 / 1;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  position: absolute;
  z-index: 10;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
}

canvas {
  will-change: transform, width, height;
  aspect-ratio: 1 / 1;
  max-width: 100%;
}
</style>
