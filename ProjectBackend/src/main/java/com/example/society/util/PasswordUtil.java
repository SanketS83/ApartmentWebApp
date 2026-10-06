package com.example.society.util;

public class PasswordUtil {

    /**
     * Store plain password without hashing as requested.
     */
    public static String hashPassword(String password) {
        return password;
    }

    /**
     * Check plain text password directly (with fallback to SHA-256 for backwards compatibility).
     */
    public static boolean checkPassword(String plainPassword, String storedPassword) {
        if (plainPassword == null || storedPassword == null) {
            return false;
        }
        if (plainPassword.equals(storedPassword)) {
            return true;
        }
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(plainPassword.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(storedPassword);
        } catch (Exception ignored) {
            return false;
        }
    }
}
