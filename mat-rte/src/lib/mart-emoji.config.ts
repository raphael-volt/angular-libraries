import { InjectionToken } from '@angular/core'

export type ToolbarSize = {
    size: string | false, name: string,
}
export type ToolbarSizeList = ToolbarSize[]

export type MatRteConfig = {
    emoji?: {
        sheetSize: number
        backgroundImageFn?: (set: string, sheetSize: number) => string
    }
    quill?: {
        toolbarSizes: ToolbarSizeList
    }
}

export const DEFAULT_MAT_RTE_CONFIG: MatRteConfig = {
    emoji: {
        sheetSize: 32,
        backgroundImageFn: (set: string, sheetSize: number): string => {
            return `/emoji-apple-${sheetSize}.png`
        }
    },
    quill: {
        toolbarSizes: [
            { size: "14px", name: "normal" },
            { size: "22px", name: "moyen" },
            { size: "28px", name: "grand" },
            { size: "32px", name: "XXL" }
        ]
    }
}
export const MAT_RTE_CONFIG_TOKEN = new InjectionToken<MatRteConfig>('mat-rte-config')