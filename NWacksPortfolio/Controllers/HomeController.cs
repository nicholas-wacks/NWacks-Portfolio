using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NWacksPortfolio.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// D3AngularCryptoTracker is a demo using an external API returning JSON to be shown displayed using a D3.js 
        /// </summary>
        /// <returns></returns>
        public ActionResult CryptoCurrencyDemo()
        {
            var model = PortfolioApiController.GetDefaultCryptoCurrencyModel();
            return View(model);
        }
    }
}