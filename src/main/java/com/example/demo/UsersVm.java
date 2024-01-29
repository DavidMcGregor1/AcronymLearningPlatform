package com.example.demo;

public class UsersVm {
    public int id;
    public String username;
    public String password;


    UsersVm(int aid, String ausername, String apassword) {
        id = aid;
        username = ausername;
        password = apassword;

    }

    public UsersVm() {

    }

}