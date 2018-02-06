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



            System.out.println("Thread");

            if(operation.equalsIgnoreCase("execution")) {
                System.out.println("Inside Run thread");

                ocaManager.WaitUntilCreatedV2(session.getVmId());

                System.out.println("Start execution Manager");

                sleep(60000);

                executionManager.uploadFile(session);

                System.out.println("Final execution Manager");

                //executionManager.launchExecution(session);

                ocaManager.WaitUntilFinalV2(session.getVmId());


                /*if(session.getExecutionId().equals("2SFVSC-model")){
                    vmIP = session.getIP();
                    System.out.println("ID:" + session.getExecutionId());
                    System.out.println("Ip:" + session.getIP());
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
                    vmIP = "";*/

            }





        } catch (Exception e) {

        }
    }

}
