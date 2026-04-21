package com.drims.dto;

public class LoginRequest {
    private String email;
    private String registerNumber;
    private String password;
    private String loginType;

    public LoginRequest() {}

    public LoginRequest(String email, String registerNumber, String password, String loginType) {
        this.email = email;
        this.registerNumber = registerNumber;
        this.password = password;
        this.loginType = loginType;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getLoginType() { return loginType; }
    public void setLoginType(String loginType) { this.loginType = loginType; }
}
