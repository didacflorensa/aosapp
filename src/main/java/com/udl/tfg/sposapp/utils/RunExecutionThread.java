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

    private String localStorageFolder;
    private String sshStorageFolder;

    private String vmIP;

    public RunExecutionThread(Session session, SessionRepository sessionRepository,
                              ExecutionManager executionManager, OCAManager ocaManager,
                              SSHManager sshManager, String localStorageFolder, String sshStorageFolder, String vmIP) {
        this.sessionRepository = sessionRepository;
        this.executionManager = executionManager;
        this.ocaManager = ocaManager;
        this.sshManager = sshManager;
        this.session = session;
        this.localStorageFolder = localStorageFolder;
        this.sshStorageFolder = sshStorageFolder;
        this.vmIP = vmIP;
    }

    public void run() {
        try {
            System.out.println("Starting execution thread");
            System.out.println("1");
            System.out.println("5");
            System.out.println("Cleaned");
            ocaManager.WaitUntilCreated(vmIP);
            Thread.sleep(60000);
            System.out.println("Created");
            session.setIP(vmIP);
            sessionRepository.save(session);
            System.out.println("Saved IP");
            SendFiles(session);
            System.out.println("Sent files");
            executionManager.LaunchExecution(session);
        } catch (Exception e) {
            System.out.println("Error launching execution: " + e.getMessage());
            sessionRepository.delete(session);
        }
    }

    private void SendFiles(Session session) throws Exception {
        com.jcraft.jsch.Session sshSession = null;
        try {
            sshSession = sshManager.OpenSession(session.getIP(), 22, "root");
            sshManager.CleanPath(sshSession, sshStorageFolder + "/" + String.valueOf(session.getId()));
            System.out.println("Cleaned remote path");
            for (int i=0; i < session.getInfo().getFiles().size(); i++){
                System.out.println("Send file origin path: " + session.getInfo().getFiles().get(i).getPath());
                File file = new File(session.getInfo().getFiles().get(i).getPath());
                sshManager.SendFile(sshSession, session.getId(), file);
                System.out.println("File remotely saved");
            }
            sshSession.disconnect();
        } catch (Exception e) {
            System.out.println("ERROR SENDING FILES " + e.getMessage());
            if (sshSession != null) sshSession.disconnect();
            throw new Exception(e);
        }
    }
}
