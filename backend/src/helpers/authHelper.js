import bcrypt from "bcrypt";

const salt = 10;
export const hashPassword = async (password) =>{
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    } catch (error) {
        console.error("Error al hashear el password");
        
    }
}
export const comparePassword = async(password, hash)=>{
    try {
        const match = await bcrypt.compare(password, hash);
        return match
    } catch (error) {
        console.error("Error al comparar el password");

    }
}