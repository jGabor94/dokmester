import imageCompression from 'browser-image-compression';
import { RawImage } from './types';

const imagePreparation = async ({ file, key }: Required<RawImage>): Promise<File> => {

    const compressedImage = await imageCompression(file, {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    })

    return compressedImage


};

export default imagePreparation