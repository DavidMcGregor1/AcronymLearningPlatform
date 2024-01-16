package com.example.demo;


import jakarta.persistence.*;

@Table(name = "Acronyms")
@Entity
public class Acronyms {
    public int id;
    public String category;
    public int length;
    public String acronym;
    public String meaning;
    public String falseAnswer1;
    public String falseAnswer2;
    public String falseAnswer3;
    public String description;

    public Acronyms() {

    }

    public Acronyms(String category, int length, String acronym, String meaning, String falseAnswer1, String falseAnswer2, String falseAnswer3, String description) {
        this.category = category;
        this.length = length;
        this.acronym = acronym;
        this.meaning = meaning;
        this.falseAnswer1 = falseAnswer1;
        this.falseAnswer2 = falseAnswer2;
        this.falseAnswer3 = falseAnswer3;
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public  int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "Category")
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Column(name = "Length")
    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    @Column(name = "Acronym")
    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    @Column(name = "Meaning")
    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    @Column(name = "False_Answer_1")
    public String getFalseAnswer1() {
        return falseAnswer1;
    }

    public void setFalseAnswer1(String falseAnswer1) {
        this.falseAnswer1 = falseAnswer1;
    }

    @Column(name = "False_Answer_2")
    public String getFalseAnswer2() {
        return falseAnswer2;
    }

    public void setFalseAnswer2(String falseAnswer2) {
        this.falseAnswer2 = falseAnswer2;
    }

    @Column(name = "False_Answer_3")
    public String getFalseAnswer3() {
        return falseAnswer3;
    }

    public void setFalseAnswer3(String falseAnswer3) {
        this.falseAnswer3 = falseAnswer3;
    }

    @Column(name = "Description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
