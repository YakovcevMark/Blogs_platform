import {compare, genSalt, hash} from "bcrypt";
const password = 'lolKekCheburek';
(async () => {
    const salt = await genSalt(10)
    console.log('salt: ', salt)
    const hashedPassword = await hash(password, salt)
    console.log('hashedPassword: ', hashedPassword)
    const isEqual = await compare(password, hashedPassword);
    console.log('isEqual: ', isEqual)
})()