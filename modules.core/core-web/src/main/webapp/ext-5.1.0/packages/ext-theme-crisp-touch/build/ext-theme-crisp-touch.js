Ext.define("ExtThemeNeptune.Component", {
    override: "Ext.Component", initComponent: function () {
        this.callParent();
        if (this.dock && this.border === undefined) {
            this.border = false
        }
    }, privates: {
        initStyles: function () {
            var c = this, b = c.hasOwnProperty("border"), a = c.border;
            if (c.dock) {
                c.border = null
            }
            c.callParent(arguments);
            if (b) {
                c.border = a
            } else {
                delete c.border
            }
        }
    }
});
Ext.define("ExtThemeNeptune.resizer.Splitter", {override: "Ext.resizer.Splitter", size: 8});
Ext.define("Ext.touch.sizing.resizer.Splitter", {override: "Ext.resizer.Splitter", size: 16});
Ext.define("ExtThemeNeptune.toolbar.Toolbar", {override: "Ext.toolbar.Toolbar", usePlainButtons: false, border: false});
Ext.define("ExtThemeNeptune.layout.component.Dock", {
    override: "Ext.layout.component.Dock",
    noBorderClassTable: [0, Ext.baseCSSPrefix + "noborder-l", Ext.baseCSSPrefix + "noborder-b", Ext.baseCSSPrefix + "noborder-bl", Ext.baseCSSPrefix + "noborder-r", Ext.baseCSSPrefix + "noborder-rl", Ext.baseCSSPrefix + "noborder-rb", Ext.baseCSSPrefix + "noborder-rbl", Ext.baseCSSPrefix + "noborder-t", Ext.baseCSSPrefix + "noborder-tl", Ext.baseCSSPrefix + "noborder-tb", Ext.baseCSSPrefix + "noborder-tbl", Ext.baseCSSPrefix + "noborder-tr", Ext.baseCSSPrefix + "noborder-trl", Ext.baseCSSPrefix + "noborder-trb", Ext.baseCSSPrefix + "noborder-trbl"],
    edgeMasks: {top: 8, right: 4, bottom: 2, left: 1},
    handleItemBorders: function () {
        var y = this, f = 0, z = 8, A = 4, l = 2, e = 1, a = y.owner, s = a.bodyBorder, n = a.border, j = y.collapsed, p = y.edgeMasks, k = y.noBorderClassTable, x = a.dockedItems.generation, w, d, v, h, r, m, u, o, g, q, t, c;
        if (y.initializedBorders === x) {
            return
        }
        t = [];
        c = [];
        d = y.getBorderCollapseTable();
        k = y.getBorderClassTable ? y.getBorderClassTable() : k;
        y.initializedBorders = x;
        y.collapsed = false;
        v = y.getDockedItems();
        y.collapsed = j;
        for (r = 0, m = v.length; r < m; r++) {
            u = v[r];
            if (u.ignoreBorderManagement) {
                continue
            }
            o = u.dock;
            q = h = 0;
            t.length = 0;
            c.length = 0;
            if (o !== "bottom") {
                if (f & z) {
                    w = u.border
                } else {
                    w = n;
                    if (w !== false) {
                        h += z
                    }
                }
                if (w === false) {
                    q += z
                }
            }
            if (o !== "left") {
                if (f & A) {
                    w = u.border
                } else {
                    w = n;
                    if (w !== false) {
                        h += A
                    }
                }
                if (w === false) {
                    q += A
                }
            }
            if (o !== "top") {
                if (f & l) {
                    w = u.border
                } else {
                    w = n;
                    if (w !== false) {
                        h += l
                    }
                }
                if (w === false) {
                    q += l
                }
            }
            if (o !== "right") {
                if (f & e) {
                    w = u.border
                } else {
                    w = n;
                    if (w !== false) {
                        h += e
                    }
                }
                if (w === false) {
                    q += e
                }
            }
            if ((g = u.lastBorderMask) !== q) {
                u.lastBorderMask = q;
                if (g) {
                    c[0] = k[g]
                }
                if (q) {
                    t[0] = k[q]
                }
            }
            if ((g = u.lastBorderCollapse) !== h) {
                u.lastBorderCollapse = h;
                if (g) {
                    c[c.length] = d[g]
                }
                if (h) {
                    t[t.length] = d[h]
                }
            }
            if (c.length) {
                u.removeCls(c)
            }
            if (t.length) {
                u.addCls(t)
            }
            f |= p[o]
        }
        q = h = 0;
        t.length = 0;
        c.length = 0;
        if (f & z) {
            w = s
        } else {
            w = n;
            if (w !== false) {
                h += z
            }
        }
        if (w === false) {
            q += z
        }
        if (f & A) {
            w = s
        } else {
            w = n;
            if (w !== false) {
                h += A
            }
        }
        if (w === false) {
            q += A
        }
        if (f & l) {
            w = s
        } else {
            w = n;
            if (w !== false) {
                h += l
            }
        }
        if (w === false) {
            q += l
        }
        if (f & e) {
            w = s
        } else {
            w = n;
            if (w !== false) {
                h += e
            }
        }
        if (w === false) {
            q += e
        }
        if ((g = y.lastBodyBorderMask) !== q) {
            y.lastBodyBorderMask = q;
            if (g) {
                c[0] = k[g]
            }
            if (q) {
                t[0] = k[q]
            }
        }
        if ((g = y.lastBodyBorderCollapse) !== h) {
            y.lastBodyBorderCollapse = h;
            if (g) {
                c[c.length] = d[g]
            }
            if (h) {
                t[t.length] = d[h]
            }
        }
        if (c.length) {
            a.removeBodyCls(c)
        }
        if (t.length) {
            a.addBodyCls(t)
        }
    },
    onRemove: function (b) {
        var a = b.lastBorderMask;
        if (!b.isDestroyed && !b.ignoreBorderManagement && a) {
            b.lastBorderMask = 0;
            b.removeCls(this.noBorderClassTable[a])
        }
        this.callParent([b])
    }
});
Ext.define("ExtThemeNeptune.panel.Panel", {
    override: "Ext.panel.Panel",
    border: false,
    bodyBorder: false,
    initBorderProps: Ext.emptyFn,
    initBodyBorder: function () {
        if (this.bodyBorder !== true) {
            this.callParent()
        }
    }
});
Ext.define("ExtThemeNeptune.panel.Table", {
    override: "Ext.panel.Table", initComponent: function () {
        var a = this;
        if (!a.hasOwnProperty("bodyBorder") && !a.hideHeaders) {
            a.bodyBorder = true
        }
        a.callParent()
    }
});
Ext.define("Ext.theme.crisp.view.Table", {override: "Ext.view.Table", stripeRows: false});
Ext.define("ExtThemeNeptune.container.ButtonGroup", {override: "Ext.container.ButtonGroup", usePlainButtons: false});
Ext.define("Ext.touch.sizing.form.trigger.Spinner", {override: "Ext.form.trigger.Spinner", vertical: false});
Ext.define("ExtThemeNeptune.toolbar.Paging", {
    override: "Ext.toolbar.Paging",
    defaultButtonUI: "plain-toolbar",
    inputItemWidth: 40
});
Ext.define("ExtThemeNeptune.picker.Month", {override: "Ext.picker.Month", measureMaxHeight: 36});
Ext.define("ExtThemeNeptune.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    defaultButtonUI: "plain-toolbar"
});
Ext.define("ExtThemeNeptune.grid.RowEditor", {override: "Ext.grid.RowEditor", buttonUI: "default-toolbar"});
Ext.define("ExtThemeNeptune.grid.column.RowNumberer", {override: "Ext.grid.column.RowNumberer", width: 25});
Ext.define("ExtThemeNeptune.menu.Separator", {override: "Ext.menu.Separator", border: true});
Ext.define("ExtThemeNeptune.menu.Menu", {override: "Ext.menu.Menu", showSeparator: false});
Ext.define("Ext.touch.sizing.grid.plugin.RowExpander", {override: "Ext.grid.plugin.RowExpander", headerWidth: 32});
Ext.define("Ext.touch.sizing.selection.CheckboxModel", {override: "Ext.selection.CheckboxModel", headerWidth: 32});