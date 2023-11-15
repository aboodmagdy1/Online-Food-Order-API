import bcrypt from 'bcrypt';

// generate the salt to use it in hashing the password
export const GenerateSalt = async ()=>{
    return await bcrypt.genSalt()
}


export const GeneratePassword = async (password:string, salt:string)=>{
    return await bcrypt.hash(password,salt)
}