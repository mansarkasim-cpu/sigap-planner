import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterChecklistQuestion } from '../entities/MasterChecklistQuestion';
import { MasterChecklistOption } from '../entities/MasterChecklistOption';

export async function listQuestions(req: Request, res: Response) {
  try {
    const jenisAlatId = req.query.jenis_alat_id ? Number(req.query.jenis_alat_id) : undefined;
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    const repo = AppDataSource.getRepository(MasterChecklistQuestion);
    const optRepo = AppDataSource.getRepository(MasterChecklistOption);

    // build base query for questions (without relying on relation metadata for options)
    const qb = repo.createQueryBuilder('q')
      .leftJoinAndSelect('q.jenis_alat','jenis')
      .orderBy('q.order','ASC');

    if (jenisAlatId) qb.where('q.jenis_alat_id = :ja', { ja: jenisAlatId });

    if (search) {
      if (jenisAlatId) qb.andWhere('(q.question_text ILIKE :q OR jenis.nama ILIKE :q)', { q: `%${search}%` });
      else qb.where('(q.question_text ILIKE :q OR jenis.nama ILIKE :q)', { q: `%${search}%` });
    }

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      // load options for these questions
      const ids = rows.map(r => r.id);
      if (ids.length > 0) {
        const opts = await optRepo.createQueryBuilder('o').where('o.question_id IN (:...ids)', { ids }).orderBy('o.order','ASC').getMany();
        const map = opts.reduce((acc: any, o: any) => { (acc[o.question?.id || (o as any).question_id] = acc[o.question?.id || (o as any).question_id] || []).push(o); return acc; }, {});
        for (const r of rows) { (r as any).options = map[r.id] || []; }
      }
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.getMany();
    // load options for all questions
    const ids = rows.map(r => r.id);
    if (ids.length > 0) {
      const opts = await optRepo.createQueryBuilder('o').where('o.question_id IN (:...ids)', { ids }).orderBy('o.order','ASC').getMany();
      const map = opts.reduce((acc: any, o: any) => { (acc[o.question?.id || (o as any).question_id] = acc[o.question?.id || (o as any).question_id] || []).push(o); return acc; }, {});
      for (const r of rows) { (r as any).options = map[r.id] || []; }
    }
    return res.json(rows);
  } catch (err) {
    console.error('listQuestions error', err);
    return res.status(500).json({ message: 'Failed to list questions' });
  }
}

export async function getQuestion(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterChecklistQuestion);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    const qb = repo.createQueryBuilder('q')
      .leftJoinAndSelect('q.options','options')
      .leftJoinAndSelect('q.jenis_alat','jenis')
      .orderBy('q.id','ASC');

    if (search) qb.where('(q.question_text ILIKE :q OR jenis.nama ILIKE :q)', { q: `%${search}%` });

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('getQuestion error', err);
    return res.status(500).json({ message: 'Failed to get question' });
  }
}

export async function createQuestion(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterChecklistQuestion);
    const payload = req.body || {};
    if (!payload.question_text || String(payload.question_text).trim() === '') return res.status(400).json({ message: 'question_text is required' });
    if (!payload.jenis_alat_id) return res.status(400).json({ message: 'jenis_alat_id is required' });
    const ent = repo.create({
      jenis_alat: payload.jenis_alat_id ? ({ id: payload.jenis_alat_id } as any) : undefined,
      question_text: String(payload.question_text).trim(),
      kelompok: payload.kelompok || payload.group || null,
      input_type: payload.input_type || 'boolean',
      required: payload.required !== undefined ? Boolean(payload.required) : true,
      order: payload.order || 0,
    });
    const saved = await repo.save(ent);

    // create options if provided
    if (Array.isArray(payload.options) && payload.options.length > 0) {
      const optRepo = AppDataSource.getRepository(MasterChecklistOption);
      const createdOpts = payload.options.map((o: any, i: number) => optRepo.create({ question: { id: (saved as any).id } as any, option_text: o.option_text || o, option_value: o.option_value || null, order: o.order ?? i }));
      await optRepo.save(createdOpts);
    }

    return res.status(201).json({ id: (saved as any).id });
  } catch (err) {
    console.error('createQuestion error', err);
    return res.status(500).json({ message: 'Failed to create question', detail: err instanceof Error ? err.message : err });
  }
}

export async function updateQuestion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterChecklistQuestion);
    const payload = req.body || {};
    const update: any = { ...payload };
    if (payload.kelompok !== undefined) update.kelompok = payload.kelompok;
    if (payload.jenis_alat_id !== undefined) {
      update.jenis_alat = payload.jenis_alat_id ? ({ id: payload.jenis_alat_id } as any) : null;
      delete update.jenis_alat_id;
    }
    await repo.update({ id }, update);
    const row = await repo.findOneBy({ id });
    return res.json(row);
  } catch (err) {
    console.error('updateQuestion error', err);
    return res.status(500).json({ message: 'Failed to update question' });
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterChecklistQuestion);
    await repo.delete({ id });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteQuestion error', err);
    return res.status(500).json({ message: 'Failed to delete question' });
  }
}

export async function createOption(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterChecklistOption);
    const payload = req.body || {};
    if (!payload.question_id) return res.status(400).json({ message: 'question_id is required' });
    if (!payload.option_text || String(payload.option_text).trim() === '') return res.status(400).json({ message: 'option_text is required' });
    const ent = repo.create({ question: payload.question_id ? ({ id: payload.question_id } as any) : undefined, option_text: String(payload.option_text).trim(), option_value: payload.option_value, order: payload.order || 0 });
    const saved = await repo.save(ent);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createOption error', err);
    return res.status(500).json({ message: 'Failed to create option' });
  }
}

export async function updateOption(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterChecklistOption);
    const payload = req.body || {};
    const update: any = { ...payload };
    if (payload.question_id !== undefined) {
      update.question = payload.question_id ? ({ id: payload.question_id } as any) : null;
      delete update.question_id;
    }
    await repo.update({ id }, update);
    const row = await repo.findOneBy({ id });
    return res.json(row);
  } catch (err) {
    console.error('updateOption error', err);
    return res.status(500).json({ message: 'Failed to update option' });
  }
}

export async function deleteOption(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterChecklistOption);
    await repo.delete({ id });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteOption error', err);
    return res.status(500).json({ message: 'Failed to delete option' });
  }
}

export async function listOptions(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterChecklistOption);
    const questionId = req.query.question_id ? Number(req.query.question_id) : undefined;
    const ids = req.query.question_ids ? ((req.query.question_ids as string).split(',').map(Number)) : undefined;
    const qb = repo.createQueryBuilder('o').orderBy('o.order','ASC');
    if (questionId) qb.where('o.question_id = :qid', { qid: questionId });
    else if (ids && ids.length > 0) qb.where('o.question_id IN (:...ids)', { ids });
    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listOptions error', err);
    return res.status(500).json({ message: 'Failed to list options' });
  }
}
