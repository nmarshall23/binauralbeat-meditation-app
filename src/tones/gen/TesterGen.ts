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

  const channel = new Tone.Channel(1);

  const reverb = new Tone.Reverb();

  const chorus = new Tone.Chorus({
    feedback: 0.5,
    frequency: 4,
    delayTime: 4,
    // depth: 0.5
  });

  const filterEffectNode = new FilterEffect({
    filter: {
      type: "lowpass",
      //detune: 1200,
    },
  });

  const gainNode = new Tone.Gain(1);
  const limiterNode = new Tone.Limiter(-20)

  const synthNode = new Tone.Synth({
    oscillator: {
      type: 'fatsawtooth6'
    },
    detune: 0
  });

 

  const modulator = new Tone.OmniOscillator({
    type: 'sine'
  })

  const modulationScale = new Tone.AudioToGain()

  // const modSynthNode = new Tone.Synth({
  //   oscillator: {
  //     type: 'square',
  //   },
  //   envelope: {
  //     attack: 0.01,
  //     decay: 0.01,

  //     // release: 0.8,
  //   },
  // });
  
  // const modOsc = new Tone.Oscillator({
  //   type: "square",
    
  // });



  // const bbEffect = new BinauralBeatEffect({ beatFrequency: 4 });

  
  // const synthNode = new BellToneSynth({
  //   harmonicity: 4,
  //   oscillator: {
  //     type: 'sawtooth'
  //   },
  //   envelope: {

  //   }
  // });

  // const synthNode = new Tone.AMSynth({
  //   oscillator: {
  //     type: 'fatsawtooth'
  //   }
  // })

  // === Connections === //

  channel.send("main");
  
  //modulator.chain(modulationScale, gainNode.gain).start()
  modulator.chain( gainNode.gain).start()
  // synthNode.chain(gainNode, chorus, reverb, limiterNode, channel)
  synthNode.chain(gainNode, limiterNode, channel)
  synthNode.volume.value = 4
  
  // synthNode.chain(filterEffectNode, chorus, reverb,  gainNode);
  //synthNode.chain(filterEffectNode, chorus, reverb, gainNode);
  // synthNode.chain(filterEffectNode, gainNode);
  // synthNode.connect(modMulti)
  // // modSynthNode.chain(negate, modMulti.factor)
  // modOsc.chain( modMulti.factor)
  
  // // add.chain(filterEffectNode, chorus, reverb,  gainNode)
  // modMulti.chain(filterEffectNode, gainNode)
  // // === Signals === //
  // const multSig = new Tone.Multiply(1);
  const harmonicity = new Tone.Multiply(0.8)
  synthNode.frequency.chain(harmonicity, modulator.frequency)

  //  synthNode.frequency.chain(multSig, filterEffectNode.filter.frequency);
  // filterEffectNode.filter.frequency =
  // filterEffectNode.wet.value = 1;

  // synthNode.frequency.chain(multSig, freqShift)
  
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
  // const effectA_Ctrl = useTrackToneNodeSignal(bbEffect.wet)
  const effectA_Ctrl = useTrackToneNodeSignal(filterEffectNode.wet)
  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
    // bbEffect.dispose()
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
      // gainNode.gain.value = 0.8;
      // const time = Tone.now()
     // modSynthNode._triggerEnvelopeAttack(time)
      synthNode.triggerAttackRelease(note, duration);

      //modSynthNode._triggerEnvelopeRelease(time + synthNode.toSeconds(duration) + synthNode.toSeconds(synthNode.envelope.release) )
    },
    effectA_Ctrl
    
  });
}
