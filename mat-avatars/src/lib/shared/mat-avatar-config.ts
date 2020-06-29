import { InjectionToken } from '@angular/core'

export type AvatarType = 
    "avataaars" |
    "bottts" |
    "female" |
    "gridy" |
    "male" |
    "jdenticon"
export const isAvatarType = (value: any): value is AvatarType => {
    switch (value) {
        case "avataaars": 
        case "bottts": 
        case "female": 
        case "gridy": 
        case "male": 
        case "jdenticon":
            return true
    }
    return false
}
export interface MatAvatarsConfig {
    emojiSize: number,
    pngSize: number
    previewSize: number
    previewHgap: number
    previewVgap: number
    avatarTypes: AvatarType[]
}
export const DEFAULT_MATAVATARS_CONFIG : MatAvatarsConfig = {
    emojiSize: 32,
    pngSize: 200,
    previewSize: 100,
    previewHgap: 8,
    previewVgap: 8,
    avatarTypes: ['avataaars', 'female', 'male', 'bottts', 'gridy', 'jdenticon']
}
export const MATAVATARS_CONFIG_TOKEN = new InjectionToken<MatAvatarsConfig>('mat-avatars-config')