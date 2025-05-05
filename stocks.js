const apiKey = "0VZkZ9jP2CukSxdzc_qaVVAXRpWaHY_k";

const ctx = document.getElementById("stockChart").getContext("2d");
let chart;

document.getElementById("lookupBtn").addEventListener("click", () => {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const days = parseInt(document.getElementById("daysSelect").value);
  if (ticker) fetchStockData(ticker, days);
});

function fetchStockData(ticker, days) {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);

  const from = fromDate.toISOString().split("T")[0];
  const to = toDate.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.results) return alert("No data found.");
      const labels = data.results.map((r) => new Date(r.t).toLocaleDateString());
      const prices = data.results.map((r) => r.c);
      drawChart(ticker, labels, prices);
    });
}

function drawChart(ticker, labels, prices) {
  const chartSection = document.querySelector('.chart-section');
  chartSection.classList.remove('hidden');
  chartSection.style.display = "block"; 

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `($) ${ticker} Stock Price`,
        data: prices,
        borderColor: "#2980b9",
        fill: false,
        tension: 0.1,
      }],
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Price (USD)" } },
      },
    },
  });
}

fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
  .then((res) => res.json())
  .then((data) => {
    const top5 = data.slice(0, 5);
    const tbody = document.querySelector("#redditStocks tbody");
    tbody.innerHTML = "";

    top5.forEach((stock) => {
      const tr = document.createElement("tr");
      const imgSrc = stock.sentiment === "Bullish"
        ? "https://i.pinimg.com/736x/e9/77/27/e97727bc96ca19aaf35ef552085d59e0.jpg"
        : "https://i.pinimg.com/736x/c9/3d/6d/c93d6dcb034aa9717b0f39b70cee8103.jpg";


      tr.innerHTML = `
        <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td><img src="${imgSrc}" class="icon-img" alt="${stock.sentiment}" /></td>
      `;
      tbody.appendChild(tr);
    });
  });

function startAnnyang() {
  if (annyang) {
    const commands = {
      "hello": () => alert("Hello World"),
      "change the color to *color": (color) => {
        document.body.style.background = color;
      },
      "navigate to *page": (page) => {
        const dest = page.toLowerCase();
        if (dest.includes("home")) window.location.href = "index.html";
        else if (dest.includes("stock")) window.location.href = "stocks.html";
        else if (dest.includes("dog")) window.location.href = "dogs.html";
      },
      "lookup *ticker": (ticker) => {
        document.getElementById("tickerInput").value = ticker.toUpperCase();
        fetchStockData(ticker.toUpperCase(), 30);
      },
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

function stopAnnyang() {
  if (annyang) annyang.abort();
}
