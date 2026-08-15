import type { Request, Response } from 'express';
import { ok } from '../../utils/envelope';
import { authService, REFRESH_COOKIE } from './service';
import { UnauthorizedError } from '../../utils/errors';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body, req, res);
    res.status(201).json(ok(result));
  },
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body, req, res);
    res.json(ok(result));
  },
  async refresh(req: Request, res: Response) {
    const cookie = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    const result = await authService.refresh(cookie, req, res);
    res.json(ok(result));
  },
  async logout(req: Request, res: Response) {
    const cookie = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    await authService.logout(cookie, res);
    res.json(ok({ loggedOut: true }));
  },
  async me(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const user = await authService.me(req.user.id);
    res.json(ok({ user }));
  },
  async changePassword(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    await authService.changePassword(req.user.id, req.body, req, res);
    res.json(ok({ passwordChanged: true }));
  },
  async forgotPassword(req: Request, res: Response) {
    await authService.forgotPassword(req.body, req);
    // Always respond 200 (no enumeration).
    res.json(ok({ sent: true }));
  },
  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body, req);
    res.json(ok({ reset: true }));
  },
  async verifyEmail(req: Request, res: Response) {
    const token = (req.query.token as string) ?? '';
    const result = await authService.verifyEmail(token);
    res.json(ok(result));
  },
  async resendVerification(req: Request, res: Response) {
    await authService.resendVerification(req.body.email);
    res.json(ok({ sent: true }));
  },
};
