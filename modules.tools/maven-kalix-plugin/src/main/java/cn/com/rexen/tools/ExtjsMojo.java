package cn.com.rexen.tools;

import cn.com.rexen.tools.api.IGenerate;
import cn.com.rexen.tools.impl.*;
import com.thoughtworks.qdox.JavaDocBuilder;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;

import java.io.File;

/**
 * Created by sunlf on 2015/9/18.
 *
 * @goal extjs
 * @phase compile
 * @threadSafe
 */
public class ExtjsMojo extends AbstractBaseKalixMojo {

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        this.docBuilder = new JavaDocBuilder();
        for (String r : sources) {
            docBuilder.addSourceTree(new File(r));
        }
        // first, find input directory and files it contains
        if (!inputDir.exists()) {
            throw new MojoExecutionException("Input directory '" + inputDir.getAbsolutePath() + "' does not exist");
        }

        //create extjs code generate
        IGenerate extjsGenerate = new ExtjsGenerateImpl(attributes, inputDir, outputDir);
        extjsGenerate.genJavaSource();
    }
}
