package com.example.demo;


import jakarta.persistence.*;

@Table(name = "Users")
@Entity
public class Users {
    public int id;
    public String username;
    public String password;

    public Users() {

    }

    public Users(String username, String password) {
        this.username = username;
        this.password = password;

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "username")
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Column(name = "password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
