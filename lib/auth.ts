import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_COOKIE_NAME = "fd_admin_token";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET ||
  "fast_delivery_bilariyaganj_jwt_secret_key_2026_secure_999";

const secretKey = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AdminJWTPayload {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

/**
 * Sign a new JWT token for authenticated admins (Valid for 7 days)
 */
export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify and decode an existing JWT token
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload && payload.role === "admin") {
      return {
        id: String(payload.id || ""),
        email: String(payload.email || ""),
        name: String(payload.name || "Admin"),
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}
