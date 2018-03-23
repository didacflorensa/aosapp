package com.udl.tfg.sposapp.controllers;

import com.udl.tfg.sposapp.models.DataFile;
import com.udl.tfg.sposapp.models.Mail;
import com.udl.tfg.sposapp.models.Session;
import com.udl.tfg.sposapp.repositories.DataFileRepository;
import com.udl.tfg.sposapp.repositories.ParametersRepository;
import com.udl.tfg.sposapp.repositories.SessionRepository;
import com.udl.tfg.sposapp.utils.*;
import org.hibernate.validator.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

@RepositoryRestController
public class SessionController {

    private static final String MOD_MAIN_METHOD = "main {\n" +
            "    var before = new Date();\n" +
            "\tvar temp = before.getTime();\n" +
            "\t\tthisOplModel.generate();\n" +
            "    \tif (cplex.solve()) {\n" +
            "    \t\t\twriteln(\"+-+-+-+\");\n" +
            "    \t\t\twriteln(\"-- Objective = \", cplex.getObjValue());\n" +
            "    \t\t\twriteln(\"-- Solution: \");\n" +
            " \t\t\t\twriteln(thisOplModel.printSolution());\n" +
            "                var after = new Date();\n" +
            "\t\t\t\twriteln(\"-- Solving time ~= \",after.getTime()-temp, \"ms\");   \t\n" +
            "        }else{\n" +
            "        \t\twriteln(\"ERROR - No Solution for this model!\");\n" +
            "        }\n" +
            "    writeln(\"+-+-+-+\"); \n" +
            "}";

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private DataFileRepository dataFileRepository;

    @Autowired
    private ParametersRepository parametersRepository;

    @Autowired
    private SSHManager sshManager;

    @Autowired
    private ResultsParser resultsParser;

    @Autowired
    private ExecutionManager executionManager;

    @Autowired
    private OCAManager ocaManager;

    @Autowired
    ServletContext context;

    @Value("${localStorageFolder}") private String localStorageFolder;
    @Value("${sshStorageFolder}")   private String sshStorageFolder;


    @RequestMapping(value = "/session", method = RequestMethod.POST)
    public @ResponseBody HttpEntity<HashMap<String, String>> createSession(HttpServletRequest request, @Valid @RequestBody Session session) throws Exception {

        if (session != null) {
            System.out.println("Generating session key...");
            session.generateKey();
            session.setExecutionState("P");
            sessionRepository.save(session);
            System.out.println("Id: " + session.getId());
            System.out.println("key: " + session.getKey());
            return GeneratePostResponse(request, session);
        } else {
            throw new NullPointerException();
        }

    }

    private HttpEntity<HashMap<String, String>> GeneratePostResponse(HttpServletRequest request, @Valid @RequestBody Session session) {
        HashMap<String, String> response = new HashMap<>();
        response.put("id", String.valueOf(session.getId()));
        response.put("key", session.getKey());
        return ResponseEntity.created(URI.create(request.getRequestURL() + "/" + session.getId())).body(response);
    }


    @RequestMapping(value = "/session/uploadAndExecution", method = RequestMethod.POST)
    public @ResponseBody HttpEntity<Void> uploadFile (MultipartHttpServletRequest request,
                                                        @RequestParam(value = "id") String id,
                                                        @RequestParam(value = "idExec") String idExec,
                                                        @RequestParam(value = "email") String email)
    {
        Session session = sessionRepository.findOne(Long.parseLong(id));

        if (session != null) {
            session.setEmail(email);
            session.setExecutionId(idExec);

            System.out.println("Starting uploading file");
            System.out.println("Email: " + email);
            System.out.println("Id: " + idExec);
            System.out.println("Receiving files");

            List<DataFile> dataFiles = null;
            try {
                dataFiles = ParseFiles(request, session);
            } catch (IOException e) {
                e.printStackTrace();
            }

            System.out.println(dataFiles);
            session.setFiles(dataFiles);
            runExecution(session);//TODO Eliminate this comment
            System.out.println("End uploading file and run execution");

            //Sendinf Mail
            //System.out.println("Sending mail");
            //Mail mail = new Mail ();
            //mail.sendEmail("dflorensa@altersoftware.es", "aosApp", "Testing app email");

            //System.out.println("email sended");


            return ResponseEntity.ok().build();
        }
        else {
            System.out.println("Session not found");
            return ResponseEntity.notFound().build();
        }

    }

