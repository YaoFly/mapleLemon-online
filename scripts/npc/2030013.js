/*
	NPC ����: 		Adobis
	���ڵ�ͼ: 		�����ļ�̨���
	�ű�����: 		����Զ����
*/

var status = 0;
var maxCount = 4;
var maxChaosZak = 5;
var maxChaosZak1 = 6;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (cm.getPlayer().getMapId() == 211042200) { //��පѨ��
        if (selection < 100) {
            cm.sendSimple("#r#L100#����#l\r\n#L101#��������#l");
        } else {
            if (selection == 100) {
                cm.warp(211042300, 0); //�������
            } else if (selection == 101) {	
                cm.warp(211042401, 0); //�����������
            }
            cm.dispose();
        }
        return;
    } else if (cm.getPlayer().getMapId() == 211042401) { //���������ļ�̨���
        switch (status) {
        case 0:
            if (cm.getPlayer().getLevel() < 100) {
                cm.sendOk("��ĵȼ�С�� 100 �����޷���ս����������");
                cm.dispose();
                return;
            }
            if (cm.getPlayer().getClient().getChannel() != 3) {
                cm.sendOk("��������ֻ���� 3 Ƶ����ս��");
                cm.dispose();
                return;
            }
            var em = cm.getEventManager("ChaosZakum");
            if (em == null) {
                cm.sendOk("�����嵥Ϊ�գ�����ϵ����Ա��");
                cm.safeDispose();
                return;
            }
            var prop = em.getProperty("state");
            var data = cm.getBossLog("��������");
            if (prop == null || prop.equals("0")) {
                var squadAvailability = cm.getSquadAvailability("ChaosZak");
                if (squadAvailability == -1) {
                    status = 1;
                    if (data >= maxChaosZak1 && !cm.getPlayer().isGM()) {
                        cm.sendOk("��������ս���������Ĵ����Ѿ����꣬������������ս�ɣ�");
                        cm.dispose();
                        return;
                    }
                    cm.sendYesNo("���ڿ�������Զ���ӣ������ΪԶ���Ӷӳ���");
                } else if (squadAvailability == 1) {
                    if (data >= maxChaosZak1 && !cm.getPlayer().isGM()) {
                        cm.sendOk("��������ս���������Ĵ����Ѿ����꣬������������ս�ɣ�");
                        cm.dispose();
                        return;
                    }
                    // -1 = Cancelled, 0 = not, 1 = true
                    var type = cm.isSquadLeader("ChaosZak");
                    if (type == -1) {
                        cm.sendOk("�Ѿ����������롣");
                        cm.safeDispose();
                    } else if (type == 0) {
                        var memberType = cm.isSquadMember("ChaosZak");
                        if (memberType == 2) {
                            cm.sendOk("��Զ���ӵ��Ʋ�������");
                            cm.safeDispose();
                        } else if (memberType == 1) {
                            status = 5;
                            cm.sendSimple("����������ʲô��\r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӡ�#l \r\n#b#L2#�˳�Զ���ӡ�#l");
                        } else if (memberType == -1) {
                            cm.sendOk("Զ����Ա�Ѿ��ﵽ30�������Ժ����ԡ�");
                            cm.safeDispose();
                        } else {
                            status = 5;
                            cm.sendSimple("����������ʲô�� \r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӡ�#l \r\n#b#L2#�˳�Զ���ӡ�#l");
                        }
                    } else { // Is leader
                        status = 10;
                        cm.sendSimple("����������ʲô��\r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӳ�Ա��#l \r\n#b#L2#�༭�����б���#l \r\n#r#L3#�����ͼ��#l");
                        // TODO viewing!
                    }
                } else {
                    var eim = cm.getDisconnected("ChaosZakum");
                    if (eim == null) {
                        var squd = cm.getSquad("ChaosZak");
                        if (squd != null) {
                            if (data >= maxChaosZak && !cm.getPlayer().isGM()) {
                                cm.sendOk("��������ս���������Ĵ����Ѿ����꣬������������ս�ɣ�");
                                cm.dispose();
                                return;
                            }
                            cm.sendYesNo("Զ���ӵ���ս�Ѿ���ʼ.\r\n" + squd.getNextPlayer());
                            status = 3;
                        } else {
                            cm.sendOk("Զ���ӵ���ս�Ѿ���ʼ.");
                            cm.safeDispose();
                        }
                    } else {
                        cm.sendYesNo("��Ҫ��������Զ��������?");
                        status = 2;
                    }
                }
            } else {
                var eim = cm.getDisconnected("ChaosZakum");
                if (eim == null) {
                    var squd = cm.getSquad("ChaosZak");
                    if (squd != null) {
                        if (data >= maxChaosZak && !cm.getPlayer().isGM()) {
                            cm.sendOk("��������ս���������Ĵ����Ѿ����꣬������������ս�ɣ�");
                            cm.dispose();
                            return;
                        }
                        cm.sendYesNo("Զ���ӵ���ս�Ѿ���ʼ.\r\n" + squd.getNextPlayer());
                        status = 3;
                    } else {
                        cm.sendOk("Զ���ӵ���ս�Ѿ���ʼ.");
                        cm.safeDispose();
                    }
                } else {
                    cm.sendYesNo("��Ҫ��������Զ��������");
                    status = 2;
                }
            }
            break;
        case 1:
            if (mode == 1) {
                if (cm.registerSquad("ChaosZak", 5, " �Ѿ���Ϊ��Զ���Ӷӳ�������������Զ���ӣ������´򿪶Ի��������Զ���ӡ�")) {
                    cm.sendOk("���Ѿ���Ϊ��Զ���Ӷӳ�����������5���ӣ���ȴ���Ա�ǵ����롣");
                } else {
                    cm.sendOk("δ֪����.");
                }
            } else {
                cm.sendOk("�����������Զ���ӵĻ�����ô�������Ұɡ�")
            }
            cm.safeDispose();
            break;
        case 2:
            if (!cm.reAdd("ChaosZakum", "ChaosZak")) {
                cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
            }
            cm.dispose();
            break;
        case 3:
            if (mode == 1) {
                var squd = cm.getSquad("ChaosZak");
                if (squd != null && !squd.getAllNextPlayer().contains(cm.getPlayer().getName())) {
                    squd.setNextPlayer(cm.getPlayer().getName());
                    cm.sendOk("�����Ѿ���Զ�����ڽ���������...");
                }
            }
            cm.dispose();
            break;
        case 5:
            if (selection == 0) {
                if (!cm.getSquadList("ChaosZak", 0)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                } else {
                    cm.dispose();
                }
            } else if (selection == 1) { // join
                var ba = cm.addMember("ChaosZak", true);
                if (ba == 2) {
                    cm.sendOk("Զ����Ա�Ѿ��ﵽ30�������Ժ����ԡ�");
                    cm.safeDispose();
                } else if (ba == 1) {
                    cm.sendOk("�������Զ���ӳɹ�����Ⱥ�ӳ�ָʾ��");
                    cm.safeDispose();
                } else {
                    cm.sendOk("���Ѿ��μ���Զ���ӣ���Ⱥ�ӳ�ָʾ��");
                    cm.safeDispose();
                }
            } else { // withdraw
                var baa = cm.addMember("ChaosZak", false);
                if (baa == 1) {
                    cm.sendOk("�Ʋ�ָ���ĳ�Ա�ɹ���");
                    cm.safeDispose();
                } else {
                    cm.sendOk("��û�вμ�Զ���ӡ�");
                    cm.safeDispose();
                }
            }
            break;
        case 10:
            if (selection == 0) {
                if (!cm.getSquadList("ChaosZak", 0)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                }
                cm.safeDispose();
            } else if (selection == 1) {
                status = 11;
                if (!cm.getSquadList("ChaosZak", 1)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }

            } else if (selection == 2) {
                status = 12;
                if (!cm.getSquadList("ChaosZak", 2)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }

            } else if (selection == 3) { // get insode
                if (cm.getSquad("ChaosZak") != null) {
                    var dd = cm.getEventManager("ChaosZakum");
                    //dd.startInstance(cm.getSquad("ChaosZak"), cm.getMap(), 160102);
                    dd.startInstance(cm.getSquad("ChaosZak"), cm.getMap(), "��������",false);
                    cm.dispose();
                } else {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }
            }
            break;
        case 11:
            cm.banMember("ChaosZak", selection);
            cm.dispose();
            break;
        case 12:
            if (selection != -1) {
                cm.acceptMember("ChaosZak", selection);
            }
            cm.dispose();
            break;
        }
    } else {
        switch (status) {
        case 0:
            if (cm.getPlayer().getLevel() < 50) {
                cm.sendOk("��ĵȼ�С�� 50 �����޷���ս����������");
                cm.dispose();
                return;
            }
            if (cm.getPlayer().getClient().getChannel() != 2) {
                cm.sendOk("�������ֻ���� 2 Ƶ���ٻ���");
                cm.dispose();
                return;
            }
            var em = cm.getEventManager("ZakumBattle");
            if (em == null) {
                cm.sendOk("�����嵥Ϊ�գ�����ϵ����Ա��");
                cm.safeDispose();
                return;
            }
            var prop = em.getProperty("state");
            var data = cm.getBossLog("��ͨ����");
            if (prop == null || prop.equals("0")) {
                var squadAvailability = cm.getSquadAvailability("ZAK");
                if (squadAvailability == -1) {
                    status = 1;
                    if (data >= maxCount && !cm.getPlayer().isGM()) {
                        cm.sendOk("��������ս��ͨ�����Ĵ����Ѿ����꣬������������ս�ɣ�");
                        cm.dispose();
                        return;
                    }
                    cm.sendYesNo("���ڿ�������Զ���ӣ������ΪԶ���Ӷӳ���");
                } else if (squadAvailability == 1) {
                    if (data >= maxCount && !cm.getPlayer().isGM()) {
                        cm.sendOk("��������ս��ͨ�����Ĵ����Ѿ����꣬������������ս�ɣ�");
                        cm.dispose();
                        return;
                    }
                    // -1 = Cancelled, 0 = not, 1 = true
                    var type = cm.isSquadLeader("ZAK");
                    if (type == -1) {
                        cm.sendOk("�Ѿ����������롣");
                        cm.safeDispose();
                    } else if (type == 0) {
                        var memberType = cm.isSquadMember("ZAK");
                        if (memberType == 2) {
                            cm.sendOk("��Զ���ӵ��Ʋ�������");
                            cm.safeDispose();
                        } else if (memberType == 1) {
                            status = 5;
                            cm.sendSimple("����������ʲô��\r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӡ�#l \r\n#b#L2#�˳�Զ���ӡ�#l");
                        } else if (memberType == -1) {
                            cm.sendOk("Զ����Ա�Ѿ��ﵽ30�������Ժ����ԡ�");
                            cm.safeDispose();
                        } else {
                            status = 5;
                            cm.sendSimple("����������ʲô��\r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӡ�#l \r\n#b#L2#�˳�Զ���ӡ�#l");
                        }
                    } else { // Is leader
                        status = 10;
                        cm.sendSimple("����������ʲô��\r\n#b#L0#�鿴Զ���ӳ�Ա��#l \r\n#b#L1#����Զ���ӳ�Ա��#l \r\n#b#L2#�༭�����б���#l \r\n#r#L3#�����ͼ��#l");
                        // TODO viewing!
                    }
                } else {
                    var eim = cm.getDisconnected("ZakumBattle");
                    if (eim == null) {
                        var squd = cm.getSquad("ZAK");
                        if (squd != null) {
                            if (data >= maxCount && !cm.getPlayer().isGM()) {
                                cm.sendOk("��������ս��ͨ�����Ĵ����Ѿ����꣬������������ս�ɣ�");
                                cm.dispose();
                                return;
                            }
                            cm.sendYesNo("Զ���ӵ���ս�Ѿ���ʼ.\r\n" + squd.getNextPlayer());
                            status = 3;
                        } else {
                            cm.sendOk("Զ���ӵ���ս�Ѿ���ʼ.");
                            cm.safeDispose();
                        }
                    } else {
                        cm.sendYesNo("��Ҫ��������Զ��������");
                        status = 1;
                    }
                }
            } else {
                var eim = cm.getDisconnected("ZakumBattle");
                if (eim == null) {
                    var squd = cm.getSquad("ZAK");
                    if (squd != null) {
                        if (data >= maxCount && !cm.getPlayer().isGM()) {
                            cm.sendOk("��������ս��ͨ�����Ĵ����Ѿ����꣬������������ս�ɣ�");
                            cm.dispose();
                            return;
                        }
                        cm.sendYesNo("Զ���ӵ���ս�Ѿ���ʼ.\r\n" + squd.getNextPlayer());
                        status = 3;
                    } else {
                        cm.sendOk("Զ���ӵ���ս�Ѿ���ʼ.");
                        cm.safeDispose();
                    }
                } else {
                    cm.sendYesNo("��Ҫ��������Զ��������");
                    status = 1;
                }
            }
            break;
        case 1:
            if (mode == 1) {
                if (cm.registerSquad("ZAK", 5, " �Ѿ���Ϊ��Զ���Ӷӳ�������������Զ���ӣ������´򿪶Ի��������Զ���ӡ�")) {
                    cm.sendOk("���Ѿ���Ϊ��Զ���Ӷӳ�����������5���ӣ���ȴ���Ա�ǵ����롣");
                } else {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                }
            } else {
                cm.sendOk("�����������Զ���ӵĻ�����ô�������Ұɡ�")
            }
            cm.safeDispose();
            break;
        case 2:
            if (!cm.reAdd("ZakumBattle", "ZAK")) {
                cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
            }
            cm.safeDispose();
            break;
        case 3:
            if (mode == 1) {
                var squd = cm.getSquad("ZAK");
                if (squd != null && !squd.getAllNextPlayer().contains(cm.getPlayer().getName())) {
                    squd.setNextPlayer(cm.getPlayer().getName());
					//cm.registerSquad("ZAK", 5, " �Ѿ���Ϊ��Զ���Ӷӳ�������������Զ���ӣ������´򿪶Ի��������Զ���ӡ�")
					
                }
					
					cm.sendOk("��ȴ���һ���μ�Զ��.");
            }
            cm.dispose();
            break;
        case 5:
            if (selection == 0) {
                if (!cm.getSquadList("ZAK", 0)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                } else {
                    cm.dispose();
                }
            } else if (selection == 1) { // join
                var ba = cm.addMember("ZAK", true);
                if (ba == 2) {
                    cm.sendOk("Զ����Ա�Ѿ��ﵽ30�������Ժ����ԡ�");
                    cm.safeDispose();
                } else if (ba == 1) {
                    cm.sendOk("�������Զ���ӳɹ�����Ⱥ�ӳ�ָʾ��");
                    cm.safeDispose();
                } else {
                    cm.sendOk("���Ѿ��μ���Զ���ӣ���Ⱥ�ӳ�ָʾ��");
                    cm.safeDispose();
                }
            } else { // withdraw
                var baa = cm.addMember("ZAK", false);
                if (baa == 1) {
                    cm.sendOk("�Ʋ�ָ���ĳ�Ա�ɹ���");
                    cm.safeDispose();
                } else {
                    cm.sendOk("��û�вμ�Զ���ӡ�");
                    cm.safeDispose();
                }
            }
            break;
        case 10:
            if (selection == 0) {
                if (!cm.getSquadList("ZAK", 0)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                }
                cm.safeDispose();
            } else if (selection == 1) {
                status = 11;
                if (!cm.getSquadList("ZAK", 1)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }
            } else if (selection == 2) {
                status = 12;
                if (!cm.getSquadList("ZAK", 2)) {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }
            } else if (selection == 3) { // get insode
                if (cm.getSquad("ZAK") != null) {
                    var dd = cm.getEventManager("ZakumBattle");
                    //dd.startInstance(cm.getSquad("ZAK"), cm.getMap(), 160101);
                    dd.startInstance(cm.getSquad("ZAK"), cm.getMap(), "��ͨ����",false);
                    cm.dispose();
                } else {
                    cm.sendOk("����δ֪�Ĵ��󣬲���ʧ�ܡ�");
                    cm.safeDispose();
                }
            }
            break;
        case 11:
            cm.banMember("ZAK", selection);
            cm.dispose();
            break;
        case 12:
            if (selection != -1) {
                cm.acceptMember("ZAK", selection);
            }
            cm.dispose();
            break;
        }
    }
}