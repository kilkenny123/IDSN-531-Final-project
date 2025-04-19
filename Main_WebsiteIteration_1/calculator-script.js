$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const ingredientId = urlParams.get("ingredientId");
  let quantity = $("#quantity-input").val();
  let unit = $("#units-dropdown").val();

  $.getJSON("sampledata.json", function (data) {
    var ingredients = data;
    var dropdown = $("#ingredients-dropdown");
    var tagFilters = [];

    // Function to display ingredients
    function addInputIngredientOptions(ingredients) {
      dropdown.empty();
      $.each(ingredients, function (index, ingredient) {
        var option = $("<option></option>")
          .attr("value", ingredient.id)
          .text(ingredient.name);
        dropdown.append(option);
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

          var substituteTags = $("<div></div>").addClass("substitute-tags");

          $.each(substitutionIngredient.tags, function (index, tag) {
            var tagLabel = $("<span></span>")
              .text(tag)
              .addClass("substitute-tag");
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
        dropdown.val(selectedIngredient.id);
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
      displaySubstitutions(getIngredientById(dropdown.val()));
    });

    $("#units-dropdown").on("change", function () {
      unit = $(this).val();
      displaySubstitutions(getIngredientById(dropdown.val()));
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
      displaySubstitutions(getIngredientById(dropdown.val()), tagFilters);
    });
  }).fail(function () {
    console.error("Error fetching ingredients.");
  });
});
