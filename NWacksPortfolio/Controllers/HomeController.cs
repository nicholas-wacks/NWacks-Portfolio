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
            var x = PortfolioApiController.GetDefaultCryptoCurrencyModel();
            return View();
        }
        
        public ActionResult D3CryptoTracker()
        {

            return View();
        }
    }
}