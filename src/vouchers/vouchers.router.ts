import { Hono } from 'hono';
import { createVoucher, getAllVouchers, getVoucherByCode, checkoutBooking } from './vouchers.controller';

export const voucherRouter = new Hono();

voucherRouter.get('list-all', getAllVouchers);
voucherRouter.get('one-voucher/:voucher_code', getVoucherByCode);
voucherRouter.post('create-voucher', createVoucher);
voucherRouter.post('create-checkout-session/:user_id', checkoutBooking);
