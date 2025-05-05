import { tagIcons } from "./icons.js";

$(document).ready(function () {
  // Get JSON File
  $.getJSON("sampledata.json", function (data) {
    var params = new URLSearchParams(window.location.search);

    var ingredients = data;
    var container = $("#ingredients-container");
    var currentCategory = params.get("category") || "All";
    var currentSearchTerm = params.get("search") || "";
    var selectedTags = params.get("tags").split(",") || [];

    // Function to display ingredients
    function displayIngredients(ingredients) {
      container.empty();
      if (ingredients.length === 0) {
        container.append(
          '<p class="no-results">No ingredients found. Please try a different search or filter.</p>'
        );
        return;
      }
      $.each(ingredients, function (index, ingredient) {
        var tile = $('<div class="tile"></div>');
        var img = $('<img class="ing-img">')
          .attr("src", ingredient.image)
          .attr("alt", ingredient.name);
        var name = $('<h2 class="tile-name"></h2>').text(ingredient.name);
        var description = $('<p class="tile-text"></p>').text(
          ingredient.description
        );

        // Add substitutions list (static, always uses the original data array)
        var substitutions = $('<div class="substitutions"></div>');
        var substitutionsTitle = $(
          '<p class="substitutions-title"><strong>Common Substitutions:</strong></p>'
        );
        var substitutionsList = $('<ul class="substitution-list"></ul>');

        $.each(ingredient.substitutes.slice(0, 3), function (i, substitute) {
          // Find the substitute ingredient from the original data array
          var substituteIngredient = data.find(
            (ing) => ing.id === substitute.id
          );
          var substituteName = substituteIngredient
            ? substituteIngredient.name
            : "Unknown";

          // Get tags for the substitute ingredient
          var substituteTags =
            substituteIngredient && substituteIngredient.tags
              ? substituteIngredient.tags
              : [];

          // Create the list item with the name
          var listItem = $("<li></li>").text(substituteName);

          // Add images for each tag
          $.each(substituteTags, function (j, tag) {
            if (tagIcons[tag]) {
              var tagIcon = $('<span class="substitution-icon"></span>').html(
                tagIcons[tag]
              );
              listItem.append(tagIcon);
            }
          });

          substitutionsList.append(listItem);
        });

        substitutions.append(substitutionsTitle, substitutionsList);

        // Add tags for the main ingredient
        var tags = $('<div class="tags"></div>');
        $.each(ingredient.tags, function (i, tag) {
          var tagElement = $('<div class="tag"></div>').text(tag);
          tags.append(tagElement);
        });

        // Add the view button
        var button = $(
          '<button class="view-btn">View Ingredient</button>'
        ).attr(
          "onclick",
          `window.location.href='calculator.html?ingredientId=${ingredient.id}'`
        );

        // Append all elements to the tile
        tile.append(img, name, tags, description, substitutions, button);
        container.append(tile);
      });
    }

    // Function to filter ingredients based on search, category, and tags
    function filterIngredients() {
      var filteredIngredients = ingredients.filter(function (ingredient) {
        // Check if the ingredient matches the selected category
        var matchesCategory =
          currentCategory === "All" || ingredient.category === currentCategory;

        // Check if the ingredient matches the search term
        var matchesSearch = ingredient.name
          .toLowerCase()
          .includes(currentSearchTerm);

        // Check if the ingredient matches all of the selected tags
        var matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every(
            (tag) => ingredient.tags && ingredient.tags.includes(tag)
          ); // All selected tags must be present

        // Combine all conditions
        return matchesCategory && matchesSearch && matchesTags;
      });

      // Display the filtered ingredients
      displayIngredients(filteredIngredients);
    }

    // Display all ingredients initially
    displayIngredients(ingredients);

    // Set search input value to the current search term
    $("#search-input").val(currentSearchTerm);

    // Set category filter to the current category
    $(".category-filter").removeClass("active");
    if (currentCategory) {
      $(".category-filter").each(function () {
        if ($(this).text() === currentCategory) {
          $(this).addClass("active");
        }
      });
    }

    // Set tag filters to the selected tags
    $(".ingredient-tag-filter").removeClass("active");
    if (selectedTags) {
      $(".ingredient-tag-filter").each(function () {
        if (selectedTags.includes($(this).text())) {
          $(this).addClass("active");
        }
      });
    }

    // Filter ingredients on page load
    filterIngredients();

    // Function to update the URL with the current search term, category, and tags
    function updateURL() {
      var newURL = `?search=${currentSearchTerm}&category=${currentCategory}&tags=${selectedTags.join(
        ","
      )}`;
      window.history.pushState({ path: newURL }, "", newURL);
    }

    // Search functionality
    $("#search-input").on("input", function () {
      currentSearchTerm = $(this).val().toLowerCase();
      updateURL();
      filterIngredients();
    });

    // Filter by category functionality
    $(".category-filter").on("click", function () {
      currentCategory = $(this).text();
      updateURL();
      filterIngredients();
    });

    // Filter by tags functionality
    $(".ingredient-tag-filter").on("click", function () {
      if (selectedTags.includes($(this).text())) {
        selectedTags = selectedTags.filter((tag) => tag !== $(this).text());
      } else {
        selectedTags.push($(this).text());
      }
      updateURL();
      filterIngredients();
    });
  }).fail(function () {
    console.error("Error fetching ingredients.");
  });
});
