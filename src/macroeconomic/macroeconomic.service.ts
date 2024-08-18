import db from '../drizzle/db';
import { TexchangeRateSelect, Tgdp_per_capitaSelect, TpopulationSelect, TgdpSelect,  TinflationRateSelect, TsafaricomSharePricesSelect } from '../drizzle/schema';

export const fetchGdp = async ():Promise<TgdpSelect[]|null> => {
    return await db.query.gdp.findMany();
}

export const fetchPopulation = async (): Promise<TpopulationSelect[]|null> => {
    return await db.query.population.findMany();
}

export const fetchGdpPerCapita = async (): Promise<Tgdp_per_capitaSelect[]|null> => {
    return await db.query.gdp_per_capita.findMany();
}
export const fetchExchangeRate = async (): Promise<TexchangeRateSelect[]|null> => {
    return await db.query.usd_exchange_rate.findMany();
}

export const fetchInflationRate = async (): Promise<TinflationRateSelect[]|null> => {
    return await db.query.inflation_rate.findMany();
}

export const fetchSafaricomSharePrices = async (): Promise<TsafaricomSharePricesSelect[]|null> => {
    return await db.query.safaricom_share_prices.findMany();
}