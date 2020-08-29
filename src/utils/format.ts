import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';

export type PhoneValue = {
    value: string;
    formatedValue: string;
    isValid: boolean;
    maskPhone: string;
}

/** 
 * Функция для форматирования телефонных номеров с использованием libphonenumber-js
*/

function formatedPhone(value: string):PhoneValue {
    const formatedValue = new AsYouType().input(value),
          phoneNumber = parsePhoneNumberFromString(formatedValue),
          isValid = phoneNumber !== undefined ? phoneNumber.isValid() : false;
    const formatedState = {
        value: value,
        formatedValue: formatedValue,
        isValid,
        maskPhone: ''
    }
    return formatedState;
};

export { formatedPhone };