import { Rule, RuleGroup } from "api/models";

export let MOCK_RULES: RuleGroup;

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const rule1: Rule = {
    id: "rule-1",
    content: `<rule id="embedded-framework-libraries-02000" xmlns="http://windup.jboss.org/schema/jboss-ruleset">
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
    sourceTechnology: [{ id: "weblogic" }],
    targetTechnology: [
      { id: "eap", versionRange: "[6,8)" },
      { id: "java-ee", versionRange: "[6,)" },
    ],
  };

  const rule2: Rule = {
    id: "rule-2",
    content: `<rule id="environment-dependent-calls-02000" xmlns="http://windup.jboss.org/schema/jboss-ruleset">
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
    targetTechnology: [{ id: "camel3" }],
  };

  MOCK_RULES = {
    phase1: [rule1],
    phase2: [rule2],
  };
}
