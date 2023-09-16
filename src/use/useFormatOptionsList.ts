import { capitalCase } from "change-case";



export function useFormatOptionsList(list: string[]) {

    return useArrayMap(list, i => ({ label: capitalCase(i), value: i}))
}

export function useFormatMenuList(list: string[]) {

    return useArrayMap(list, i => ({ title: capitalCase(i), value: i}))
}