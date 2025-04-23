const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
    <div class="header">
        <div class="header-content">
          <img src="logo-white.png" alt="Logo" id="logo"></img>
          <div class="nav-icon">
            <img src="menu-icon.png" alt="Menu Icon" id="menu-icon"></img>
          </div>
          <div class="nav">
            <a href="homepage.html" id="home">Home</a>
            <a href="BrowseIngredients.html" id="ingredients">Browse Ingredients</a>
            <a href="calculator.html" id="calculator">Substitution Calculator</a>
            <a href="RequestPage.html" id="request">Request Form</a>
            <a href="about.html" id="about">About Us</a>
          </div>
        </div>
    </div>
`;

function addHeader(activePage) {
  const activeNavlink = headerTemplate.content.getElementById(activePage);
  if (activeNavlink) {
    activeNavlink.classList.add("active");
  }
  const headerDiv = document.getElementById("header");
  if (headerDiv) {
    headerDiv.appendChild(headerTemplate.content);
  } else {
    console.error("Header div not found");
  }
}

$(document).ready(function () {
  const menuIcon = document.getElementById("menu-icon");
  const nav = document.querySelector(".nav");

  menuIcon.addEventListener("click", function () {
    nav.classList.toggle("active");
  });
});
