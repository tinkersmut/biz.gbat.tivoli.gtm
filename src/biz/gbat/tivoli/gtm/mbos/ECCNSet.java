/*
 *  Copyright (c)  2002-2009
 *
 *  Total Resource Management (TRM)
 *  510 King Street
 *  Alexandria, VA. 22314
 *  703.548.4285
 *  www.trmnet.com
 *
 *  All Rights Reserved
 *
 *  This program is an unpublished work protected by the Copyright Act
 *  of the United States of America. It contains proprietary information
 *  and trade secrets which are the property of Total Resource 
 *  Management (TRM) Incorporated. This work is submitted to the recipient
 *  in confidence, the information contained herein may not be copied or
 *  disclosed in whole or in part except as permitted by written agreement
 *  signed by an officer of Total Resource Management.
 *
 *  Decompilation or modification of this software is strictly prohibited.
 *
 *  No part of this work may be reproduced or used in any form or by
 *  any means; graphic, electronic, or mechanical including
 *  photocopying, recording, taping or information storage and retrieval
 *  systems without the permission of Total Resource Management Corporation
 *
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
