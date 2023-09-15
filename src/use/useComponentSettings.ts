export function useComponentSettings() {
  return {
    // sliders 
    gainSliderSettings,
    partialCountSliderSettings,
    multiplySliderSettings,
    normalRangeSliderSettings,
    freqLfoSliderSettings,
    frequencySliderSettings,
    // Select Option
    lfoTypeOptions,
    oscTypeOptions,
    oscSourceTypeOptions
  };
}

// === Select Option Setup === //

const lfoTypeOptions = [
  { label: "Sine", value: "sine" },
  { label: "Triangle", value: "triangle" },
  { label: "Square", value: "square" },
];

const oscTypeOptions = [
  { label: "Sine", value: "sine" },
  { label: "SawTooth", value: "sawtooth" },
  { label: "Triangle", value: "triangle" },
  { label: "Square", value: "square" },
];

const oscSourceTypeOptions = [
  { label: "Oscillator", value: "oscillator" },
  { label: "AM", value: "am" },
  { label: "FM", value: "fm" },
  { label: "Fat", value: "fat" },
];

// === Slider Setup === //

const gainSliderSettings = {
  min: 0,
  max: 1,
  step: 0.1,
  snap: true,
  label: true,
  markers: 0.25,
  markerLabelsClass: 'text-white',
  markerLabels: (v: number) => `${v * 100}%`,
};

const partialCountSliderSettings = {
  min: 0,
  //innerMin: 1,
  max: 5,
  step: 1,
  snap: true,
  label: true,
  markers: true,
  markerLabels: true,
};

const multiplySliderSettings = {
  min: 1,
 // innerMin: 1,
  max: 20,
  step: 1,
  snap: true,
  label: true,
  markers: 20,
  markerLabelsClass: 'text-white',
  markerLabels: true,
};

const normalRangeSliderSettings = {
  min: 0,
  max: 1,
  step: 0.1,
  snap: true,
  label: true,
  markers: 0.5,
  markerLabels: (v: number) => v.toFixed(1),
};

const frequencySliderSettings = {
  min: 20,
  max: 2000,
  step: 100,
  snap: true,
  label: true,
  markers: 500,
  markerLabels: [
    { value: 20, label: "20 Hz" },
    { value: 500, label: "500 Hz" },
    { value: 1000, label: "1KHz" },
    { value: 1500, label: "1.5KHz" },
    { value: 2000, label: "2KHz" },
  ],
};

const freqLfoSliderSettings = {
  min: 0.1,
  max: 10,
  step: 0.1,
  snap: true,
  label: true,
  markers: 10,
  markerLabels: (v: number) => v.toFixed(1),
};
