import * as Tone from "tone";
import { useTrackToneNodeSignal } from "./useTrackToneNode";

const identityFn = <T, C extends T>(c: T) => c as C

export function useToneConnectEffect<T extends Tone.Unit.UnitName, C extends Tone.Unit.UnitMap[T]>(
  destSignal: Tone.Signal<T>,
  lfoNode: Tone.LFO,
  convertToFn: (v: C) => Tone.Unit.UnitMap[T] = identityFn,
  convertFromFn: (v: Tone.Unit.UnitMap[T]) => C = identityFn,
) {
  const lfoAmount = new Tone.CrossFade(1);
  const LfoScaleFac = new Tone.Multiply();

  const signal = new Tone.Signal({
    units: destSignal.units as T,
    value: destSignal.value,
  });

  lfoNode.connect(LfoScaleFac.factor);

  signal.chain(LfoScaleFac, lfoAmount.b);
  signal.chain(lfoAmount.a);

  lfoAmount.connect(destSignal);

  const signalRef = useTrackToneNodeSignal(
    signal,
    0.1,
    convertToFn,
    convertFromFn
  );

  const lfoAmountRef = useTrackToneNodeSignal(
    lfoAmount.fade,
    0.1
  );

  return {
    signal,
    lfoAmount,
    signalRef,
    lfoAmountRef,
  };
}
