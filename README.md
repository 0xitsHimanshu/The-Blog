# The Blog

The Blog is a full-stack blog application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js) along with AWS technologies for deployment and cloud services. This application allows users to create, edit, delete, and view blog posts with a user-friendly interface.

## Features

- **User Authentication**: Secure authentication system with JWT for user login and registration.
- **Create, Read, Update, Delete (CRUD)**: Users can create new blog posts, edit existing ones, delete posts, and read all posts.
- **Responsive Design**: The application is fully responsive, ensuring a seamless experience across different devices.
- **AWS Integration**: Utilizes AWS for cloud storage and deployment, ensuring scalability and reliability.
- **Rich Text Editor**: Includes a rich text editor for composing blog posts with various formatting options.
- **Comment System**: Users can comment on posts and engage with other users.
- **Search Functionality**: Allows users to search for posts by title or content.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: AWS (EC2, S3, CloudFront, RDS)
- **Rich Text Editor**: [Editor.js](https://editorjs.io/)
- **Version Control**: Git, GitHub

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/0xitsHimanshu/The-Blog.git
    cd The-Blog
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_BUCKET_NAME=your_aws_s3_bucket_name
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

    The application will be running on `http://localhost:3000`.

## Usage

- **Sign Up / Login**: Register a new account or log in with existing credentials.
- **Create a Post**: Navigate to the "New Post" section to create a new blog post.
- **Edit / Delete a Post**: Edit or delete your posts from the "My Posts" section.
- **Comment**: Engage with other users by commenting on posts.
- **Search**: Use the search bar to find specific posts.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out:

- Twitter: Himanshu()
- LinkedIn: [Himanshu Yadav](https://www.linkedin.com/in/0xhimanshuyadav/)

---

*This project is part of my personal portfolio and demonstrates my skills in full-stack development using the MERN stack and AWS technologies.*
