import { customRef } from "vue";

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
