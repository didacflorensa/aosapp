package com.udl.tfg.sposapp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.security.SecureRandom;
import java.util.List;

@Entity
public class Session {

    @Id
    @NotBlank(message = "You must provide a valid email address")
    @Email
    private String email;

    private String executionId;

    @ManyToOne
    @RestResource(exported = false)
    private VirtualMachine vmConfig;

    @Nullable
    private String IP;

    @JsonIgnore
    private String key = "";

    @JsonIgnore
    private boolean vmDestroyed = false;

    private String vmId;

    @JsonIgnore
    @ElementCollection
    @OneToMany(cascade = {CascadeType.ALL})
    public List<DataFile> files;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public List<DataFile> getFiles() {
        return files;
    }

    public void setFiles(List<DataFile> files) {
        this.files = files;
    }

    /*Final AOSAPP*/


    public String getVmId() {
        return vmId;
    }

    public void setVmId (String vmId) {
        this.vmId = vmId;
    }

    public VirtualMachine getVmConfig() {
        return vmConfig;
    }

    public void setVmConfig(VirtualMachine vmConfig) {
        this.vmConfig = vmConfig;
    }

    /*public SolutionType getType() {
        return type;
    }

    public void setType(SolutionType type) {
        this.type = type;
    }



    public Parameters getInfo() {
        return info;
    }

    public void setInfo(Parameters info) {
        this.info = info;
    }

    public Result getResults() {
        return results;
    }

    public void setResults(Result results) {
        this.results = results;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getMaximumDuration() {
        return maximumDuration;
    }

    public void setMaximumDuration(int maximumDuration) {
        this.maximumDuration = maximumDuration;
    }

    public void setId(long id) {
        Id = id;
    }*/

    @Nullable
    public String getIP() {
        return IP;
    }

    public void setIP(@Nullable String IP) {
        this.IP = IP;
    }


}
