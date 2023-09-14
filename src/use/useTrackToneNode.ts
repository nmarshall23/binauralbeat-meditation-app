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

const identityFn = <T, C extends T>(c: T) => c as C

export function useTrackToneNodeSignal<TypeName extends keyof Tone.Unit.UnitMap,  C extends Tone.Unit.UnitMap[TypeName] >(
  signal: Tone.Signal<TypeName>,
  rampTime: number = 0.1,
  convertToFn: (v: C) => Tone.Unit.UnitMap[TypeName] = identityFn,
  convertFromFn: (v: Tone.Unit.UnitMap[TypeName]) => C = identityFn,
) {
  const trackedProp = customRef((track, trigger) => {
    return {
      get() {
        track();
        return  convertFromFn(signal.value)
      },
      set(newValue) {
        console.log('set val %o', newValue)
        signal.rampTo(convertToFn(newValue), rampTime)
        setTimeout(() => trigger(), rampTime * 1000 + 50 )
        
      },
    };
  });

  return trackedProp;
}


export function useTrackPramNode<TypeName extends Tone.Unit.UnitName = "number", >(
  param: Tone.Param<TypeName>,
  rampTime: number = 0.1,
  
) {
  const trackedProp = customRef((track, trigger) => {
    return {
      get() {
        track();
        return  param.value
      },
      set(newValue) {
        
        param.rampTo(newValue, rampTime)
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