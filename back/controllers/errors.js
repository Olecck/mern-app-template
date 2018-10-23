class CustomError extends Error{
    constructor(errorCode, description, ...args) {
        super(...args);
        this.errorCode = errorCode;
        this.description = description;
        Error.captureStackTrace(this, CustomError);
    }

    errorMessage(){
        return {
            status: "error",
            code: this.errorCode,
            message: this.message
        }
    }
}

/*
Errors are referenced by error code.
An error code is a three digit number:
    - the first digit indicates what category of error it is
    - the second and third digits are just an id of the error within that category
*/
const errors = {
    // unknown error start with 1
    // db errors all start with 2
    201: new CustomError(201, 'Unknown error with the database','Server side error'),
    202: new CustomError(202, 'Impossible to register user, might already exist', 'Could not create user'),

    // resource not found errors start with 3
    301: new CustomError(301, 'User not found', 'User not found'),

    // not allowed to access this ressource 4
    401: new CustomError(401, 'Wrong password', 'Not Authorized'),
    402: new CustomError(402, 'Not authorized to access this ressource', 'Not Authorized')

};

module.exports = {
    errors
};