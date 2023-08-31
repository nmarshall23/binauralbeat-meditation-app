import { Pattern } from "ts-pattern";

export const eventMatcherGain = {
  rampTime: Pattern.number,
  signal: {
    gain: Pattern.number.between(0.0, 2.0),
  },
};

export const eventMatcherFilterFrequency = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      frequency: Pattern.number
    },
  },
};

export const eventMatcherFilterQ = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      Q: Pattern.number.positive
    },
  },
};

export const eventMatcherFilterGain = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      gain: Pattern.number
    },
  },
};

export const eventMatcherFilterDetune = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      detune: Pattern.number
    },
  },
};