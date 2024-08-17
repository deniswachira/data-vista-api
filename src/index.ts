import { serve } from '@hono/node-server'
import {  Hono, } from 'hono'
import { prometheus } from '@hono/prometheus'
// import { limiter } from './middleWare/rateLimiter';
import { readFile } from 'fs/promises';
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import {cors} from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash'
import  assert from 'assert' 
import dotenv from 'dotenv';
import { macroeconomicRouter } from './macroeconomic/macroeconomic.router';
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/user.router';
import { voucherRouter } from './vouchers/vouchers.router';
import { handleStripeWebhook } from './vouchers/vouchers.controller';
import csv from 'csv-parser';
import axios from 'axios';
import fs from 'fs';
dotenv.config();

// import csvtojson from 'csvtojson';
// import db from "../src/drizzle/db";
// import { exchange_rate, gdp, population, share_prices, gdp_per_capita,inflation_rate, safaricom_share_prices } from './drizzle/schema';
// import path from 'path';


const app = new Hono();
const {printMetrics, registerMetrics} = prometheus();
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('*', registerMetrics) //prometheus to monitor metrics
app.use(cors()) 
// app.use(limiter); //rate limiter





//default routes
app.get('/', async (c) => {
    try {
        let html = await readFile('./index.html', 'utf-8');
        return c.html(html);
    } catch (err:any) {
        return c.text(err.message, 500);
    }
});

// Fetch and store GDP data
// app.get('/api/fetch-gdp', async (c) => {
//   const response = await axios.get('https://api.worldbank.org/v2/country/KE/indicator/NY.GDP.MKTP.CD?date=2010:2023&format=json');
//   const gdpData = response.data[1];

//   for (const entry of gdpData) {
//     await db.insert(gdp).values({
//       year: entry.date,
//       value: entry.value,
//     });
//   }

//   return c.json({ message: 'GDP data fetched and stored successfully!' });
// });

// Fetch and store GDP per Capita data
// app.get('/api/fetch-gdp-per-capita', async (c) => {
//   const response = await axios.get('https://api.worldbank.org/v2/country/KE/indicator/NY.GDP.PCAP.CD?date=2010:2023&format=json');
//   const gdpPerCapitaData = response.data[1];

//   for (const entry of gdpPerCapitaData) {
//     await db.insert(gdp_per_capita).values({
//       year: entry.date,
//       value: entry.value,
//     });
//   }

//   return c.json({ message: 'GDP per Capita data fetched and stored successfully!' });
// }

// Fetch and store Population data
// app.get('/api/fetch-population', async (c) => {
//   const response = await axios.get('https://api.worldbank.org/v2/country/KE/indicator/SP.POP.TOTL?date=2010:2023&format=json');
//   const populationData = response.data[1];

//   for (const entry of populationData) {
//     await db.insert(population).values({
//       year: entry.date,
//       value: entry.value,
//     });
//   }

//   return c.json({ message: 'Population data fetched and stored successfully!' });
// });

// Fetch and store Exchange Rate data

// app.get('/api/fetch-exchange-rate', async (c) => {
//   const csvFilePath = path.join(__dirname, 'utils', 'exchange_rate.csv');

//   try {
//     // Convert CSV to JSON
//     const jsonArray = await csvtojson().fromFile(csvFilePath);

//     const results: { date: string; value: number }[] = jsonArray.map((row) => {
//       const dateField = row['Date']?.trim();
//       const valueField = row['Mean']?.trim();

//       if (dateField && valueField) {
//         const [day, month, year] = dateField.split('-');
//         const date = `${year}-${month}-${day}`;  // Convert to YYYY-MM-DD format
//         const value = parseFloat(valueField);

//         if (!isNaN(value)) {
//           return { date, value };
//         }
//       }
//       return null;
//     }).filter(Boolean) as { date: string; value: number }[];

//     // Insert the parsed data into the database
//     for (const entry of results) {
//       await db.insert(exchange_rate).values({
//         date: entry.date,  // Storing date as text
//         value: entry.value,  // Storing value as numeric
//       });
//     }

//     return c.json({ message: 'Exchange rate data from CSV stored successfully!' });
//   } catch (err) {
//     return c.json({ message: 'Error processing exchange rate data', error: err.message }, 500);
//   }
// });


// Fetch and store Safaricom Share Prices data


