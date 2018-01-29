package com.udl.tfg.sposapp.utils;


import com.udl.tfg.sposapp.models.Session;
import com.udl.tfg.sposapp.repositories.SessionRepository;

import java.io.File;

public class RunExecutionThread extends Thread {

    private SessionRepository sessionRepository;
    private ExecutionManager executionManager;
    private OCAManager ocaManager;
    private SSHManager sshManager;
    private Session session;

    private String sshStorageFolder;

    private String vmIP;

    private String email;
    private String id;

    public RunExecutionThread(String email, String id,
                              ExecutionManager executionManager, OCAManager ocaManager,
                              SSHManager sshManager, String sshStorageFolder) {
        //this.sessionRepository = sessionRepository;
        this.executionManager = executionManager;
        this.ocaManager = ocaManager;
        this.sshManager = sshManager;
        //this.session = session;
        this.sshStorageFolder = sshStorageFolder;
        this.vmIP = "";
        this.email = email;
        this.id = id;
    }

    public void run() {
        try {
            if(id.equals("2SFVSC-model")){
                vmIP = "";
                System.out.println("ID:" + id);
            }

            else if (id.equals("DASC-model-stochastic"))
                vmIP = "";
            else if (id.equals("DASC-model-deterministic"))
                vmIP = "";
            else if (id.equals("ODFP-deterministic"))
                vmIP = "";
            else if (id.equals("ODFP-multistage"))
                vmIP = "";
            else if (id.equals("ODFP-multihorizon"))
                vmIP = "";
            else if (id.equals("chiara-model"))
                vmIP = "";
            else if (id.equals("sam-model-deterministic"))
                vmIP = "";
            else if (id.equals("sam-model-gt"))
                vmIP = "";
            else if (id.equals("category-cloud-GP"))
                vmIP = "";


        } catch (Exception e) {

        }
    }

}
