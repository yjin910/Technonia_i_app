# TEMS

## Overview

TEMS stands for Technonia Environment Monitoring System.
As the name of the project depicts, the main aim of this app is to monitor the environment data with a mobile phone.

## Target

As the react native supports both Android and iOS, the app should be able to run on both Android and iOS environment.

Currently, I am testing this app with Android emulator.

## Network communication

### BLE

### HTTP/HTTPS

1. Sign in

The app will send GET request to the server. The request will contain user's email address and password.

    GET /login ?email={email}&pw={password}

The server will check if the given email address is registered.
If so, the server will then check if the password is correct.
Otherwise, the server will send error message to the app.

    1) log in success -> ok
    2) log in failed  -> error


2. Sign up

To sign up, the user should input the email address, password and password-confirm.
After doing the native form validation, the app will send POST request to the server.
The POST request for sign up process will contain user's email address and password.

    POST /signup
    {
        email: email_address
        password: password
    }

When the server receives the POST request for the sign up process, it will store the received email address and password in the database.
If an error occurred while processing the sign up request, the server will response to the client with error message.
Otherwise (if success), the server will send ok message to the client.

    1) sign up success -> ok
    2) error occurred  -> error


3. Reset password

TODO


## TODO

1. use react-native-community/async-storage rather than react-native/AsyncStorage

2. BLE modules

3. clean the navigation history to prevent some unexpected behaviours