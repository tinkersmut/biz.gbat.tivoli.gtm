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