// app.get('/api/fetch-share-price', async (c) => {
//   const csvFilePath = path.join(__dirname, 'utils', 'HistoricalPrices.csv');

//   try {
//     // Convert CSV to JSON
//     const jsonArray = await csvtojson().fromFile(csvFilePath);

//     const results: { date: string; close: number }[] = jsonArray.map((row) => {
//       const dateField = row['Date']?.trim();
//       const closeField = row['Close']?.trim();

//       if (dateField && closeField) {
//         const [month, day, year] = dateField.split('/');
//         const date = `20${year}-${month}-${day}`;  // Convert to YYYY-MM-DD format
//         const close = parseFloat(closeField);

//         if (!isNaN(close)) {
//           return { date, close };
//         }
//       }
//       return null;
//     }).filter(Boolean) as { date: string; close: number }[];

//     // Insert the parsed data into the database
//     for (const entry of results) {
//       await db.insert(share_prices).values({
//         date: entry.date,  // Storing date as text
//         close: entry.close,  // Storing close price as numeric
//       });
//     }

//     return c.json({ message: 'Share price data from CSV stored successfully!' });
//   } catch (err) {
//     return c.json({ message: 'Error processing share price data', error: (err as any).message }, 500);
//   }
// });


// Fetch and store Inflation Rate data
// app.get('/api/fetch-inflation-rate', async (c) => {
//   const csvFilePath = path.join(__dirname, 'utils', 'InflationRate.csv');

//   try {
//     // Convert CSV to JSON
//     const jsonArray = await csvtojson().fromFile(csvFilePath);

//     const results: { month: string; value: number }[] = jsonArray.map((row) => {
//       const monthField = row['Month']?.trim();
//       const valueField = row['Inflation']?.trim();

//       if (monthField && valueField) {
//         const month = monthField;
//         const value = parseFloat(valueField);

//         if (!isNaN(value)) {
//           return { month, value };
//         }
//       }
//       return null;
//     }).filter(Boolean) as { month: string; value: number }[];

//     // Insert the parsed data into the database
//     for (const entry of results) {
//       await db.insert(inflation_rate).values({
//         month: entry.month,  // Storing month as text
//         value: entry.value,  // Storing value as numeric
//       });
//     }

//     return c.json({ message: 'Inflation rate data from CSV stored successfully!' });
//   } catch (err) {
//     return c.json({ message: 'Error processing inflation rate data', error: (err as any).message }, 500);
//   }
// }
// );

//fetch and store safaricom share prices
// app.get('/api/fetch-safaricom-share-prices', async (c) => {
//   const csvFilePath = path.join(__dirname, 'utils', 'HistoricalSafaricomSharePrices.csv');

//   try {
//     // Convert CSV to JSON
//     const jsonArray = await csvtojson().fromFile(csvFilePath);

//     const results: { date: string; close: number }[] = jsonArray.map((row) => {
//       const dateField = row['Date']?.trim();
//       const closeField = row['Close']?.trim();

//       if (dateField && closeField) {
//         const [month, day, year] = dateField.split('/');
//         const date = `20${year}-${month}-${day}`;  // Convert to YYYY-MM-DD format
//         const close = parseFloat(closeField);

//         if (!isNaN(close)) {
//           return { date, close };
//         }
//       }
//       return null;
//     }).filter(Boolean) as { date: string; close: number }[];

//     // Insert the parsed data into the database
//     for (const entry of results) {
//       await db.insert(safaricom_share_prices).values({
//         date: entry.date,  // Storing date as text
//         close: entry.close,  // Storing close price as numeric
//       });
//     }

//     return c.json({ message: 'Safaricom share prices data from CSV stored successfully!' });
//   } catch (err) {
//     return c.json({ message: 'Error processing Safaricom share prices data', error: (err as any).message }, 500);
//   }
// });

app.notFound((c) => {
  return c.text('Route Not Found 😊', 404)
})
app.get('/metrics', printMetrics)
app.post('/webhook', handleStripeWebhook)

//custom routes
app.route("/", authRouter)
app.route("/", userRouter)
app.route('/', macroeconomicRouter);
app.route('/', voucherRouter)



assert(process.env.PORT, "PORT is not set in the .env file")
console.log("Server is running on port  " + process.env.PORT + " 📢 📢")

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000)
})
