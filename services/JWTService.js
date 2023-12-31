const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");

class JWTService {
    constructor() {
        this.accessToken_expired = "1d";
        this.refreshToken_expired = "7d";
    }
    async generalAccessToken(id) {
        const access_token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: this.accessToken_expired,
        });

        return access_token;
    }

    async generalRefreshToken(id) {
        const refresh_token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: this.refreshToken_expired,
        });

        return refresh_token;
    }

    async refreshTokenService(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const accessToken = await this.generalAccessToken(user.id);
            return { accessToken };
        } catch (err) {
            throw new ApiError(403, "Forbidden");
        }
    }
}

module.exports = new JWTService();
