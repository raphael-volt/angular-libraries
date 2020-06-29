import { Injectable, Inject } from '@angular/core';
import { MatAvatarsConfig, MATAVATARS_CONFIG_TOKEN } from './shared/mat-avatar-config';
import { Avatar } from './shared/mat-avatars';

@Injectable({
  providedIn: 'root'
})
export class MatAvatarEncoderService {

  constructor(
    @Inject(MATAVATARS_CONFIG_TOKEN) private config: MatAvatarsConfig) { }

  encode(avatar: Avatar) {
    return new Promise((res, rej) => {
      const cnv = document.createElement('canvas')
      document.body.appendChild(cnv)
      const config = this.config
      const size: number = config.pngSize
      const spx: string = size + 'px'
      const srcWidth: number = config.previewSize
      cnv.width = size
      cnv.height = size
      cnv.setAttribute('width', spx)
      cnv.setAttribute('height', spx)
      const style = cnv.style
      style.width = spx
      style.height = spx
      
      const _ctx = cnv.getContext('2d')
      const img = new Image()
      // bugfix edge
      // img must be added to a parent
      document.body.appendChild(img)
      // pushing the img outside the viewport does not works
      img.style.opacity = "0.001"
      const done = (error?) => {
        _ctx.clearRect(0, 0, size, size)
        document.body.removeChild(cnv)
        document.body.removeChild(img)
        if (error)
          rej(error)
      }
      img.onload = () => {
        // bugfix edge
        // svg not completly rendered in requestAnimationFrame callback 
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            img.style.opacity = "1"
            _ctx.drawImage(img, 0, 0, size, size)
            const result = cnv.toDataURL("image/png")
            done()
            res(result)
          })
        })
      }
      img.onerror = done
      img.src = avatar.src
    })
  }
}
