# Click Fit App

A fitness and sports web application with image upload functionality.

## Environment Configuration

This project uses environment variables for configuration. These are stored in a `config.env` file in the root directory.

### Available Environment Variables

- `PORT`: The port on which the server will run (default: 3000)
- `DB_HOST`: MySQL database host (default: localhost)
- `DB_USER`: MySQL database username
- `DB_PASSWORD`: MySQL database password
- `DB_NAME`: MySQL database name
- `FILE_UPLOAD_SIZE_LIMIT`: Maximum file size for image uploads in bytes (default: 5MB)

### Setup Instructions

1. Make sure you have Node.js and MySQL installed
2. Clone this repository
3. Install dependencies: `npm install`
4. Customize the `config.env` file with your own values if needed
5. Start the server: `npm start`

## Features

- Responsive design with Bootstrap
- Image upload with drag and drop functionality
- Daily fitness fact from Numbers API
- MySQL database integration
- User management functionality
