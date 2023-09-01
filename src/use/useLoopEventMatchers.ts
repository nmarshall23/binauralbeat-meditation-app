import { Pattern } from "ts-pattern";

export const eventMatcherGain = {
  rampTime: Pattern.number,
  signal: {
    gain: Pattern.number.between(0.0, 2.0),
  },
};

export const eventMatcherBinauralBeatFreq = {
  rampTime: Pattern.number,
  signal: {
    beatFreq: Pattern.number,
  },
};

export const eventMatcherOscFreq = {
  rampTime: Pattern.number,
  signal: {
    osc: {
      frequency: Pattern.number,
    },
  },
};

export const eventMatcherFilterFrequency = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      frequency: Pattern.number,
    },
  },
};

export const eventMatcherFilterQ = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      Q: Pattern.number.positive,
    },
  },
};

export const eventMatcherFilterGain = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      gain: Pattern.number,
    },
  },
};

export const eventMatcherFilterDetune = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      detune: Pattern.number,
    },
  },
};

export const eventMatcherFilterWet = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      wet: Pattern.number.between(0, 1)
    }
  },
};

export const eventMatcherSpinEffect = {
  rampTime: Pattern.number,
  signal: {
    spinEffect: Pattern.union(0,1)
  },
};

export const eventMatcherSpinCycleFreq = {
  rampTime: Pattern.number,
  signal: {
    spinCycleFreq: Pattern.number.between(0.1, 2)
  },
};

