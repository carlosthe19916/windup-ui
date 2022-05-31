import { AppFile } from "api/models";

export let MOCK_APP_FILES: AppFile[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const file1: AppFile = {
    id: "1",
    filename:
      "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-validator-4.1.0.Final.jar",
    hints: [
      {
        line: 37,
        rule: { id: "embedded-framework-libraries-02000" },
      },
    ],
  };
  const file2: AppFile = {
    id: "2",
    filename:
      "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-validator-4.1.0.Final.jar",
    hints: [
      {
        line: 37,
        rule: { id: "embedded-framework-libraries-02000" },
      },
    ],
  };
  const file3: AppFile = {
    id: "3",
    filename:
      "AdministracionEfectivo.ear/AdministracionEfectivo-web-0.0.1-SNAPSHOT.war/WEB-INF/lib/hibernate-commons-annotations-4.0.1.Final.jar",
    hints: [
      {
        line: 37,
        rule: { id: "embedded-framework-libraries-02000" },
      },
    ],
  };
  const file4: AppFile = {
    id: "4",
    filename: "mx.com.bcm.banamex.ae.negocio.design.ServiceLocator",
    fileContent: `package mx.com.bcm.banamex.ae.negocio.design;

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
    hints: [
      {
        line: 37,
        rule: { id: "environment-dependent-calls-02000" },
      },
    ],
  };

  MOCK_APP_FILES = [file1, file2, file3, file4];
}
