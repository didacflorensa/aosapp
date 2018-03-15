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
    private String operation;

    public RunExecutionThread(Session session, SessionRepository sessionRepository,
                              ExecutionManager executionManager, OCAManager ocaManager,
                              SSHManager sshManager, String sshStorageFolder, String operation) {
        this.sessionRepository = sessionRepository;
        this.executionManager = executionManager;
        this.ocaManager = ocaManager;
        this.sshManager = sshManager;
        this.session = session;
        this.sshStorageFolder = sshStorageFolder;
        this.vmIP = "";
        this.operation = operation;

    }

    public void run() {
        try {

            if(operation.equalsIgnoreCase("execution")) {

                ocaManager.WaitUntilCreatedV2(session.getVmId());

                sleep(60000);

                executionManager.uploadFile(session);

                executionManager.launchExecution(session);

                sleep(65000);

                session.setExecutionState("R");
                sessionRepository.save(session);

                ocaManager.WaitUntilFinalV2(session.getVmId());

                System.out.println("Fin de la ejecución");

                session.setExecutionState("F");
                sessionRepository.save(session);
            }

        } catch (Exception e) {

        }
    }

}
