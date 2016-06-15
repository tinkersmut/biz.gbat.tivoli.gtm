/*
 *  file:    DSPLicenseAppBean.java
 *  created: Jul 9, 2012
 *  author:  Andrew Mahen
 */
package biz.gbat.tivoli.gtm.webclient.beans;

import java.rmi.RemoteException;

import psdi.mbo.MboRemote;
import psdi.util.MXException;
import psdi.webclient.system.beans.AppBean;
import psdi.webclient.system.controller.WebClientEvent;

/**
 * @author Andrew Mahen
 */
public class DSPLicenseAppBean extends AppBean {

  public void CREATEDSPLICENSE() throws RemoteException, MXException{
    WebClientEvent event = this.clientSession.getCurrentEvent();

    MboRemote mbo = getMbo();
    if (mbo != null) {
      mbo.sigOptionAccessAuthorized("INSERT");
    }

    insert();
  }
  
  /**
   * Creates a DSP-73 license
   * 
   * @return 1 when successfull
   * @throws RemoteException
   * @throws MXException
   */
  public int ADDDSP73() throws RemoteException, MXException {
    CREATEDSPLICENSE();
    MboRemote mbo = getMbo();
    if(mbo == null){
      return 0;
    }
    mbo.setValue("dspnum", 73);
    return 1;
  }

  /**
   * Creates a DSP-5 license
   * 
   * @return 1 when successfull
   * @throws MXException 
   * @throws RemoteException 
   */
  public int ADDDSP5() throws RemoteException, MXException {
    CREATEDSPLICENSE();
    MboRemote mbo = getMbo();
    if(mbo == null){
      return 0;
    }
    mbo.setValue("dspnum", 5);
    return 1;
  }
}
