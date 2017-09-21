using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NWacksPortfolio;
using NWacksPortfolio.Controllers;
using NWacksPortfolio.Models;
using Newtonsoft.Json;

namespace NWacksPortfolio.Tests.Controllers
{
    [TestClass]
    public class PortfolioApiControllerTest
    {
        [TestMethod]
        public void TestGetDefaultCryptoCurrencyModel()
        {
            var testModel = PortfolioApiController.GetDefaultCryptoCurrencyModel();

            //Model should have no error
            Assert.IsFalse(testModel.HasError);

            //Data should have 100 records by default
            Assert.AreEqual((Newtonsoft.Json.JsonConvert.DeserializeObject<object[]>(testModel.CryptoData)).Length, 100);
        }

        [TestMethod]
        public void TestGetCryptoCurrencyData()
        {
            var controller = new PortfolioApiController();

            //Verify default data
            var data1 = controller.GetCryptoCurrencyData();
            Assert.AreEqual((Newtonsoft.Json.JsonConvert.DeserializeObject<object[]>(data1)).Length, 100);

            //Verify looking up top 5 records
            var data2 = controller.GetCryptoCurrencyData("", 5);
            Assert.AreEqual((Newtonsoft.Json.JsonConvert.DeserializeObject<object[]>(data2)).Length, 5);

            //Verify looking up top 1000 records
            var data3 = controller.GetCryptoCurrencyData("", 1000);
            Assert.AreEqual((Newtonsoft.Json.JsonConvert.DeserializeObject<object[]>(data3)).Length, 1000);

            //Verify looking up Bitcoin
            var data4 = controller.GetCryptoCurrencyData("bitcoin");
            Assert.IsTrue(data4.Contains("BTC"));

            //Verify looking up Neo
            var data5 = controller.GetCryptoCurrencyData("neo");
            Assert.IsTrue(data5.Contains("NEO"));

            //Verify an error is returned on invalid coin
            var data6 = controller.GetCryptoCurrencyData("DefinitelyFakeCoin.Coin");
            Assert.IsTrue(data6.Contains("\"Error\":"));
        }
    }
}
