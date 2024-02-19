# DevBG Job Trends

## Overview
The DevBG Job Trends application is designed to provide users with insights 
into the software development job market in Bulgaria. 
By scraping data daily from the popular Bulgarian website [dev.bg](https://dev.bg), 
the application tracks the number of available positions in the 
software development field over time. Users can visualize these 
trends and observe how the job market fluctuates through an intuitive 
web interface.

## Features
- Daily Scraping: The application scrapes data from [dev.bg](https://dev.bg) on a daily basis to ensure up-to-date information.
- Trend Analysis: Users can analyze trends in the software development job market by viewing historical data.
- Visualization: Data is presented graphically to make it easier for users to understand and interpret trends.


## Demo
You can explore a live demo of the Dev.bg Job Trends application by visiting the following URL:

[Dev.bg Job Trends Demo](https://sinilinx.com/)

This demo provides a glimpse into the functionality and features of the application, 
allowing you to visualize software development job market trends in Bulgaria. 
Take a tour and experience the insights provided by the Dev.bg Job Trends application.

## Tech Stack
The DevBG Job Trends application is built using a serverless architecture on AWS, with the following components:

### Backend Services
- **AWS Lambda**: Handles backend requests, including scraping data from [dev.bg](https://dev.bg) and processing API requests.
- **Amazon DynamoDB**: Stores the scraped job data in a NoSQL database for easy retrieval and analysis.
- **Amazon API Gateway**: Provides a RESTful API for communication between the frontend and backend services.
- **Amazon EventBridge**: Triggers the daily scraping of the most recent job data from dev.bg.

### Frontend Services
- **Next.js**: Powers the frontend application, providing Static Site Generation (SSG) and a smooth development experience.
- **Material-UI (MUI)**: Utilized as a component library for building a responsive and visually appealing user interface.
- **Amazon S3**: Stores the static assets and files for the frontend application.
- **Amazon CloudFront**: Distributes the frontend application globally, ensuring fast and reliable access for users.
- **AWS Route 53**: Manages domain names and directs internet traffic to the application hosted on AWS.
- **AWS Certificate Manager**: Generates and manages SSL/TLS certificates to ensure secure communication between clients and the application.

This serverless architecture offers scalability, cost-effectiveness, and low maintenance overhead, allowing for efficient development and operation of the application.


## Local Development
To start the Dev.bg Job Trends application locally, follow these steps:

### Backend Setup
1. Navigate to the `backend` subfolder of the project directory.
2. Ensure you have Node.js and npm installed on your local machine.
3. Install the required dependencies by running:
    ```
    npm install
    ```
4. Deploy the backend resources using the following command:
    ```
    npm run cdk deploy "DevbgStorageStack" "DevbgScraperStack" "DevbgApiStack"
    ```
5. You won't have any data in the database yet. The application is designed to scrape data from [dev.bg](https://dev.bg) on a daily basis. You can invoke the `DevbgScraper-Lambda` manually through the AWS Console to populate the database with the most recent job data.
6. Note that after successful deployment, the AWS CloudFormation stack outputs the API Gateway endpoint URL, which you will need for the frontend setup.

### Frontend Setup
1. Navigate to the `frontend` subfolder of the project directory.
2. Ensure you have Node.js and npm installed on your local machine.
3. Install the required dependencies by running:
    ```
    npm install
    ```
4. Create a `.env.local` file in the `frontend` directory with the following content. 
Replace `<API_GATEWAY_ENDPOINT_URL>` with the API Gateway endpoint URL from the backend setup:
    ```
    BACKEND_URL=<API_GATEWAY_ENDPOINT_URL>
    ```
5. Start the frontend application by running:
    ```
    npm run dev
    ```
6. Open your web browser and navigate to `http://localhost:3000` to view the DevBG Job Trends application running locally.

By following these steps, you can run both the backend and frontend components of the application locally for development and testing purposes.

## Acknowledgements
- Special thanks to [dev.bg](https://dev.bg) for providing valuable job market data.
- Thanks to the open-source community for providing tools and libraries used in this project.