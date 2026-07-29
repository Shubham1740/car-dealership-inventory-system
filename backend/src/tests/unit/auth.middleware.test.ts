import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';

describe('authenticate middleware', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call next() and attach req.user for a valid token', () => {
    const token = jwt.sign({ id: 'user1', role: 'user' }, 'test-secret');
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expect.objectContaining({ id: 'user1', role: 'user' }));
  });

  it('should return 401 when no Authorization header is present', () => {
    const req: any = { headers: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for an invalid token', () => {
    const req: any = { headers: { authorization: 'Bearer invalid.token.here' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('requireAdmin middleware', () => {
  it('should call next() when user role is admin', () => {
    const req: any = { user: { id: 'user1', role: 'admin' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when user role is not admin', () => {
    const req: any = { user: { id: 'user1', role: 'user' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});