package com.example.society.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guard")
public class Guard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 15, nullable = false)
    private String phone;

    @Column(length = 128, nullable = false)
    private String password;

    @Column(length = 30, nullable = false)
    private String shift = "Day";

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Guard() { }

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

    @Override
    public String toString() {
        return username;
    }
}
