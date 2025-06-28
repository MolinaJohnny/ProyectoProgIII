import { Router } from "express";
import{
    createAdmin,
    findAdminById,
    loginAdmin
} from "../controllers/admin.controller.js"

const router = Router();

router.post("/index-admin", loginAdmin);

router.post("/api/admins", createAdmin);
router.get("/api/admins", findAdminById);



export default router;
