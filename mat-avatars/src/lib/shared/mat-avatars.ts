import avataaars from '@dicebear/avatars-avataaars-sprites';
import bottts from '@dicebear/avatars-bottts-sprites';
import female from '@dicebear/avatars-female-sprites';
import gridy from '@dicebear/avatars-gridy-sprites';
import male from '@dicebear/avatars-male-sprites';
import jdenticon from '@dicebear/avatars-jdenticon-sprites';
import { AvatarType, DEFAULT_MATAVATARS_CONFIG, MatAvatarsConfig } from './mat-avatar-config';

const AVATAAARS_CONFIG = {

    mouth: [
        "default",
        "disbelief",
        "eating",
        "serious",
        "smile",
        "twinkle"
    ],
    eyes: [
        "default",
        "roll",
        "happy",
        "side",
        "squint",
        "surprised"
    ]
}

const HUMAN_CONFIG = {
    mood: ['happy', 'surprised']
}

const getAvatarOptions = (t: AvatarType, size: number) => {

    const options: any = {
        width: size,
        height: size,
        base64: true,
        margin: size * .04
    }

    switch (t) {
        case "avataaars":
            Object.assign(options, AVATAAARS_CONFIG)
            break
        case "jdenticon":
            options.margin = Math.floor(size * .14)
            break
        case "male":
        case "female":
            Object.assign(options, HUMAN_CONFIG)
            break;
        default:
            break;
    }
    return options
}
const H16 = 16
const rdmInt = () => {
    let v = Math.round(Math.random() * H16).toString(16)
    if (v.length == 1)
        v = `0${v}`
    return v
}
const getUID = (length = 8) => {
    let l = []
    const n = 8
    for (let i = 0; i < length; i++) {
        l.push(rdmInt())
    }
    return l.join("")
}

const getSprites = (type: AvatarType): any => {
    switch (type) {
        case "avataaars":
            return avataaars

        case "bottts":
            return bottts

        case "female":
            return female

        case "gridy":
            return gridy

        case "male":
            return male
        case "jdenticon":
            return jdenticon
    }
    return null
}

const getTypeEmoji = (type: AvatarType): any => {
    switch (type) {
        case "avataaars":
            return "0307060f04080a00"

        case "bottts":
            return "0f020f080e0f0405"

        case "female":
            return "080a060703030602"//080f090f08020f05 100f0e05080a030b

        case "gridy":
            return "020c0604040d050f"

        case "male":
            return "08070308060e090c"
        case "jdenticon":
            return "080a0f06090f030f"
    }
    return null
}


export type AvatarDesc = {
    type: AvatarType
    emoji: string
}

export type AvatarDescList = AvatarDesc[]

const createAvatarDescList = (config: MatAvatarsConfig): AvatarDescList => {
    if (!config)
        config = DEFAULT_MATAVATARS_CONFIG
    const list: AvatarDescList = []
    for (const type of config.avatarTypes) {
        list.push({
            type: type,
            emoji: getTypeEmoji(type)
        })
    }
    return list
}

export interface Avatar {
    uid?: string,
    src?: string
}
export { getSprites, getUID, createAvatarDescList, getAvatarOptions }