# Medi-Quest-Server

## Installation:
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create `.env` file to root and assign appropriate value.

    ```bash
    MONGODB_URI=
    PORT=
    JWT_SECRET=
    EXPIRES_IN=
    ```
4. Run the server using `npm run dev`.

### Before Pushing Code:
Before pushing your code to the remote repository, ensure that you have run the following command in your terminal (Git Bash):

```bash
rm -rf .git
```

## Configuration:
- Environment Variables:
  - `PORT`: Port number the server listens on. Default: 5000
  - `MONGODB_URI`: URI for MongoDB database.
  - `JWT_SECRET`: Secret key for JWT token generation.
  - `EXPIRES_IN`: Token expiration time.

## Usage:
- API Endpoints:
  - POST `/api/v1/login`
    - Description: Authenticates user and returns a JWT token.
    - Request: 
        ```json
        { 
            "email": "example@email.com", 
            "password": "password" 
        }
        ```
    - Response: 
        ```json
        {
            "success": true, 
            "message": "User registered successfully"
        }
        ```

  - POST `/api/v1/register`
    - Description: Registers a new user.
    - Request:
        ```json
        { 
            "name": "John", 
            "email": "example@email.com", 
            "password": "password" 
        }
        ```
    - Response: 
        ```json
        {
            "success": true,
            "message": "Login successful",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoMkBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzg1MDYyMSwiZXhwIjoxNzA3OTM3MDIxfQ.7EahSgmPLPNuZ_T9ok-B6TayWCJVdxPzi_Nx4UfrhvY"
        }
        ```


## Dependencies:
- `bcrypt`: Library for hashing passwords.
- `cors`: Express middleware for enabling CORS.
- `dotenv`: Loads environment variables from .env file.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Library for generating and verifying JWT tokens.
- `mongodb`: MongoDB driver for Node.js.
- `nodemon`: Utility for automatically restarting the server during development.

## Server Link
Hosted in Vercel -> [medi-quest-server](https://medi-quest-server.vercel.app)