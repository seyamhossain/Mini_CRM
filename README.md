Mini CRM Dashboard
This is a simple CRM system built with ReactJS, Node.js, PostgreSQL, and Docker. It allows you to manage customers, add tags, search/filter, and upload a CSV file for bulk customer data (admin only). The goal was to keep it simple and scalable.

Core Features
Customer Management: Add, edit, and delete customer information including name, email, phone, and company.

Tagging System: Assign multiple tags (e.g., Lead, Client) to each customer for easier organization and filtering.

Search & Filter: Search customers by name, email, or phone number, and filter them by tags.

CSV Upload (Admin): Admins can upload a CSV file with customer records. The system validates email formats, checks for duplicates, and processes large files efficiently.

Backend API: Built with Node.js and Express, using PostgreSQL for data storage.

Frontend: ReactJS for building the user interface. It is simple, responsive, and easy to use.

Bonus Features
Basic unit tests.

GitHub Actions for continuous integration and deployment.

Pagination for better performance with large customer lists.

Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (latest LTS version)

Docker (for running the application in containers)

Running Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/mini-crm-dashboard.git
cd mini-crm-dashboard
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables: Create a .env file at the root of the project and add the following:

bash
Copy
Edit
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=crm_db
JWT_SECRET=your-jwt-secret
Start the project:

You can run the project using Docker. Run this command to set up both the frontend and backend:

bash
Copy
Edit
docker-compose up --build
This will start the application with PostgreSQL as the database, and the frontend and backend will be running in containers.

CSV Upload Instructions
Admins can upload customer data in CSV format. The CSV should contain the following columns:

name

email

phone

company

Make sure the email format is correct and that there are no duplicate entries in the file.

To upload a CSV:

Go to the "Upload" page in the admin panel.

Select the CSV file to upload.

The system will validate and process the data.

Known Limitations
This is a basic version, and some advanced features like role-based access control and more complex filtering can be added.

The CSV upload process is simplified, so there are some edge cases not fully covered.

Project Structure
backend/: Contains Node.js server and PostgreSQL database setup.

frontend/: Contains ReactJS UI for managing customers, tags, and file upload.

docker/: Configuration files for Docker to containerize both the frontend and backend services.

Tech Choices
Frontend: ReactJS, hooks, functional components.

Backend: Node.js, Express, JWT-based authentication, PostgreSQL for data storage.

Containerization: Docker for setting up both frontend and backend.

Conclusion
This is a simple yet scalable CRM system that should serve as a foundati
