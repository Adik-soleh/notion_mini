import { Response, NextFunction } from "express";
import { BlockService } from "../services/block-service";
import { CreateBlockRequest, UpdateBlockRequest } from "../model/block-model";
import { UserRequest } from "../type/user-request";
import { logger } from "../utils/logger";

export class BlockController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const noteId = Number(req.params.noteId);
      const request: CreateBlockRequest = req.body;

      const response = await BlockService.create(req.user!, noteId, request);

      logger.info(`✅ User ${req.user?.id} berhasil membuat block baru dengan id ${response.id} di note ${noteId}`);

      res.status(201).json({ data: response });
    } catch (e) {
      logger.error(`❌ Gagal membuat block: ${e}`);
      next(e);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const noteId = Number(req.params.noteId);
      const response = await BlockService.get(req.user!, noteId);

      logger.info(`📄 User ${req.user?.id} mengambil semua block di note ${noteId}, total: ${response.length}`);

      res.status(200).json({ data: response });
    } catch (e) {
      logger.error(`❌ Gagal mengambil block: ${e}`);
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const blockId = Number(req.params.id);
      const request: UpdateBlockRequest = req.body;
      const file = req.file;

      const response = await BlockService.update(req.user!, blockId, request, file);

      logger.info(`✏️ Berhasil update block dengan id ${blockId} oleh user ${req.user?.id}`);

      res.status(200).json({ data: response });
    } catch (e) {
      logger.error(`❌ Gagal update block ${req.params.id}: ${e}`);
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const blockId = Number(req.params.id);

      await BlockService.remove(req.user!, blockId);

      logger.info(`🗑️ Block dengan id ${blockId} berhasil dihapus oleh user ${req.user?.id}`);

      res.status(200).json({ message: "Block deleted" });
    } catch (e) {
      logger.error(`❌ Gagal menghapus block ${req.params.id}: ${e}`);
      next(e);
    }
  }

  static async updateBlockOrders(req: UserRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const blocks: { id: number; order: number }[] = req.body;

      if (!Array.isArray(blocks)) {
        logger.warn(`⚠️ Payload untuk urutan block tidak valid dari user ${req.user?.id}`);
        return res.status(400).json({ message: "Invalid payload format" });
      }

      await BlockService.updateOrders(blocks);

      logger.info(`🔃 User ${req.user?.id} mengupdate urutan ${blocks.length} block`);

      res.status(200).json({ message: "Block orders updated" });
    } catch (error) {
      logger.error(`❌ Gagal update urutan block: ${error}`);
      next(error);
    }
  }
}
