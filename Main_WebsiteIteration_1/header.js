const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
    <div class="header">
        <div class="header-content">
          <h1>EasyPantry</h1>
          <div class="nav">
              <a href="homepage.html" id="home">Home</a>
              <a href="BrowseIngredients.html" id="ingredients">Browse Ingredients</a>
              <a href="calculator.html" id="calculator">Substitution Calculator</a>
          </div>
        </div>
    </div>
`;

function addHeader(activePage) {
  headerTemplate.content.getElementById(activePage).classList.add("active");
  const headerDiv = document.getElementById("header");
  if (headerDiv) {
    headerDiv.appendChild(headerTemplate.content);
  } else {
    console.error("Header div not found");
  }
}
