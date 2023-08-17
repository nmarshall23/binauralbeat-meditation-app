import { Temporal } from "@js-temporal/polyfill";



export function useMinDurationToSec(minutes: number, hours?: number) {
    return Temporal.Duration.from({ minutes, hours }).round({ largestUnit: 'second' }).seconds
}