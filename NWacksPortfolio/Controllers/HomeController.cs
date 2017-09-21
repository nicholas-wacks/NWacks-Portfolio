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
        /// CryptoCurrencyDemo is a demo using an external API returning JSON to be shown displayed using various js frameworks
        /// </summary>
        /// <returns></returns>
        public ActionResult CryptoCurrencyDemo()
        {
            var model = PortfolioApiController.GetDefaultCryptoCurrencyModel();
            return View(model);
        }
    }
}