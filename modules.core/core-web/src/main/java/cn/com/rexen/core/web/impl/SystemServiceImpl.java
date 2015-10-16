package cn.com.rexen.core.web.impl;

import cn.com.rexen.core.api.security.IShiroService;
import cn.com.rexen.core.api.web.*;
import cn.com.rexen.core.api.web.model.*;
import cn.com.rexen.core.web.manager.ApplicationManager;
import cn.com.rexen.core.web.manager.MenuManager;
import cn.com.rexen.core.web.manager.ModuleManager;
import cn.com.rexen.core.web.util.DozerHelper;
import org.apache.shiro.subject.Subject;
import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sunlf on 2015/7/13.
 */
public class SystemServiceImpl implements ISystemService {
    private ISystem systemService;
    private IShiroService shiroService;

    public void setShiroService(IShiroService shiroService) {
        this.shiroService = shiroService;
    }

    @Override
    public SystemBean getSystem() {
        Subject subject=shiroService.getSubject();
        SystemBean systemBean = new SystemBean();
        if(subject==null)
            return systemBean;
        Mapper mapper = new DozerBeanMapper();
        HeaderBean headerBean = mapper.map(systemService.getHeader(), HeaderBean.class);
        systemBean.setHeaderBean(headerBean);

        FooterBean footerBean = mapper.map(systemService.getFooter(), FooterBean.class);
        systemBean.setFooterBean(footerBean);

        BodyBean bodyBean = new BodyBean();
        bodyBean.setApplicationBeanList(DozerHelper.map(mapper, systemService.getBody().getApplications(), ApplicationBean.class));
        systemBean.setBodyBean(bodyBean);
        return systemBean;
    }

    @Override
    public List<ApplicationBean> getApplicationList() {
        Subject subject=shiroService.getSubject();
        List<ApplicationBean> applicationBeans = new ArrayList<>();
        if(subject==null)
            return applicationBeans;

        List<IApplication> applicationList = ApplicationManager.getInstall().getApplicationList();
        if (applicationList != null && applicationList.size() > 0) {
            Mapper mapper = new DozerBeanMapper();
            for (IApplication application : applicationList) {
                //调用isPermitted不能传入空字符,故此默认值为KALIX_NOT_PERMISSION
                String permission=application.getPermission()!=null?application.getPermission():"KALIX_NOT_PERMISSION";
                if (subject.hasRole(permission)) {
                    ApplicationBean applicationBean = mapper.map(application, ApplicationBean.class);
                    applicationBeans.add(applicationBean);
                }
            }
        }
        return applicationBeans;
    }

    @Override
    public List<ModuleBean> getModuleByApplication(String applicationId) {
        Subject subject=shiroService.getSubject();
        List<IModule> moduleList = ModuleManager.getInstall().getModuleList(applicationId);
        List<ModuleBean> moduleBeanList=new ArrayList<ModuleBean>();
        if(moduleList==null)
            moduleList=new ArrayList<IModule>();
        Mapper mapper = new DozerBeanMapper();
        //找出所有对应权限的功能模块
        if(moduleList!=null&&!moduleList.isEmpty()){
            for(IModule module:moduleList) {
                //调用isPermitted不能传入空字符,故此默认值为KALIX_NOT_PERMISSION
                String modulePermission=module.getPermission()!=null?module.getPermission():"KALIX_NOT_PERMISSION";
                if (subject.hasRole(modulePermission)) {
                    ModuleBean moduleBean = mapper.map(module, ModuleBean.class);
                    moduleBean.setText(module.getText());
                    moduleBeanList.add(moduleBean);
                }
            }
        }
        if(moduleBeanList!=null&&!moduleBeanList.isEmpty()){
            for(ModuleBean moduleBean:moduleBeanList){
                moduleBean.setChildren(new ArrayList<MenuBean>());
                List<IMenu> menuList = new ArrayList<IMenu>();
                List<IMenu> allMenu=MenuManager.getInstall().getMenuList(moduleBean.getId());
                //去掉没有权限的菜单
                if(allMenu!=null&&!allMenu.isEmpty()){
                    for(IMenu menu:allMenu){
                        //调用isPermitted不能传入空字符,故此默认值为KALIX_NOT_PERMISSION
                        String menuPermission=menu.getPermission()!=null?menu.getPermission():"KALIX_NOT_PERMISSION";
                        if (subject.hasRole(menuPermission)) {
                            menuList.add(menu);
                        }
                    }
                }
                List<IMenu> rootMenus = getRootMenus(menuList);
                if(rootMenus!=null&&!rootMenus.isEmpty()){
                    for(IMenu rootMenu:rootMenus){
                        MenuBean menuBean = null;
                        if(rootMenu!=null) {
                            menuBean=mapper.map(rootMenu, MenuBean.class);
                            menuBean.setText(rootMenu.getText());
                            getMenuChilden(menuBean, menuList, mapper);
                        }
                        moduleBean.getChildren().add(menuBean);
                    }
                }
            }
        }
        return moduleBeanList;
    }

