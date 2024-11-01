# MiaoJi Address Book

Address Book is a simple contact management application where you can add, edit, delete, favorite, and search contacts. The project includes HTML, CSS, and JavaScript files that provide a front-end interface for managing contacts and interacting with an API.

## Features

1. **Add Contacts**: Add new contacts by entering name, phone number, and email.
2. **Edit Contacts**: Update contact details by clicking the "Edit" button in the contact list.
3. **Delete Contacts**: Remove a contact by clicking the "Delete" button.
4. **Favorite Contacts**: Mark contacts as favorites by clicking the "Favorite" button.
5. **Search Contacts**: Search contacts by name, phone number, or email.
6. **Filter Contacts**: Switch between viewing all contacts and only favorite contacts using the filter buttons.

## File Structure

- `index.html`: The main HTML file that contains the application's basic structure.
- `styles.css`: CSS file for styling the application.
- `scripts.js`: JavaScript file that contains the logic for interacting with the API and managing contact features like add, edit, delete, search, and favorite.

## Usage

1. Ensure you have a backend server that supports REST API for storing and managing contact data (example API endpoint: `http://localhost:5000/api/contacts`).
2. Place project files on the server and start the server.
3. Open the `index.html` file in your browser to access the address book and manage contacts.

## API Endpoints

The project uses the following API endpoints for server interaction:

1. **Get Contact List**
   - `GET http://localhost:5000/api/contacts`
2. **Add a New Contact**
   - `POST http://localhost:5000/api/contacts`
   - Request Body: `{ "name": "Name", "phone_number": "Phone Number", "email": "Email" }`
3. **Update Contact**
   - `PUT http://localhost:5000/api/contacts/{id}`
   - Request Body: `{ "name": "Name", "phone_number": "Phone Number", "email": "Email", "is_favorite": false }`
4. **Delete Contact**
   - `DELETE http://localhost:5000/api/contacts/{id}`

## Code Explanation

### Styling

- The `styles.css` file defines the layout, button, form, and table styles to make the interface visually appealing and user-friendly.

### Key Logic

- **Form Submission**: The `contactForm` collects user input and adds a new contact to the address book.
- **Render Contacts**: The `renderContacts` function sorts contacts by name and dynamically displays them in the table.
- **Edit and Save**: Clicking the "Edit" button enables input fields to update contact details and save changes.
- **Delete Contact**: Allows users to delete a contact upon confirmation.
- **Search**: Enables search by name, phone number, or email based on selected criteria.
- **Filter**: Filter between all contacts and favorites using filter buttons.

## Example Screenshot

![Application Screenshot](screenshot.png)

## Notes

- Update the API endpoint according to your backend configuration.
- Ensure JavaScript is enabled and CORS is configured correctly.

## Contributing

Contributions and suggestions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
