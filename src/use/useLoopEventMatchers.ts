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
    synth: {
      beatFreq: Pattern.number,
    },
  },
};

export const eventMatcherOscFreq = {
  rampTime: Pattern.number,
  signal: {
    synth: {
      baseFreq: Pattern.number,
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
      wet: Pattern.number.between(0, 1),
    },
  },
};

export const eventMatcherSpinEffectWet = {
  rampTime: Pattern.number,
  signal: {
    spinEffect: {
      wet: Pattern.union(0, 1),
    },
  },
};

export const eventMatcherSpinEffect = {
  rampTime: Pattern.number,
  signal: {
    spinEffect: Pattern.union(0, 1),
  },
};

export const eventMatcherSpinCycleFreq = {
  rampTime: Pattern.number,
  signal: {
    spinEffect: {
      frequency: Pattern.number.between(0.1, 2),
    },
  },
};

export const eventMatcherStartSample = {
  rampTime: Pattern.number,
  signal: {
    startSample: true
  },
};

export const eventMatcherStartLoopBool = {
  rampTime: Pattern.number,
  signal: {
    startLoop: true
  },
};

export const eventMatcherStartLoopPatten = {
  rampTime: Pattern.number,
  signal: {
    startLoop: {
      pattern: Pattern.string
    }
  },
};

export const eventMatcherPanner3dPositionX = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionX: Pattern.number
    }
  },
};

export const eventMatcherPanner3dPositionY = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionY: Pattern.number
    }
  },
};

export const eventMatcherPanner3dPositionZ = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionZ: Pattern.number
    }
  },
};


