import * as Tone from "tone";
import { useTrackPramNode, useTrackToneNodeSignal } from "./useTrackToneNode";

const identityFn = <T, C extends T>(c: T) => c as C;

type UseToneConnectEffectOptions<
  T extends Tone.Unit.UnitName,
  C extends Tone.Unit.UnitMap[T]
> = {
  convertToFn?: (v: C) => Tone.Unit.UnitMap[T];
  convertFromFn?: (v: Tone.Unit.UnitMap[T]) => C;
  modulatorInline?: boolean;
};

export function useToneConnectEffect<
  T extends Tone.Unit.UnitName,
  C extends Tone.Unit.UnitMap[T]
>(
  modulatingToneNode: Tone.ToneAudioNode,
  destSignal: Tone.Signal<T>,
  options?: UseToneConnectEffectOptions<T, C>
) {
  const { convertToFn, convertFromFn, modulatorInline } = options ?? {};

  const effectAmount = new Tone.CrossFade(1);
  const effectScaleFac = new Tone.Multiply(1);

  effectAmount.connect(destSignal);

  const signal = new Tone.Signal({
    units: destSignal.units as T,
    value: destSignal.value,
  });

  if (modulatorInline && modulatingToneNode.numberOfInputs > 0) {
    signal.chain(modulatingToneNode, effectScaleFac, effectAmount.b);
    signal.chain(effectAmount.a);
  } else {
    modulatingToneNode.chain(effectScaleFac, effectAmount.b);
    signal.chain(effectAmount.a);
  }

  const signalRef = useTrackToneNodeSignal(
    signal,
    0.1,
    convertToFn,
    convertFromFn
  );

  const effectAmountRef = useTrackToneNodeSignal(effectAmount.fade, 0.1);

  const effectScaleFacRef = useTrackPramNode(effectScaleFac.factor);

  function dispose() {
    effectAmount.dispose();
    effectScaleFac.dispose();
    signal.dispose();
  }

  return {
    signal,
    effectAmount,
    signalRef,
    effectAmountRef,
    effectScaleFacRef,
    dispose,
  };
}



export function useToneConnectLfoEffect<
  T extends Tone.Unit.UnitName,
  C extends Tone.Unit.UnitMap[T]
>(
  destSignal: Tone.Signal<T>,
  lfoNode: Tone.LFO,
  convertToFn: (v: C) => Tone.Unit.UnitMap[T] = identityFn,
  convertFromFn: (v: Tone.Unit.UnitMap[T]) => C = identityFn
) {
  const lfoAmount = new Tone.CrossFade(1);
  const lfoScaleFac = new Tone.Multiply();

  const signal = new Tone.Signal({
    units: destSignal.units as T,
    value: destSignal.value,
  });

  lfoNode.connect(lfoScaleFac.factor);

  signal.chain(lfoScaleFac, lfoAmount.b);
  signal.chain(lfoAmount.a);

  lfoAmount.connect(destSignal);

  const signalRef = useTrackToneNodeSignal(
    signal,
    0.1,
    convertToFn,
    convertFromFn
  );

  const lfoAmountRef = useTrackToneNodeSignal(lfoAmount.fade, 0.1);

  function dispose() {
    lfoAmount.dispose();
    lfoScaleFac.dispose();
    signal.dispose();
  }

  return {
    signal,
    lfoAmount,
    signalRef,
    lfoAmountRef,
    dispose,
  };
}
