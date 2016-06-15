/*
 *
 *  file:    DSPLicense.java
 *  created: Jul 3, 2012
 *  author:  Andrew Mahen
 */
package biz.gbat.tivoli.gtm.mbos;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;


/**
 * Export Control DSP license
 * 
 * @author Andrew Mahen
 *
 */
public class DSPLicense extends Mbo {

  /**
   * @param ms
   * @throws RemoteException
   */
  public DSPLicense(MboSet ms) throws RemoteException {
    super(ms);
  }
}
