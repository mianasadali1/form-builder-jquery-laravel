# Form Builder Script

This form builder script is a tool designed to create and manage forms within a Laravel environment using jQuery and Bootstrap 5. It enables users to easily construct forms through a drag-and-drop interface, preview them before saving, and store the resulting forms as JSON objects in a MySQL database via AJAX.

## Features

- **Drag-and-Drop Interface**: Build forms by dragging and dropping elements.
- **Bootstrap 5 Integration**: Utilizes Bootstrap 5 for responsive and visually appealing forms.
- **Form Preview**: Preview forms prior to finalization and saving.
- **AJAX Database Interaction**: Seamlessly saves and retrieves forms from a MySQL database using AJAX.
- **JSON Storage**: Stores forms as JSON objects in the database for easy editing and retrieval.

## Todo

- [ ] Add support for additional form fields:
  - [x] Radio Buttons
  - [x] Text Inputs
  - [ ] Date Field
  - [ ] Steppers
  - [ ] Conditional Inputs
- [ ] Enhance form customization options.
- [ ] Improve form validation and error handling.
- [ ] Implement advanced form layout features.
- [ ] Integrate SMTP support for email notifications.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/form-builder.git`
2. Navigate to the project directory: `cd form-builder`
3. Install dependencies: `composer install`
4. Configure your `.env` file with MySQL database credentials.
5. Run migrations: `php artisan migrate`
6. Serve the application: `php artisan serve`

## Usage

1. Access the application through your web browser.
2. Drag and drop form elements to build your desired form.
3. Preview the form to ensure it meets your requirements.
4. Save the form, which will be stored in the MySQL database as a JSON object.
5. Edit or retrieve saved forms at any time.

## Database Structure

The forms are stored in the database in a table structure that includes the following fields:

- `id`: Unique identifier for each form.
- `title`: Title of the form.
- `json_data`: JSON representation of the form structure.

## Contributing

We welcome contributions! If you'd like to improve this project or add new features, feel free to fork the repository and submit a pull request.

## Acknowledgments

- Credits or acknowledgments for libraries, frameworks, or individuals whose work contributed to this project.

## Support

For any inquiries or issues, please contact dev@mianasad.com
