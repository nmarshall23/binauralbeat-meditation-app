import { customRef } from "vue";

type ToneNode = {
  set: (props: object) => ToneNode;
};

export function useTrackToneNode<T extends ToneNode, K extends keyof T>(
  toneNode: T,
  prop: K
) {
  const trackedProp = customRef((track, trigger) => {
    return {
      get() {
        track();
        return toneNode[prop];
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
