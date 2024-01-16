package com.example.demo;

public class AcronymsVm {
    public int id;
    public String category;
    public String acronym;
    public String meaning;
    public int length;
    public String falseAnswer1;
    public String falseAnswer2;
    public String falseAnswer3;
    public String description;


    AcronymsVm(int aid, String acategory, String aacronym, String ameaning, int alength, String afalseAnswer1, String afalseAnswer2, String afalseAnswer3, String adescription) {
        id = aid;
        category = acategory;
        acronym = aacronym;
        meaning = ameaning;
        length = alength;
        falseAnswer1 = afalseAnswer1;
        falseAnswer2 = afalseAnswer2;
        falseAnswer3 = afalseAnswer3;
        description = adescription;

    }

    public AcronymsVm() {

    }

}