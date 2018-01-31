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

    public RunExecutionThread(Session session, SessionRepository sessionRepository,
                              ExecutionManager executionManager, OCAManager ocaManager,
                              SSHManager sshManager, String sshStorageFolder) {
        this.sessionRepository = sessionRepository;
        this.executionManager = executionManager;
        this.ocaManager = ocaManager;
        this.sshManager = sshManager;
        this.session = session;
        this.sshStorageFolder = sshStorageFolder;
        this.vmIP = "";

    }

    public void run() {
        try {
            if(session.getExecutionId().equals("2SFVSC-model")){
                vmIP = "";
                System.out.println("ID:" + session.getExecutionId());
            }

            else if (session.getExecutionId().equals("DASC-model-stochastic"))
                vmIP = "";
            else if (session.getExecutionId().equals("DASC-model-deterministic"))
                vmIP = "";
            else if (session.getExecutionId().equals("ODFP-deterministic"))
                vmIP = "";
            else if (session.getExecutionId().equals("ODFP-multistage"))
                vmIP = "";
            else if (session.getExecutionId().equals("ODFP-multihorizon"))
                vmIP = "";
            else if (session.getExecutionId().equals("chiara-model"))
                vmIP = "";
            else if (session.getExecutionId().equals("sam-model-deterministic"))
                vmIP = "";
            else if (session.getExecutionId().equals("sam-model-gt"))
                vmIP = "";
            else if (session.getExecutionId().equals("category-cloud-GP"))
                vmIP = "";


        } catch (Exception e) {

        }
    }

}
