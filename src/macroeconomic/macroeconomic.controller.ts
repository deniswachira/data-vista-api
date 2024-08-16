import { Context } from "hono";
import { fetchExchangeRate, fetchGdp, fetchGdpPerCapita, fetchInflationRate, fetchPopulation, fetchSafaricomSharePrices } from "./macroeconomic.service";

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
        return c.json({msg:"error"}, 500);
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
        return c.json({ msg: "error" },  500);
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
        return c.json({ msg: "error" },  500);
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
        return c.json({ msg: "error" }, 500);
    }
}

//inflation rate
export const inflationRate = async (c: Context) => {
    try {
        const inflationRateData = await fetchInflationRate();
        if (inflationRateData) {
            return c.json(inflationRateData);
        }else{
            return c.text('No Inflation Rate data found', 404);
        }
    } catch (error) {
        return c.json({ msg: "error" }, 500);
    }
}

//safaricom share prices
export const safaricomSharePrices = async (c: Context) => {
    try {
        const safaricomSharePricesData = await fetchSafaricomSharePrices();
        if (safaricomSharePricesData) {
            return c.json(safaricomSharePricesData);
        }
        else {
            return c.text('No Safaricom Share Prices data found', 404);
        }
    } catch (error) {
        return c.json({ msg: "error" }, 500);
    }
}