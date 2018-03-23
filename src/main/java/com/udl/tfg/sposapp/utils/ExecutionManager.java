package com.udl.tfg.sposapp.utils;
import com.udl.tfg.sposapp.models.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.util.zip.ZipOutputStream;

@Service
public class ExecutionManager {

    @Autowired
    private SSHManager sshManager;


    @Value("${scriptsFolder}")
    private String scriptsFolder;

    @Value("${storageNode}")
    private String storageNode;


    private com.jcraft.jsch.Session sshSession;


    /*
    * This functions is needed to create the user folder into the computing node.
    * Opens a ssh session and executes the user-register.sh
    */
    public void launchExecution(Session session) throws Exception {

        try {
            System.out.println(session.getIP());
            sshSession = sshManager.OpenSession(session.getIP(), 22, "root");
            String script = "ts " + scriptsFolder + "/launch.sh %1$s %2$s %3$s %4$s";
            sshManager.ExecuteCommand(sshSession, String.format(script, session.getEmail(), session.getId(), session.getExecutionId(), session.getKey()));
            sshSession.disconnect();
            sshSession = null;
        } catch (Exception e) {
            if (sshSession != null) sshSession.disconnect();
            throw new Exception(e);
        }

    }

    public void uploadFile(Session session) throws Exception {
        // Todo: Path of the HD has to be in settings and imported from there.
        try {
            System.out.println("Execution: " + session.getIP());
            sshSession = sshManager.OpenSession(session.getIP(), 22, "root");

            String destPath = "/media/aos/sessions/" + session.getEmail() + "/";
            String destPathSession = "/media/aos/sessions/" + session.getEmail() + "/" + session.getId() + "/";
            System.out.println(destPath);

            for (int i=0; i < session.getFiles().size(); i++){
                System.out.println(session.getFiles().get(i).getPath());
                File file = new File(session.getFiles().get(i).getPath());
                sshManager.SendFile(sshSession,file.getPath(), destPath, destPathSession);
            }

            sshSession.disconnect();
            sshSession = null;
        } catch (Exception e) {
            if (sshSession != null) sshSession.disconnect();
            throw new Exception(e);
        }

    }

    public StringBuilder downloadFile(Session session) throws Exception {
        StringBuilder results = new StringBuilder("");
        try {
            sshSession = sshManager.OpenSession(session.getIP(), 22, "root");
            String destPath = "/tmp/DASC/template/results/tmp/";

            results = sshManager.GetFile(sshSession, destPath);

            return results;

        }catch(Exception e){
            return results;
        }
    }

    public File downloadResults(Session session) throws Exception {
        try {
            sshSession = sshManager.OpenSession(storageNode, 22, "root");
            String destPath = "/media/aos/sessions/"+session.getEmail()+"/" + session.getId()+"/";
            File out_file = sshManager.DownloadResults(sshSession, destPath);
            return out_file;
        } catch(Exception e){
            return null;
        }
    }

}

/*

    public void LaunchExecution(Session session) throws Exception {
        try {
            sshSession = sshManager.OpenSession(session.getIP(), 22, "root");
            run(session,session.getInfo().getMethod().getMethod().name());
            sshSession.disconnect();
            sshSession = null;
        } catch (Exception e) {
            if (sshSession != null) sshSession.disconnect();
            throw new Exception(e);
        }
    }


    private void run (Session session, String solver) throws  Exception{
        String script;
        if (session.getInfo().getFiles().size() > 1){
            if (session.getInfo().getFiles().get(0).getExtension().equals(".dat")) {
                script = "ts " + scriptsFolder + "/"  +solver+ "/" + solver + "-pyomo %1$s %2$s %3$s %4$s %5$s %6$s %7$s";
            } else {
                script = "ts " + scriptsFolder + "/"  +solver+  "/" + solver + "-deco %1$s %2$s %3$s %4$s %5$s %6$s %7$s";
            }
        } else {
            if (session.getInfo().getFiles().get(0).getExtension().equals("mps")) {
                script = "ts " + scriptsFolder + "/"  +solver+ "/" + solver + "-mps %1$s %2$s %3$s %4$s %5$s %6$s";
            } else {
                script = "ts " + scriptsFolder + "/"  +solver+  "/" + solver + "-lp %1$s %2$s %3$s %4$s %5$s %6$s";
            }
        }
        sshManager.ExecuteCommand(sshSession, String.format(script, session.getId(), session.getKey(), session.getEmail(), session.getInfo().getFiles().get(0).getName(), session.getMaximumDuration(), computingNode));
    }

}
**/