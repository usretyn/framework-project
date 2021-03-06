\<?xml version="1.0" encoding="UTF-8"?>
\<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    \<modelVersion>4.0.0\</modelVersion>

    \<parent>
        \<groupId><packageName>\</groupId>
        \<artifactId><pomName>-parent\</artifactId>
        \<version><versionName>\</version>
    \</parent>

    \<artifactId><pomName>-web\</artifactId>
    \<packaging>bundle\</packaging>
    \<name><projectName> :: <beanName> - Web\</name>
    \<description><beanName> Web Service\</description>

    \<properties>
        \<project.build.sourceEncoding>UTF-8\</project.build.sourceEncoding>
        \<bundle.symbolicName><packageName>.web\</bundle.symbolicName>
        \<bundle.namespace>${bundle.symbolicName}\</bundle.namespace>
    \</properties>

    \<dependencies>
        \<dependency>
            \<groupId><packageName>\</groupId>
            \<artifactId><pomName>-api\</artifactId>
            \<version><versionName>\</version>
        \</dependency>
        \<dependency>
            \<groupId>cn.com.rexen.roffice.core.web\</groupId>
            \<artifactId>roffice-core-web\</artifactId>
            \<version><versionName>\</version>
        \</dependency>
    \</dependencies>

    \<build>
        \<plugins>

        \</plugins>
    \</build>

\</project>