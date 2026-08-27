import { jwtDecode, JwtPayload } from "jwt-decode";

export interface IBaseJWT extends JwtPayload {
    email: string;
}

export const decodeToken = <T extends IBaseJWT>(token: string) => {
    try {
        return jwtDecode<T>(token);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}