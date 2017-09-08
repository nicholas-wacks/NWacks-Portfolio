using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NWacksPortfolio.Models
{
    public class CryptoCurrencyModel
    {
        /// <summary>
        /// Flag used to determing if an error was found
        /// </summary>
        public bool hasError { get; set; }

        /// <summary>
        /// JSON object or list containing one or more data summaries of currencies, or an error message if hasError is true
        /// </summary>
        public string cryptoData { get; set; }
    }
}