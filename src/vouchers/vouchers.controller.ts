import { Context } from "hono";
import dotenv from 'dotenv';
import { createVoucherService, fetchVouchersService, getVoucherByCodeService } from "./vouchers.service";
import Stripe from 'stripe';
import { FRONTEND_URL } from "../proxxy/proxxy";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
//get vouchers
export const getAllVouchers = async (c: Context) => {
    try {
        const vouchers = await fetchVouchersService();
        if (vouchers) {
            return c.json(vouchers);
        }else{
            return c.text('No voucher data found', 404);
        }
    } catch (error) {
        return c.json({msg:"error"}, 500);
    }
}

//get a single voucher using voucher code
export const getVoucherByCode = async (c: Context) => {
    const voucher_code = c.req.param("voucher_code");
    try {
        const voucher = await getVoucherByCodeService(voucher_code);
        if(voucher === undefined){
            return c.json({msg:"Voucher not found"}, 404);
        }else{
            return c.json(voucher);
        }
    } catch (error) {
        return c.json({msg:"error"}, 500);
    }
};

//create a new voucher
export const createVoucher = async (c: Context) => {
    try {
        const voucher = await c.req.json();
        const res = await createVoucherService(voucher);
        if (res) {
            return c.json({msg:"Voucher created successfully"}, 201);
        }else{
            return c.text('Voucher not created', 404);
        }
    } catch (error) {
        return c.json({msg:"error"}, 500);
    }
}

export const checkoutPayment = async (c: Context) => {
    let amount: number;
    try {
        amount = await c.req.json();
    } catch (error) {
        return c.text("Invalid request body", 400);
    }
    try {
        if (!amount) {
            return c.text("Missing total amount", 400);
        }

        const conversionRate = 0.007;
        const totalAmountInUsd = amount * conversionRate;
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Account Upgrade',
                },
                unit_amount: Math.round(totalAmountInUsd * 100), // Convert to cents
            },
            quantity: 1,
        }];
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${FRONTEND_URL}`,
            cancel_url: `${FRONTEND_URL}`,
        };
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);      

        return c.json({ id: session.id }, 200);

    } catch (error: any) {
        return c.text(error?.message, 400);
    }
};

export const handleStripeWebhook = async (c: Context) => {
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.text();
    if (!sig) {
        console.error('Webhook Error: No stripe-signature header value was provided.');
        return c.text('Webhook Error: No stripe-signature header value was provided.', 400);
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return c.text(`Webhook Error: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            // Update isPremium status in the database
            const user_id = parseInt(session.client_reference_id as string);

        // Handle other event types as needed
        default:
            return c.text(`Unhandled event type ${event.type}`, 400);
    }
};
