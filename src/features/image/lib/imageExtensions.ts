import { ImageExtension } from "../utils/types"

export const imageExtensions: ImageExtension[] = [
  "jpg",
  "jpeg",
  "png",
  "apng",
  "gif",
  "webp",
  "flif",
  "xcf",
  "cr2",
  "cr3",
  "orf",
  "arw",
  "dng",
  "nef",
  "rw2",
  "raf",
  "tif",
  "bmp",
  "icns",
  "jxr",
  "psd",
  "indd",
  "ico",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "mj2",
  "heic",
  "avif",
  "jxl"
]

export const allowedImageExtenstions: ImageExtension[] = (() => {
  const extensions = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_EXTENSIONS
  return extensions ? (extensions.split(",") as ImageExtension[]) : imageExtensions
})()


export const allowedImageSize: number = (() => {
  const size = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_SIZE
  return Number(size) ?? 3000
})()