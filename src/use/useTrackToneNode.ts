import * as Tone from "tone";

type ToneNode = {
  set: (props: object) => ToneNode;
};

export function useTrackToneNode<T extends ToneNode, K extends keyof T, V extends T[K]>(
  toneNode: T,
  prop: K,
  defaultValue: V
) {
  const trackedProp = customRef((track, trigger) => {
    return {
      get() {
        track();
        return toneNode[prop] ?? defaultValue;
      },
      set(newValue) {
        toneNode.set({
          [prop]: newValue,
        });
        trigger();
      },
    };
  });

  return trackedProp;
}


export function useTrackToneNodeSignal<TypeName extends keyof Tone.Unit.UnitMap>(
  signal: Tone.Signal<TypeName>,
  rampTime: number = 0.1
) {
  const trackedProp = customRef((track, trigger) => {
    return {
      get() {
        track();
        return signal.value
      },
      set(newValue) {
        console.log('set val %o', newValue)
        signal.rampTo(newValue, rampTime)
        setTimeout(() => trigger(), rampTime * 1000 + 50 )
        
      },
    };
  });

  return trackedProp;
}

// export function useTrackToneParam<P extends Param>(param: P) {
//   customRef((track, trigger) => {
//     return {
//       get() {
//         track();
//         return param
//       },
//       set(newValue) {
//         toneNode.set({
//           [prop]: newValue,
//         });
//         trigger();
//       },
//     };
//   });
// }