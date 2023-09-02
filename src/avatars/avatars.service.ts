import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { FilerService } from 'src/filer/filer.service';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class AvatarsService {
  private FOLDER_PATH = '/usr/src/app/storage/avatars';

  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly filerService: FilerService,
  ) {}

  async create(avatar: Express.Multer.File): Promise<string> {
    this.loggerService.debug(`Create new avatar. Original file name : ${avatar.originalname}`);
    const name = `${uuidv4()}.jpg`;

    const buffer = await sharp(avatar.buffer)
      .resize({ width: 300, height: 300 })
      .jpeg({ quality: 80 })
      .toBuffer();

    await this.filerService.write(this.FOLDER_PATH, name, buffer);

    return name;
  }

  async delete(avatar: string): Promise<void> {
    this.loggerService.debug(`Delete avatar : ${avatar}`);

    await this.filerService.delete(this.FOLDER_PATH, avatar);
  }
}
