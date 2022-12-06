1. First unzip dhe project

2. make sure that node_modules folder is present in project (if not run in terminal of the project: npm install)

3. as ORM is used prisma so you must configure to the .env file password and the db name 
	configuration at my local machine are:
   	postgres password Root.123
   	db name: node
   	host: localhost
   	port: 5432

DATABASE_URL="postgresql://postgres:Root.123@localhost:5432/node?schema=public"


and after the configuration is done run the command on the terminal of IDE you opened the project
   `npx prisma migrate dev` to migrate the tables in the database (PostgresDB)
   this will require to name the migration, put a name on this migration.


4. after the migration is done successfully than run command to seed the db: `npx prisma db seed`
   if everything goes good in this point you must have the new user, new company and new roles created

5. run in terminal to start the project `npm run dev`

credentials for the admin user are as follows:
email: admin@admin.com
password: password

than call route login sending email and password as payload to endpoint http://localhost:3001/login to generate the jwt token