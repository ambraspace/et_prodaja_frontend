export class JWToken
{

    jwttoken: string = "";
    username: string = "";
    exp: string = "1970-01-01T00:00:00+00:00";
    role: string = "";

    static isTokenValid(token: JWToken): boolean
    {
        if (new Date(token.exp).getTime() > new Date().getTime())
        {
            return true;
        }
        return false;
    }
    
}
