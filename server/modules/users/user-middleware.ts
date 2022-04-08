import { validate } from 'uuid'

export const userIdValidator = (userId: string): boolean => {
    return validate(userId);
}

export const emailValidator = (email: string): boolean => {

    const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/

    const result = emailPattern.exec(email);

    if(result) {
        return true;
    } else {
        return false;
    }
}

export const passwordValidator = (password: string): boolean => {


    const passwordPattern = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{10,}$/
    
    if(!passwordPattern.test(password)){
        return false;
    } else {    
        return true;
    }
}