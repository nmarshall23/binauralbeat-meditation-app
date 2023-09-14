export interface LfoModOptions {}

export class LfoMod<Options extends LfoModOptions> {
  readonly name: string = "FilterEffect";

  dispose(): this {

    return this;
  }
}
