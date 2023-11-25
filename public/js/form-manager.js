let listGroupCounter = 1;
let fieldCounter = 1;

// Execute when the document is ready
$(document).ready(function () {
    // Close builder section event
    $(".close-builder-section").click(function () {
        $(".form-builder-items").addClass("hide");
        $(".form-builder-menu").removeClass("hide");
    });

    // Add form elements event
    $(".add-form-elements").click(function () {
        $(".form-builder-items").removeClass("hide");
        $(".form-builder-menu").addClass("hide");
    });

    // Close preview button event
    $(".close-preview-btn").click(function () {
        $(".form-preview-section").addClass("hide");
        $(".form-builder").removeClass("hide");
    });

    // Show preview button event
    $(".show-preview-btn").click(function () {
        $(".form-preview-section").removeClass("hide");
        $(".form-builder").addClass("hide");

        // Generate form preview
        extractFormData();
    });

    // Make elements draggable
    $('.draggable').draggable({
        revert: false,
        helper: 'clone'
    });

    // Define droppable area for elements
    $('.element-drop-zone').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
            var type = $(ui.draggable).data('type');
            if (type === 'text') {
                addTextInputSection(); // Add text input section on drop
            } else if (type === 'radio') {
                addRadioInputSection(); // Add radio input section on drop
            }

            $('.form-empty-state').addClass('hide');
        }
    });

    // Sortable area for form elements
    $('#sortable-area').sortable({
        handle: '.move-item-btn',
        update: function (event, ui) {
            saveFormData(); // Save form data after sorting
        }
    });

    // Event for adding new option in a list group
    $('.add-option-btn').on('click', function () {
        var newItem = $('<li class="list-group-item">' +
            '<div class="item-content radio-options">' +
            '<input type="radio" name="options" class="option-radio">' +
            '<span name="radio_option" contenteditable="true">Type your option</span>' +
            '</div>' +
            '<div class="item-buttons">' +
            '<span class="move-list-item-btn">&nbsp;&nbsp;&nbsp;</span>' +
            '<button class="delete-item-btn"></button>' +
            '</div>' +
            '</li>');
        $(this).before(newItem);
    });

    // Delete list item event
    $('.list-group').on('click', '.delete-item-btn', function () {
        $(this).closest('li').remove();
    });

    // Sortable list group items
    $('.list-group').sortable({
        handle: '.move-list-item-btn',
        update: function (event, ui) {
            saveFormData(); // Save form data after sorting list items
        }
    });

    // Event to close a form element section
    $('.form-builder-area').on('click', '.close-item-btn', function () {
        $(this).closest('.form-element-section').remove();
        checkEmpty();
        saveFormData(); // Save form data after closing an element section
    });

    // Event to duplicate a form element section
    $('.form-builder-area').on('click', '.duplicate-item-btn', function () {
        var clonedItem = $(this).closest('.form-element-section').clone();
        clonedItem.addClass("new-field-section");

        var fieldType = clonedItem.data('type');
        let listGroupId;
        if (fieldType === "radio") {
            listGroupId = 'list-group-' + listGroupCounter;
            var listGroup = clonedItem.find('.list-group');
            listGroup.attr('id', listGroupId);
        }

        var newId = fieldType + '-field-' + fieldCounter; // Define the new ID here
        clonedItem.attr('id', newId);

        $(this).closest('.form-element-section').after(clonedItem);

        if (fieldType == "radio") {
            // Event for adding new option in a list group for duplicated radio elements
            $('#' + listGroupId + ' .add-option-btn').on('click', function () {
                var newItem = $('<li class="list-group-item">' +
                    '<div class="item-content radio-options">' +
                    '<input type="radio" name="options" class="option-radio">' +
                    '<span name="radio_option" contenteditable="true">Type your option</span>' +
                    '</div>' +
                    '<div class="item-buttons">' +
                    '<span class="move-list-item-btn">&nbsp;&nbsp;&nbsp;</span>' +
                    '<button class="delete-item-btn"></button>' +
                    '</div>' +
                    '</li>');
                $(this).before(newItem);
            });

            // Delete list item event for duplicated radio elements
            $('#' + listGroupId).on('click', '.delete-item-btn', function () {
                $(this).closest('li').remove();
            });

            // Sortable list group items for duplicated radio elements
            $('#' + listGroupId).sortable({
                handle: '.move-list-item-btn',
                update: function (event, ui) {
                    saveFormData(); // Save form data after sorting list items
                }
            });
        }
        listGroupCounter++;
        fieldCounter++;

        saveFormData(); // Save form data after duplicating an element section
    });
});


/**
 * Function: saveFormData
 * Description: Gathers form data from newly added field sections, converts it to JSON, and sends it to a server endpoint for storage.
 */
