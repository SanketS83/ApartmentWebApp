package com.example.society.dto;

public class GuardDto {
    private Long id;
    private String name;
    private String username;
    private String phone;
    private String password;
    private String shift;
    private Boolean isActive;

    public GuardDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
