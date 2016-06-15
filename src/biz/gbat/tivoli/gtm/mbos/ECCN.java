/*
 *  file:    ECCN.java
 *  created: Jul 3, 2012
 *  author:  Andrew Mahen
 */
package biz.gbat.tivoli.gtm.mbos;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;


/**
 * Export Control Classification Number
 * 
 * @author Andrew Mahen
 *
 */
public class ECCN extends Mbo {

  /**
   * @param ms
   * @throws RemoteException
   */
  public ECCN(MboSet ms) throws RemoteException {
    super(ms);
  }

}