function saveFormData() {
    var formData = []; // Array to hold form data

    // Loop through each newly added field section
    $('.new-field-section').each(function () {
        var sectionData = {}; // Object to store section data

        sectionData.type = $(this).data('type'); // Extract type of form section

        // Extract header information
        var formBody = $(this).find('.section-body');
        sectionData.title = formBody.find('.field-heading').text(); // Extract field title
        sectionData.description = formBody.find('.field-description').text(); // Extract field description
        sectionData.id = $(this).attr('id'); // Extract field ID

        if (sectionData.type == 'radio') {
            // Extract list-group items for radio type
            var listGroup = $(this).find('.list-group');
            sectionData.listGroupId = listGroup.attr('id'); // Extract list group ID
            var listItems = [];
            var listGroupItems = $(this).find('.list-group-item');
            listGroupItems.not(':last').each(function () {
                var listItem = {};
                listItem.option = $(this).find('.radio-options span').text(); // Extract radio option

                listItems.push(listItem);
            });

            if ($(this).find('#field-sort-options').is(':checked')) {
                // Sort radio options alphabetically
                listItems.sort((a, b) => a.option.localeCompare(b.option));
            }

            sectionData.options = listItems; // Add options to section data for radio type
        }

        // Extract settings for both types
        var settings = {};
        settings.required = $(this).find('#field-required-switch').is(':checked');

        if (sectionData.type == 'radio') {
            settings.sortOptions = $(this).find('#field-sort-options').is(':checked');
        } else if (sectionData.type == 'text') {
            sectionData.maxCharactersEnabled = $(this).find('#field-max-characters').is(':checked');
            sectionData.maxCharacters = $(this).find('#field-max-characters-value').val(); // Extract max characters for text type
        }

        sectionData.settings = settings; // Add settings to section data

        formData.push(sectionData); // Push section data to form data array
    });

    // Convert formData array to JSON
    var jsonData = JSON.stringify(formData, null, 2);

    // Make an AJAX request to send form data to a server endpoint
    $.ajax({
        url: '/api/store-form-data',
        type: 'POST',
        data: jsonData,
        contentType: 'application/json',
        success: function (response) {
            // Handle success response from the server
            console.log(response);
            // You can perform actions based on the response, like displaying a success message
        },
        error: function (error) {
            // Handle error response from the server
            console.error(error);
        }
    });
}


/**
 * Function: extractFormData
 * Description: Extracts form data from newly added field sections, converts it to JSON, and sends it to a server endpoint.
 */
function extractFormData() {
    var formData = []; // Array to hold form data

    // Loop through each newly added field section
    $('.new-field-section').each(function () {
        var sectionData = {}; // Object to store section data

        sectionData.type = $(this).data('type'); // Extract type of form section

        // Extract header information
        var formBody = $(this).find('.section-body');
        sectionData.title = formBody.find('.field-heading').text(); // Extract field title
        sectionData.description = formBody.find('.field-description').text(); // Extract field description
        sectionData.id = $(this).attr('id'); // Extract field ID

        if (sectionData.type == 'radio') {
            // Extract list-group items for radio type
            var listItems = [];
            var listGroupItems = $(this).find('.list-group-item');
            listGroupItems.not(':last').each(function () {
                var listItem = {};
                listItem.option = $(this).find('.radio-options span').text(); // Extract radio option

                listItems.push(listItem);
            });

            if ($(this).find('#field-sort-options').is(':checked')) {
                // Sort radio options alphabetically
                listItems.sort((a, b) => a.option.localeCompare(b.option));
            }

            sectionData.options = listItems; // Add options to section data for radio type
        }

        // Extract settings for both types
        var settings = {};
        settings.required = $(this).find('#field-required-switch').is(':checked');

        if (sectionData.type == 'radio') {
            settings.sortOptions = $(this).find('#field-sort-options').is(':checked');
        } else if (sectionData.type == 'text') {
            sectionData.maxCharactersEnabled = $(this).find('#field-max-characters').is(':checked');
            sectionData.maxCharacters = $(this).find('#field-max-characters-value').val(); // Extract max characters for text type
        }

        sectionData.settings = settings; // Add settings to section data

        formData.push(sectionData); // Push section data to form data array
    });

    // Convert formData array to JSON
    var jsonData = JSON.stringify(formData, null, 2);

    // Make an AJAX request to send form data to a server endpoint
    $.ajax({
        url: '/api/store-form-data',
        type: 'POST',
        data: jsonData,
        contentType: 'application/json',
        success: function (response) {
            // Handle success response from the server
            console.log(response);
            // You can perform actions based on the response, like displaying a success message
        },
        error: function (error) {
            // Handle error response from the server
            console.error(error);
        }
    });

    $('.form-preview').html(""); // Clear form preview

    if (formData.length > 0) {
        // Loop through the JSON data to create form elements for preview
        formData.forEach(function (item) {
            var formElement = createFormElement(item); // Create form elements based on extracted data
            $('.form-preview').append(formElement); // Append form elements to the preview area
        });

        
    } else {
        $(".form-preview").html('<span class="preview-empty-state">Your form is empty, please add some elements.</span>'); // Show preview empty state message if no form data
    }
}


/**
 * Function: addTextInputSection
 * Description: Adds a new text input section to a form builder area.
 */
