package com.example.nari.service;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;

    /**
     * Sends OTP to the given phone number via Twilio Verify. Phone must be in
     * E.164 format: +91XXXXXXXXXX
     */
    public void sendOtp(String phoneE164) {
        Verification.creator(verifyServiceSid, phoneE164, "sms").create();
    }

    /**
     * Verifies the OTP code entered by the user. Returns true if approved,
     * false otherwise.
     */
    public boolean verifyOtp(String phoneE164, String code) {
        try {
            VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                    .setTo(phoneE164)
                    .setCode(code)
                    .create();
            return "approved".equalsIgnoreCase(check.getStatus().toString());
        } catch (Exception e) {
            // Twilio throws if code is wrong/expired — treat as failed verification
            return false;
        }
    }
}
