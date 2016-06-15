/*
 *  file:    DSPLicenseSet.java
 *  created: Jul 3, 2012
 *  author:  Andrew Mahen
 */
package biz.gbat.tivoli.gtm.mbos;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;


/**
 * Set of export DSP licenses
 * 
 * @author Andrew Mahen
 *
 */
public class DSPLicenseSet extends MboSet {

  /**
   * @param ms
   * @throws RemoteException
   */
  public DSPLicenseSet(MboServerInterface ms) throws RemoteException {
    super(ms);
  }

  /*
   * @see psdi.mbo.MboSet#getMboInstance(psdi.mbo.MboSet)
   */
  @Override
  protected Mbo getMboInstance(MboSet set) throws MXException, RemoteException {
    return new DSPLicense(set);
  }

}
