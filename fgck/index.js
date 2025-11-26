document.addEventListener("DOMContentLoaded", () => {
  
  
    /* ===== Fade-in on Scroll ===== */
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  /* ===== Daily Bible Verse ===== */
  const verseDisplay = document.getElementById("verseDisplay");
  const verseReference = document.getElementById("verseReference");

  const dailyVerse = {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
  };

  verseDisplay.textContent = dailyVerse.text;
  verseReference.textContent = dailyVerse.reference;

  /* ===== Event Carousel ===== */
  const track = document.getElementById("carouselTrack");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  let currentIndex = 0;

  const cardWidth = 320; // width + margin of each card

  nextBtn.addEventListener("click", () => {
    const cards = track.children.length;
    if(currentIndex < cards - Math.floor(track.parentElement.offsetWidth / cardWidth)) {
      currentIndex++;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  prevBtn.addEventListener("click", () => {
    if(currentIndex > 0) {
      currentIndex--;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  /* ===== Latest Sermons ===== */
  const sermonList = document.getElementById("sermonList");
  const sermons = [
    { title: "Faith Over Fear", preacher: "Pastor John", img: "images/sermon1.jpg" },
    { title: "Walking in Grace", preacher: "Pastor Mary", img: "images/sermon2.jpg" },
    { title: "Living in Hope", preacher: "Pastor Peter", img: "images/sermon3.jpg" }
  ];

  sermons.forEach(sermon => {
    const card = document.createElement("div");
    card.classList.add("sermon-card");
    card.innerHTML = `
      <img src="${sermon.img}" alt="${sermon.title}">
      <h3>${sermon.title}</h3>
      <p>${sermon.preacher}</p>
    `;
    sermonList.appendChild(card);
  });
});
