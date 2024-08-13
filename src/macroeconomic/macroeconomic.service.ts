import db from '../drizzle/db';
import { gdp, population, gdp_per_capita, exchange_rate, TexchangeRateSelect, Tgdp_per_capitaSelect, TpopulationSelect, TgdpSelect } from '../drizzle/schema';

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
    return await db.query.exchange_rate.findMany();
}