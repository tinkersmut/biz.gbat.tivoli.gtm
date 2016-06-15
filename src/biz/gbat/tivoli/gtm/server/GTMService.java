package biz.gbat.tivoli.gtm.server;

import java.rmi.RemoteException;

import psdi.mbo.MboSetRemote;
import psdi.security.UserInfo;
import psdi.server.AppService;
import psdi.server.MXServer;
import psdi.util.MXException;


/**
 * Starts the Global Trade Management Service
 * @author Andrew Mahen
 *
 */
public class GTMService extends AppService {

  /**
   * 
   */
  private static final long serialVersionUID = 1L;

  /**
   * @throws RemoteException
   */
  public GTMService() throws RemoteException {
  }

  /**
   * @param mxServer
   * @throws RemoteException
   */
  public GTMService(MXServer mxServer) throws RemoteException {
    super(mxServer);
  }

}
