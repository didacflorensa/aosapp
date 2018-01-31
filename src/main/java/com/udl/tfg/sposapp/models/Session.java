package com.udl.tfg.sposapp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.security.SecureRandom;

@Entity
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @NotBlank(message = "You must provide a valid email address")
    @Email
    private String email;

    @NotBlank(message = "You must provide a execution Id")
    @Email
    private String executionId;

    @NotNull(message = "You must choose a solution type")
    @Enumerated(EnumType.STRING)
    private SolutionType type;

    @NotNull(message = "A maximum duration is required. -1 for optimal execution.")
    private int maximumDuration;

    @ManyToOne
    @RestResource(exported = false)
    private VirtualMachine vmConfig;

    @ManyToOne(cascade = {CascadeType.ALL})
    @RestResource(exported = false)
    private Parameters info;

    @OneToOne
    private Result results;

    @Nullable
    private String IP;

    @JsonIgnore
    private String key = "";

    @JsonIgnore
    private boolean vmDestroyed = false;

    private String vmId;


    public long getId() {
        return Id;
    }

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

    public String getVmId() {
        return vmId;
    }

    public void setVmId (String vmId) {
        this.vmId = vmId;
    }

    public SolutionType getType() {
        return type;
    }

    public void setType(SolutionType type) {
        this.type = type;
    }

    public VirtualMachine getVmConfig() {
        return vmConfig;
    }

    public void setVmConfig(VirtualMachine vmConfig) {
        this.vmConfig = vmConfig;
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
    }

    @Nullable
    public String getIP() {
        return IP;
    }

    public void setIP(@Nullable String IP) {
        this.IP = IP;
    }

    public String getKey() {
        return key;
    }

    public boolean isVmDestroyed() {
        return vmDestroyed;
    }

    public void setVmDestroyed(boolean vmDestroyed) {
        this.vmDestroyed = vmDestroyed;
    }

    public void generateKey(){
        String AB = "123456789ABCDEFGHIJKLMNOPKRSTUVWYZabcdefghijklmnopkrstuvwyz";
        SecureRandom rnd = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++){
            sb.append(AB.charAt(rnd.nextInt(AB.length())));
        }
        this.key = sb.toString();
    }
}
