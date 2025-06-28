import {Admin} from "../models/admin.model.js"

export const create = async (admin) =>{
    return await Admin.create(admin);   
}
export const findPk = async (id) =>{
    return await Admin.findByPk(id);
}
export const getAdminByEmail = async (email) => {
    return await Admin.findOne({ where: { email } });
};