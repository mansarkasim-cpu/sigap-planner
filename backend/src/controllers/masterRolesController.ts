import { Request, Response } from 'express';

// Central list of known application roles. Keep in sync with frontend ROLE_OPTIONS.
const ROLES = ['admin', 'planner', 'technician', 'terminal'];

export function listRoles(req: Request, res: Response) {
  try {
    return res.json({ data: ROLES });
  } catch (err) {
    console.error('listRoles error', err);
    return res.status(500).json({ message: 'Failed to list roles' });
  }
}

export default { listRoles };
