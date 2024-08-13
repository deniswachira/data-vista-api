import { Context } from "hono";
import { fetchExchangeRate, fetchGdp, fetchGdpPerCapita, fetchPopulation } from "./macroeconomic.service";

//get gdp data
export const gdp = async (c: Context) => {
    try {
        const gdpData = await fetchGdp();
        if (gdpData) {
            return c.json(gdpData);
        }else{
            return c.text('No GDP data found', 404);
        }
    } catch (error) {
        return c.json(error.message, 500);
    }
}
//get population data
export const population = async (c: Context) => {
    try {
        const populationData = await fetchPopulation();
        if (populationData) {
            return c.json(populationData);
        }else{
            return c.text('No population data found', 404);
        }
    } catch (error) {
        return c.json(error.message, 500);
    }
}

//get gdp per capita data
export const gdpPerCapita = async (c: Context) => {
    try {
        const gdpPerCapitaData = await fetchGdpPerCapita();
        if (gdpPerCapitaData) {
            return c.json(gdpPerCapitaData);
        }else{
            return c.text('No GDP per Capita data found', 404);
        }
    } catch (error) {
        return c.json(error.message, 500);
    }
}

//exchange rate
export const exchangeRate = async (c: Context) => {
    try {
        const exchangeRateData = await fetchExchangeRate();
        if (exchangeRateData) {
            return c.json(exchangeRateData);
        }else{
            return c.text('No Exchange Rate data found', 404);
        }
    } catch (error) {
        return c.json(error.message, 500);
    }
}
