import { NextResponse } from "next/server";

/**
 * hCaptcha v3 verification endpoint
 * 
 * This endpoint verifies the hCaptcha token and returns success/failure.
 * For GDPR compliance:
 * - No personal data is stored beyond what's necessary for bot protection
 * - The token is verified with hCaptcha's API
 * - IP addresses are not logged or are anonymized
 * - Processing is based on legitimate interest for bot protection
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing hCaptcha token" },
        { status: 400 }
      );
    }

    // Verify token with hCaptcha's remote API
    const secretKey = process.env.HCAPTCHA_SECRET_KEY || "your-secret-key-here";

    const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        // Optional: capture IP for fraud detection (anonymized where possible)
        // hostname: request.headers.get("x-forwarded-for") || "unknown",
      }),
    });

    const data = await verifyRes.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      // Return error codes for debugging
      return NextResponse.json(
        { 
          success: false, 
          error_codes: data.error_codes || ["unknown_error"],
          hostname: data.hostname 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification service unavailable" },
      { status: 500 }
    );
  }
}