package com.example.society.dto;

public class LoginResponse {
    private Long id;
    private String name;
    private String username;
    private String role;
    private String email;
    private Long flatId;

    public LoginResponse() {}

    public LoginResponse(Long id, String name, String username, String role, String email, Long flatId) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.role = role;
        this.email = email;
        this.flatId = flatId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }
}
