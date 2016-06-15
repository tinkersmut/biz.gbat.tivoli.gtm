/*
 *  file:    ECCNSet.java
 *  created: Jul 3, 2012
 *  author:  Andrew Mahen
 */
package biz.gbat.tivoli.gtm.mbos;

import java.rmi.RemoteException;

import psdi.mbo.HierarchicalMboSet;
import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.mbo.MboValueData;
import psdi.util.MXException;


/**
 * A set of Export Control Classification Numbers
 * 
 * @author Andrew Mahen
 *
 */
public class ECCNSet extends HierarchicalMboSet {

  /*
   * @see psdi.mbo.HierarchicalMboSetRemote#getChildren(java.lang.String, java.lang.String, java.lang.String[], int)
   */
  @Override
  public MboValueData[][] getChildren(String arg0, String arg1, String[] arg2, int arg3) throws MXException, RemoteException {
    return null;
  }

  /*
   * @see psdi.mbo.HierarchicalMboSetRemote#getParent(java.lang.String, java.lang.String, java.lang.String[])
   */
  @Override
  public MboValueData[] getParent(String arg0, String arg1, String[] arg2) throws MXException, RemoteException {
    return null;
  }

  /*
   * @see psdi.mbo.HierarchicalMboSetRemote#getPathToTop(java.lang.String, java.lang.String, java.lang.String[], int)
   */
  @Override
  public MboValueData[][] getPathToTop(String arg0, String arg1, String[] arg2, int arg3) throws MXException, RemoteException {
    return null;
  }

  /*
   * @see psdi.mbo.HierarchicalMboSetRemote#getSiblings(java.lang.String, java.lang.String, java.lang.String[], int)
   */
  @Override
  public MboValueData[][] getSiblings(String arg0, String arg1, String[] arg2, int arg3) throws MXException, RemoteException {
    return null;
  }

  /*
   * @see psdi.mbo.HierarchicalMboSetRemote#getTop(java.lang.String[], int)
   */
  @Override
  public MboValueData[][] getTop(String[] arg0, int arg1) throws MXException, RemoteException {
    return null;
  }

  /**
   * @param ms
   * @throws RemoteException
   */
  public ECCNSet(MboServerInterface ms) throws RemoteException {
    super(ms);
  }

  /*
   * @see psdi.mbo.MboSet#getMboInstance(psdi.mbo.MboSet)
   */
  @Override
  protected Mbo getMboInstance(MboSet set) throws MXException, RemoteException {
    return new ECCN(set);
  }

}
