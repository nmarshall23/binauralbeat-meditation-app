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