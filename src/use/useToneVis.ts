import { logicNot } from "@vueuse/math";

function scale(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function draw(
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  values: Float32Array
) {
  if (isDefined(canvasRef)) {
    const context = canvasRef.value.getContext("2d");
    if (isDefined(context)) {
      const width = canvasRef.value.width;
      const height = canvasRef.value.height;
      context.clearRect(0, 0, width, height);

      const max = Math.max(0.001, ...values) * 1.1;
      const min = Math.min(-0.001, ...values) * 1.1;

      const lineWidth = 1;
      context.lineWidth = lineWidth;
      context.beginPath();
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        const x = scale(i, 0, values.length, lineWidth, width - lineWidth);
        const y = scale(v, max, min, 0, height - lineWidth);
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.lineCap = "round";
      context.strokeStyle = "white";
      context.stroke();
    }
  }
}

type ToneGetValue = {
  getValue: () => Float32Array;
};

type UseToneVisOptions = {
  height: number;
};

export function useToneVis(
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  toneNode: ToneGetValue,
  isPlaying: Ref<boolean>,
  options?: UseToneVisOptions
) {
  if (isDefined(canvasRef)) {
    canvasRef.value.height = options?.height ?? 40;
  }

  // Setup AnimationFrame Loop
  const { pause, resume } = useRafFn(
    () => {
      draw(canvasRef, toneNode.getValue());
    },
    { immediate: false }
  );

  whenever(isPlaying, () => {
    resume();
  });
  whenever(logicNot(isPlaying), () => {
    pause();
  });
}
