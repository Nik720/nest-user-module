import { Request } from 'express';
import User from "src/entity/user.entity";

interface IRequestWithUser extends Request {
    user: User;
}

export default IRequestWithUser;