    @Override
    public MenuBean getMenuByModule(String moduleId) {
        List<IMenu> menuList = MenuManager.getInstall().getMenuList(moduleId);
        IMenu rootMenu = getRootMenu(menuList);
        /*List<String> mapFile=new ArrayList<>();
        mapFile.add("META-INF/MenuMapper.xml");*/
        Mapper mapper = new DozerBeanMapper();
        MenuBean menuBean = null;
        if(rootMenu!=null) {
            menuBean=mapper.map(rootMenu, MenuBean.class);
            menuBean.setText(rootMenu.getText());
            getMenuChilden(menuBean, menuList, mapper);
        }
        return menuBean;
    }

    @Override
    public Map getButtonsByPermission(String permission) {
        if(permission==null||permission.isEmpty())
            return null;
        Map resp=new HashMap();
        List<Map> buttons=new ArrayList<Map>();
        Subject subject=shiroService.getSubject();
        if(permission.indexOf("_")!=-1){
            String[] permissions=permission.split("_");
            for(String _permission:permissions){
                Map button=new HashMap();
                button.put("permission",_permission);
                if(subject.hasRole(_permission)){
                    button.put("status",true);
                }else {
                    button.put("status", false);
                }
                buttons.add(button);
            }
        }else{
            Map button=new HashMap();
            button.put("permission",permission);
            if(subject.hasRole(permission)){
                button.put("status",true);
            }else{
                button.put("status",false);
            }
            buttons.add(button);
        }
        resp.put("buttons",buttons.toArray());
        return resp;
    }

    /**
     * 递归函数加载子菜单
     *
     * @param menuBean
     * @param menuList
     */
    private void getMenuChilden(MenuBean menuBean, List<IMenu> menuList, Mapper mapper) {
        if(menuList==null||menuList.isEmpty())
            return;
        List<MenuBean> childMenuList = new ArrayList<>();

        for (IMenu menu : menuList) {
            if (menu.getParentMenuId() != null && menu.getParentMenuId().equals(menuBean.getId())) {
                MenuBean mBean = mapper.map(menu, MenuBean.class);
                mBean.setText(menu.getText());
                childMenuList.add(mBean);
                getMenuChilden(mBean, menuList, mapper);
            }
        }
        menuBean.setChildren(childMenuList);
    }

    /**
     * 获得菜单根节点
     *
     * @param menuList
     * @return
     */
    private IMenu getRootMenu(List<IMenu> menuList) {
        if(menuList==null||menuList.isEmpty())
            return null;
        for (IMenu menu : menuList) {
            if (menu.getParentMenuId() == null) {
                return menu;
            }
        }
        return null;
    }

    /**
     * 获得菜单根节点
     *
     * @param menuList
     * @return
     */
    private List<IMenu> getRootMenus(List<IMenu> menuList) {
        List<IMenu> rootMenus=new ArrayList<IMenu>();
        if(menuList==null||menuList.isEmpty())
            return rootMenus;
        for (IMenu menu : menuList) {
            if (menu.getParentMenuId() == null) {
                rootMenus.add(menu);
            }
        }
        return rootMenus;
    }
    public void setSystemService(ISystem systemService) {
        this.systemService = systemService;
    }

}
