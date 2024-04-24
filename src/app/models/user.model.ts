export interface Userdetails {
    "cognito:username": String,
    "email": String;
    "custom:name": String,
    "email_verified": Boolean, 
    "custom:profileurl": String,
    "sub": String;
    "cognito:groups": Array<String>;
    "iss": String;
    "custom:birthdate": String;
    "cognito:roles": Array<String>;
    "custom:mobile": String;
    "custom:language": String;
    "custom:role": String;
    "origin_jti": String,
    "custom:createdBy": String,
    "custom:updatedBy": String;
    "event_id": String,
    "aud": String,
    "token_use": String, 
    "auth_time": Number;
    "exp": Number;
    "iat": Number;
    "jti": Number;
}