import { Request } from 'express';
import User from "src/user/entities/user.entity";

interface IRequestWithUser extends Request {
    user: User;
}

export default IRequestWithUser;