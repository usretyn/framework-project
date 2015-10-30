package cn.com.rexen.admin.web.impl.module;

import cn.com.rexen.core.api.web.IMenu;
import cn.com.rexen.core.api.web.IModule;

import java.util.List;

/**
 * Created by sunlf on 2015/7/19.
 * 权限控制菜单
 */
public class PermissionModuleImpl implements IModule {
    @Override
    public List<IMenu> getMenus() {
        return null;
    }

    @Override
    public String getApplicationId() {
        return "AdminApplication";
    }

    @Override
    public String getId() {
        return "permissionModule";
    }

    @Override
    public String getText() {
        return "权限管理";
    }

    @Override
    public String getDescription() {
        return "权限管理";
    }

    @Override
    public String getIcon() {
        return "resources/images/wrench.png";
    }

    @Override
    public String getRouteId() {
        return null;
    }

    @Override
    public int getIndex() {
        return 0;
    }

    @Override
    public String getPermission() {
        return null;//"admin:permissionModule";
    }

    @Override
    public String getIconCls() {
        return "right-icon x-fa fa-user-secret";
    }
}