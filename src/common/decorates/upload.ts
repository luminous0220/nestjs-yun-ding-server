import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'

function upload(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)))
}

function fileTypeFilter(mimes: string[], message = '文件类型错误') {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void
  ) => {
    if (mimes.some((mime) => file.originalname.includes(mime))) {
      callback(null, true)
    } else {
      callback(new UnsupportedMediaTypeException(message), false)
    }
  }
}

export const Image = (fileName = 'image', fileSize = Math.pow(1024, 2) * 3) => {
  return upload(fileName, {
    limits: { fieldSize: fileSize },
    fileFilter: fileTypeFilter(['png', 'jpg', 'jpeg'], '只支持jpg、jpeg、png等格式'),
    storage: diskStorage({
      destination: process.env.FILE_PREFIX + process.env.IMAGE_PATH,
      filename: (req, file, cb) => {
        const fileName =
          Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname
        cb(null, fileName)
      }
    })
  })
}

export const Excle = (fileName = 'file', fileSize = Math.pow(1024, 2) * 2) => {
  return upload(fileName, {
    limits: { fieldSize: fileSize },
    fileFilter: fileTypeFilter(['xlsx', 'xls'])
  })
}
