import { Router, Request, Response } from 'express';
import { auth } from '../lib/auth';

/**
 * Authentication routes with email OTP support
 */

const router = Router();

/**
 * POST /api/auth/send-otp
 * Send OTP to email for verification
 */
router.post('/send-otp', async (req: Request, res: Response) => {
    try {
        const { email, type } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Send OTP using Better Auth
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: type || 'email-verification' // 'sign-in', 'email-verification', or 'password-reset'
            }
        });

        res.json({
            success: true,
            message: `Verification code sent to ${email}`
        });

    } catch (error: any) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send verification code',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Email and OTP are required'
            });
        }

        // Verify OTP using Better Auth
        const result = await auth.api.verifyOTP({
            body: { email, otp }
        });

        if (result.verified) {
            res.json({
                success: true,
                message: 'Email verified successfully',
                user: result.user
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid or expired verification code'
            });
        }

    } catch (error: any) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'Verification failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/auth/signup-with-otp
 * Sign up with email and verify with OTP
 */
router.post('/signup-with-otp', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Create user with Better Auth
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: name || email.split('@')[0]
            }
        });

        // Send OTP for email verification
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: 'email-verification'
            }
        });

        res.status(201).json({
            success: true,
            message: 'Account created. Please check your email for verification code.',
            user: result.user,
            requiresVerification: true
        });

    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Signup failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
