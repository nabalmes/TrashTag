// Topbar
const topBar = {
	classname: "topbar",
};

let nanobar = new Nanobar(topBar);
nanobar.go(33);
nanobar.go(66);
nanobar.go(100);


// Navbar + page activate
// const navbar = document.querySelector(".navbar"),
// 	navbarItems = navbar.querySelectorAll(".navbar__link"),
// 	pages = document.querySelectorAll(".page"),
// 	home = document.querySelector(".section--home"),
// 	homeLead = home.querySelector(".hero > .nab-lead");

// function activatePage(e) {
// 	e.preventDefault();

//   	navbarItems.forEach(function (item, index) {
// 		item.classList.remove("active");
// 	});

//   	[].forEach.call(pages, function (pane, index) {
// 		pane.classList.remove("active");
// 	});

// 	e.target.classList.add("active");

// 	let clickedPage = e.target.getAttribute("href");

// 	document.querySelector(clickedPage).classList.add("active");
// 	nanobar.go(100);
// }

// navbarItems.forEach(function (item, index) {
// 	item.addEventListener("click", activatePage, scrollToTop);
// });


// AOS
AOS.init({
	offset: 200,
	duration: 600,
	easing: "ease-in-sine",
	delay: 200,
	once: true,
	disable: "mobile",
});


// Work toggle
// const sectionWork = document.querySelector(".section--work"),
// 	workToggle = document.querySelector(".work-toggle"),
// 	workToggleText = workToggle.querySelector("span"),
//   	workHeaderLead = sectionWork.querySelector(".section-header > p.lead");

// workToggle.addEventListener("click", () => {
// 	console.log("toggled!");
// 	sectionWork.classList.toggle("work--experience");

// 	if (workToggleText.textContent === "Experience") {
// 		workToggleText.textContent = "Projects";
// 		workHeaderLead.textContent = "Summary of work experience about the various roles I have worked on for the past years.";
//   	} else {
// 		workToggleText.textContent = "Experience";
// 		workHeaderLead.textContent = "Collection of projects, from websites to webapps and everything tech. Includes experiments and self-discoveries.";
// 	}
// });


// Scroll to top
const scrollButton = document.querySelector(".scroll-button"),
	rootElement = document.documentElement;

function handleScroll() {
	let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;

  	if (rootElement.scrollTop / scrollTotal > 0.4) {
		scrollButton.classList.add("show");
  	} else {
		scrollButton.classList.remove("show");
  	}
}