    @RequestMapping(value = "/session/{id}", method = RequestMethod.GET)
    public @ResponseBody Session getSession(@PathVariable String id, @RequestParam(value = "key", required = true) String key) throws Exception {
        Session session = sessionRepository.findOne(Long.parseLong(id));
        if (session == null)
            throw new NullPointerException();

        if (session.getKey().equals(key)) {
            return session;
        } else {
            throw new InvalidKeyException();
        }
    }


    @RequestMapping(value = "/session/{id}/GetFileResults", method = RequestMethod.GET)
    public @ResponseBody String getFileResults (@PathVariable String id) throws Exception {
        Session session = sessionRepository.findOne(Long.parseLong(id));
        StringBuilder results;
        String error_results = "Loading input file... Please wait.";

        if(session != null){
            System.out.println("state: " + session.getExecutionState());
            results = executionManager.downloadFile(session);
            System.out.println("results: " + results);
            if(results.equals("Error") || results.equals(""))
            {
                return error_results;
            }

        } else {
            System.out.println("Session not found");
            return "Error with File";
        }

        return results.toString();
    }

    @RequestMapping(value = "/session/{id}/DownloadResults", method = RequestMethod.GET)
    public @ResponseBody void downloadResults(HttpServletResponse response, @PathVariable String id) throws Exception {
        System.out.println("Controller downloadresults");
        Session session = sessionRepository.findOne(Long.parseLong(id));
        System.out.println("ID: " + id);
        File resuls_zip = null;
        MultipartHttpServletRequest request = null;

        if (session != null) {
            resuls_zip = executionManager.downloadResults(session);

            if (resuls_zip.exists()) {
                String mimeType = context.getMimeType(resuls_zip.getPath());

                if (mimeType == null) {
                    mimeType = "application/octet-stream";
                }

                response.setContentType(mimeType);
                response.addHeader("Content-Disposition", "attachment; filename=" + resuls_zip.getName());
                response.setContentLength((int) resuls_zip.length());

                OutputStream os = response.getOutputStream();
                FileInputStream fis = new FileInputStream(resuls_zip);
                byte[] buffer = new byte[4096];
                int b = -1;

                while ((b = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, b);
                }

                fis.close();
                os.close();
            } else {
                System.out.println("Requested " + resuls_zip + " file not found!!");
            }

        } else {
            System.out.println("Session not found");
        }
    }


    private void runExecution (Session session) {

        try {
            org.opennebula.client.vm.VirtualMachine vm = ocaManager.createNewVM(session.getVmConfig());
            session.setVmId(vm.getId());
            session.setIP(ocaManager.GetIP(vm));
            sessionRepository.save(session);

            new RunExecutionThread(session, sessionRepository, executionManager, ocaManager, sshManager, sshStorageFolder, "execution").start();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private List<DataFile> ParseFiles(MultipartHttpServletRequest request, Session session) throws IOException {
        Iterator<String> itr =  request.getFileNames();
        List<DataFile> dataFiles = new ArrayList<>();
        MultipartFile mpf;

        //CleanSessionPath(session);

        while(itr.hasNext()){
            mpf = request.getFile(itr.next());

            DataFile df = new DataFile();

            String name = "template";
            String path = localStorageFolder + "/" + name +".zip";
            df.setPath(path);
            df.setName(name);
            df.setExtension(mpf.getOriginalFilename().split("\\.")[1]);

            byte[] content = mpf.getBytes();
            saveFile(df.getPath(), content);

            dataFileRepository.save(df);
            dataFiles.add(df);
        }

        return dataFiles;
    }

    private File saveFile(String path, byte[] bytes) throws IOException {
        Path storagePath = Paths.get(path);

        if (!Files.exists(storagePath.getParent())) {
            Files.createDirectories(storagePath.getParent());
        }

        File infoFile = storagePath.toFile();
        if (!infoFile.exists()) {
            infoFile.createNewFile();
        }

        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(infoFile));
        bufferedOutputStream.write(bytes);
        bufferedOutputStream.flush();
        bufferedOutputStream.close();
        return infoFile;
    }

}
