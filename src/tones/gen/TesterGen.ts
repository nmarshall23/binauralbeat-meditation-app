import * as Tone from "tone";

import { GeneratorControls } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { useTrackToneNode, useTrackToneNodeSignal } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import { FilterEffect } from "../effect/filterEffect";
import { BellToneSynth } from "../Instrument/BellToneSynth";
import { BinauralBeatEffect } from "../effect/binauralBeatEffect";

export function createTesterGen(
  generatorName: string
  // eventHandler: PlaybackTriggers
) {
  console.debug(`createBellToneGen ${generatorName}`);

  const channel = new Tone.Channel();

  const reverb = new Tone.Reverb();

  const chorus = new Tone.Chorus({});

  const filterEffectNode = new FilterEffect({
    filter: {
      type: "lowpass",
      //detune: 1200,
    },
  });

  const gainNode = new Tone.Gain(0);

  const synthNode = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 1,
      release: 0.5,
    },
  });

  const bbEffect = new BinauralBeatEffect({ beatFrequency: 4 });

  
  // const synthNode = new BellToneSynth({
  //   harmonicity: 4,
  //   oscillator: {
  //     type: 'sine'
  //   }
  // });

  // const synthNode = new Tone.AMSynth({
  //   oscillator: {
  //     type: 'fatsawtooth'
  //   }
  // })

  // === Connections === //

  channel.send("main");
  gainNode.connect(channel);
  synthNode.chain(bbEffect,  gainNode);
  // synthNode.chain(filterEffectNode, chorus, reverb, gainNode);
  synthNode.chain(gainNode);

  // === Signals === //
   const multSig = new Tone.Multiply(2);

   synthNode.frequency.chain(multSig, filterEffectNode.filter.frequency);
  // filterEffectNode.filter.frequency =
  // filterEffectNode.wet.value = 1;

  // === Playback === //

  //   eventHandler.onPlayBackStarted((event) => {
  //     synthNode.triggerAttack(event.time);
  //   });

  //   eventHandler.onPlayBackPaused((time) => {
  //     synthNode.triggerRelease(time);
  //   });

  //   eventHandler.onPlayBackStopped((time) => {
  //     synthNode.triggerRelease(time);
  //   });

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} `;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);
  const effectA_Ctrl = useTrackToneNodeSignal(bbEffect.wet)

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
    bbEffect.dispose()
    filterEffectNode.dispose();
    chorus.dispose();
    reverb.dispose();
    gainNode.dispose();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatwLoop",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    trigger: (note: Tone.Unit.Frequency, duration: Tone.Unit.Time) => {
      gainNode.gain.value = 0.8;
      synthNode.triggerAttackRelease(note, duration);
    },
    effectA_Ctrl
    
  });
}
