import type { Request, Response } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { created, ok } from '../utils/apiResponse';
import { changePassword, login, logout, refresh } from '../services/auth.service';
import {
  createPaymentOrder,
  createRegistration,
  getActiveWorkshopForBooking,
  getBookingConfig,
  getRegistrationByCode,
  handleWebhookPaymentCaptured,
  verifyAndCompletePayment,
} from '../services/booking.service';
import { verifyWebhookSignature } from '../services/razorpay.service';
import { ApiError } from '../utils/ApiError';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await login(req.body.email, req.body.password, res);
  ok(res, data, 'Signed in');
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[env.REFRESH_COOKIE_NAME] as string | undefined;
  ok(res, await refresh(token, res));
});

export const logoutHandler = asyncHandler(async (_req: Request, res: Response) => {
  await logout(res);
  ok(res, { ok: true }, 'Signed out');
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  ok(res, { admin: req.admin });
});

export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  await changePassword(req.admin!.id, req.body.currentPassword, req.body.nextPassword);
  ok(res, { ok: true }, 'Password updated');
});

export const bookingConfigHandler = asyncHandler(async (_req, res) => {
  ok(res, getBookingConfig());
});

export const bookingWorkshopHandler = asyncHandler(async (_req, res) => {
  const workshop = await getActiveWorkshopForBooking();
  ok(res, workshop.toJSON());
});

export const createRegistrationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { registration, workshop } = await createRegistration({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('user-agent') ?? undefined,
  });
  created(res, { registration: registration.toJSON(), workshop: workshop.toJSON() }, 'Registration started');
});

export const createOrderHandler = asyncHandler(async (req: Request, res: Response) => {
  ok(res, await createPaymentOrder(req.body.registrationCode), 'Order created');
});

export const verifyPaymentHandler = asyncHandler(async (req: Request, res: Response) => {
  const registration = await verifyAndCompletePayment(req.body);
  ok(res, { registration: registration.toJSON() }, 'Payment confirmed');
});

export const registrationLookupHandler = asyncHandler(async (req: Request, res: Response) => {
  ok(res, await getRegistrationByCode(String(req.params.code)));
});

export const webhookHandler = asyncHandler(async (req: Request, res: Response) => {
  const signature = String(req.header('x-razorpay-signature') ?? '');
  const raw = req.rawBody ?? JSON.stringify(req.body);
  if (!verifyWebhookSignature(raw, signature)) {
    throw ApiError.unauthorized('Invalid webhook signature');
  }
  const event = req.body as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string; method?: string } } } };
  if (event.event === 'payment.captured') {
    const entity = event.payload?.payment?.entity;
    if (entity?.order_id && entity.id) {
      await handleWebhookPaymentCaptured({
        orderId: entity.order_id,
        paymentId: entity.id,
        method: entity.method,
      });
    }
  }
  ok(res, { received: true });
});
