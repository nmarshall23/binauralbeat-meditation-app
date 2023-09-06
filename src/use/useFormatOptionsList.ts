import { capitalCase } from "change-case";



export function useFormatOptionsList(list: string[]) {

    return useArrayMap(list, i => ({ label: capitalCase(i), value: i}))
}