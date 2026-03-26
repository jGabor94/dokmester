export type ImageExtension = 'jpg' | 'jpeg' | 'png' | 'apng' | 'gif' | 'webp' | 'flif' | 'xcf' | 'cr2' | 'cr3' | 'orf' | 'arw' | 'dng' | 'nef' | 'rw2' | 'raf' | 'tif' | 'bmp' | 'icns' | 'jxr' | 'psd' | 'indd' | 'ico' | 'j2c' | 'jp2' | 'jpm' | 'jpx' | 'mj2' | 'heic' | 'avif' | 'jxl'

export interface imageValidationCfg {
  extensions?: Array<ImageExtension>,
  size?: number,
  imageNumber?: number
}

export type RawImage = {
  previewUrl: string,
  key: string,
  file?: File
}

export type Image = {
  file: File,
  key: string,
}