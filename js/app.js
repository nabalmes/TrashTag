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


// Project Modals
const modalOpen = function() {
	body.classList.add('modal-open')
}

const modalClose = function() {
	body.classList.remove('modal-open')
}

document.addEventListener('click', function (e) {
	e = e || window.event;
	let target = e.target;

	if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal' || target.closest('.primary-btn')) {
		if (target.hasAttribute('data-target') || target.parent) {
	  		var modalId = target.getAttribute('data-target');
	  		document.getElementById(modalId).classList.add('modal-active');
			e.preventDefault();
	  		modalOpen();
		}
	}

	if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.closest('.close-modal') || target.classList.contains('modal')) {
		var modal = document.querySelector('.modal.modal-active');
		modal.classList.remove('modal-active');
		e.preventDefault();
		modalClose();
	}
}, false);

document.body.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		console.log(e);
		document.querySelector('.close-modal').click();  
	}
})


// About Image Toggle
const imageToggleBtn = document.querySelector('.image-toggle'),
	dpWrapper = document.querySelector('.dp-wrapper'),
	meMaskedOn = 'assets/media/me-masked.webp',
	meMaskedOff = 'assets/media/me-beach.jpg',
	dpTitle = document.querySelector('[data-about="dp"] .image');

// imageToggleBtn.addEventListener('click', function() {
// 	// transform: rotate(180deg);
// 	imageToggleBtn.classList.toggle('unmasked');
// 	dpWrapper.classList.toggle('unmasked');
	
// 	if (dpWrapper.matches('.unmasked')) {
// 		dpWrapper.querySelector('source[type="image/webp"]').srcset = meMaskedOff;
// 		dpWrapper.querySelector('source[type="image/jpeg"]').srcset = meMaskedOff.replace('.webp', '.jpg');
// 		dpWrapper.querySelector('img').src = meMaskedOff.replace('.webp', '.jpg');
// 		dpTitle.setAttribute('title', 'it\'s me, happy');
// 	} else {
// 		dpWrapper.querySelector('source[type="image/webp"]').srcset = meMaskedOn;
// 		dpWrapper.querySelector('source[type="image/jpeg"]').srcset = meMaskedOn.replace('.webp', '.jpg');
// 		dpWrapper.querySelector('img').src = meMaskedOn.replace('.webp', '.jpg');
// 		dpTitle.setAttribute('title', 'it\'s me');
// 	}
// })


// Projects Displaying
const projectTemplate = document.querySelector('[data-waste]');
const projectContainer = document.querySelector('[data-wastes]');
const searchInput = document.getElementById('search-bar');

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

//   const link = card.querySelector('[data-waste-link]');
  const image = card.querySelector('[data-waste-image]');
  const title = card.querySelector('[data-waste-title]');
  const desc = card.querySelector('[data-waste-description]');
  const year = card.querySelector('[data-waste-year]');

//   link.setAttribute('href', project.link || '#');
  image.src = PROJECT_IMAGE_PATH + project.thumb;
  title.textContent = project.name;
  desc.textContent = project.description;
  year.textContent = project.year || '';

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

// Search on typing or pressing Enter
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submission
    handleSearch();
  }
});

function handleSearch() {
  const term = searchInput.value.toLowerCase();
  const filtered = wastes.filter(w => w.name.toLowerCase().includes(term));
  renderWastes(filtered);
}
