package cn.com.rexen.admin.core;

import cn.com.rexen.admin.api.biz.IMessageBeanService;
import cn.com.rexen.admin.api.dao.IMessageBeanDao;
import cn.com.rexen.admin.entities.MessageBean;
import cn.com.rexen.core.api.persistence.IGenericDao;
import cn.com.rexen.core.impl.biz.GenericBizServiceImpl;

import java.util.List;

/**
 * @类描述：系统消息服务实现类
 * @创建人： sunlingfeng
 * @创建时间：2014/9/25
 * @修改人：
 * @修改时间：
 * @修改备注：
 */
public class MessageBeanServiceImpl extends GenericBizServiceImpl<IMessageBeanDao, MessageBean> implements IMessageBeanService {
    // private IMessageBeanDao messageBeanDao;

    public MessageBeanServiceImpl() {
        super.init(MessageBean.class.getName());
    }

//    public void setMessageBeanDao(IMessageBeanDao messageBeanDao) {
//        this.messageBeanDao = messageBeanDao;
//
//    }

    @Override
    public List<MessageBean> query(MessageBean bean) {
        return dao.find("select a from MessageBean a where a.title LIKE ?1", "%" + bean.getTitle() + "%");
    }
}
