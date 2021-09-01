
const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Passwords should be at least 8 characters long.
// const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Pld asswords should be at least 8 characters long and shoucontain one number, one character and one special character.
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const PHONE_REGEXP = /^[0-9]*$/;

const NAME_REGEXP = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

const POSTAL_CODE_REGEXP = /\d{5}/;

const ADDRESS_REGEXP = /^[0-9]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

const LOCATION_REGEXP  = /^[A-z]+$/;

export const regexValidators = {
  email: PURE_EMAIL_REGEXP,
  password: PASSWORD_REGEXP,
  phone: PHONE_REGEXP,
  name: NAME_REGEXP,
  postalCode: POSTAL_CODE_REGEXP,
  address: ADDRESS_REGEXP,
  location: LOCATION_REGEXP
};
