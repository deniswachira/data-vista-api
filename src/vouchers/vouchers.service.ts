import { eq } from 'drizzle-orm';
import db from '../drizzle/db';
import { TvoucherInsert, TvoucherSelect, voucherTable } from '../drizzle/schema';

export const fetchVouchersService = async (): Promise<TvoucherSelect[]|null> => {
    return await db.query.voucherTable.findMany();
}

//get a single voucher
export const getVoucherByCodeService = async (voucher_code: string): Promise<TvoucherSelect| undefined> => {
    return await db.query.voucherTable.findFirst({
        where: eq(voucherTable.voucher_code, voucher_code)
    })
}

//create a new voucher
export const createVoucherService = async (voucher: TvoucherInsert) => {
    return await db.insert(voucherTable).values(voucher);
}
    

