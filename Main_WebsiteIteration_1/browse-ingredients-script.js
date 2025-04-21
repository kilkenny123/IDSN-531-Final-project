$(document).ready(function () {
  // Get JSON File
  $.getJSON("sampledata.json", function (data) {
    var ingredients = data;
    var container = $("#ingredients-container");
    var currentCategory = "All";
    var currentSearchTerm = "";
    var selectedTags = [];

    // Function to display ingredients
    function displayIngredients(ingredients) {
      container.empty();
      $.each(ingredients, function (index, ingredient) {
        var tile = $('<div class="tile"></div>');
        var img = $('<img class="ing-img">')
          .attr("src", ingredient.image)
          .attr("alt", ingredient.name);
        var name = $('<h2 class="tile-name"></h2>').text(ingredient.name);
        var description = $('<p class="tile-text"></p>').text(
          ingredient.description
        );
        var tags = $('<div class="tags"></div>');
        $.each(ingredient.tags, function (i, tag) {
          var tagElement = $('<div class="tag"></div>').text(tag);
          tags.append(tagElement);
        });
        var button = $(
          '<button class="view-btn">View Ingredient</button>'
        ).attr(
          "onclick",
          `window.location.href='calculator.html?ingredientId=${ingredient.id}'`
        );
        tile.append(img, name, description, tags, button);
        container.append(tile);
      });
    }

    // Function to filter ingredients based on search, category, and tags
    function filterIngredients() {
      var filteredIngredients = ingredients.filter(function (ingredient) {
        var matchesCategory =
          currentCategory === "All" || ingredient.category === currentCategory;
        var matchesSearch = ingredient.name
          .toLowerCase()
          .includes(currentSearchTerm);
        var matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => ingredient.tags.includes(tag));
        return matchesCategory && matchesSearch && matchesTags;
      });
      displayIngredients(filteredIngredients);
    }

    // Display all ingredients initially
    displayIngredients(ingredients);

    // Search functionality
    $("#search-input").on("input", function () {
      currentSearchTerm = $(this).val().toLowerCase();
      filterIngredients();
    });

    // Filter by category functionality
    $(".category-filter").on("click", function () {
      currentCategory = $(this).text();
      filterIngredients();
    });

    // Filter by tags functionality
    $(".ingredient-tag-filter").on("click", function () {
      if (selectedTags.includes($(this).text())) {
        selectedTags = selectedTags.filter((tag) => tag !== $(this).text());
      } else {
        selectedTags.push($(this).text());
      }
      filterIngredients();
    });
  }).fail(function () {
    console.error("Error fetching ingredients.");
  });
});
