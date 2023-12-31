
import { Pattern, isMatching } from "ts-pattern";

export const isTimeEvent = isMatching({
  time: Pattern.union(Pattern.string, Pattern.number)
});

export const eventMatcherGain = {
  rampTime: Pattern.number,
  signal: {
    gain: Pattern.number.between(0.0, 2.0),
  },
};

export const isGainEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    gain: Pattern.number.between(0.0, 2.0),
  },
});

export const isSynthEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    synth: Pattern.not(Pattern.nullish)
  },
});

export const eventMatcherBinauralBeatFreq = {
  rampTime: Pattern.number,
  signal: {
    synth: {
      beatFreq: Pattern.number,
    },
  },
};

export const isSynthBeatFreqEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    synth: {
      beatFreq: Pattern.number,
    },
  },
});

export const eventMatcherOscFreq = {
  rampTime: Pattern.number,
  signal: {
    synth: {
      baseFreq: Pattern.number,
    },
  },
};

export const isSynthBaseFreqEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    synth: {
      baseFreq: Pattern.number,
    },
  },
});

export const eventMatcherFilterFrequency = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      frequency: Pattern.number,
    },
  },
};

export const isFilterEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    filter: Pattern.not(Pattern.nullish)
  },
});

export const isFilterFreqEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    filter: {
      frequency: Pattern.number,
    },
  },
});

export const isFilterQEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    filter: {
      Q: Pattern.number,
    },
  },
});

export const eventMatcherFilterQ = {
  rampTime: Pattern.number,
  signal: {
    filter: {
      Q: Pattern.number,
    },
  },
};

export const isFilterGainEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    filter: {
      gain: Pattern.number,
    },
  },
});

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

export const isFilterWetEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    filter: {
      wet: Pattern.number.between(0, 1),
    },
  },
});

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

export const isSpinEffectEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    spinEffect: Pattern.not(Pattern.nullish),
  },
});

export const isSpinEffectWetEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    spinEffect: {
      wet: Pattern.union(0, 1),
    },
  },
});

export const isSpinEffectEnableEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    spinEffect: Pattern.union(0, 1),
  },
});

export const eventMatcherSpinCycleFreq = {
  rampTime: Pattern.number,
  signal: {
    spinEffect: {
      frequency: Pattern.number.between(0.1, 2),
    },
  },
};

export const isSpinEffectCycleFreqEvent = isMatching({
  rampTime: Pattern.number,
  signal: {
    spinEffect: {
      frequency: Pattern.number.between(0.1, 2),
    },
  },
});

export const eventMatcherStartSample = {
  rampTime: Pattern.number,
  signal: {
    startSample: true,
  },
};

export const eventMatcherStartLoopBool = {
  rampTime: Pattern.number,
  signal: {
    startPattern: true,
  },
};

export const eventMatcherStartLoopPatten = {
  rampTime: Pattern.number,
  signal: {
    startLoop: {
      pattern: Pattern.union(
        "up",
        "down",
        "upDown",
        "downUp",
        "alternateUp",
        "alternateDown",
        "random",
        "randomOnce",
        "randomWalk"
      ),
    },
  },
};

export const eventMatcherPanner3dPositionX = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionX: Pattern.number,
    },
  },
};

export const eventMatcherPanner3dPositionY = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionY: Pattern.number,
    },
  },
};

export const eventMatcherPanner3dPositionZ = {
  rampTime: Pattern.number,
  signal: {
    panner3d: {
      positionZ: Pattern.number,
    },
  },
};

export const eventMatcherPitchShiftPitch = {
  rampTime: Pattern.number,
  signal: {
    pitchShift: {
      pitch: Pattern.number,
    },
  },
};

export const eventMatcherPitchShiftWet = {
  rampTime: Pattern.number,
  signal: {
    pitchShift: {
      wet: Pattern.union(0, 1),
    },
  },
};