function scrollToTop() {
	// Scroll to top logic
  	rootElement.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

scrollButton.addEventListener("click", scrollToTop);
document.addEventListener("scroll", handleScroll);



// Projects Displaying
const projectTemplate = document.querySelector('[data-waste]');
const projectContainer = document.querySelector('[data-wastes]');
const searchForm = document.querySelector('.search-container'); 
const searchInput = document.getElementById('search-bar');
const searchIcon = document.querySelector('.search-icon');     

const PROJECT_URL = 'data/work/waste.json';
const PROJECT_IMAGE_PATH = 'assets/media/waste/';

let wastes = [];

// Fetch and render data
fetch(PROJECT_URL)
  .then(res => res.json())
  .then(data => {
    wastes = data.map(project => ({
      ...project,
      element: createWasteCard(project)
    }));
    renderWastes(wastes);
  });

  function createWasteCard(project) {
	const card = projectTemplate.content.cloneNode(true).children[0];

	const image = card.querySelector('[data-waste-image]');
	const title = card.querySelector('[data-waste-title]');
	const desc = card.querySelector('[data-waste-description]');
  
	const category = card.querySelector('[data-waste-category]');
	const binColor = card.querySelector('[data-waste-bin-color]');
	const degradeTime = card.querySelector('[data-waste-degrade]');
	const stats = card.querySelector('[data-waste-stats]');

	image.src = PROJECT_IMAGE_PATH + project.thumb;
	title.textContent = project.name;
	desc.textContent = project.description;
  
	category.textContent = project.category.join(', ');
	binColor.textContent = project.binColor.join(', ');
	degradeTime.textContent = project.degradeTime;
	stats.textContent = project.statistics;
  
	return card;
  }

function renderWastes(wasteList) {
  projectContainer.innerHTML = '';
  if (wasteList.length === 0) {
    projectContainer.innerHTML = '<p>No matching waste found.</p>';
    return;
  }

  wasteList.forEach(w => projectContainer.appendChild(w.element));
}

function handleSearch() {
  const term = searchInput.value.toLowerCase();
  const filtered = wastes.filter(w => w.name.toLowerCase().includes(term));
  renderWastes(filtered);

  if (term && filtered.length > 0) {
	const firstMatchName = filtered[0].name;
    onSuccessfulSearch(firstMatchName)
  }
}


  /* ---------- trigger ONLY on Enter or click ---------- */
  // 1. Enter key submits the form
  searchForm.addEventListener('submit', e => {
	e.preventDefault();     // stop actual form post/refresh
	handleSearch();
  });


  // 2. Click on the search icon
searchIcon.addEventListener('click', e => {
	e.preventDefault();     // stop the "#" navigation
	handleSearch();
  });

  searchInput.addEventListener('input', () => {
	if (searchInput.value.trim() === '') {
	  // If input is cleared, show all items
	  renderWastes(wastes);
	}
  });



//Rewarding system
let searchCount = 0;
let searchTerms = JSON.parse(localStorage.getItem("searchTerms")) || [];
const stepsPerReward = 3;

const circles = document.querySelectorAll('.progress .circle');
const bars = document.querySelectorAll('.progress .bar');

function updateProgress() {
	// Index of the current cycle (0-based)
	const cycleIndex = Math.floor((searchCount - 1) / 3);
	const stepInCycle = (searchCount - 1) % 3;
  
	// Reset all classes
	circles.forEach(c => c.classList.remove('done', 'active'));
	bars.forEach(b => b.classList.remove('done', 'half'));
  
	// Mark all previous circles and their 2 bars as done
	for (let i = 0; i < cycleIndex; i++) {
	  circles[i].classList.add('done');
	  if (bars[i * 2]) bars[i * 2].classList.add('done');
	  if (bars[i * 2 + 1]) bars[i * 2 + 1].classList.add('done');
	}
  
	// Now handle current cycle
	if (cycleIndex < circles.length) {
	  if (stepInCycle === 0) {
		// Search 1, 4, 7... → circle active
		circles[cycleIndex].classList.add('active');
	  } else if (stepInCycle === 1) {
		// Search 2, 5, 8... → first bar done
		circles[cycleIndex].classList.add('done');
		if (bars[cycleIndex * 2]) bars[cycleIndex * 2].classList.add('done');
	  } else if (stepInCycle === 2) {
		// Search 3, 6, 9... → second bar done
		circles[cycleIndex].classList.add('done');
		if (bars[cycleIndex * 2]) bars[cycleIndex * 2].classList.add('done');
		if (bars[cycleIndex * 2 + 1]) bars[cycleIndex * 2 + 1].classList.add('done');
	  }
	}
  }
  
searchCount = searchTerms.length;

function onSuccessfulSearch(wasteName) {
	
	if (searchCount > 5){
		alert("Your Search Reward Point Limit")
	}else {
	searchCount++;
    searchTerms.unshift(wasteName);

    // Remove duplicates and keep only latest 10
    searchTerms = [...new Set(searchTerms)].slice(0, 10);

    localStorage.setItem("searchTerms", JSON.stringify(searchTerms));

    updateProgress();     // If you're tracking search progress
    updateTopSearches();  // Update the UI list
	}
  }

  function updateTopSearches() {
	const list = document.getElementById("topSearches");
	list.innerHTML = "";
  
	searchTerms.forEach((term, index) => {
	  const li = document.createElement("li");
	  li.textContent = `${index + 1}. ${term}`;
	  list.appendChild(li);
	});
  }

  document.addEventListener('DOMContentLoaded', function () {
	updateTopSearches()
	updateProgress()
  })