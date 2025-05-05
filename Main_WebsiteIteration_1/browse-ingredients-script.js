import { tagIcons } from './icons.js'; 

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

        // Add substitutions list (static, always uses the original data array)
        var substitutions = $('<div class="substitutions"></div>');
        var substitutionsTitle = $('<p class="substitutions-title"><strong>Common Substitutions:</strong></p>');
        var substitutionsList = $('<ul class="substitution-list"></ul>');

        $.each(ingredient.substitutes.slice(0, 3), function (i, substitute) {
          // Find the substitute ingredient from the original data array
          var substituteIngredient = data.find((ing) => ing.id === substitute.id);
          var substituteName = substituteIngredient ? substituteIngredient.name : "Unknown";

          // Get tags for the substitute ingredient
          var substituteTags = substituteIngredient && substituteIngredient.tags ? substituteIngredient.tags : [];

          // Create the list item with the name
          var listItem = $('<li></li>').text(substituteName);

          // Map tags to their corresponding images
          var tagIcons = {
            Vegetarian: "vegetarian-icon.png",
            Vegan: "vegan-icon.png",
            "Gluten-Free": "gluten-icon.png",
          };

          // Add images for each tag
            $.each(substituteTags, function (j, tag) {
            if (tagIcons[tag]) {
              var tagIcon = $('<span class="substitution-icon"></span>').html(tagIcons[tag]);
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

        // Check if the ingredient matches any of the selected tags
        var matchesTags =
          selectedTags.length === 0 || // No tags selected
          selectedTags.some((tag) => ingredient.tags && ingredient.tags.includes(tag)); // At least one selected tag must be present

        // Combine all conditions
        return matchesCategory && matchesSearch && matchesTags;
      });

      // Display the filtered ingredients
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
