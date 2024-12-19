# NoteWorthy: “Because your Notes are worth it!”

**NoteWorthy** is a powerful note-taking app designed to help you organize, prioritize, and enhance your notes with ease. Whether you're jotting down quick thoughts, organizing study materials, or managing projects, NoteWorthy provides a simple yet effective interface to keep your notes organized and accessible. With intuitive features and a clean, user-friendly design, NoteWorthy ensures your notes always stay meaningful and easy to manage.

# Technologies Used:

- Angular
- Spring Boot
- MySQL
- Tailwind CSS

# Installation and Running Instructions

1. **Clone the Project**: Clone the project to your local directory of choice using the link below:

   ```
   https://github.com/n3wt0n03/Note-App-Project.git

   ```

2. **Run the Database**: Open MySQL Workbench and connect to your local database using your MySQL Database Credentials. After that, follow these steps:

   ```
   1. Create a Schema in the SCHEMAS tab
      - Create a name of your choice for your database.
      - Leave all settings to default.
      - Click apply.
   2. Click "Data Import" under the Server tab.
      - Check the "Import from the Self-Contained File".
      - Click the "more options"(3 dots at the right) and navigate the "db_data_import.sql" file inside the server folder.
      - Go to "Default Target Schema" below and navigate your newly created schema.
      - Click "Start Import" (If the button is not visible,adjust the "Options Tab" by dragging it downward until the button appears.)
      - Refresh the Database and check to see if the tables and data are successfully added.
   ```

3. **Run the Server**: Open an IDE (i.e. IntelliJ) that supports a Spring Boot Project and run the server:

   - If the server is not running properly, check the "application.properties" file under "src\main\resources" directory in the server folder.
   - Replace the spring boot username and password with your MySQL Database Credentials.

4. **Install Dependencies**: In the terminal, navigate to the client folder directory and install the required node modules:

   ```
   cd client
   npm install
   ```

5. **Run the Website(Client Side)**: Run the Angular Web Application to gain access to the website. Follow these steps below:

   ```
   cd client
   ng serve
   <press "o" then hit enter>
   ```

# Enjoy running our project!
