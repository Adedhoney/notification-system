# Notification System

## What it does:

This is a microservice that handles notification when a debit transaction fails due to insufficient balance in a user's wallet
The notification can either be email notification or mobile(sms) notification

## Implementation:

The system is supposed to be a small part of a much larger system. Hence, it assumes that the other services already work in a certain way. This includes Authentication and Authorization, user management services, wallet services etc.

The getUser and getUSerWallet functions are supposed to be the plug into the larger service. Here, they just return a dummy test data that work to test the notification system (be sure to replace the dummy data with one you can test with. It is located in src/infrastructure/ExternalService/user.ts).

Twilio is used as the sms service provider and a queueing system is put in place to prevent notification loss (you will need to set up your own twilio and rabbitmq credentials to run the program).

## How to get and run:

1. Navigate & open CLI into the directory where you want to put this project & Clone this project using this command.

```bash
git clone https://github.com/Adedhoney/notification-system
```

#### Using manual download ZIP

1. Download repository
2. Extract the zip file, navigate into it & copy the folder to your desired directory
3. use npm install to download all dependencies

## Setting up environments

1. There is a file named `.env.example` on the root directory of the project
2. Create a new file by copying & pasting the file on the root directory & rename it to just `.env`
3. The `.env` file is already ignored, so your credentials inside it won't be committed
4. Change the values of the file. Make changes of comment to the `.env.example` file while adding new constants to the `.env` file.

## Run the project

1. To run build

    ```bash
    npm run build <!-- from the root folder  -->
    ```

2. start

    ```bash
    npm start
    ```

### endpoint

-   Post comment: `POST localhost:8080/api/make-debit`

```json
    Body - {
    "data": {
    "userId": "123-sjdfjd9-s6762g3-676536y6w",
    "amount": 5000,
    "notificationType": "MOBILE"
    }
    }
```
