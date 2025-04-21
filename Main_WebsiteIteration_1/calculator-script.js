$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const ingredientId = urlParams.get("ingredientId");

  if (!ingredientId) {
    window.location.href = "calculator.html?ingredientId=1";
  }

  let quantity = $("#quantity-input").val();
  let unit = $("#units-dropdown").val();

  $.getJSON("sampledata.json", function (data) {
    var ingredients = data;
    var ingredientsDiv = $("#ingredients-section");

    var substitutionTagFilters = [];

    // Function to display ingredients
    function addInputIngredientOptions(ingredients) {
      ingredientsDiv.empty();
      $.each(ingredients, function (index, ingredient) {
        var ingredientCard = $("<div></div>")
          .addClass("ingredient-card")
          .attr(
            "onclick",
            "window.location.href='calculator.html?ingredientId=" +
              ingredient.id +
              "'"
          );

        if (ingredientId == ingredient.id) {
          ingredientCard.addClass("selected");
        }

        var ingredientImage = $("<img>")
          .attr("src", ingredient.image)
          .attr("alt", ingredient.name)
          .addClass("ingredient-image");

        var ingredientDetails = $("<div></div>").addClass("ingredient-details");

        var ingredientName = $("<p></p>")
          .text(ingredient.name)
          .addClass("ingredient-name");

        var ingredientTags = $("<div></div>").addClass("tags");
        $.each(ingredient.tags, function (index, tag) {
          var tagLabel = $("<span></span>").text(tag).addClass("tag");
          ingredientTags.append(tagLabel);
        });

        ingredientDetails.append(ingredientName);
        ingredientDetails.append(ingredientTags);

        ingredientCard.append(ingredientImage);
        ingredientCard.append(ingredientDetails);

        ingredientsDiv.append(ingredientCard);

        // Scroll to the selected ingredient
        if (ingredientId == ingredient.id) {
          ingredientCard[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    }

    // Display all ingredients in select options initially
    addInputIngredientOptions(ingredients);

    // Function to display ingredient image
    function displayIngredientImage(ingredient) {
      var imageContainer = $("#ingredient-image-container");
      imageContainer.empty();

      var img = $("<img>")
        .attr("src", ingredient.image)
        .attr("alt", ingredient.name)
        .addClass("ingredient-image");
      imageContainer.append(img);
    }

    // Function to get an ingredient by ID
    function getIngredientById(id) {
      return ingredients.find(function (ingredient) {
        return ingredient.id == id;
      });
    }

    // Function to get all tags for a given ingredient's substitutes
    function getSubstiteTags(ingredient) {
      var tags = [];
      $.each(ingredient.substitutes, function (index, substitution) {
        var substitutionIngredient = getIngredientById(substitution.id);
        if (substitutionIngredient) {
          $.each(substitutionIngredient.tags, function (index, tag) {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
        }
      });
      return tags;
    }

    // Function to update tag filter options
    function displayTagFilterOptions(ingredient) {
      var tags = getSubstiteTags(ingredient);
      var tagFilterContainer = $("#tag-filters");
      tagFilterContainer.empty();

      $.each(tags, function (index, tag) {
        var tagOption = $("<div></div>")
          .attr("tag", tag)
          .text(tag)
          .addClass("tag-filter");
        tagFilterContainer.append(tagOption);
      });
    }

    // Function to display substitutions
    function displaySubstitutions(ingredient, tagFilters) {
      var substitutionsSection = $("#substitution-options");
      substitutionsSection.empty();

      $.each(ingredient.substitutes, function (index, substitution) {
        var substitutionIngredient = getIngredientById(substitution.id);
        if (substitutionIngredient) {
          if (
            tagFilters &&
            tagFilters.length > 0 &&
            !tagFilters.every((tag) =>
              substitutionIngredient.tags.includes(tag)
            )
          ) {
            return; // Skip this substitution if it doesn't match the selected tags
          }
          var substitutionDiv = $("<div></div>").addClass(
            "substitution-option"
          );

          var substituteDetails =
            $("<div></div>").addClass("substitute-details");

          var substituteImage = $("<img>")
            .attr("src", substitutionIngredient.image)
            .attr("alt", substitutionIngredient.name)
            .addClass("substitute-image");

          substituteDetails.append(substituteImage);

          var substituteDetailsText = $("<div></div>").addClass(
            "substitute-details-text"
          );

          var substituteNameLabel = $("<p></p>")
            .text(substitutionIngredient.name)
            .addClass("substitute-name");

          substituteDetailsText.append(substituteNameLabel);

          var substituteDescriptionLabel = $("<p></p>")
            .text(substitutionIngredient.description)
            .addClass("substitute-description");

          substituteDetailsText.append(substituteDescriptionLabel);

          var substituteTags = $("<div></div>").addClass("tags");

          $.each(substitutionIngredient.tags, function (index, tag) {
            var tagLabel = $("<span></span>").text(tag).addClass("tag");
            substituteTags.append(tagLabel);
          });

          substituteDetailsText.append(substituteTags);

          substituteDetails.append(substituteDetailsText);

          var amountDetails = $("<div></div>").addClass("amount-details");

          var ratioText = $("<p></p>")
            .text(substitution.ratio)
            .addClass("substitute-ratio");

          amountDetails.append(ratioText);

          var calculatedAmount = $("<div></div>").addClass("calculated-amount");

          var quantityText = $("<p></p>").addClass("calculated-quantity");
          if (quantity) {
            var calculatedValue = (quantity * substitution.xing).toFixed(2);
            quantityText.text(calculatedValue);
          } else {
            quantityText.text("-");
          }
          calculatedAmount.append(quantityText);

          var unitText = $("<p></p>").addClass("calculated-unit");
          if (unit) {
            unitText.text(unit);
          } else {
            unitText.text("-");
          }
          calculatedAmount.append(unitText);

          amountDetails.append(calculatedAmount);

          substitutionDiv.append(substituteDetails);
          substitutionDiv.append(amountDetails);

          substitutionsSection.append(substitutionDiv);
        } else {
          console.error("Substitution ingredient not found.");
        }
      });
    }

    // If ingredientId is provided, set it as selected, display its image and substitutions, and updates tag filter options
    if (ingredientId) {
      var selectedIngredient = getIngredientById(ingredientId);
      if (selectedIngredient) {
        // dropdown.val(selectedIngredient.id);
        displayIngredientImage(selectedIngredient);
        displaySubstitutions(selectedIngredient);
        displayTagFilterOptions(selectedIngredient);
      } else {
        console.error("Ingredient not found.");
      }
    }

    // Reload page with new ingredientId when ingredient changes
    $("#ingredients-dropdown").on("change", function () {
      window.location.href = "calculator.html?ingredientId=" + $(this).val();
    });

    // Update substitutions when quantity or unit changes
    $("#quantity-input").on("input", function () {
      quantity = $(this).val();
      displaySubstitutions(getIngredientById(ingredientId));
    });

    $("#units-dropdown").on("change", function () {
      unit = $(this).val();
      displaySubstitutions(getIngredientById(ingredientId));
    });

    // Update substitutions when tag filters are applied
    $(".tag-filter").on("click", function () {
      var tag = $(this).attr("tag");
      if (tagFilters.includes(tag)) {
        tagFilters = tagFilters.filter((t) => t !== tag);
        $(this).removeClass("selected");
      } else {
        tagFilters.push(tag);
        $(this).addClass("selected");
      }
      displaySubstitutions(getIngredientById(ingredientId), tagFilters);
    });

    /*
      HANDLE FILTER INPUTS
    */

    // Function to handle search input
    $("#search-input").on("input", function () {
      searchInput = $(this).val().toLowerCase();
      var filteredIngredients = ingredients.filter(function (ingredient) {
        return ingredient.name.toLowerCase().includes(searchInput);
      });
      addInputIngredientOptions(filteredIngredients);
    });

    // Function to handle category filter
    $(".category-filter").on("click", function () {
      selectedCategory = $(this).text().toLowerCase();

      var filteredIngredients = ingredients.filter(function (ingredient) {
        return ingredient.category.toLowerCase() === selectedCategory;
      });
      addInputIngredientOptions(filteredIngredients);
    });

    // Function to handle tag filters
    $(".substitution-tag-filter").on("click", function () {
      var tag = $(this).text();
      if (substitutionTagFilters.includes(tag)) {
        substitutionTagFilters = substitutionTagFilters.filter(
          (t) => t !== tag
        );
      } else {
        substitutionTagFilters.push(tag);
      }
      displaySubstitutions(
        getIngredientById(ingredientId),
        substitutionTagFilters
      );
    });
  }).fail(function () {
    console.error("Error fetching ingredients.");
  });
});
