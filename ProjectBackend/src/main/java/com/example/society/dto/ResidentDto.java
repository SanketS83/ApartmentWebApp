package com.example.society.dto;

public class ResidentDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String memberType;
    private Long flatId;
    private String flatDetails;
    private String address;
    private Boolean isActive;

    public ResidentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getMemberType() { return memberType; }
    public void setMemberType(String memberType) { this.memberType = memberType; }
    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }
    public String getFlatDetails() { return flatDetails; }
    public void setFlatDetails(String flatDetails) { this.flatDetails = flatDetails; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
