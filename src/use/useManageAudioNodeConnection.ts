import * as Tone from "tone";

export function useManageAudioNodeConnection(
  toneNode: Ref<Tone.ToneAudioNode | undefined>,
  destNode: Tone.ToneAudioNode
) {
  watch(
    toneNode,
    (node, prevNode) => {
      if (isDefined(prevNode)) {
        prevNode.disconnect(destNode);
      }

      if (isDefined(node)) {
        node.connect(destNode);
      }
    },
    {
      immediate: true,
    }
  );
}
