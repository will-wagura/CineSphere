const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a3ee93b4ae13d2e80a3de5b234805dda&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=a3ee93b4ae13d2e80a3de5b234805dda&query=";

    const topRated = document.getElementById("topRated");
    const popular = document.getElementById("popular");
    const upcoming = document.getElementById("upcoming");
    
    async function getMovies(url, element, page) {
        const resp = await fetch(`${url}&page=${page}`);
        const respData = await resp.json();
    
        showMovies(respData.results.slice(0,15), element);
    }
    
    function showMovies(movies, element) {
        // clear element
        element.innerHTML = "";

        const h2 = document.createElement("h2");
        h2.textContent = element.id.charAt(0).toUpperCase() + element.id.slice(1);
        element.appendChild(h2);
    
        movies.forEach((movie) => {
            const { poster_path, title, vote_average, overview, release_date } = movie;
    
            // format vote_average to one decimal place
            const formattedVoteAverage = vote_average.toFixed(1);
    
            // extract year from release_date
            const releaseYear = new Date(release_date).getFullYear();
    
            const movieEl = document.createElement("div");
            movieEl.classList.add("movie");
            
            movieEl.innerHTML = `
                <img
                    src="${IMGPATH + poster_path}"
                    alt="${title}"
                />
                <div class="movie-info">
                    <h3>${title}</h3>
                    <div class="rating">
                        <span class="${getClassByRate(
                            formattedVoteAverage
                        )}">${formattedVoteAverage} <i class="fas fa-star"></i></span>
                        <span class="year">${releaseYear}</span>
                    </div>
                    
                </div>
                <div class="overview">
                    <h3>Overview:</h3>
                    ${overview}
                </div>
            `;
    
            element.appendChild(movieEl);
        });
    }
    
    getMovies("https://api.themoviedb.org/3/movie/top_rated?api_key=a3ee93b4ae13d2e80a3de5b234805dda&page=1", topRated);
    getMovies("https://api.themoviedb.org/3/movie/popular?api_key=a3ee93b4ae13d2e80a3de5b234805dda&page=1", popular);
    getMovies("https://api.themoviedb.org/3/movie/upcoming?api_key=a3ee93b4ae13d2e80a3de5b234805dda&page=1", upcoming);

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

        search.value = "";
    }
});

const container = document.querySelector(".movies-container");
const carousel = document.querySelector(".topRated");
const cardWidth = carousel.querySelector(".movies").min-Width;
const arrowBtns = document.querySelectorAll(".btn");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.min-Width / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);