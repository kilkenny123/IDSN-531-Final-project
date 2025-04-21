const searchTemplate = document.createElement("template");

searchTemplate.innerHTML = `
        <div id="ingredient-search">
            <input type="text" id="search-input" placeholder="Search for ingredients..." />
        </div>
`;

categoryFiltersTemplate = document.createElement("template");

categoryFiltersTemplate.innerHTML = `
  <div id="ingredient-category-filters" id="category-filters-container"></div>
`;

ingredientTagFiltersTemplate = document.createElement("template");

ingredientTagFiltersTemplate.innerHTML = `
  <div id="ingredient-tag-filters" id="tag-filters-container"></div>
`;

substitutionTagFiltersTemplate = document.createElement("template");

substitutionTagFiltersTemplate.innerHTML = `
  <div id="substitution-tag-filters" id="substitution-tag-filters-container"></div>
`;

function addFilters() {
  const searchDiv = document.getElementById("ingredient-search-container");
  if (searchDiv) {
    searchDiv.appendChild(searchTemplate.content);
  }

  const categoryFiltersDiv = document.getElementById(
    "ingredient-category-filters-container"
  );
  if (categoryFiltersDiv) {
    categoryFiltersDiv.appendChild(categoryFiltersTemplate.content);
  }

  const ingredientTagFiltersDiv = document.getElementById(
    "ingredient-tag-filters-container"
  );
  if (ingredientTagFiltersDiv) {
    ingredientTagFiltersDiv.appendChild(ingredientTagFiltersTemplate.content);
  }

  const substitutionTagFiltersDiv = document.getElementById(
    "substitution-tag-filters-container"
  );
  if (substitutionTagFiltersDiv) {
    substitutionTagFiltersDiv.appendChild(
      substitutionTagFiltersTemplate.content
    );
  }
}

$(document).ready(function () {
  // Add filtercomponents to the page
  addFilters();

  var params = new URLSearchParams(window.location.search);
  var ingredientId = params.get("ingredientId");

  // Get JSON File
  $.getJSON("sampledata.json", function (data) {
    var ingredients = data;
    var categoryFiltersContainer = $("#ingredient-category-filters-container");
    var ingredientTagFiltersContainer = $("#ingredient-tag-filters-container");
    var substitutionTagFiltersContainer = $(
      "#substitution-tag-filters-container"
    );

    function getIngredientById(id) {
      return ingredients.find(function (ingredient) {
        return ingredient.id == id;
      });
    }

    /*
        SEARCH HANDLING
    */

    // Function to update search input
    $("#search-input").on("input", function () {
      searchInput = $(this).val().toLowerCase();
    });

    /*
      CATEGORY FILTER HANDLING
    */

    // Function to get unique categories from ingredients
    function getUniqueCategories() {
      var categories = [];
      $.each(ingredients, function (index, ingredient) {
        if (!categories.includes(ingredient.category)) {
          categories.push(ingredient.category);
        }
      });
      return categories;
    }

    // Function to display category filters
    function displayCategoryFilters(categories) {
      categoryFiltersContainer.empty();

      var allFilter = $('<div class="category-filter active">All</div>');
      categoryFiltersContainer.append(allFilter);

      $.each(categories, function (index, category) {
        var categoryFilter = $('<div class="category-filter"></div>').text(
          category
        );
        categoryFiltersContainer.append(categoryFilter);
      });
    }

    // Display category filters intially
    var categories = getUniqueCategories(ingredients);
    displayCategoryFilters(categories);

    // Handle category filter click
    $(".category-filter").on("click", function () {
      $(".category-filter").removeClass("active");
      $(this).addClass("active");
      selectedCategory = $(this).text().toLowerCase();
    });

    /*
      INGREDIENT TAG FILTER HANDLING
    */

    // Function to get unique tags from ingredients
    function getUniqueIngredientTags() {
      var uniqueTags = [];
      $.each(ingredients, function (index, ingredient) {
        $.each(ingredient.tags, function (i, tag) {
          if (!uniqueTags.includes(tag)) {
            uniqueTags.push(tag);
          }
        });
      });
      return uniqueTags;
    }

    // Function to display ingredient tag filters
    function displayIngredientTagFilters(tags) {
      ingredientTagFiltersContainer.empty();

      $.each(tags, function (index, tag) {
        var tagFilter = $('<div class="ingredient-tag-filter"></div>').text(
          tag
        );
        ingredientTagFiltersContainer.append(tagFilter);
      });
    }

    // Display tag filters initially
    var ingredientTags = getUniqueIngredientTags(ingredients);
    displayIngredientTagFilters(ingredientTags);

    // Handle tag filter click
    $(".ingredient-tag-filter").on("click", function () {
      $(this).toggleClass("active");
      var selectedTags = [];
      $(".ingredient-tag-filter.active").each(function () {
        selectedTags.push($(this).text());
      });
      ingredientTagFilters = selectedTags;
    });

    /*
      SUBSTITUTION TAG FILTER HANDLING
    */

    // Function to get unique tags from substitutions
    function getUniqueSubstitutionTags() {
      if (!ingredientId) {
        return [];
      }
      var ingredient = getIngredientById(ingredientId);
      if (!ingredient) {
        return [];
      }
      var uniqueTags = [];
      $.each(ingredient.substitutes, function (index, substitute) {
        var substitutionIngredient = getIngredientById(substitute.id);
        if (substitutionIngredient) {
          $.each(substitutionIngredient.tags, function (i, tag) {
            if (!uniqueTags.includes(tag)) {
              uniqueTags.push(tag);
            }
          });
        }
      });
      return uniqueTags;
    }

    // Function to display substitution tag filters
    function displaySubstitutionTagFilters(tags) {
      substitutionTagFiltersContainer.empty();

      $.each(tags, function (index, tag) {
        var tagFilter = $('<div class="substitution-tag-filter"></div>').text(
          tag
        );
        substitutionTagFiltersContainer.append(tagFilter);
      });
    }

    // Display tag filters initially
    var substitutionTags = getUniqueSubstitutionTags(ingredients);
    displaySubstitutionTagFilters(substitutionTags);

    // Handle tag filter click
    $(".substitution-tag-filter").on("click", function () {
      $(this).toggleClass("active");
      var selectedTags = [];
      $(".substitution-tag-filter.active").each(function () {
        selectedTags.push($(this).text());
      });
      substitutionTagFilters = selectedTags;
    });
  });
});
