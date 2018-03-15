package com.udl.tfg.sposapp.utils;

import com.jcraft.jsch.*;
import com.udl.tfg.sposapp.models.DataFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.IOUtils;
import sun.nio.ch.IOUtil;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Hashtable;
import java.util.Properties;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import java.util.regex.Pattern;

@Service
public class SSHManager {

    @Value("${sshIdentityFile}")    private String sshIdentityFile;
    //@Value("${sshIdentityPass}")    private String sshIdentityPass;
    @Value("${sshKnownHostsFile}")  private String sshKnownHostsFile;
    @Value("${localStorageFolder}") private String localStorageFolder;
    @Value("${sshStorageFolder}")   private String sshStorageFolder;

    private JSch jSch = null;

    public void Initialize() throws JSchException {
        if (jSch != null)
            throw new IllegalStateException("SSHUtils has been already initialized");

        jSch = new JSch();
        //jSch.addIdentity(sshIdentityFile, sshIdentityPass);
        jSch.addIdentity(sshIdentityFile);
        jSch.setKnownHosts(sshKnownHostsFile);
        System.out.println("JSCH Initialized");
    }

    public Session OpenSession(String address, int port, String username) throws Exception {
        System.out.println("openSession");
        return OpenSession(address, port, username, null);
    }

    public Session OpenSession(String address, int port, String username, Hashtable<Object, Object> properties) throws Exception {
        Session session;
        if (jSch == null)
            throw new NullPointerException("SSHUtils has not been initialized.");

        session = jSch.getSession(username, address, port);
        System.out.println("openSession 2");
        try {
            Properties config = new Properties();
            if (properties != null)
                config.putAll(properties);
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.setConfig(config);
            System.out.println("Connect");
            session.connect();
            System.out.println("Session opened in " + address + " as " + username);
            return session;
        } catch (Exception e){
            throw new Exception(e);
        }
    }


    public void CleanPath(Session session, String destPath) throws Exception {
        try {
            ExecuteCommand(session, "rm -rf " + destPath.replace('\\', '/'));
        } catch (Exception e) {
            throw new Exception(e);
        }
    }


    public File DownloadResults(Session session, String destPath) throws Exception {
        ChannelSftp channelSftp = (ChannelSftp) getChannel(session, "sftp");
        channelSftp.connect();

        System.out.println("Get downlaod zip");
        channelSftp.cd(destPath);
        InputStream in = channelSftp.get("results.zip");
        File ZipPackage = ParseFile(in);

        return ZipPackage;
    }

    private File ParseFile(InputStream stream) {
        MultipartFile mpf;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        DataFile df = new DataFile();
        File file = null;

        byte[] content;
        try {
            int reads = stream.read();
            while (reads != -1)
            {
                out.write(reads);
                reads = stream.read();
            }
            content = out.toByteArray();
            String name = "download";
            String path = localStorageFolder + "/" + name +".zip";
            df.setPath(path);
            df.setName(name);
            file = saveFile(path, content);


        } catch (IOException e) {
            e.printStackTrace();
        }

        return file;

    }

    private File saveFile(String path, byte[] bytes) throws IOException {


        Path storagePath = Paths.get(path);

        if (!Files.exists(storagePath.getParent())) {
            Files.createDirectories(storagePath.getParent());
        }

        File file = storagePath.toFile();
        if (!file.exists()) {
            file.createNewFile();
        }

        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(file));
        bufferedOutputStream.write(bytes);
        bufferedOutputStream.flush();
        bufferedOutputStream.close();

        return file;
    }


    public StringBuilder GetFile(Session session, String destPath) throws Exception {
        StringBuilder stringBuilder = new StringBuilder();
        try {

            ChannelSftp channelSftp = (ChannelSftp) getChannel(session, "sftp");
            channelSftp.connect();

            System.out.println("Get FILE LOG");
            channelSftp.cd(destPath);
            System.out.println("cd");

            InputStream in = null;

            try {
                in = channelSftp.get("*.log");
            }catch (Exception e){
                return new StringBuilder("Loading input files... Please wait");
            }


            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            String line = "";

            while ((line = reader.readLine()) != null)
                stringBuilder.append(line + " <br> ");

            System.out.println("FINAL FILE LOG");

            return stringBuilder;
        }catch (Exception e) {
            return new StringBuilder("Error");
        }
    }

    public void SendFile(Session session, String sourcePath, String destPath) throws Exception {
        DataFile file = new DataFile();
        try {
            ChannelSftp channelSftp = (ChannelSftp) getChannel(session, "sftp");
            channelSftp.connect();

            System.out.println(sourcePath);
            System.out.println(destPath);
            System.out.println("---------");
            File sourceFile = new File(sourcePath);
            File destFile = new File(destPath);
            SftpATTRS attrs=null;

            if (!sourceFile.exists())
                throw new FileNotFoundException("Invalid source path.");

            //Check if the user directory exist
            try {
                attrs = channelSftp.stat(destPath);
            } catch (Exception e) {
                System.out.println("Not found destpath:" + destPath);
            }

            //If not exist, create the directory
            if (attrs == null) {
                channelSftp.mkdir(destPath);
            }

            channelSftp.cd(destFile.getPath());
            channelSftp.put(new FileInputStream(sourceFile), sourceFile.getName(), ChannelSftp.OVERWRITE);
            channelSftp.disconnect();
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public String ExecuteCommand(Session session, String command) throws Exception {
        try {
            ChannelExec channelExec = (ChannelExec) getChannel(session, "exec");
            System.out.println("Running command: " + command);
            BufferedReader in = new BufferedReader(new InputStreamReader(channelExec.getInputStream()));
            //channelExec.setCommand(". ~/.bashrc && " + command);
            channelExec.setCommand(command);
            channelExec.setErrStream(System.err);
            channelExec.connect();

            String output = "";
            String msg;
            System.out.println("ExecuteCommand: ");
            /*while((msg = in.readLine()) != null){
                System.out.println(msg);
                output += msg;
            }*/

            String output2="execution OK!";
            channelExec.disconnect();
            return output2;
        } catch (Exception e){
            session.disconnect();
            throw new Exception(e);
        }
    }

    private Channel getChannel(Session session, String channelType) throws Exception {
        if (session == null)
            throw new NullPointerException("You must open a new session before open any channel");
        Channel channel = session.openChannel(channelType);
        if (channel == null)
            throw new Exception("Channel type does not exist");
        return channel;
    }

}
