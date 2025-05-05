document.addEventListener("DOMContentLoaded", () => {
  loadCarouselImages();
  loadDogBreeds();
});

function loadCarouselImages() {
  fetch("https://dog.ceo/api/breeds/image/random/10")
    .then((res) => res.json())
    .then((data) => {
      const carousel = document.getElementById("dogCarousel");
      data.message.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        carousel.appendChild(img);
      });

      simpleslider.getSlider({
        container: document.getElementById('dogCarousel'),
        prop: 'left',
        init: -612,
        show: 0,
        end: 612,
        unit: 'px',
        delay: 3,
        transitionDuration: 0.5
      });
    });
}

function loadDogBreeds() {
  fetch("https://dogapi.dog/api/v2/breeds")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("breed-buttons");
      data.data.forEach((breed) => {
        const btn = document.createElement("button");
        btn.textContent = breed.attributes.name;
        btn.classList.add("dog-breed-btn", "button-56");
        btn.setAttribute("data-id", breed.id);
        btn.setAttribute("data-name", breed.attributes.name);
        btn.addEventListener("click", () => showBreedDetails(breed.id));
        container.appendChild(btn);
      });
    });
}

function showBreedDetails(id) {
  fetch(`https://dogapi.dog/api/v2/breeds/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const breed = data.data;
      document.getElementById("breed-info").classList.remove("hidden");
      document.getElementById("breed-name").textContent = breed.attributes.name;
      document.getElementById("breed-description").textContent = breed.attributes.description || "No description available.";
      document.getElementById("breed-life-min").textContent = breed.attributes.life.min || "-";
      document.getElementById("breed-life-max").textContent = breed.attributes.life.max || "-";
    });
}

function startAnnyang() {
  if (annyang) {
    const commands = {
      "hello": () => alert("Hello World"),
      "change the color to *color": (color) => {
        document.body.style.backgroundColor = color;
      },
      "navigate to *page": (page) => {
        const dest = page.toLowerCase();
        if (dest.includes("home")) window.location.href = "index.html";
        else if (dest.includes("stock")) window.location.href = "stocks.html";
        else if (dest.includes("dog")) window.location.href = "dogs.html";
      },
      "load dog breed *name": (name) => {
        const buttons = document.querySelectorAll(".dog-breed-btn");
        for (btn of buttons) {
          if (btn.getAttribute("data-name").toLowerCase() === name.toLowerCase()) {
            btn.click();
            break;
          }
        }
      },
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

function stopAnnyang() {
  if (annyang) annyang.abort();
}
