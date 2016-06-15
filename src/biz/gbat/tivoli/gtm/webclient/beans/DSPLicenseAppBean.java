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