function addTextInputSection() {
    // Clone the text input section
    var textInputSection = $('#text-field').clone();
    var newId = 'text-field-' + fieldCounter; // Define the new ID here
    textInputSection.attr('id', newId);
    textInputSection.addClass("new-field-section");

    // Append the cloned section to the form container
    $('.form-builder-area').append(textInputSection);
    fieldCounter++; // Increment field counter for unique IDs

    saveFormData(); // Function call to save form data
}


/**
 * Function: addRadioInputSection
 * Description: Adds a new radio input section to a form builder area and handles addition, deletion, and sorting of radio options within the section.
 */
function addRadioInputSection() {
    // Clone the radio input section
    var radioInputSection = $('#radio-field').clone();
    radioInputSection.addClass("new-field-section");

    var newId = 'radio-field-' + fieldCounter; // Define the new ID here
    radioInputSection.attr('id', newId);

    // Create a unique ID for the list group
    let listGroupId = 'list-group-' + listGroupCounter;

    var listGroup = radioInputSection.find('.list-group');
    listGroup.attr('id', listGroupId);

    // Append the cloned section to the form container
    $('.form-builder-area ').append(radioInputSection);

    // Event listener for adding new radio options
    $('#' + listGroupId + ' .add-option-btn').on('click', function () {
        // Create a new radio option item
        var newItem = $('<li class="list-group-item">' +
            '<div class="item-content radio-options">' +
            '<input type="radio" name="options" class="option-radio">' +
            '<span name="radio_option" contenteditable="true">Type your option</span>' +
            '</div>' +
            '<div class="item-buttons">' +
            '<span class="move-list-item-btn">&nbsp;&nbsp;&nbsp;</span>' +
            '<button class="delete-item-btn"></button>' +
            '</div>' +
            '</li>');
        $(this).before(newItem);
    });

    // Deleting the clicked list item when close-item-btn is clicked
    $('#' + listGroupId).on('click', '.delete-item-btn', function () {
        $(this).closest('li').remove();
    });

    // Enable sorting functionality for list items
    $('#' + listGroupId).sortable({
        handle: '.move-list-item-btn'
    });

    fieldCounter++;
    listGroupCounter++;

    saveFormData(); // Function call to save form data
}

function checkEmpty() {
    // Count the number of items present
    var itemCount = $('.form-builder-area .form-element-section').length;

    // Show or hide the empty message based on the item count
    if (itemCount === 0) {
        $('.form-empty-state').removeClass('hide');
    } else {
        $('.form-empty-state').addClass('hide');
    }
}

/**
 * Function: createFormElement
 * Description: Generates HTML form elements based on the provided item type.
 * @param {Object} item - Object containing information about the form element.
 * @returns {string} - HTML string representing the form element.
 */
function createFormElement(item) {
    // Check the type of form element to create
    if (item.type === 'text') {
        // Creating a text input field
        var field = "<div class='row mb-3 field-section'>";

        // Adding label for the text input
        field += "<label for='" + item.id + "' class='form-label'>" + item.title + (item.settings.required ? '' : ' (optional)') + "</label>";

        // Adding description if available
        if (item.description.length > 0) {
            field += "<small id='" + item.id + "_help' class='form-text text-muted mb-3'>" + item.description + "</small>";
        }

        // Creating the text input element
        field += "<input type='text' maxlength='" + item.maxCharacters + "' class='form-control' id='" + item.id + "' name='" + item.id + "' " + (item.settings.required ? 'required' : '') + ">";

        if(item.maxCharactersEnabled) {
            // Adding the character count display
            field += "<small id='" + item.id + "_count' class='form-text text-muted mb-3'>0 out of " + item.maxCharacters + "</small>";
        }

        // Closing the field section div
        field += "</div>";

        if(item.maxCharactersEnabled) {
            // JavaScript to handle character count update
            field += "<script>" +
                "document.getElementById('" + item.id + "').addEventListener('input', function() {" +
                "var count = this.value.length;" +
                "document.getElementById('" + item.id + "_count').innerText = count + ' out of " + item.maxCharacters + "';" +
                "});" +
                "</script>";
        }
        return field;
    } else if (item.type === 'radio') {
        // Creating radio button elements
        var field = "<div class='row mb-3 field-section'>";

        // Adding label for the radio buttons
        field += "<label for='" + item.id + "' class='form-label'>" + item.title + (item.settings.required ? '' : ' (optional)') + "</label>";

        // Adding description if available
        if (item.description.length > 0) {
            field += "<small id='" + item.id + "_help' class='form-text text-muted mb-3'>" + item.description + "</small>";
        }

        var optionCount = 0;
        // Looping through options to create radio buttons
        item.options.forEach(function (option) {
            var id = item.id + '_' + optionCount;
            // Creating each radio button with its label
            field += '<div class="form-check"> <input class="form-check-input" type="radio" name="' + item.id + '" id="' + id + '"> <label class="form-check-label" for="' + id + '" value=' + option.option + '> ' + option.option + ' </label> </div>';
            optionCount++;
        });

        // Closing the field section div
        field += "</div>";
        return field;
    }
}
