using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using NWacksPortfolio.Models;

namespace NWacksPortfolio.Controllers
{
    public class PortfolioApiController : ApiController
    {
        /// <summary>
        /// Returns a CryptoCurrencyModel with data with the default limit of results.
        /// If an error was found
        /// </summary>
        /// <returns></returns>
        public static CryptoCurrencyModel GetDefaultCryptoCurrencyModel()
        {
            var model = new CryptoCurrencyModel();
            var controller = new PortfolioApiController();
            model.CryptoData = controller.GetCryptoCurrencyData();

            if (model.CryptoData.Substring(2, 5) == "Error")
                model.HasError = true;
            else
                model.HasError = false;

            return model;
        }

        /// <summary>
        /// Makes a call to Coin Market Cap's ticker Api to get current information on currencies
        /// </summary>
        /// <param name="crypto">Optional parameter specifying a particular currency to check. Will return all if no currency is given.</param>
        /// <param name="limit">Optional parameter specifying the max number of currencies to return. Will return the top 100 if no limit is given. 
        ///     A value of zero will return all results</param>
        /// <returns>Will return a JSON list of crypto currency data, or an error message in JSON</returns>
        //[HttpGet]
        public string GetCryptoCurrencyData(string crypto = "", uint limit = 100) {
            string url = "https://api.coinmarketcap.com/v1/ticker";

            //If a specific crypto currency is specified, the limit doesn't matter
            if (!string.IsNullOrEmpty(crypto))
                url += "/" + crypto;
            else if (limit != 0)
                url += "?limit=" + limit.ToString();

            string response;
            try
            {
                response = new WebClient().DownloadString(url);
            }
            catch (Exception e)
            {
                return "{\"Error\":\"" + e.Message + "\"}";
            }

            //Verify that the web client returned data
            if (string.IsNullOrEmpty(response))
                return "{\"Error\":\"Coin Market Cap API did not return data\"}";

            return GetValidatedJsonOrErrorJson(response);
        }

        /// <summary>
        /// If the passed in string is valid JSON, return it; otherwise, return an error in JSON format
        /// </summary>
        /// <param name="StringToVerify">String to check JSONness of</param>
        /// <returns></returns>
        private static string GetValidatedJsonOrErrorJson(string StringToVerify)
        {
            //Verify valid JSON object was given
            try
            {
                JToken.Parse(StringToVerify);
                return StringToVerify;
            }
            catch (Newtonsoft.Json.JsonReaderException)
            {
                //Exception parsing JSON
                return "{\"Error\":\"Invalid JSON\"}";
            }
            catch (Exception e)
            {
                //Miscellaneous error (in theory, shouldn't hit this)
                return "{\"Error\":\"" + e.Message + "\"}";
            }
        }
    }
}
