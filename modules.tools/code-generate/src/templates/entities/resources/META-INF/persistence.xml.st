\<?xml version="1.0" encoding="UTF-8"?>
\<persistence xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             version="2.1" xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xsi:schemaLocation="
        http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_1.xsd
    ">
    \<persistence-unit transaction-type="JTA" name="<pomName>-cm">
        \<provider>org.hibernate.jpa.HibernatePersistenceProvider\</provider>
        \<jta-data-source>osgi:service/javax.sql.DataSource/(osgi.jndi.service.name=jdbc/ds)
        \</jta-data-source>
        \<class>cn.com.rexen.core.api.persistence.PersistentEntity\</class>
        \<class><packageName>.entities.<beanName>Bean\</class>
        \<properties>
            \<property name="hibernate.hbm2ddl.auto" value="update"/>
            \<property name="hibernate.archive.autodetection" value="class"/>
            \<property name="hibernate.id.new_generator_mappings" value="true"/>
            \<property name="hibernate.cache.use_second_level_cache" value="false"/>
            \<property name="hibernate.show_sql" value="true"/>
        \</properties>
    \</persistence-unit>
\</persistence>
