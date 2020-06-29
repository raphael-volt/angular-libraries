import { Injectable, Inject } from '@angular/core';
import { AvatarDescList, createAvatarDescList, Avatar, getSprites, getAvatarOptions, getUID } from './shared/mat-avatars';
import { MATAVATARS_CONFIG_TOKEN, AvatarType, MatAvatarsConfig } from './shared/mat-avatar-config';
import Avatars from "@dicebear/avatars";
import { AvatarImgDirective } from './shared/avatar-img.directive';
type AvatarFactory = { create: (id: string, options?: any) => string }
type AvatarCollection = { [key: string]: AvatarFactory }
type PreviewConfig = {
  size: number
  hGap: number
  vGap: number
}
@Injectable({
  providedIn: 'root'
})
export class MatAvatarsService {

  private avatarFactory: AvatarCollection = {}

  constructor(
    @Inject(MATAVATARS_CONFIG_TOKEN) public config: MatAvatarsConfig
  ) {
    this._avatarDescList = createAvatarDescList(config)
  }

  private _avatarDescList: AvatarDescList
  get avatarDescList() {
    return this._avatarDescList
  }

  getAvatars(type: AvatarType, width: number, height: number, hGap = 0, vGap = 0): Avatar[] {
    this.clearSelection()
    const factory = this.getAvatarFactory(type)
    const n = this.calculateNumAvatars(width, height, hGap, vGap)
    return this.createAvatars(type, n)
  }
  createAvatar(type: AvatarType, id: string) {
    const factory = this.getAvatarFactory(type)
    const options = getAvatarOptions(type, this.config.previewSize)
    return factory.create(id, options)
  }
  private createAvatars(type: AvatarType, num: number, source: Avatar[] = null) {
    if (!source)
      source = []
    const factory = this.getAvatarFactory(type)
    const options = getAvatarOptions(type, this.config.previewSize)
    for (let i = 0; i < num; i++) {
      const avt: Avatar = {
        uid: getUID()
      }
      avt.src = factory.create(avt.uid, options)
      source.push(avt)
    }
    return source
  }

  get previewConfig(): PreviewConfig {
    const config = this.config
    return {
      size: config.previewSize,
      hGap: config.previewHgap,
      vGap: config.previewVgap,
    }
  }

  private validatePreviewConfig(hGap: number, vGap: number, size: number, config: PreviewConfig = null) {
    if (!config) 
      config = this.previewConfig
    if (!isNaN(hGap))
      config.hGap = hGap

    if (!isNaN(vGap))
      config.vGap = vGap
    if (!isNaN(size))
      config.size = size
    return config

  }

  setAvatarsPosition(images: AvatarImgDirective[], width: number, height: number, hGap: number=NaN, vGap: number=NaN, size: number = NaN) {
    const layout = this.calculateLayout(width, height, hGap, vGap, size)
    const cfg = layout[2]
    hGap = cfg.hGap
    vGap = cfg.vGap
    size = cfg.size
    const rowCount = layout[0]
    const colCount = layout[1]
    hGap = (width - rowCount * size) / (rowCount+1)
    vGap = (height - colCount * size) / (colCount+1)
    
    let x: number = hGap
    let y: number = vGap
    let k : number = 0
    const n = images.length
    for (let i = 0; i < n; i++) {
      images[i].setPosition(x, y)
      k++
      if(k<rowCount) {
        x += size + hGap
      }
      else {
        k = 0
        x = hGap
        y += size + vGap
      }
    }
  }
  calculateLayout(width: number, height: number, hGap: number=NaN, vGap: number=NaN, size: number = NaN): [number, number, PreviewConfig] {
    const cfg = this.validatePreviewConfig(hGap, vGap, size)
    size = cfg.size
    hGap = cfg.hGap
    vGap = cfg.vGap
    let rowCount = 0
    let colCount = 0
    let v: number
    width -= hGap*2
    height -= vGap*2
    for (v = 0; v < width; v += size) {
      if (v + size <= width) {
        rowCount++
        v += hGap
      }
    }

    for (v = 0; v < height; v += size) {
      if (v + size <= height) {
        colCount++
        v += vGap
      }
    }
    return [rowCount, colCount, cfg]
  }




  private calculateNumAvatars(width: number, height: number, hGap: number, vGap: number, size: number = NaN) {
    const layout = this.calculateLayout(width, height, hGap, vGap, size)
    return layout[0] * layout[1]
    /*
    const bdrSize = size + 12 // margin: 4px bdr-w:1
    let rowCount = Math.floor(width / size)
    let colCount = Math.floor(height / size)
    let mw = bdrSize * rowCount
    let mh = bdrSize * colCount
    if (mw > width && rowCount > 1)
      rowCount--
    if (mh > height && colCount > 1)
      colCount--
      return rowCount * colCount
    */
  }

  checkAvatars(type: AvatarType, avatars: Avatar[], hGap: number, vGap: number, width: number, height: number) {
    const next = this.calculateNumAvatars(width, height, hGap, vGap)
    const current = avatars.length
    if (next == current)
      return false
    if (current > next) {
      avatars.splice(next, current - next)
    }
    else {
      this.createAvatars(type, next - current, avatars)
    }
    return true
  }

  getAvatarFactory(type: AvatarType): AvatarFactory {
    const factory = this.avatarFactory;
    if (type in factory)
      return factory[type]

    factory[type] = new Avatars(
      getSprites(type),
      getAvatarOptions(type, this.config.previewSize))
    return factory[type]
  }

  private selecteImg: AvatarImgDirective
  public selectDirective(value: AvatarImgDirective) {
    if (this.selecteImg)
      this.selecteImg.selected = false
    value.selected = true
    this.selecteImg = value
  }

  public clearSelection() {
    if (this.selecteImg) {
      this.selecteImg.selected = false
      this.selecteImg = null
    }
  }




}
