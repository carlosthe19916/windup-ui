import { ApplicationIssues } from "api/models";

export let MOCK_ISSUES: ApplicationIssues[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const app1: ApplicationIssues = {
    application: { id: 1, name: "AdministracionEfectivo.ear" },
    issues: [
      {
        name: "Hibernate embedded library",
        category: "mandatory",
        levelOfEffort: "Complex change with documented solution",
        incident: {
          storyPoints: 3,
          files: [
            {
              name: "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-validator-4.1.0.Final.jar",
              incidentsFound: 1,
            },
            {
              name: "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-commons-annotations-4.0.1.Final.jar",
              incidentsFound: 1,
            },
            {
              name: "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-jpa-2.0-api-1.0.1.Final.jar",
              incidentsFound: 1,
            },
          ],
          hint: {
            description: `
The application has a Hibernate library embedded.
Red Hat JBoss EAP includes Hibernate as a module with a version that has been tested and supported by Red Hat.
There are two options for using the Hibernate library:


  1. Keep it embedded as it is now. This approach is low effort but the application will not use a tested and supported library.
  2. Switch to use the Hibernate library in the EAP module. This will require effort to remove the embedded library and configure the application to use the module's library but then the application will rely on a tested and supported version of the Hibernate library.

In the links below there are the instructions to enable alternative versions for both EAP 6 and 7. 
              `,
            links: [
              {
                title: "Red Hat JBoss EAP: Component Details",
                href: "https://access.redhat.com/articles/112673",
              },
              {
                title:
                  "Red Hat JBoss EAP 6: Hibernate and JPA Migration Changes",
                href: "https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/migration_guide/#sect-Hibernate_and_JPA_Changes",
              },
              {
                title:
                  "Red Hat JBoss EAP 6: Hibernate and JPA Migration Changes",
                href: "https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/migration_guide/application_migration_changes#hibernate_and_jpa_migration_changes",
              },
            ],
          },
          rule: {
            name: "embedded-framework-libraries-02000",
            sourceTechnology: [{ id: "weblogic" }],
            targetTechnology: [
              { id: "eap", versionRange: "[6,8)" },
              { id: "java-ee", versionRange: "[6,)" },
            ],
            content: `
<rule id="embedded-framework-libraries-02000" xmlns="http://windup.jboss.org/schema/jboss-ruleset">
    <when>
        <graph-query discriminator="JarArchiveModel">
            <property name="fileName" searchType="regex">.*hibernate.*\\.jar$</property>
        </graph-query>
    </when>
    <perform>
        <classification category-id="mandatory" effort="3" title="Hibernate embedded library">
            <description>
                The application has a Hibernate library embedded.
                Red Hat JBoss EAP includes Hibernate as a module with a version that has been tested and supported by Red Hat.
                There are two options for using the Hibernate library:

                1. Keep it embedded as it is now. This approach is low effort but the application will not use a tested and supported library.
                2. Switch to use the Hibernate library in the EAP module. This will require effort to remove the embedded library and configure the application to use the module's library but then the application will rely on a tested and supported version of the Hibernate library.

                In the links below there are the instructions to enable alternative versions for both EAP 6 and 7.
            </description>
            <link href="https://access.redhat.com/articles/112673" title="Red Hat JBoss EAP: Component Details"/>
            <link href="https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/migration_guide/#sect-Hibernate_and_JPA_Changes" title="Red Hat JBoss EAP 6: Hibernate and JPA Migration Changes"/>
            <link href="https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/migration_guide/application_migration_changes#hibernate_and_jpa_migration_changes" title="Red Hat JBoss EAP 7: Hibernate and JPA Migration Changes"/>
        </classification>
        <technology-tag level="INFORMATIONAL">Hibernate</technology-tag>
    </perform>
</rule>
              `,
          },
        },
      },
      {
        name: "Call of JNDI lookup",
        category: "mandatory",
        levelOfEffort: "Trivial change or 1-1 library swap",
        incident: {
          storyPoints: 1,
          files: [
            {
              name: "mx.com.bcm.banamex.ae.negocio.design.ServiceLocator",
              incidentsFound: 1,
              content: `
package mx.com.bcm.banamex.ae.negocio.design;

import java.util.Hashtable;
import java.util.Map;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;

public class ServiceLocator {
  private InitialContext context;
  private static Map<String, Object> service = new Hashtable();
  private static ServiceLocator me = new ServiceLocator();

  public static ServiceLocator getInstance() {
      return me;
  }

  public Class remoteloockUp(String jndiName, Class a) {
      Object obje = this.loockUp(jndiName);
      return (Class)PortableRemoteObject.narrow(obje, a);
  }

  private Hashtable<Object, Object> getConnection() {
      Hashtable<Object, Object> properties = new Hashtable();
      properties.put("java.naming.factory.initial", "com.ibm.websphere.naming.WsnInitialContextFactory");
      properties.put("java.naming.provider.url", "iiop://localhost:2809");
      return properties;
  }

  public Object loockUp(String jndiName) {
      Object obj = null;
      Hashtable<Object, Object> properties = this.getConnection();
      if (service.containsKey(jndiName)) {
        return service.get(jndiName);
      } else {
        try {
            this.context = new InitialContext(properties);
            obj = this.context.lookup(jndiName);
        } catch (NamingException var5) {
            System.out.println("Naming Exception occurred :");
            var5.printStackTrace();
        }

        service.put(jndiName, obj);
        return obj;
      }
  }
}
              `,
              comment: {
                line: 37,
                title: "Proprietary InitialContext initialization",
                content: `
  In JBoss EAP, the \`InitialContext\` should be instantiated with no arguments. Once an instance is constructed, look up the service using portable JNDI lookup syntax. Ensure also that in case system properties for \`InitialContext\` are provided, they do not need to be changed for the JBoss EAP.

  \`\`\`java
  InitialContext context = new InitialContext();
  Service service = (Service) context.lookup( "java:app/service/" + ServiceImpl.class.getSimpleName() );
  \`\`\`
                `,
                links: [
                  {
                    title:
                      "Migrate Applications From Other Platforms to Use Portable JNDI Syntax in Red Hat JBoss Enterprise Application Platform",
                    href: "https://access.redhat.com/articles/1496973",
                  },
                ],
              },
            },
          ],
          hint: {
            description: `
This method lookups an object using a JNDI String. During the migration process, some entity JNDI bindings may change.
Ensure that the JNDI Name does not need to change for JBoss EAP.

*For Example:*

\`\`\`java
(ConnectionFactory)initialContext.lookup("weblogic.jms.ConnectionFactory");
\`\`\`

*should become:*

\`\`\`java
(ConnectionFactory)initialContext.lookup("/ConnectionFactory");
\`\`\`
            `,
            links: [
              {
                title: "JNDI Changes",
                href: "https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/migration_guide/#sect-JNDI_Changes",
              },
              {
                title: "JBoss EAP 6 - JNDI Reference",
                href: "https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/development_guide/#chap-Remote_JNDI_Lookup",
              },
            ],
          },
          rule: {
            name: "environment-dependent-calls-02000",
            content: `
<rule id="environment-dependent-calls-02000" xmlns="http://windup.jboss.org/schema/jboss-ruleset">
  <when>
      <javaclass as="default" references="javax.naming.Context.lookup{*}">
          <location>METHOD_CALL</location>
      </javaclass>
  </when>
  <perform>
      <iteration>
          <hint category-id="mandatory" effort="1" title="Call of JNDI lookup">
              <message>
                <![CDATA[
                This method lookups an object using a JNDI String. During the migration process, some entity JNDI bindings may change.
                Ensure that the JNDI Name does not need to change for JBoss EAP.

                *For Example:*

                \`\`\`java
                (ConnectionFactory)initialContext.lookup("weblogic.jms.ConnectionFactory");
                \`\`\`

                *should become:*

                \`\`\`java
                (ConnectionFactory)initialContext.lookup("/ConnectionFactory");
                \`\`\`
                ]]>
              </message>
              <link href="https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/development_guide/#chap-Remote_JNDI_Lookup" title="JBoss EAP 6 - JNDI Reference"/>
              <link href="https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/6.4/html-single/migration_guide/#sect-JNDI_Changes" title="JNDI Changes"/>
              <tag>jndi</tag>
          </hint>
      </iteration>
  </perform>
</rule>
            `,
          },
        },
      },
    ],
  };

  MOCK_ISSUES = [app1];
}
