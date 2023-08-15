import { Temporal } from "@js-temporal/polyfill";



export function useMinDurationToSec(minutes: number) {
    return Temporal.Duration.from({ minutes }).round({ largestUnit: 'second' }).seconds
}