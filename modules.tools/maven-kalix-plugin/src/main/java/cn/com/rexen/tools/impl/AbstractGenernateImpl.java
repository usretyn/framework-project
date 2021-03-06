package cn.com.rexen.tools.impl;

import cn.com.rexen.core.util.Assert;
import cn.com.rexen.tools.Util;
import cn.com.rexen.tools.api.IGenerate;
import org.apache.maven.plugin.MojoExecutionException;
import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.compiler.STException;

import java.io.File;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by sunlf on 2015/9/18.
 */
public abstract class AbstractGenernateImpl implements IGenerate {
    public final static String encoding = "UTF-8";
    public final static String JAVA_SOURCE_PATH = "\\src\\main\\java\\";
    public final static String RESOURCES_SOURCE_PATH = "src\\main\\resources";
    public final static String JS_SOURCE_PATH = "src\\main\\";
    //处理java类的map
    public Map<String, String> fileMap = new HashMap<>();
    //包名称
    protected String packageName;
    //bean名称，要求首字母大写
    protected String beanName;
    //bean小写名称
    protected String pomName;
    //项目名称
    protected String projectName;
    //父模块名称
    protected String parentName;
    //目标版本名称
    protected String versionName;

    protected String parentPackageName;

    protected Map<File, File> files;
    protected File inputDir, outputDir;
    //由超类实例化，分别为api，entities等
    protected String moduleName;
    //模块中文名称
    protected String module_Name;
    //extjs类前缀
    protected String extjsPrefix;

    protected Map<String, String> attributes;

    public AbstractGenernateImpl(Map<String, String> attributes, File inputDir, File outputDir, String moduleName) {
        this.attributes = attributes;
        this.inputDir = inputDir;
        beanName = attributes.get("beanName");
        Assert.notNull(beanName);
        packageName = attributes.get("packageName");
        Assert.notNull(packageName);
        pomName = attributes.get("pomName");
        Assert.notNull(pomName);
        projectName = attributes.get("projectName");
        Assert.notNull(projectName);
        parentName = attributes.get("parentName");
        Assert.notNull(parentName);
        versionName = attributes.get("versionName");
        Assert.notNull(versionName);
        parentPackageName = attributes.get("parentPackageName");
        Assert.notNull(parentPackageName);
        module_Name = attributes.get("module_Name");
        Assert.notNull(module_Name);
        extjsPrefix = attributes.get("extjsPrefix");
        Assert.notNull(extjsPrefix);

        File target = new File(outputDir.getAbsolutePath() + "\\" + pomName + "-" + moduleName);
        if (!target.exists())
            target.mkdirs();
        this.outputDir = target;
        this.moduleName = moduleName;

    }

    @Override
    public void genJavaSource() throws MojoExecutionException {
        //处理api模板
        Map<File, File> apiFiles = new LinkedHashMap<File, File>();
        // looks like maven may change empty String to null?
        Assert.notNull(moduleName);
        findFiles(apiFiles, new File(inputDir.getAbsolutePath() + "//" + moduleName), outputDir);
        for (Map.Entry<File, File> fileEntry : apiFiles.entrySet()) {
            File inputFile = fileEntry.getKey();
            File outputFile = fileEntry.getValue();
            String input = Util.readFile(inputFile, encoding);
            ST stringTemplate;
            try {
                stringTemplate = new ST(input);
                if (attributes != null) {
                    for (Map.Entry<String, String> attrEntry : attributes.entrySet()) {
                        stringTemplate.add(attrEntry.getKey(), attrEntry.getValue());
                    }
                }
                String output = stringTemplate.render();
                Util.writeFile(outputFile, encoding, output);
            } catch (STException e) {
                throw new MojoExecutionException("Problem when trying to process input template '"
                        + inputFile.getAbsolutePath() + "': " + e.getMessage(), e);
            }
        }
    }

    //递归确定模板文件以及对应的目标目录文件
    private void findFiles(Map<File, File> result, File inputDir,
                             File outputDir) {
        CharSequence javaChar = "java";
        CharSequence resourceChar = "xml";
        CharSequence jsChar = "js";
        for (File f : inputDir.listFiles()) {
            String name = f.getName();
            if (f.isDirectory()) {
                findFiles(result, f, new File(outputDir, name));
            } else {
                name = name.substring(0, name.length() - Util.inputSuffix.length());
                String fileName = fileMap.get(name);
                //判断是否为java文件
                if (fileName != null) {
                    //处理java类型的文件
                    if (fileName.contains(javaChar)) {
                        File pd = new File(this.outputDir, JAVA_SOURCE_PATH + packageName.replaceAll("\\.", "/"));
                        File javaFile = new File(pd, fileName);
                        result.put(f, javaFile);
                    }
                    //处理资源类型的文件
                    else if (fileName.contains(resourceChar)) {
                        File pd = new File(this.outputDir, RESOURCES_SOURCE_PATH);
                        File resourceFile = new File(pd, fileName);
                        result.put(f, resourceFile);
                    }
                    //处理资源类型的文件
                    else if (fileName.contains(jsChar)) {
                        //js输出路径
                        File pd = new File(this.outputDir, JS_SOURCE_PATH + "webapp\\" + projectName.toLowerCase() + "\\" + pomName);
                        File jsFile = new File(pd, fileName);
                        result.put(f, jsFile);
                    }

                } else {
                    if (!outputDir.exists()) {
                        outputDir.mkdirs();
                    }
                    result.put(f, new File(outputDir, name));
                }

            }
        }
    }
}
