import { Temporal } from "@js-temporal/polyfill";



export function useMinDurationToSec(minutes: number, hours?: number) {
    return Temporal.Duration.from({ minutes, hours }).round({ largestUnit: 'second' }).seconds
}

/**
 * 
 * @param durationObj = { hours?: number, minutes?: number, seconds?: number }
 * @returns duration in seconds
 */
export function useFromDurationToSeconds(durationObj: Temporal.DurationLike) {
    return Temporal.Duration.from(durationObj).round({ largestUnit: 'second' }).seconds
}