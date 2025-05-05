document.addEventListener("DOMContentLoaded", () => {
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        const quote = data[0].q;
        const author = data[0].a;
        document.getElementById("quote").innerText = `"${quote}" — ${author}`;
      })
      .catch(() => {
        document.getElementById("quote").innerText = "Failed to load quote.";
      });
  });
  
  function startAnnyang() {
    if (annyang) {
      const commands = {
        'hello': () => alert("Hello World"),
        'change the color to *color': (color) => {
          document.body.style.background = color;
        },
        'navigate to *page': (page) => {
          const p = page.toLowerCase();
          if (p.includes("home")) window.location.href = "index.html";
          else if (p.includes("stock")) window.location.href = "stocks.html";
          else if (p.includes("dog")) window.location.href = "dogs.html";
        }
      };
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  function stopAnnyang() {
    if (annyang) annyang.abort();
  }
  