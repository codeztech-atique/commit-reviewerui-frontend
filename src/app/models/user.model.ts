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
    "custom:subscriber_user_id": String;
    "custom:subscriptionId": String;
    "custom:selectedPlan": String;
    "custom:description": String;
    "custom:role": String;
    "custom:mood": String;
    "custom:country": String;
    "custom:state": String,
    "custom:city": String,
    "custom:home": String, 
    "custom:office": String;
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