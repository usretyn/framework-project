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
Ext.define("Ext.aria.FocusManager", {
    singleton: true,
    requires: ["Ext.util.KeyNav", "Ext.util.Observable"],
    mixins: {observable: "Ext.util.Observable"},
    enabled: false,
    windows: [],
    constructor: function (c) {
        var f = this, e = f.whitelist, b, d, a;
        f.mixins.observable.constructor.call(f, c)
    },
    enable: function () {
        var a = this, b = Ext.getDoc();
        if (a.enabled) {
            return
        }
        a.enabled = true;
        a.toggleKeyMap = new Ext.util.KeyMap({
            target: b,
            scope: a,
            defaultEventAction: "stopEvent",
            key: Ext.event.Event.F6,
            fn: a.toggleWindow
        });
        a.fireEvent("enable", a)
    },
    onComponentBlur: function (b, c) {
        var a = this;
        if (a.focusedCmp === b) {
            a.previousFocusedCmp = b
        }
        Ext.globalEvents.fireEvent("componentblur", a, b, a.previousFocusedCmp);
        return false
    },
    onComponentFocus: function (b, c) {
        var a = this;
        if (Ext.globalEvents.fireEvent("beforecomponentfocus", a, b, a.previousFocusedCmp) === false) {
            a.clearComponent(b);
            return
        }
        a.focusedCmp = b;
        return false
    },
    onComponentHide: Ext.emptyFn,
    toggleWindow: function (i, d) {
        var f = this, g = f.windows, b = g.length, h = f.focusedCmp, a = 0, j = 0, c;
        if (b === 1) {
            return
        }
        c = h.isWindow ? h : h.up("window");
        if (c) {
            a = f.findWindowIndex(c)
        }
        if (d.shiftKey) {
            j = a - 1;
            if (j < 0) {
                j = b - 1
            }
        } else {
            j = a + 1;
            if (j === b) {
                j = 0
            }
        }
        c = g[j];
        if (c.cmp.isWindow) {
            c.cmp.toFront()
        }
        c.cmp.focus(false, 100);
        return false
    },
    addWindow: function (b) {
        var a = this, c = {cmp: b};
        a.windows.push(c)
    },
    removeWindow: function (b) {
        var a = this, c = a.windows, d;
        if (c.length === 1) {
            return
        }
        d = a.findWindowIndex(b);
        if (d >= 0) {
            Ext.Array.erase(c, d, 1)
        }
    },
    findWindowIndex: function (e) {
        var d = this, f = d.windows, c = f.length, b = -1, a;
        for (a = 0; a < c; a++) {
            if (f[a].cmp === e) {
                b = a;
                break
            }
        }
        return b
    }
}, function () {
    var a = Ext.FocusManager = Ext.aria.FocusManager;
    Ext.onReady(function () {
        a.enable()
    })
});
Ext.define("Ext.aria.Component", {
    override: "Ext.Component",
    requires: ["Ext.aria.FocusManager"],
    ariaRenderAttributesToElement: true,
    statics: {ariaHighContrastModeCls: Ext.baseCSSPrefix + "aria-highcontrast"},
    ariaApplyAfterRenderAttributes: function () {
        var b = this, c = b.ariaRole, a;
        if (c !== "presentation") {
            a = b.ariaGetAfterRenderAttributes();
            b.ariaUpdate(a)
        }
    },
    ariaGetRenderAttributes: function () {
        var b = this, c = b.ariaRole, a = {role: c};
        if (c === "presentation" || c === undefined) {
            return a
        }
        if (b.hidden) {
            a["aria-hidden"] = true
        }
        if (b.disabled) {
            a["aria-disabled"] = true
        }
        if (b.ariaLabel) {
            a["aria-label"] = b.ariaLabel
        }
        Ext.apply(a, b.ariaAttributes);
        return a
    },
    ariaGetAfterRenderAttributes: function () {
        var c = this, a = {}, b;
        if (!c.ariaLabel && c.ariaLabelledBy) {
            b = c.ariaGetLabelEl(c.ariaLabelledBy);
            if (b) {
                a["aria-labelledby"] = b.id
            }
        }
        if (c.ariaDescribedBy) {
            b = c.ariaGetLabelEl(c.ariaDescribedBy);
            if (b) {
                a["aria-describedby"] = b.id
            }
        }
        return a
    },
    ariaUpdate: function (b, a) {
        if (arguments.length === 1) {
            a = b;
            b = this.ariaGetEl()
        }
        if (!b) {
            return
        }
        b.set(a)
    },
    ariaGetEl: function () {
        return this.el
    },
    ariaGetLabelEl: function (a) {
        var c = this, b = null;
        if (a) {
            if (/^#/.test(a)) {
                a = a.replace(/^#/, "");
                b = Ext.get(a)
            } else {
                b = c.ariaGetEl().down(a)
            }
        }
        return b
    },
    ariaGetFocusEl: function () {
        var a = this.getFocusEl();
        while (a.isComponent) {
            a = a.getFocusEl()
        }
        return a
    },
    onFocus: function (h, b, a) {
        var d = this, g = Ext.aria.FocusManager, f, c;
        d.callParent(arguments);
        if (d.tooltip && Ext.quickTipsActive) {
            f = Ext.tip.QuickTipManager.getQuickTip();
            c = d.ariaGetEl();
            f.cancelShow(c);
            f.showByTarget(c)
        }
        if (d.hasFocus && g.enabled) {
            return g.onComponentFocus(d)
        }
    },
    onBlur: function (f, b, a) {
        var c = this, d = Ext.aria.FocusManager;
        c.callParent(arguments);
        if (c.tooltip && Ext.quickTipsActive) {
            Ext.tip.QuickTipManager.getQuickTip().cancelShow(c.ariaGetEl())
        }
        if (!c.hasFocus && d.enabled) {
            return d.onComponentBlur(c)
        }
    },
    onDisable: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-disabled": true})
    },
    onEnable: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-disabled": false})
    },
    onHide: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-hidden": true})
    },
    onShow: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-hidden": false})
    }
}, function () {
    function a() {
        var f = "http://www.html5accessibility.com/tests/clear.gif", d = {}, i = document.createElement("div"), g = Ext.get(i), c = i.style, e = document.createElement("img"), d = {
            images: true,
            backgroundImages: true,
            borderColors: true,
            highContrastMode: false,
            lightOnDark: false
        };
        i.id = "ui-helper-high-contrast";
        i.className = "ui-helper-hidden-accessible";
        c.borderWidth = "1px";
        c.borderStyle = "solid";
        c.borderTopColor = "#F00";
        c.borderRightColor = "#FF0";
        c.backgroundColor = "#FFF";
        c.width = "2px";
        e.alt = "";
        i.appendChild(e);
        document.body.appendChild(i);
        c.backgroundImage = "url(" + f + ")";
        e.src = f;
        var h = function (n) {
            var j = [], l = 0, k;
            if (n.indexOf("rgb(") !== -1) {
                j = n.replace("rgb(", "").replace(")", "").split(", ")
            } else {
                if (n.indexOf("#") !== -1) {
                    k = n.match(n.length === 7 ? /^#(\S\S)(\S\S)(\S\S)$/ : /^#(\S)(\S)(\S)$/);
                    if (k) {
                        j = ["0x" + k[1], "0x" + k[2], "0x" + k[3]]
                    }
                }
            }
            for (var m = 0; m < j.length; m++) {
                l += parseInt(j[m])
            }
            return l
        };
        var b = function (l) {
            var k = g.getStyle("backgroundImage"), j = Ext.getBody();
            d.images = e.offsetWidth === 1;
            d.backgroundImages = !(k !== null && (k === "none" || k === "url(invalid-url:)"));
            d.borderColors = !(g.getStyle("borderTopColor") === g.getStyle("borderRightColor"));
            d.highContrastMode = !d.images || !d.backgroundImages;
            d.lightOnDark = h(g.getStyle("color")) - h(g.getStyle("backgroundColor")) > 0;
            if (Ext.isIE) {
                i.outerHTML = ""
            } else {
                document.body.removeChild(i)
            }
        };
        b();
        return d
    }

    Ext.enableAria = true;
    Ext.onReady(function () {
        var c = Ext.supports, b, d;
        b = Ext.isWindows ? a() : {};
        c.HighContrastMode = !!b.highContrastMode;
        if (c.HighContrastMode) {
            Ext.getBody().addCls(Ext.Component.ariaHighContrastModeCls)
        }
    })
});
Ext.define("Ext.aria.Img", {
    override: "Ext.Img", getElConfig: function () {
        var b = this, a;
        a = b.callParent();
        a.tabIndex = -1;
        return a
    }, onRender: function () {
        var a = this;
        if (!a.alt) {
            Ext.log.warn("For ARIA compliance, IMG elements SHOULD have an alt attribute")
        }
        a.callParent()
    }
});
Ext.define("Ext.aria.panel.Tool", {
    override: "Ext.panel.Tool",
    requires: ["Ext.aria.Component", "Ext.util.KeyMap"],
    tabIndex: 0,
    destroy: function () {
        if (this.keyMap) {
            this.keyMap.destroy()
        }
        this.callParent()
    },
    ariaAddKeyMap: function (b) {
        var a = this;
        a.keyMap = new Ext.util.KeyMap(Ext.apply({target: a.el}, b))
    },
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent(arguments);
        if (b.tooltip && b.tooltipType === "qtip") {
            a["aria-label"] = b.tooltip
        }
        return a
    }
});
Ext.define("ExtThemeNeptune.resizer.Splitter", {override: "Ext.resizer.Splitter", size: 8});
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
Ext.define("Ext.aria.panel.Panel", {
    override: "Ext.panel.Panel",
    closeText: "Close Panel",
    collapseText: "Collapse Panel",
    expandText: "Expand Panel",
    untitledText: "Untitled Panel",
    onBoxReady: function () {
        var e = this, b = Ext.event.Event, c = e.collapseTool, g, f, d, a;
        e.callParent();
        if (c) {
            c.ariaUpdate({"aria-label": e.collapsed ? e.expandText : e.collapseText});
            c.ariaAddKeyMap({key: [b.ENTER, b.SPACE], handler: e.toggleCollapse, scope: e})
        }
        if (e.closable) {
            toolBtn = e.down("tool[type=close]");
            if (toolBtn) {
                toolBtn.ariaUpdate({"aria-label": e.closeText});
                toolBtn.ariaAddKeyMap({key: [b.ENTER, b.SPACE], handler: e.close, scope: e})
            }
        }
        g = e.getHeader()
    },
    setTitle: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-label": b})
    },
    createReExpander: function (g, f) {
        var d = this, b = Ext.event.Event, e, a, c;
        e = d.getOppositeDirection(g);
        a = d.callParent(arguments);
        c = a.down("tool[type=expand-" + e + "]");
        if (c) {
            c.on("boxready", function () {
                c.ariaUpdate({"aria-label": d.collapsed ? d.expandText : d.collapseText});
                c.ariaAddKeyMap({key: [b.ENTER, b.SPACE], handler: d.toggleCollapse, scope: d})
            }, {single: true})
        }
        return a
    },
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        if (b.collapsible) {
            a["aria-expanded"] = !b.collapsed
        }
        return a
    },
    ariaGetAfterRenderAttributes: function () {
        var e = this, c = {}, b, a, d;
        b = e.callParent(arguments);
        if (e.ariaRole === "presentation") {
            return b
        }
        if (e.title) {
            d = e.ariaGetTitleTextEl();
            if (d) {
                c = {"aria-labelledby": d.id}
            } else {
                c = {"aria-label": e.title}
            }
        } else {
            if (e.ariaLabel) {
                c = {"aria-label": e.ariaLabel}
            }
        }
        Ext.apply(b, c);
        return b
    },
    ariaGetTitleTextEl: function () {
        var a = this.header;
        return a && a.titleCmp && a.titleCmp.textEl || null
    },
    afterExpand: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-expanded": true});
        if (a.collapseTool) {
            a.ariaUpdate(a.collapseTool.getEl(), {"aria-label": a.collapseText})
        }
    },
    afterCollapse: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-expanded": false});
        if (a.collapseTool) {
            a.ariaUpdate(a.collapseTool.getEl(), {"aria-label": a.expandText})
        }
    }
});
Ext.define("Ext.aria.form.field.Base", {
    override: "Ext.form.field.Base",
    requires: ["Ext.util.Format", "Ext.aria.Component"],
    ariaRenderAttributesToElement: false,
    msgTarget: "side",
    getSubTplData: function () {
        var c = this, a = Ext.util.Format.attributes, d, b;
        d = c.callParent(arguments);
        b = c.ariaGetRenderAttributes();
        delete b.role;
        d.inputAttrTpl = [d.inputAttrTpl, a(b)].join(" ");
        return d
    },
    ariaGetEl: function () {
        return this.inputEl
    },
    ariaGetRenderAttributes: function () {
        var c = this, d = c.readOnly, a = c.formatText, b;
        b = c.callParent();
        if (d != null) {
            b["aria-readonly"] = !!d
        }
        if (a && !b.title) {
            b.title = Ext.String.format(a, c.format)
        }
        return b
    },
    ariaGetAfterRenderAttributes: function () {
        var c = this, b = c.labelEl, a;
        a = c.callParent();
        if (b) {
            a["aria-labelledby"] = b.id
        }
        return a
    },
    setReadOnly: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-readonly": b})
    },
    markInvalid: function (b, c) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-invalid": true})
    },
    clearInvalid: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-invalid": false})
    }
});
Ext.define("Ext.aria.form.field.Display", {
    override: "Ext.form.field.Display",
    requires: ["Ext.aria.form.field.Base"],
    msgTarget: "none",
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-readonly"] = true;
        return a
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
Ext.define("Ext.aria.view.View", {
    override: "Ext.view.View", initComponent: function () {
        var b = this, a;
        b.callParent();
        a = b.getSelectionModel();
        a.on({scope: b, select: b.ariaSelect, deselect: b.ariaDeselect});
        b.on({scope: b, refresh: b.ariaInitViewItems, itemadd: b.ariaItemAdd, itemremove: b.ariaItemRemove})
    }, ariaGetRenderAttributes: function () {
        var b = this, a, c;
        a = b.callParent();
        c = b.getSelectionModel().getSelectionMode();
        if (c !== "SINGLE") {
            a["aria-multiselectable"] = true
        }
        if (b.title) {
            a["aria-label"] = b.title
        }
        return a
    }, ariaInitViewItems: function () {
        var g = this, b = g.pageSize || g.store.buffered, h = g.store.requestStart + 1, c, f, e, d, a;
        c = g.getNodes();
        e = g.store.getTotalCount();
        for (d = 0, a = c.length; d < a; d++) {
            f = c[d];
            if (!f.id) {
                f.setAttribute("id", Ext.id())
            }
            f.setAttribute("role", g.itemAriaRole);
            f.setAttribute("aria-selected", false);
            if (b) {
                f.setAttribute("aria-setsize", e);
                f.setAttribute("aria-posinset", h + d)
            }
        }
    }, ariaSelect: function (b, a) {
        var d = this, c;
        c = d.getNode(a);
        if (c) {
            c.setAttribute("aria-selected", true);
            d.ariaUpdate({"aria-activedescendant": c.id})
        }
    }, ariaDeselect: function (b, a) {
        var d = this, c;
        c = d.getNode(a);
        if (c) {
            c.removeAttribute("aria-selected");
            d.ariaUpdate({"aria-activedescendant": undefined})
        }
    }, ariaItemRemove: function (d, e, c) {
        if (!c) {
            return
        }
        var g = this, b, f, a;
        b = g.el.getAttribute("aria-activedescendant");
        for (f = 0, a = c.length; f < a; f++) {
            if (b === c[f].id) {
                g.ariaUpdate({"aria-activedescendant": undefined});
                break
            }
        }
    }, ariaItemAdd: function (b, c, a) {
        this.ariaInitViewItems(b, c, a)
    }, setTitle: function (b) {
        var a = this;
        a.title = b;
        a.ariaUpdate({"aria-label": b})
    }
});
Ext.define("Ext.aria.view.Table", {
    override: "Ext.view.Table",
    requires: ["Ext.aria.view.View"],
    ariaGetRenderAttributes: function () {
        var e = this, b = e.plugins, f = true, c, d, a;
        c = e.callParent();
        if (b) {
            for (d = 0, a = b.length; d < a; d++) {
                if ("editing" in b[d]) {
                    f = false;
                    break
                }
            }
        }
        c["aria-readonly"] = f;
        return c
    },
    ariaItemAdd: Ext.emptyFn,
    ariaItemRemove: Ext.emptyFn,
    ariaInitViewItems: Ext.emptyFn,
    ariaFindNode: function (b, a, f, c) {
        var e = this, d;
        if (b.isCellModel) {
            if (c > -1) {
                d = e.getCellByPosition({row: f, column: c})
            } else {
                d = e.getCellByPosition({row: f, column: 0})
            }
        } else {
            d = Ext.fly(e.getNode(a))
        }
        return d
    },
    ariaSelect: function (b, a, f, c) {
        var e = this, d;
        d = e.ariaFindNode(b, a, f, c);
        if (d) {
            d.set({"aria-selected": true});
            e.ariaUpdate({"aria-activedescendant": d.id})
        }
    },
    ariaDeselect: function (b, a, f, c) {
        var e = this, d;
        d = e.ariaFindNode(b, a, f, c);
        if (d) {
            d.set({"aria-selected": undefined});
            e.ariaUpdate({"aria-activedescendant": undefined})
        }
    },
    renderRow: function (a, d, b) {
        var c = this, e = c.rowValues;
        e.ariaRowAttr = 'role="row"';
        return c.callParent(arguments)
    },
    renderCell: function (f, a, c, h, e, d) {
        var g = this, b = g.cellValues;
        b.ariaCellAttr = 'role="gridcell"';
        b.ariaCellInnerAttr = "";
        return g.callParent(arguments)
    },
    collectData: function (a, d) {
        var b = this, c;
        c = b.callParent(arguments);
        Ext.applyIf(c, {ariaTableAttr: 'role="presentation"', ariaTbodyAttr: 'role="rowgroup"'});
        return c
    }
});
Ext.define("Ext.aria.form.field.Checkbox", {
    override: "Ext.form.field.Checkbox",
    requires: ["Ext.aria.form.field.Base"],
    isFieldLabelable: false,
    hideLabel: true,
    ariaGetEl: function () {
        return this.inputEl
    },
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent(arguments);
        a["aria-checked"] = b.getValue();
        if (b.required) {
            a["aria-required"] = true
        }
        return a
    },
    ariaGetAfterRenderAttributes: function () {
        var c = this, b = c.boxLabelEl, a;
        a = c.callParent();
        if (c.boxLabel && !c.fieldLabel && b) {
            a["aria-labelledby"] = b.id
        }
        return a
    },
    onChange: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-checked": a.getValue()})
    }
});
Ext.define("Ext.aria.grid.header.Container", {
    override: "Ext.grid.header.Container",
    ariaGetAfterRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        delete a["aria-label"];
        return a
    }
});
Ext.define("Ext.aria.grid.column.Column", {
    override: "Ext.grid.column.Column",
    ariaSortStates: {ASC: "ascending", DESC: "descending"},
    ariaGetAfterRenderAttributes: function () {
        var d = this, b = d.sortState, c = d.ariaSortStates, a;
        a = d.callParent();
        a["aria-sort"] = c[b];
        return a
    },
    setSortState: function (e) {
        var b = this, a = b.ariaSortStates, d = b.sortState, c;
        b.callParent(arguments);
        c = b.sortState;
        if (d !== c) {
            b.ariaUpdate({"aria-sort": a[c]})
        }
    }
});
Ext.define("Ext.aria.grid.NavigationModel", {override: "Ext.grid.NavigationModel", preventWrap: true});
Ext.define("Ext.aria.form.field.Text", {
    override: "Ext.form.field.Text",
    requires: ["Ext.aria.form.field.Base"],
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        if (b.allowBlank !== undefined) {
            a["aria-required"] = !b.allowBlank
        }
        return a
    }
});
Ext.define("Ext.aria.button.Button", {
    override: "Ext.button.Button",
    requires: ["Ext.aria.Component"],
    showEmptyMenu: true,
    ariaGetRenderAttributes: function () {
        var b = this, c = b.menu, a;
        a = b.callParent(arguments);
        if (c) {
            a["aria-haspopup"] = true;
            a["aria-owns"] = c.id
        }
        if (b.enableToggle) {
            a["aria-pressed"] = b.pressed
        }
        return a
    },
    toggle: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-pressed": a.pressed})
    },
    ariaGetLabelEl: function () {
        return this.btnInnerEl
    }
});
Ext.define("Ext.aria.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "closable",
    ariaGetAfterRenderAttributes: function () {
        var b = this, a;
        a = b.callParent(arguments);
        a["aria-selected"] = !!b.active;
        if (b.card && b.card.getEl()) {
            a["aria-controls"] = b.card.getEl().id
        }
        return a
    },
    activate: function (a) {
        this.callParent([a]);
        this.ariaUpdate({"aria-selected": true})
    },
    deactivate: function (a) {
        this.callParent([a]);
        this.ariaUpdate({"aria-selected": false})
    }
});
Ext.define("Ext.aria.tab.Bar", {
    override: "Ext.tab.Bar",
    requires: ["Ext.aria.tab.Tab"],
    findNextActivatable: function (a) {
        var c = this, b;
        b = c.callParent(arguments);
        if (!b) {
            b = c.activeTab
        }
        return b
    }
});
Ext.define("Ext.aria.tab.Panel", {
    override: "Ext.tab.Panel",
    requires: ["Ext.layout.container.Card", "Ext.aria.tab.Bar"],
    isTabPanel: true,
    onAdd: function (b, a) {
        b.ariaRole = "tabpanel";
        this.callParent(arguments)
    },
    setActiveTab: function (c) {
        var g = this, b, f, e, d, a;
        g.callParent(arguments);
        b = g.getRefItems();
        for (d = 0, a = b.length; d < a; d++) {
            f = b[d];
            if (f.ariaRole === "tabpanel") {
                e = f === c;
                f.ariaUpdate({"aria-expanded": e, "aria-hidden": !e})
            }
        }
    },
    ariaIsOwnTab: function (a) {
        return a.isTab && a.isGroupedBy.ownerCt === this
    }
});
Ext.define("Ext.aria.window.Window", {
    override: "Ext.window.Window",
    requires: ["Ext.aria.panel.Panel", "Ext.util.ComponentDragger", "Ext.util.Region", "Ext.EventManager", "Ext.aria.FocusManager"],
    closeText: "Close Window",
    moveText: "Move Window",
    resizeText: "Resize Window",
    deltaMove: 10,
    deltaResize: 10,
    initComponent: function () {
        var a = this, b = a.tools;
        if (!b) {
            a.tools = b = []
        }
        if (!a.isToast) {
            b.unshift({type: "resize", tooltip: a.resizeText}, {type: "move", tooltip: a.moveText})
        }
        a.callParent()
    },
    onBoxReady: function () {
        var c = this, b = Ext.event.Event, a;
        c.callParent();
        if (c.isToast) {
            return
        }
        if (c.draggable) {
            a = c.down("tool[type=move]");
            if (a) {
                c.ariaUpdate(a.getEl(), {"aria-label": c.moveText});
                a.keyMap = new Ext.util.KeyMap({
                    target: a.el,
                    key: [b.UP, b.DOWN, b.LEFT, b.RIGHT],
                    handler: c.moveWindow,
                    scope: c
                })
            }
        }
        if (c.resizable) {
            a = c.down("tool[type=resize]");
            if (a) {
                c.ariaUpdate(a.getEl(), {"aria-label": c.resizeText});
                a.keyMap = new Ext.util.KeyMap({
                    target: a.el,
                    key: [b.UP, b.DOWN, b.LEFT, b.RIGHT],
                    handler: c.resizeWindow,
                    scope: c
                })
            }
        }
    },
    onEsc: function (a, c) {
        var b = this;
        if (c.within(b.el)) {
            c.stopEvent();
            b.close()
        }
    },
    onShow: function () {
        var a = this;
        a.callParent(arguments);
        Ext.aria.FocusManager.addWindow(a)
    },
    afterHide: function () {
        var a = this;
        Ext.aria.FocusManager.removeWindow(a);
        a.callParent(arguments)
    },
    moveWindow: function (d, c) {
        var b = this, g = b.deltaMove, f = b.getPosition(), a = Ext.event.Event;
        switch (d) {
            case a.RIGHT:
                f[0] += g;
                break;
            case a.LEFT:
                f[0] -= g;
                break;
            case a.UP:
                f[1] -= g;
                break;
            case a.DOWN:
                f[1] += g;
                break
        }
        b.setPagePosition(f);
        c.stopEvent()
    },
    resizeWindow: function (g, f) {
        var d = this, h = d.deltaResize, c = d.getWidth(), a = d.getHeight(), b = Ext.event.Event;
        switch (g) {
            case b.RIGHT:
                c += h;
                break;
            case b.LEFT:
                c -= h;
                break;
            case b.UP:
                a -= h;
                break;
            case b.DOWN:
                a += h;
                break
        }
        d.setSize(c, a);
        f.stopEvent()
    }
});
Ext.define("Ext.aria.tip.QuickTip", {
    override: "Ext.tip.QuickTip", showByTarget: function (f) {
        var c = this, e, b, d, a, g;
        e = c.targets[f.id];
        if (!e) {
            return
        }
        c.activeTarget = e;
        c.activeTarget.el = Ext.get(f).dom;
        c.anchor = c.activeTarget.anchor;
        b = f.getSize();
        d = f.getXY();
        c.showAt([d[0], d[1] + b.height])
    }
});
Ext.define("Ext.aria.button.Split", {override: "Ext.button.Split"});
Ext.define("Ext.aria.button.Cycle", {override: "Ext.button.Cycle"});
Ext.define("ExtThemeNeptune.container.ButtonGroup", {override: "Ext.container.ButtonGroup", usePlainButtons: false});
Ext.define("Ext.aria.container.Viewport", {
    override: "Ext.container.Viewport", initComponent: function () {
        var g = this, b = g.items, f = g.layout, c, a, e, d;
        if (b && f === "border" || (Ext.isObject(f) && f.type === "border")) {
            for (c = 0, a = b.length; c < a; c++) {
                e = b[c];
                if (e.region) {
                    Ext.applyIf(e, {ariaRole: "region", headerRole: "heading"})
                }
            }
        }
        g.callParent()
    }, ariaGetAfterRenderAttributes: function () {
        var a = this.callParent();
        a.role = this.ariaRole;
        delete a["aria-label"];
        delete a["aria-labelledby"];
        return a
    }
});
Ext.define("Ext.aria.form.field.TextArea", {
    override: "Ext.form.field.TextArea",
    requires: ["Ext.aria.form.field.Text"],
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-multiline"] = true;
        return a
    }
});
Ext.define("Ext.aria.window.MessageBox", {
    override: "Ext.window.MessageBox",
    requires: ["Ext.aria.window.Window", "Ext.aria.form.field.Text", "Ext.aria.form.field.TextArea", "Ext.aria.form.field.Display", "Ext.aria.button.Button"]
});
Ext.define("Ext.aria.form.FieldContainer", {
    override: "Ext.form.FieldContainer",
    ariaGetAfterRenderAttributes: function () {
        var b = this, a;
        a = b.callParent(arguments);
        if (b.fieldLabel && b.labelEl) {
            a["aria-labelledby"] = b.labelEl.id
        }
        return a
    }
});
Ext.define("Ext.aria.form.CheckboxGroup", {
    override: "Ext.form.CheckboxGroup",
    requires: ["Ext.aria.form.FieldContainer", "Ext.aria.form.field.Base"],
    msgTarget: "side",
    setReadOnly: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-readonly": !!b})
    },
    markInvalid: function (b, c) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-invalid": !!c})
    },
    clearInvalid: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-invalid": false})
    }
});
Ext.define("Ext.aria.form.FieldSet", {
    override: "Ext.form.FieldSet",
    expandText: "Expand",
    collapseText: "Collapse",
    onBoxReady: function () {
        var c = this, d = c.checkboxCmp, e = c.toggleCmp, b = c.legend, a;
        c.callParent(arguments);
        if (!b) {
            return
        }
        b.collapseImmune = true;
        b.getInherited().collapseImmune = true;
        if (d) {
            d.collapseImmune = true;
            d.getInherited().collapseImmune = true;
            d.getActionEl().set({title: c.expandText + " " + c.title})
        }
        if (e) {
            e.collapseImmune = true;
            e.getInherited().collapseImmune = true;
            e.keyMap = new Ext.util.KeyMap({
                target: e.el,
                key: [Ext.event.Event.ENTER, Ext.event.Event.SPACE],
                handler: function (f, h, g) {
                    h.stopEvent();
                    c.toggle()
                },
                scope: c
            });
            a = e.getActionEl();
            if (c.collapsed) {
                a.set({title: c.expandText + " " + c.title})
            } else {
                a.set({title: c.collapseText + " " + c.title})
            }
        }
    },
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent(arguments);
        a["aria-expanded"] = !b.collapsed;
        return a
    },
    setExpanded: function (a) {
        var c = this, d = c.toggleCmp, b;
        c.callParent(arguments);
        c.ariaUpdate({"aria-expanded": a});
        if (d) {
            b = d.getActionEl();
            if (!a) {
                b.set({title: c.expandText + " " + c.title})
            } else {
                b.set({title: c.collapseText + " " + c.title})
            }
        }
    }
});
Ext.define("Ext.aria.form.RadioGroup", {
    override: "Ext.form.RadioGroup",
    requires: ["Ext.aria.form.CheckboxGroup"],
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        if (b.allowBlank !== undefined) {
            a["aria-required"] = !b.allowBlank
        }
        return a
    },
    ariaGetAfterRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        if (b.labelEl) {
            a["aria-labelledby"] = b.labelEl.id
        }
        return a
    }
});
Ext.define("Ext.aria.form.field.Picker", {
    override: "Ext.form.field.Picker", ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-haspopup"] = true;
        return a
    }, ariaGetAfterRenderAttributes: function () {
        var c = this, b, a;
        b = c.callParent();
        a = c.getPicker();
        if (a) {
            b["aria-owns"] = a.id
        }
        return b
    }
});
Ext.define("Ext.aria.view.BoundListKeyNav", {
    override: "Ext.view.BoundListKeyNav",
    requires: ["Ext.aria.view.View"],
    focusItem: function (c) {
        var b = this, a = b.view;
        if (typeof c === "number") {
            c = a.all.item(c)
        }
        if (c) {
            a.ariaUpdate({"aria-activedescendant": Ext.id(c, b.id + "-")});
            b.callParent([c])
        }
    }
});
Ext.define("Ext.aria.form.field.Number", {
    override: "Ext.form.field.Number", ariaGetRenderAttributes: function () {
        var e = this, d = e.minValue, a = e.maxValue, c, b;
        c = e.callParent(arguments);
        b = e.getValue();
        if (d !== Number.NEGATIVE_INFINITY) {
            c["aria-valuemin"] = isFinite(d) ? d : "NaN"
        }
        if (a !== Number.MAX_VALUE) {
            c["aria-valuemax"] = isFinite(a) ? a : "NaN"
        }
        c["aria-valuenow"] = b !== null && isFinite(b) ? b : "NaN";
        return c
    }, onChange: function (c) {
        var b = this, a;
        b.callParent(arguments);
        a = b.getValue();
        b.ariaUpdate({"aria-valuenow": a !== null && isFinite(a) ? a : "NaN"})
    }, setMinValue: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-valuemin": isFinite(a.minValue) ? a.minValue : "NaN"})
    }, setMaxValue: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-valuemax": isFinite(a.maxValue) ? a.maxValue : "NaN"})
    }
});
Ext.define("ExtThemeNeptune.toolbar.Paging", {
    override: "Ext.toolbar.Paging",
    defaultButtonUI: "plain-toolbar",
    inputItemWidth: 40
});
Ext.define("Ext.aria.view.BoundList", {
    override: "Ext.view.BoundList", onHide: function () {
        this.ariaUpdate({"aria-activedescendant": Ext.emptyString});
        this.callParent(arguments)
    }
});
Ext.define("Ext.aria.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    requires: ["Ext.aria.form.field.Picker"],
    createPicker: function () {
        var b = this, a;
        a = b.callParent(arguments);
        if (a) {
            b.mon(a, {highlightitem: b.ariaUpdateActiveDescendant, scope: b})
        }
        return a
    },
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-readonly"] = !!(!b.editable || b.readOnly);
        a["aria-expanded"] = !!b.isExpanded;
        a["aria-autocomplete"] = "list";
        return a
    },
    setReadOnly: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-readonly": a.readOnly})
    },
    setEditable: function (a) {
        var b = this;
        b.callParent(arguments);
        b.ariaUpdate({"aria-readonly": !b.editable})
    },
    onExpand: function () {
        var b = this, a = b.picker.getSelectedNodes();
        b.callParent(arguments);
        b.ariaUpdate({"aria-expanded": true, "aria-activedescendant": (a.length ? a[0].id : undefined)})
    },
    onCollapse: function () {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-expanded": false, "aria-activedescendant": undefined})
    },
    ariaUpdateActiveDescendant: function (a) {
        this.ariaUpdate({"aria-activedescendant": a.highlightedItem ? a.highlightedItem.id : undefined})
    }
});
Ext.define("ExtThemeNeptune.picker.Month", {override: "Ext.picker.Month", measureMaxHeight: 36});
Ext.define("Ext.aria.form.field.Date", {
    override: "Ext.form.field.Date",
    requires: ["Ext.aria.form.field.Picker"],
    formatText: "Expected date format {0}",
    onCollapse: function () {
        var a = this;
        if (!a.doCancelFieldFocus) {
            a.focus(false, 60)
        }
    }
});
Ext.define("Ext.aria.picker.Color", {
    override: "Ext.picker.Color",
    requires: ["Ext.aria.Component"],
    initComponent: function () {
        var a = this;
        a.callParent(arguments)
    },
    ariaGetEl: function () {
        return this.innerEl
    },
    onColorSelect: function (b, a) {
        var c = this;
        if (a && a.dom) {
            c.ariaUpdate(c.eventEl, {"aria-activedescendant": a.dom.id})
        }
    },
    privates: {
        getFocusEl: function () {
            return this.el
        }
    }
});
Ext.define("ExtThemeNeptune.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    defaultButtonUI: "plain-toolbar"
});
Ext.define("Ext.aria.form.field.Time", {
    override: "Ext.form.field.Time",
    requires: ["Ext.aria.form.field.ComboBox"],
    formatText: "Expected time format HH:MM AM or PM"
});
Ext.define("ExtThemeNeptune.grid.RowEditor", {override: "Ext.grid.RowEditor", buttonUI: "default-toolbar"});
Ext.define("ExtThemeNeptune.grid.column.RowNumberer", {override: "Ext.grid.column.RowNumberer", width: 25});
Ext.define("Ext.aria.menu.Item", {
    override: "Ext.menu.Item", ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        if (b.menu) {
            a["aria-haspopup"] = true
        }
        return a
    }, ariaGetAfterRenderAttributes: function () {
        var b = this, c = b.menu, a;
        a = b.callParent();
        if (c && c.rendered) {
            a["aria-controls"] = c.ariaGetEl().id
        }
        if (b.plain) {
            a["aria-label"] = b.text
        } else {
            a["aria-labelledby"] = b.textEl.id
        }
        return a
    }, doExpandMenu: function () {
        var a = this, b = a.menu;
        a.callParent();
        if (b && b.rendered) {
            a.ariaUpdate({"aria-controls": b.ariaGetEl().id})
        }
    }
});
Ext.define("Ext.aria.menu.CheckItem", {
    override: "Ext.menu.CheckItem", ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-checked"] = b.menu ? "mixed" : !!b.checked;
        return a
    }
});
Ext.define("ExtThemeNeptune.menu.Separator", {override: "Ext.menu.Separator", border: true});
Ext.define("ExtThemeNeptune.menu.Menu", {override: "Ext.menu.Menu", showSeparator: false});
Ext.define("Ext.aria.slider.Thumb", {
    override: "Ext.slider.Thumb", move: function (c, b) {
        var f = this, d = f.el, e = f.slider, a = e.vertical ? "bottom" : e.horizontalProp, h, g;
        c += "%";
        if (!b) {
            d.dom.style[a] = c;
            e.fireEvent("move", e, c, f)
        } else {
            h = {};
            h[a] = c;
            if (!Ext.supports.GetPositionPercentage) {
                g = {};
                g[a] = d.dom.style[a]
            }
            new Ext.fx.Anim({
                target: d, duration: 350, from: g, to: h, callback: function () {
                    e.fireEvent("move", e, c, f)
                }
            })
        }
    }
});
Ext.define("Ext.aria.slider.Tip", {
    override: "Ext.slider.Tip", init: function (b) {
        var a = this, c = b.tipHideTimeout;
        a.onSlide = Ext.Function.createThrottled(a.onSlide, 50, a);
        a.hide = Ext.Function.createBuffered(a.hide, c, a);
        a.callParent(arguments);
        b.on({scope: a, change: a.onSlide, move: a.onSlide, changecomplete: a.hide})
    }
});
Ext.define("Ext.aria.slider.Multi", {
    override: "Ext.slider.Multi",
    tipHideTimeout: 1000,
    animate: false,
    tabIndex: 0,
    ariaGetRenderAttributes: function () {
        var b = this, a;
        a = b.callParent();
        a["aria-minvalue"] = b.minValue;
        a["aria-maxvalue"] = b.maxValue;
        a["aria-valuenow"] = b.getValue(0);
        return a
    },
    getSubTplData: function () {
        var c = this, a = Ext.util.Format.attributes, d, b;
        d = c.callParent(arguments);
        b = c.ariaGetRenderAttributes();
        delete b.role;
        d.inputAttrTpl = a(b);
        return d
    },
    onKeyDown: function (d) {
        var b = this, a, c;
        if (b.disabled || b.thumbs.length !== 1) {
            d.preventDefault();
            return
        }
        a = d.getKey();
        switch (a) {
            case d.HOME:
                d.stopEvent();
                b.setValue(0, b.minValue, undefined, true);
                return;
            case d.END:
                d.stopEvent();
                b.setValue(0, b.maxValue, undefined, true);
                return;
            case d.PAGE_UP:
                d.stopEvent();
                c = b.getValue(0) - b.keyIncrement * 10;
                b.setValue(0, c, undefined, true);
                return;
            case d.PAGE_DOWN:
                d.stopEvent();
                c = b.getValue(0) + b.keyIncrement * 10;
                b.setValue(0, c, undefined, true);
                return
        }
        b.callParent(arguments)
    },
    setMinValue: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-minvalue": b})
    },
    setMaxValue: function (b) {
        var a = this;
        a.callParent(arguments);
        a.ariaUpdate({"aria-maxvalue": b})
    },
    setValue: function (a, c) {
        var b = this;
        b.callParent(arguments);
        if (a === 0) {
            b.ariaUpdate({"aria-valuenow": c})
        }
    }
});
Ext.define("Ext.aria.window.Toast", {
    override: "Ext.window.Toast", initComponent: function () {
        if (this.autoClose) {
            this.closable = false
        }
        this.callParent()
    }
});
Ext.define("Ext.ux.BoxReorderer", {
    requires: ["Ext.dd.DD"],
    mixins: {observable: "Ext.util.Observable"},
    itemSelector: ".x-box-item",
    animate: 100,
    constructor: function () {
        this.mixins.observable.constructor.apply(this, arguments)
    },
    init: function (a) {
        var b = this;
        b.container = a;
        b.animatePolicy = {};
        b.animatePolicy[a.getLayout().names.x] = true;
        b.container.on({scope: b, boxready: b.onBoxReady, beforedestroy: b.onContainerDestroy})
    },
    onContainerDestroy: function () {
        var a = this.dd;
        if (a) {
            a.unreg();
            this.dd = null
        }
    },
    onBoxReady: function () {
        var c = this, b = c.container.getLayout(), d = b.names, a;
        a = c.dd = new Ext.dd.DD(b.innerCt, c.container.id + "-reorderer");
        Ext.apply(a, {
            animate: c.animate,
            reorderer: c,
            container: c.container,
            getDragCmp: c.getDragCmp,
            clickValidator: Ext.Function.createInterceptor(a.clickValidator, c.clickValidator, c, false),
            onMouseDown: c.onMouseDown,
            startDrag: c.startDrag,
            onDrag: c.onDrag,
            endDrag: c.endDrag,
            getNewIndex: c.getNewIndex,
            doSwap: c.doSwap,
            findReorderable: c.findReorderable
        });
        a.dim = d.width;
        a.startAttr = d.beforeX;
        a.endAttr = d.afterX
    },
    getDragCmp: function (a) {
        return this.container.getChildByElement(a.getTarget(this.itemSelector, 10))
    },
    clickValidator: function (b) {
        var a = this.getDragCmp(b);
        return !!(a && a.reorderable !== false)
    },
    onMouseDown: function (g) {
        var f = this, a = f.container, d, b, c;
        f.dragCmp = f.getDragCmp(g);
        if (f.dragCmp) {
            b = f.dragCmp.getEl();
            f.startIndex = f.curIndex = a.items.indexOf(f.dragCmp);
            c = b.getBox();
            f.lastPos = c[f.startAttr];
            d = a.el.getBox();
            if (f.dim === "width") {
                f.minX = d.left;
                f.maxX = d.right - c.width;
                f.minY = f.maxY = c.top;
                f.deltaX = g.getX() - c.left
            } else {
                f.minY = d.top;
                f.maxY = d.bottom - c.height;
                f.minX = f.maxX = c.left;
                f.deltaY = g.getY() - c.top
            }
            f.constrainY = f.constrainX = true
        }
    },
    startDrag: function () {
        var b = this, a = b.dragCmp;
        if (a) {
            a.setPosition = Ext.emptyFn;
            a.animate = false;
            if (b.animate) {
                b.container.getLayout().animatePolicy = b.reorderer.animatePolicy
            }
            b.dragElId = a.getEl().id;
            b.reorderer.fireEvent("StartDrag", b, b.container, a, b.curIndex);
            a.suspendEvents();
            a.disabled = true;
            a.el.setStyle("zIndex", 100)
        } else {
            b.dragElId = null
        }
    },
    findReorderable: function (c) {
        var d = this, a = d.container.items, b;
        if (a.getAt(c).reorderable === false) {
            b = a.getAt(c);
            if (c > d.startIndex) {
                while (b && b.reorderable === false) {
                    c++;
                    b = a.getAt(c)
                }
            } else {
                while (b && b.reorderable === false) {
                    c--;
                    b = a.getAt(c)
                }
            }
        }
        c = Math.min(Math.max(c, 0), a.getCount() - 1);
        if (a.getAt(c).reorderable === false) {
            return -1
        }
        return c
    },
    doSwap: function (d) {
        var f = this, b = f.container.items, a = f.container, e = f.container._isLayoutRoot, h, c, g;
        d = f.findReorderable(d);
        if (d === -1) {
            return
        }
        f.reorderer.fireEvent("ChangeIndex", f, a, f.dragCmp, f.startIndex, d);
        h = b.getAt(f.curIndex);
        c = b.getAt(d);
        b.remove(h);
        g = Math.min(Math.max(d, 0), b.getCount() - 1);
        b.insert(g, h);
        b.remove(c);
        b.insert(f.curIndex, c);
        a._isLayoutRoot = true;
        a.updateLayout();
        a._isLayoutRoot = e;
        f.curIndex = d
    },
    onDrag: function (c) {
        var b = this, a;
        a = b.getNewIndex(c.getPoint());
        if ((a !== undefined)) {
            b.reorderer.fireEvent("Drag", b, b.container, b.dragCmp, b.startIndex, b.curIndex);
            b.doSwap(a)
        }
    },
    endDrag: function (d) {
        if (d) {
            d.stopEvent()
        }
        var c = this, b = c.container.getLayout(), a;
        if (c.dragCmp) {
            delete c.dragElId;
            delete c.dragCmp.setPosition;
            c.dragCmp.animate = true;
            c.dragCmp.lastBox[b.names.x] = c.dragCmp.getPosition(true)[b.names.widthIndex];
            c.container._isLayoutRoot = true;
            c.container.updateLayout();
            c.container._isLayoutRoot = undefined;
            a = Ext.fx.Manager.getFxQueue(c.dragCmp.el.id)[0];
            if (a) {
                a.on({afteranimate: c.reorderer.afterBoxReflow, scope: c})
            } else {
                Ext.Function.defer(c.reorderer.afterBoxReflow, 1, c)
            }
            if (c.animate) {
                delete b.animatePolicy
            }
            c.reorderer.fireEvent("drop", c, c.container, c.dragCmp, c.startIndex, c.curIndex)
        }
    },
    afterBoxReflow: function () {
        var a = this;
        a.dragCmp.el.setStyle("zIndex", "");
        a.dragCmp.disabled = false;
        a.dragCmp.resumeEvents()
    },
    getNewIndex: function (h) {
        var g = this, a = g.getDragEl(), b = Ext.fly(a).getBox(), l, f, k, d = 0, c = g.container.items.items, e = c.length, j = g.lastPos;
        g.lastPos = b[g.startAttr];
        for (; d < e; d++) {
            l = c[d].getEl();
            if (l.is(g.reorderer.itemSelector)) {
                f = l.getBox();
                k = f[g.startAttr] + (f[g.dim] >> 1);
                if (d < g.curIndex) {
                    if ((b[g.startAttr] < j) && (b[g.startAttr] < (k - 5))) {
                        return d
                    }
                } else {
                    if (d > g.curIndex) {
                        if ((b[g.startAttr] > j) && (b[g.endAttr] > (k + 5))) {
                            return d
                        }
                    }
                }
            }
        }
    }
});
Ext.define("Ext.ux.CellDragDrop", {
    extend: "Ext.plugin.Abstract",
    alias: "plugin.celldragdrop",
    uses: ["Ext.view.DragZone"],
    enforceType: false,
    applyEmptyText: false,
    emptyText: "",
    dropBackgroundColor: "green",
    noDropBackgroundColor: "red",
    dragText: "{0} selected row{1}",
    ddGroup: "GridDD",
    enableDrop: true,
    enableDrag: true,
    containerScroll: false,
    init: function (a) {
        var b = this;
        a.on("render", b.onViewRender, b, {single: true})
    },
    destroy: function () {
        var a = this;
        Ext.destroy(a.dragZone, a.dropZone)
    },
    enable: function () {
        var a = this;
        if (a.dragZone) {
            a.dragZone.unlock()
        }
        if (a.dropZone) {
            a.dropZone.unlock()
        }
        a.callParent()
    },
    disable: function () {
        var a = this;
        if (a.dragZone) {
            a.dragZone.lock()
        }
        if (a.dropZone) {
            a.dropZone.lock()
        }
        a.callParent()
    },
    onViewRender: function (a) {
        var b = this, c;
        if (b.enableDrag) {
            if (b.containerScroll) {
                c = a.getEl()
            }
            b.dragZone = new Ext.view.DragZone({
                view: a,
                ddGroup: b.dragGroup || b.ddGroup,
                dragText: b.dragText,
                containerScroll: b.containerScroll,
                scrollEl: c,
                getDragData: function (j) {
                    var h = this.view, i = j.getTarget(h.getItemSelector()), g = h.getRecord(i), f = j.getTarget(h.getCellSelector()), d, k;
                    if (i) {
                        d = document.createElement("div");
                        d.className = "x-form-text";
                        d.appendChild(document.createTextNode(f.textContent || f.innerText));
                        k = h.getHeaderByCell(f);
                        return {
                            event: new Ext.EventObjectImpl(j),
                            ddel: d,
                            item: j.target,
                            columnName: k.dataIndex,
                            record: g
                        }
                    }
                },
                onInitDrag: function (e, k) {
                    var h = this, j = h.dragData, g = h.view, d = g.getSelectionModel(), f = j.record, i = j.ddel;
                    if (!d.isSelected(f)) {
                        d.select(f, true)
                    }
                    Ext.fly(h.ddel).update(i.textContent || i.innerText);
                    h.proxy.update(h.ddel);
                    h.onStartDrag(e, k);
                    return true
                }
            })
        }
        if (b.enableDrop) {
            b.dropZone = new Ext.dd.DropZone(a.el, {
                view: a,
                ddGroup: b.dropGroup || b.ddGroup,
                containerScroll: true,
                getTargetFromEvent: function (h) {
                    var g = this, f = g.view, d = h.getTarget(f.cellSelector), i, j;
                    if (d) {
                        i = f.findItemByChild(d);
                        j = f.getHeaderByCell(d);
                        if (i && j) {
                            return {node: d, record: f.getRecord(i), columnName: j.dataIndex}
                        }
                    }
                },
                onNodeEnter: function (k, d, j, i) {
                    var f = this, h = k.record.getField(k.columnName).type.toUpperCase(), g = i.record.getField(i.columnName).type.toUpperCase();
                    delete f.dropOK;
                    if (!k || k.node === i.item.parentNode) {
                        return
                    }
                    if (b.enforceType && h !== g) {
                        f.dropOK = false;
                        if (b.noDropCls) {
                            Ext.fly(k.node).addCls(b.noDropCls)
                        } else {
                            Ext.fly(k.node).applyStyles({backgroundColor: b.noDropBackgroundColor})
                        }
                        return false
                    }
                    f.dropOK = true;
                    if (b.dropCls) {
                        Ext.fly(k.node).addCls(b.dropCls)
                    } else {
                        Ext.fly(k.node).applyStyles({backgroundColor: b.dropBackgroundColor})
                    }
                },
                onNodeOver: function (h, d, g, f) {
                    return this.dropOK ? this.dropAllowed : this.dropNotAllowed
                },
                onNodeOut: function (i, d, h, g) {
                    var f = this.dropOK ? b.dropCls : b.noDropCls;
                    if (f) {
                        Ext.fly(i.node).removeCls(f)
                    } else {
                        Ext.fly(i.node).applyStyles({backgroundColor: ""})
                    }
                },
                onNodeDrop: function (h, d, g, f) {
                    if (this.dropOK) {
                        h.record.set(h.columnName, f.record.get(f.columnName));
                        if (b.applyEmptyText) {
                            f.record.set(f.columnName, b.emptyText)
                        }
                        return true
                    }
                },
                onCellDrop: Ext.emptyFn
            })
        }
    }
});
Ext.define("Ext.ux.DataTip", function (e) {
    function c() {
        var f = this.isXType("panel") ? this.body : this.el;
        if (this.dataTip.renderToTarget) {
            this.dataTip.render(f)
        }
        this.dataTip.setTarget(f)
    }

    function a(g, f) {
        if (g.rendered) {
            if (g.host.fireEvent("beforeshowtip", g.eventHost, g, f) === false) {
                return false
            }
            g.update(f)
        } else {
            if (Ext.isString(f)) {
                g.html = f
            } else {
                g.data = f
            }
        }
    }

    function d(g) {
        var h = this.view.getRecord(g.triggerElement), f;
        if (h) {
            f = g.initialConfig.data ? Ext.apply(g.initialConfig.data, h.data) : h.data;
            return a(g, f)
        } else {
            return false
        }
    }

    function b(f) {
        var g = Ext.getCmp(f.triggerElement.id);
        if (g && (g.tooltip || f.tpl)) {
            return a(f, g.tooltip || g)
        } else {
            return false
        }
    }

    return {
        extend: "Ext.tip.ToolTip",
        mixins: {plugin: "Ext.plugin.Abstract"},
        alias: "plugin.datatip",
        lockableScope: "both",
        constructor: function (f) {
            var g = this;
            g.callParent([f]);
            g.mixins.plugin.constructor.call(g, f)
        },
        init: function (g) {
            var f = this;
            f.mixins.plugin.init.call(f, g);
            g.dataTip = f;
            f.host = g;
            if (g.isXType("tablepanel")) {
                f.view = g.getView();
                if (g.ownerLockable) {
                    f.host = g.ownerLockable
                }
                f.delegate = f.delegate || f.view.rowSelector;
                f.on("beforeshow", d)
            } else {
                if (g.isXType("dataview")) {
                    f.view = f.host;
                    f.delegate = f.delegate || g.itemSelector;
                    f.on("beforeshow", d)
                } else {
                    if (g.isXType("form")) {
                        f.delegate = "." + Ext.form.Labelable.prototype.formItemCls;
                        f.on("beforeshow", b)
                    } else {
                        if (g.isXType("combobox")) {
                            f.view = g.getPicker();
                            f.delegate = f.delegate || f.view.getItemSelector();
                            f.on("beforeshow", d)
                        }
                    }
                }
            }
            if (g.rendered) {
                c.call(g)
            } else {
                g.onRender = Ext.Function.createSequence(g.onRender, c)
            }
        }
    }
});
Ext.define("Ext.ux.DataView.Animated", {
    defaults: {duration: 750, idProperty: "id"}, constructor: function (a) {
        Ext.apply(this, a || {}, this.defaults)
    }, init: function (a) {
        var c = this, b = a.store;
        c.dataview = a;
        a.blockRefresh = true;
        a.updateIndexes = Ext.Function.createSequence(a.updateIndexes, function () {
            this.getTargetEl().select(this.itemSelector).each(function (f, g, e) {
                f.dom.id = Ext.util.Format.format("{0}-{1}", a.id, b.getAt(e).internalId)
            }, this)
        }, a);
        c.dataviewID = a.id;
        c.cachedStoreData = {};
        c.cacheStoreData(b.data || b.snapshot);
        a.on("resize", function () {
            var e = a.store;
            if (e.getCount() > 0) {
            }
        }, this);
        a.store.on("datachanged", d, this);
        function d(o) {
            var l = a.getTargetEl(), h = o.getAt(0), q = c.getAdded(o), y = c.getRemoved(o), i = c.getRemaining(o);
            if (!l) {
                return
            }
            Ext.each(y, function (B) {
                var C = c.dataviewID + "-" + B.internalId;
                Ext.fly(C).animate({
                    remove: false, duration: e, opacity: 0, useDisplay: true, callback: function () {
                        Ext.fly(C).setDisplayed(false)
                    }
                })
            }, this);
            if (h == null) {
                c.cacheStoreData(o);
                return
            }
            c.cacheStoreData(o);
            var g = Ext.get(c.dataviewID + "-" + h.internalId);
            if (!g) {
                a.refresh();
                return true
            }
            var k = g.getMargin("lr") + g.getWidth(), w = g.getMargin("bt") + g.getHeight(), s = l.dom.clientWidth, f = Math.floor(s / k), m = c.dataview.getInherited().rtl, r = m ? "right" : "left", v;
            var j = {}, A = {}, t = {};
            Ext.iterate(i, function (D, C) {
                var D = C.internalId, B = t[D] = Ext.get(c.dataviewID + "-" + D);
                j[D] = {top: B.getY() - l.getY() - B.getMargin("t") - l.getPadding("t")};
                j[D][r] = c.getItemX(B)
            });
            Ext.iterate(i, function (E, D) {
                var B = j[E], C = t[E];
                if (C.getStyle("position") != "absolute") {
                    v = {position: "absolute", top: B.top + "px"};
                    v[r] = B[r] + "px";
                    t[E].applyStyles(v)
                }
            });
            var p = 0;
            Ext.iterate(o.data.items, function (C) {
                var G = C.internalId, B = p % f, F = Math.floor(p / f), E = F * w, D = B * k;
                A[G] = {top: E};
                A[G][r] = D;
                p++
            }, this);
            var u = new Date(), e = c.duration, n = c.dataviewID;
            var z = function () {
                var K = new Date() - u, M = K / e, B;
                if (M >= 1) {
                    for (B in A) {
                        v = {top: A[B].top + "px"};
                        v[r] = A[B][r] + "px";
                        Ext.fly(n + "-" + B).applyStyles(v)
                    }
                    Ext.TaskManager.stop(x);
                    a.refresh()
                } else {
                    for (B in A) {
                        if (!i[B]) {
                            continue
                        }
                        var E = j[B], H = A[B], F = E.top, I = H.top, D = E[r], J = H[r], G = M * Math.abs(F - I), L = M * Math.abs(D - J), N = F > I ? F - G : F + G, C = D > J ? D - L : D + L;
                        v = {top: N + "px"};
                        v[r] = C + "px";
                        Ext.fly(n + "-" + B).applyStyles(v).setDisplayed(true)
                    }
                }
            };
            var x = {run: z, interval: 20};
            Ext.iterate(q, function (C, B) {
                v = {top: A[B.internalId].top + "px"};
                v[r] = A[B.internalId][r] + "px";
                Ext.fly(c.dataviewID + "-" + B.internalId).applyStyles(v).setDisplayed(true);
                Ext.fly(c.dataviewID + "-" + B.internalId).animate({remove: false, duration: e, opacity: 1})
            });
            Ext.TaskManager.start(x);
            c.cacheStoreData(o)
        }
    }, getItemX: function (b) {
        var c = this.dataview.getInherited().rtl, a = b.up("");
        if (c) {
            return a.getViewRegion().right - b.getRegion().right + b.getMargin("r")
        } else {
            return b.getX() - a.getX() - b.getMargin("l") - a.getPadding("l")
        }
    }, cacheStoreData: function (a) {
        this.cachedStoreData = {};
        a.each(function (b) {
            this.cachedStoreData[b.internalId] = b
        }, this)
    }, getExisting: function () {
        return this.cachedStoreData
    }, getExistingCount: function () {
        var c = 0, b = this.getExisting();
        for (var a in b) {
            c++
        }
        return c
    }, getAdded: function (a) {
        var b = {};
        a.each(function (c) {
            if (this.cachedStoreData[c.internalId] == undefined) {
                b[c.internalId] = c
            }
        }, this);
        return b
    }, getRemoved: function (a) {
        var b = [], c;
        for (c in this.cachedStoreData) {
            if (a.findBy(function (d) {
                    return d.internalId == c
                }) == -1) {
                b.push(this.cachedStoreData[c])
            }
        }
        return b
    }, getRemaining: function (a) {
        var b = {};
        a.each(function (c) {
            if (this.cachedStoreData[c.internalId] != undefined) {
                b[c.internalId] = c
            }
        }, this);
        return b
    }
});
Ext.define("Ext.ux.DataView.DragSelector", {
    requires: ["Ext.dd.DragTracker", "Ext.util.Region"], init: function (a) {
        this.dataview = a;
        a.mon(a, {
            beforecontainerclick: this.cancelClick,
            scope: this,
            render: {fn: this.onRender, scope: this, single: true}
        })
    }, onRender: function () {
        this.tracker = Ext.create("Ext.dd.DragTracker", {
            dataview: this.dataview,
            el: this.dataview.el,
            dragSelector: this,
            onBeforeStart: this.onBeforeStart,
            onStart: this.onStart,
            onDrag: this.onDrag,
            onEnd: this.onEnd
        });
        this.dragRegion = Ext.create("Ext.util.Region")
    }, onBeforeStart: function (a) {
        return a.target == this.dataview.getEl().dom
    }, onStart: function (b) {
        var c = this.dragSelector, a = this.dataview;
        this.dragging = true;
        c.fillRegions();
        c.getProxy().show();
        a.getSelectionModel().deselectAll()
    }, cancelClick: function () {
        return !this.tracker.dragging
    }, onDrag: function (l) {
        var b = this.dragSelector, k = b.dataview.getSelectionModel(), q = b.dragRegion, p = b.bodyRegion, n = b.getProxy(), g = b.regions, c = g.length, m = this.startXY, s = this.getXY(), f = Math.min(m[0], s[0]), d = Math.min(m[1], s[1]), a = Math.abs(m[0] - s[0]), r = Math.abs(m[1] - s[1]), o, h, j;
        Ext.apply(q, {top: d, left: f, right: f + a, bottom: d + r});
        q.constrainTo(p);
        n.setBox(q);
        for (j = 0; j < c; j++) {
            o = g[j];
            h = q.intersect(o);
            if (h) {
                k.select(j, true)
            } else {
                k.deselect(j)
            }
        }
    }, onEnd: Ext.Function.createDelayed(function (c) {
        var a = this.dataview, b = a.getSelectionModel(), d = this.dragSelector;
        this.dragging = false;
        d.getProxy().hide()
    }, 1), getProxy: function () {
        if (!this.proxy) {
            this.proxy = this.dataview.getEl().createChild({tag: "div", cls: "x-view-selector"})
        }
        return this.proxy
    }, fillRegions: function () {
        var a = this.dataview, b = this.regions = [];
        a.all.each(function (c) {
            b.push(c.getRegion())
        });
        this.bodyRegion = a.getEl().getRegion()
    }
});
Ext.define("Ext.ux.DataView.Draggable", {
    requires: "Ext.dd.DragZone",
    ghostCls: "x-dataview-draggable-ghost",
    ghostTpl: ['<tpl for=".">', "{title}", "</tpl>"],
    init: function (a, b) {
        this.dataview = a;
        a.on("render", this.onRender, this);
        Ext.apply(this, {itemSelector: a.itemSelector, ghostConfig: {}}, b || {});
        Ext.applyIf(this.ghostConfig, {itemSelector: "img", cls: this.ghostCls, tpl: this.ghostTpl})
    },
    onRender: function () {
        var a = Ext.apply({}, this.ddConfig || {}, {
            dvDraggable: this,
            dataview: this.dataview,
            getDragData: this.getDragData,
            getTreeNode: this.getTreeNode,
            afterRepair: this.afterRepair,
            getRepairXY: this.getRepairXY
        });
        this.dragZone = Ext.create("Ext.dd.DragZone", this.dataview.getEl(), a)
    },
    getDragData: function (h) {
        var a = this.dvDraggable, b = this.dataview, c = b.getSelectionModel(), g = h.getTarget(a.itemSelector), d, f;
        if (g) {
            if (!b.isSelected(g)) {
                c.select(b.getRecord(g))
            }
            d = b.getSelectedNodes();
            f = {copy: true, nodes: d, records: c.getSelection(), item: true};
            if (d.length === 1) {
                f.single = true;
                f.ddel = g
            } else {
                f.multi = true;
                f.ddel = a.prepareGhost(c.getSelection()).dom
            }
            return f
        }
        return false
    },
    getTreeNode: function () {
    },
    afterRepair: function () {
        this.dragging = false;
        var a = this.dragData.nodes, c = a.length, b;
        for (b = 0; b < c; b++) {
            Ext.get(a[b]).frame("#8db2e3", 1)
        }
    },
    getRepairXY: function (c) {
        if (this.dragData.multi) {
            return false
        } else {
            var a = Ext.get(this.dragData.ddel), b = a.getXY();
            b[0] += a.getPadding("t") + a.getMargin("t");
            b[1] += a.getPadding("l") + a.getMargin("l");
            return b
        }
    },
    prepareGhost: function (b) {
        var c = this.createGhost(b), a = c.store;
        a.removeAll();
        a.add(b);
        return c.getEl().dom
    },
    createGhost: function (b) {
        if (!this.ghost) {
            var a = Ext.apply({}, this.ghostConfig, {store: Ext.create("Ext.data.Store", {model: b[0].self})});
            this.ghost = Ext.create("Ext.view.View", a);
            this.ghost.render(document.createElement("div"))
        }
        return this.ghost
    }
});
Ext.define("Ext.ux.DataView.LabelEditor", {
    extend: "Ext.Editor",
    alignment: "tl-tl",
    completeOnEnter: true,
    cancelOnEsc: true,
    shim: false,
    autoSize: {width: "boundEl", height: "field"},
    labelSelector: "x-editable",
    requires: ["Ext.form.field.Text"],
    constructor: function (a) {
        a.field = a.field || Ext.create("Ext.form.field.Text", {allowOnlyWhitespace: false, selectOnFocus: true});
        this.callParent([a])
    },
    init: function (a) {
        this.view = a;
        this.mon(a, "afterrender", this.bindEvents, this);
        this.on("complete", this.onSave, this)
    },
    bindEvents: function () {
        this.mon(this.view.getEl(), {click: {fn: this.onClick, scope: this}})
    },
    onClick: function (f, d) {
        var c = this, b, a;
        if (Ext.fly(d).hasCls(c.labelSelector) && !c.editing && !f.ctrlKey && !f.shiftKey) {
            f.stopEvent();
            b = c.view.findItemByChild(d);
            a = c.view.store.getAt(c.view.indexOf(b));
            c.startEdit(d, a.data[c.dataIndex]);
            c.activeRecord = a
        } else {
            if (c.editing) {
                c.field.blur();
                f.preventDefault()
            }
        }
    },
    onSave: function (a, b) {
        this.activeRecord.set(this.dataIndex, b)
    }
});
Ext.ux.DataViewTransition = Ext.extend(Object, {
    defaults: {duration: 750, idProperty: "id"}, constructor: function (a) {
        Ext.apply(this, a || {}, this.defaults)
    }, init: function (a) {
        this.dataview = a;
        var b = this.idProperty;
        a.blockRefresh = true;
        a.updateIndexes = Ext.Function.createSequence(a.updateIndexes, function () {
            this.getTargetEl().select(this.itemSelector).each(function (d, e, c) {
                d.id = d.dom.id = Ext.util.Format.format("{0}-{1}", a.id, a.store.getAt(c).get(b))
            }, this)
        }, a);
        this.dataviewID = a.id;
        this.cachedStoreData = {};
        this.cacheStoreData(a.store.snapshot);
        a.store.on("datachanged", function (l) {
            var j = a.getTargetEl(), f = l.getAt(0), n = this.getAdded(l), v = this.getRemoved(l), g = this.getRemaining(l), s = Ext.apply({}, g, n);
            Ext.each(v, function (A) {
                Ext.fly(this.dataviewID + "-" + A.get(this.idProperty)).animate({
                    remove: false,
                    duration: c,
                    opacity: 0,
                    useDisplay: true
                })
            }, this);
            if (f == undefined) {
                this.cacheStoreData(l);
                return
            }
            var e = Ext.get(this.dataviewID + "-" + f.get(this.idProperty));
            var x = l.getCount(), i = e.getMargin("lr") + e.getWidth(), t = e.getMargin("bt") + e.getHeight(), p = j.getWidth(), d = Math.floor(p / i), o = Math.ceil(x / d), y = Math.ceil(this.getExistingCount() / d);
            j.applyStyles({display: "block", position: "relative"});
            var h = {}, z = {}, q = {};
            Ext.iterate(g, function (C, B) {
                var C = B.get(this.idProperty), A = q[C] = Ext.get(this.dataviewID + "-" + C);
                h[C] = {
                    top: A.getY() - j.getY() - A.getMargin("t") - j.getPadding("t"),
                    left: A.getX() - j.getX() - A.getMargin("l") - j.getPadding("l")
                }
            }, this);
            Ext.iterate(g, function (D, C) {
                var A = h[D], B = q[D];
                if (B.getStyle("position") != "absolute") {
                    q[D].applyStyles({
                        position: "absolute",
                        left: A.left + "px",
                        top: A.top + "px",
                        width: B.getWidth(!Ext.isIE || Ext.isStrict),
                        height: B.getHeight(!Ext.isIE || Ext.isStrict)
                    })
                }
            });
            var m = 0;
            Ext.iterate(l.data.items, function (C) {
                var G = C.get(b), B = q[G];
                var A = m % d, F = Math.floor(m / d), E = F * t, D = A * i;
                z[G] = {top: E, left: D};
                m++
            }, this);
            var r = new Date(), c = this.duration, k = this.dataviewID;
            var w = function () {
                var J = new Date() - r, L = J / c;
                if (L >= 1) {
                    for (var A in z) {
                        Ext.fly(k + "-" + A).applyStyles({top: z[A].top + "px", left: z[A].left + "px"})
                    }
                    Ext.TaskManager.stop(u)
                } else {
                    for (var A in z) {
                        if (!g[A]) {
                            continue
                        }
                        var D = h[A], G = z[A], E = D.top, H = G.top, C = D.left, I = G.left, F = L * Math.abs(E - H), K = L * Math.abs(C - I), M = E > H ? E - F : E + F, B = C > I ? C - K : C + K;
                        Ext.fly(k + "-" + A).applyStyles({top: M + "px", left: B + "px"})
                    }
                }
            };
            var u = {run: w, interval: 20, scope: this};
            Ext.TaskManager.start(u);
            Ext.iterate(n, function (B, A) {
                Ext.fly(this.dataviewID + "-" + A.get(this.idProperty)).applyStyles({
                    top: z[A.get(this.idProperty)].top + "px",
                    left: z[A.get(this.idProperty)].left + "px"
                });
                Ext.fly(this.dataviewID + "-" + A.get(this.idProperty)).animate({
                    remove: false,
                    duration: c,
                    opacity: 1
                })
            }, this);
            this.cacheStoreData(l)
        }, this)
    }, cacheStoreData: function (a) {
        this.cachedStoreData = {};
        a.each(function (b) {
            this.cachedStoreData[b.get(this.idProperty)] = b
        }, this)
    }, getExisting: function () {
        return this.cachedStoreData
    }, getExistingCount: function () {
        var c = 0, b = this.getExisting();
        for (var a in b) {
            c++
        }
        return c
    }, getAdded: function (a) {
        var b = {};
        a.each(function (c) {
            if (this.cachedStoreData[c.get(this.idProperty)] == undefined) {
                b[c.get(this.idProperty)] = c
            }
        }, this);
        return b
    }, getRemoved: function (a) {
        var b = [];
        for (var c in this.cachedStoreData) {
            if (a.findExact(this.idProperty, Number(c)) == -1) {
                b.push(this.cachedStoreData[c])
            }
        }
        return b
    }, getRemaining: function (a) {
        var b = {};
        a.each(function (c) {
            if (this.cachedStoreData[c.get(this.idProperty)] != undefined) {
                b[c.get(this.idProperty)] = c
            }
        }, this);
        return b
    }
});
Ext.define("Ext.ux.Explorer", {
    extend: "Ext.panel.Panel",
    xtype: "explorer",
    requires: ["Ext.layout.container.Border", "Ext.toolbar.Breadcrumb", "Ext.tree.Panel"],
    config: {
        breadcrumb: {dock: "top", xtype: "breadcrumb", reference: "breadcrumb"},
        contentView: {
            xtype: "dataview",
            reference: "contentView",
            region: "center",
            cls: Ext.baseCSSPrefix + "explorer-view",
            itemSelector: "." + Ext.baseCSSPrefix + "explorer-item",
            tpl: '<tpl for="."><div class="' + Ext.baseCSSPrefix + 'explorer-item"><div class="{iconCls}"><div class="' + Ext.baseCSSPrefix + 'explorer-node-icon{[values.leaf ? " ' + Ext.baseCSSPrefix + 'explorer-leaf-icon" : ""]}"></div><div class="' + Ext.baseCSSPrefix + 'explorer-item-text">{text}</div></div></div></tpl>'
        },
        store: null,
        tree: {xtype: "treepanel", reference: "tree", region: "west", width: 200}
    },
    renderConfig: {selection: null},
    layout: "border",
    referenceHolder: true,
    defaultListenerScope: true,
    cls: Ext.baseCSSPrefix + "explorer",
    initComponent: function () {
        var b = this, a = b.getStore();
        b.dockedItems = [b.getBreadcrumb()];
        b.items = [b.getTree(), b.getContentView()];
        b.callParent()
    },
    applyBreadcrumb: function (b) {
        var a = this.getStore();
        b = Ext.create(Ext.apply({store: a, selection: a.getRoot()}, b));
        b.on("selectionchange", "_onBreadcrumbSelectionChange", this);
        return b
    },
    applyContentView: function (a) {
        var b = this.contentStore = new Ext.data.Store({model: this.getStore().model});
        a = Ext.create(Ext.apply({store: b}, a));
        return a
    },
    applyTree: function (a) {
        a = Ext.create(Ext.apply({store: this.getStore()}, a));
        a.on("selectionchange", "_onTreeSelectionChange", this);
        return a
    },
    updateSelection: function (b) {
        var f = this, h = f.getReferences(), e = h.breadcrumb, i = h.tree, d = i.getSelectionModel(), g = f.contentStore, c, a;
        if (e.getSelection() !== b) {
            e.setSelection(b)
        }
        if (d.getSelection()[0] !== b) {
            d.select([b]);
            c = b.parentNode;
            if (c) {
                c.expand()
            }
            a = i.getView();
            a.scrollRowIntoView(a.getRow(b))
        }
        g.removeAll();
        g.add(b.hasChildNodes() ? b.childNodes : [b])
    },
    updateStore: function (a) {
        this.getBreadcrumb().setStore(a)
    },
    privates: {
        _onTreeSelectionChange: function (a, b) {
            this.setSelection(b[0])
        }, _onBreadcrumbSelectionChange: function (b, a) {
            this.setSelection(a)
        }
    }
});
Ext.define("Ext.ux.FieldReplicator", {
    alias: "plugin.fieldreplicator", init: function (a) {
        if (!a.replicatorId) {
            a.replicatorId = Ext.id()
        }
        a.on("blur", this.onBlur, this)
    }, onBlur: function (e) {
        var b = e.ownerCt, d = e.replicatorId, g = Ext.isEmpty(e.getRawValue()), f = b.query("[replicatorId=" + d + "]"), c = f[f.length - 1] === e, h, a;
        if (g && !c) {
            Ext.Function.defer(e.destroy, 10, e)
        } else {
            if (!g && c) {
                if (e.onReplicate) {
                    e.onReplicate()
                }
                h = e.cloneConfig({replicatorId: d});
                a = b.items.indexOf(e);
                b.add(a + 1, h)
            }
        }
    }
});
Ext.define("Ext.ux.GMapPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.gmappanel",
    requires: ["Ext.window.MessageBox"],
    initComponent: function () {
        Ext.applyIf(this, {plain: true, gmapType: "map", border: false});
        this.callParent()
    },
    onBoxReady: function () {
        var a = this.center;
        this.callParent(arguments);
        if (a) {
            if (a.geoCodeAddr) {
                this.lookupCode(a.geoCodeAddr, a.marker)
            } else {
                this.createMap(a)
            }
        } else {
            Ext.Error.raise("center is required")
        }
    },
    createMap: function (a, b) {
        var c = Ext.apply({}, this.mapOptions);
        c = Ext.applyIf(c, {zoom: 14, center: a, mapTypeId: google.maps.MapTypeId.HYBRID});
        this.gmap = new google.maps.Map(this.body.dom, c);
        if (b) {
            this.addMarker(Ext.applyIf(b, {position: a}))
        }
        Ext.each(this.markers, this.addMarker, this);
        this.fireEvent("mapready", this, this.gmap)
    },
    addMarker: function (a) {
        a = Ext.apply({map: this.gmap}, a);
        if (!a.position) {
            a.position = new google.maps.LatLng(a.lat, a.lng)
        }
        var b = new google.maps.Marker(a);
        Ext.Object.each(a.listeners, function (c, d) {
            google.maps.event.addListener(b, c, d)
        });
        return b
    },
    lookupCode: function (b, a) {
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({address: b}, Ext.Function.bind(this.onLookupComplete, this, [a], true))
    },
    onLookupComplete: function (c, b, a) {
        if (b != "OK") {
            Ext.MessageBox.alert("Error", 'An error occured: "' + b + '"');
            return
        }
        this.createMap(c[0].geometry.location, a)
    },
    afterComponentLayout: function (a, b) {
        this.callParent(arguments);
        this.redraw()
    },
    redraw: function () {
        var a = this.gmap;
        if (a) {
            google.maps.event.trigger(a, "resize")
        }
    }
});
Ext.define("Ext.ux.GroupTabRenderer", {
    extend: "Ext.plugin.Abstract",
    alias: "plugin.grouptabrenderer",
    tableTpl: new Ext.XTemplate('<div id="{view.id}-body" class="' + Ext.baseCSSPrefix + "{view.id}-table " + Ext.baseCSSPrefix + 'grid-table-resizer" style="{tableStyle}">', "{%", "values.view.renderRows(values.rows, values.viewStartIndex, out);", "%}", "</div>", {priority: 5}),
    rowTpl: new Ext.XTemplate("{%", 'Ext.Array.remove(values.itemClasses, "', Ext.baseCSSPrefix + 'grid-row");', 'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-data-row";', "%}", '<div {[values.rowId ? ("id=\\"" + values.rowId + "\\"") : ""]} ', 'data-boundView="{view.id}" ', 'data-recordId="{record.internalId}" ', 'data-recordIndex="{recordIndex}" ', 'class="' + Ext.baseCSSPrefix + 'grouptab-row {[values.itemClasses.join(" ")]} {[values.rowClasses.join(" ")]}{[dataRowCls]}" ', "{rowAttr:attributes}>", '<tpl for="columns">{%', "parent.view.renderCell(values, parent.record, parent.recordIndex, parent.rowIndex, xindex - 1, out, parent)", "%}", "</tpl>", "</div>", {priority: 5}),
    cellTpl: new Ext.XTemplate('{%values.tdCls = values.tdCls.replace(" ' + Ext.baseCSSPrefix + 'grid-cell "," ");%}', '<div class="' + Ext.baseCSSPrefix + 'grouptab-cell {tdCls}" {tdAttr}>', '<div {unselectableAttr} class="' + Ext.baseCSSPrefix + 'grid-cell-inner" style="text-align: {align}; {style};">{value}</div>', '<div class="x-grouptabs-corner x-grouptabs-corner-top-left"></div>', '<div class="x-grouptabs-corner x-grouptabs-corner-bottom-left"></div>', "</div>", {priority: 5}),
    selectors: {
        bodySelector: "div." + Ext.baseCSSPrefix + "grid-table-resizer",
        nodeContainerSelector: "div." + Ext.baseCSSPrefix + "grid-table-resizer",
        itemSelector: "div." + Ext.baseCSSPrefix + "grouptab-row",
        rowSelector: "div." + Ext.baseCSSPrefix + "grouptab-row",
        cellSelector: "div." + Ext.baseCSSPrefix + "grouptab-cell",
        getCellSelector: function (a) {
            return a ? a.getCellSelector() : this.cellSelector
        }
    },
    init: function (b) {
        var a = b.getView(), c = this;
        a.addTpl(c.tableTpl);
        a.addRowTpl(c.rowTpl);
        a.addCellTpl(c.cellTpl);
        Ext.apply(a, c.selectors)
    }
});
Ext.define("Ext.ux.GroupTabPanel", {
    extend: "Ext.Container",
    alias: "widget.grouptabpanel",
    requires: ["Ext.tree.Panel", "Ext.ux.GroupTabRenderer"],
    baseCls: Ext.baseCSSPrefix + "grouptabpanel",
    initComponent: function (a) {
        var b = this;
        Ext.apply(b, a);
        b.store = b.createTreeStore();
        b.layout = {type: "hbox", align: "stretch"};
        b.defaults = {border: false};
        b.items = [{
            xtype: "treepanel",
            cls: "x-tree-panel x-grouptabbar",
            width: 150,
            rootVisible: false,
            store: b.store,
            hideHeaders: true,
            animate: false,
            processEvent: Ext.emptyFn,
            border: false,
            plugins: [{ptype: "grouptabrenderer"}],
            viewConfig: {overItemCls: "", getRowClass: b.getRowClass},
            columns: [{
                xtype: "treecolumn",
                sortable: false,
                dataIndex: "text",
                flex: 1,
                renderer: function (j, d, i, h, g, f, c) {
                    var e = "";
                    if (i.parentNode && i.parentNode.parentNode === null) {
                        e += " x-grouptab-first";
                        if (i.previousSibling) {
                            e += " x-grouptab-prev"
                        }
                        if (!i.get("expanded") || i.firstChild == null) {
                            e += " x-grouptab-last"
                        }
                    } else {
                        if (i.nextSibling === null) {
                            e += " x-grouptab-last"
                        } else {
                            e += " x-grouptab-center"
                        }
                    }
                    if (i.data.activeTab) {
                        e += " x-active-tab"
                    }
                    d.tdCls = "x-grouptab" + e;
                    return j
                }
            }]
        }, {
            xtype: "container",
            flex: 1,
            layout: "card",
            activeItem: b.mainItem,
            baseCls: Ext.baseCSSPrefix + "grouptabcontainer",
            items: b.cards
        }];
        b.callParent(arguments);
        b.setActiveTab(b.activeTab);
        b.setActiveGroup(b.activeGroup);
        b.mon(b.down("treepanel").getSelectionModel(), "select", b.onNodeSelect, b)
    },
    getRowClass: function (d, e, c, b) {
        var a = "";
        if (d.data.activeGroup) {
            a += " x-active-group"
        }
        return a
    },
    onNodeSelect: function (a, e) {
        var d = this, b = d.store.getRootNode(), c;
        if (e.parentNode && e.parentNode.parentNode === null) {
            c = e
        } else {
            c = e.parentNode
        }
        if (d.setActiveGroup(c.get("id")) === false || d.setActiveTab(e.get("id")) === false) {
            return false
        }
        while (b) {
            b.set("activeTab", false);
            b.set("activeGroup", false);
            b = b.firstChild || b.nextSibling || b.parentNode.nextSibling
        }
        c.set("activeGroup", true);
        c.eachChild(function (f) {
            f.set("activeGroup", true)
        });
        e.set("activeTab", true);
        a.view.refresh()
    },
    setActiveTab: function (b) {
        var a = this, d = b, c;
        if (Ext.isString(b)) {
            d = Ext.getCmp(d)
        }
        if (d === a.activeTab) {
            return false
        }
        c = a.activeTab;
        if (a.fireEvent("beforetabchange", a, d, c) !== false) {
            a.activeTab = d;
            if (a.rendered) {
                a.down("container[baseCls=" + Ext.baseCSSPrefix + "grouptabcontainer]").getLayout().setActiveItem(d)
            }
            a.fireEvent("tabchange", a, d, c)
        }
        return true
    },
    setActiveGroup: function (c) {
        var b = this, d = c, a;
        if (Ext.isString(c)) {
            d = Ext.getCmp(d)
        }
        if (d === b.activeGroup) {
            return true
        }
        a = b.activeGroup;
        if (b.fireEvent("beforegroupchange", b, d, a) !== false) {
            b.activeGroup = d;
            b.fireEvent("groupchange", b, d, a)
        } else {
            return false
        }
        return true
    },
    createTreeStore: function () {
        var b = this, a = b.prepareItems(b.items), c = {text: ".", children: []}, d = b.cards = [];
        b.activeGroup = b.activeGroup || 0;
        Ext.each(a, function (g, e) {
            var h = g.items.items, f = (h[g.mainItem] || h[0]), i = {children: []};
            i.id = f.id;
            i.text = f.title;
            i.iconCls = f.iconCls;
            i.expanded = true;
            i.activeGroup = (b.activeGroup === e);
            i.activeTab = i.activeGroup ? true : false;
            if (i.activeTab) {
                b.activeTab = i.id
            }
            if (i.activeGroup) {
                b.mainItem = g.mainItem || 0;
                b.activeGroup = i.id
            }
            Ext.each(h, function (j) {
                if (j.id !== i.id) {
                    var k = {
                        id: j.id,
                        leaf: true,
                        text: j.title,
                        iconCls: j.iconCls,
                        activeGroup: i.activeGroup,
                        activeTab: false
                    };
                    i.children.push(k)
                }
                delete j.title;
                delete j.iconCls;
                d.push(j)
            });
            c.children.push(i)
        });
        return Ext.create("Ext.data.TreeStore", {
            fields: ["id", "text", "activeGroup", "activeTab"],
            root: {expanded: true},
            proxy: {type: "memory", data: c}
        })
    },
    getActiveTab: function () {
        return this.activeTab
    },
    getActiveGroup: function () {
        return this.activeGroup
    }
});
Ext.define("Ext.ux.IFrame", {
    extend: "Ext.Component",
    alias: "widget.uxiframe",
    loadMask: "Loading...",
    src: "about:blank",
    renderTpl: ['<iframe src="{src}" id="{id}-iframeEl" data-ref="iframeEl" name="{frameName}" width="100%" height="100%" frameborder="0"></iframe>'],
    childEls: ["iframeEl"],
    initComponent: function () {
        this.callParent();
        this.frameName = this.frameName || this.id + "-frame"
    },
    initEvents: function () {
        var a = this;
        a.callParent();
        a.iframeEl.on("load", a.onLoad, a)
    },
    initRenderData: function () {
        return Ext.apply(this.callParent(), {src: this.src, frameName: this.frameName})
    },
    getBody: function () {
        var a = this.getDoc();
        return a.body || a.documentElement
    },
    getDoc: function () {
        try {
            return this.getWin().document
        } catch (a) {
            return null
        }
    },
    getWin: function () {
        var b = this, a = b.frameName, c = Ext.isIE ? b.iframeEl.dom.contentWindow : window.frames[a];
        return c
    },
    getFrame: function () {
        var a = this;
        return a.iframeEl.dom
    },
    beforeDestroy: function () {
        this.cleanupListeners(true);
        this.callParent()
    },
    cleanupListeners: function (c) {
        var b, d;
        if (this.rendered) {
            try {
                b = this.getDoc();
                if (b) {
                    Ext.get(b).un(this._docListeners);
                    if (c) {
                        for (d in b) {
                            if (b.hasOwnProperty && b.hasOwnProperty(d)) {
                                delete b[d]
                            }
                        }
                    }
                }
            } catch (a) {
            }
        }
    },
    onLoad: function () {
        var b = this, d = b.getDoc(), a = b.onRelayedEvent;
        if (d) {
            try {
                Ext.get(d).on(b._docListeners = {
                    mousedown: a,
                    mousemove: a,
                    mouseup: a,
                    click: a,
                    dblclick: a,
                    scope: b
                })
            } catch (c) {
            }
            Ext.get(this.getWin()).on("beforeunload", b.cleanupListeners, b);
            this.el.unmask();
            this.fireEvent("load", this)
        } else {
            if (b.src) {
                this.el.unmask();
                this.fireEvent("error", this)
            }
        }
    },
    onRelayedEvent: function (c) {
        var b = this.iframeEl, d = b.getTrueXY(), e = c.getXY(), a = c.getTrueXY();
        c.xy = [d[0] + a[0], d[1] + a[1]];
        c.injectEvent(b);
        c.xy = e
    },
    load: function (d) {
        var a = this, c = a.loadMask, b = a.getFrame();
        if (a.fireEvent("beforeload", a, d) !== false) {
            if (c && a.el) {
                a.el.mask(c)
            }
            b.src = a.src = (d || a.src)
        }
    }
});
Ext.define("Ext.ux.statusbar.StatusBar", {
    extend: "Ext.toolbar.Toolbar",
    alternateClassName: "Ext.ux.StatusBar",
    alias: "widget.statusbar",
    requires: ["Ext.toolbar.TextItem"],
    cls: "x-statusbar",
    busyIconCls: "x-status-busy",
    busyText: "Loading...",
    autoClear: 5000,
    emptyText: "&#160;",
    activeThreadId: 0,
    initComponent: function () {
        var a = this.statusAlign === "right";
        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create("Ext.toolbar.TextItem", {
            cls: "x-status-text " + (this.currIconCls || ""),
            text: this.text || this.defaultText || ""
        });
        if (a) {
            this.cls += " x-status-right";
            this.add("->");
            this.add(this.statusEl)
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, "->")
        }
    },
    setStatus: function (e) {
        var a = this;
        e = e || {};
        Ext.suspendLayouts();
        if (Ext.isString(e)) {
            e = {text: e}
        }
        if (e.text !== undefined) {
            a.setText(e.text)
        }
        if (e.iconCls !== undefined) {
            a.setIcon(e.iconCls)
        }
        if (e.clear) {
            var f = e.clear, d = a.autoClear, b = {useDefaults: true, anim: true};
            if (Ext.isObject(f)) {
                f = Ext.applyIf(f, b);
                if (f.wait) {
                    d = f.wait
                }
            } else {
                if (Ext.isNumber(f)) {
                    d = f;
                    f = b
                } else {
                    if (Ext.isBoolean(f)) {
                        f = b
                    }
                }
            }
            f.threadId = this.activeThreadId;
            Ext.defer(a.clearStatus, d, a, [f])
        }
        Ext.resumeLayouts(true);
        return a
    },
    clearStatus: function (e) {
        e = e || {};
        var c = this, b = c.statusEl;
        if (e.threadId && e.threadId !== c.activeThreadId) {
            return c
        }
        var d = e.useDefaults ? c.defaultText : c.emptyText, a = e.useDefaults ? (c.defaultIconCls ? c.defaultIconCls : "") : "";
        if (e.anim) {
            b.el.puff({
                remove: false, useDisplay: true, callback: function () {
                    b.el.show();
                    c.setStatus({text: d, iconCls: a})
                }
            })
        } else {
            c.setStatus({text: d, iconCls: a})
        }
        return c
    },
    setText: function (b) {
        var a = this;
        a.activeThreadId++;
        a.text = b || "";
        if (a.rendered) {
            a.statusEl.setText(a.text)
        }
        return a
    },
    getText: function () {
        return this.text
    },
    setIcon: function (a) {
        var b = this;
        b.activeThreadId++;
        a = a || "";
        if (b.rendered) {
            if (b.currIconCls) {
                b.statusEl.removeCls(b.currIconCls);
                b.currIconCls = null
            }
            if (a.length > 0) {
                b.statusEl.addCls(a);
                b.currIconCls = a
            }
        } else {
            b.currIconCls = a
        }
        return b
    },
    showBusy: function (a) {
        if (Ext.isString(a)) {
            a = {text: a}
        }
        a = Ext.applyIf(a || {}, {text: this.busyText, iconCls: this.busyIconCls});
        return this.setStatus(a)
    }
});
Ext.define("Ext.ux.LiveSearchGridPanel", {
    extend: "Ext.grid.Panel",
    requires: ["Ext.toolbar.TextItem", "Ext.form.field.Checkbox", "Ext.form.field.Text", "Ext.ux.statusbar.StatusBar"],
    searchValue: null,
    indexes: [],
    currentIndex: null,
    searchRegExp: null,
    caseSensitive: false,
    regExpMode: false,
    matchCls: "x-livesearch-match",
    defaultStatusText: "Nothing Found",
    initComponent: function () {
        var a = this;
        a.tbar = ["Search", {
            xtype: "textfield",
            name: "searchField",
            hideLabel: true,
            width: 200,
            listeners: {change: {fn: a.onTextFieldChange, scope: this, buffer: 500}}
        }, {
            xtype: "button",
            text: "&lt;",
            tooltip: "Find Previous Row",
            handler: a.onPreviousClick,
            scope: a
        }, {
            xtype: "button",
            text: "&gt;",
            tooltip: "Find Next Row",
            handler: a.onNextClick,
            scope: a
        }, "-", {
            xtype: "checkbox",
            hideLabel: true,
            margin: "0 0 0 4px",
            handler: a.regExpToggle,
            scope: a
        }, "Regular expression", {
            xtype: "checkbox",
            hideLabel: true,
            margin: "0 0 0 4px",
            handler: a.caseSensitiveToggle,
            scope: a
        }, "Case sensitive"];
        a.bbar = Ext.create("Ext.ux.StatusBar", {defaultText: a.defaultStatusText, name: "searchStatusBar"});
        a.callParent(arguments)
    },
    afterRender: function () {
        var a = this;
        a.callParent(arguments);
        a.textField = a.down("textfield[name=searchField]");
        a.statusBar = a.down("statusbar[name=searchStatusBar]")
    },
    tagsRe: /<[^>]*>/gm,
    tagsProtect: "\x0f",
    getSearchValue: function () {
        var b = this, c = b.textField.getValue();
        if (c === "") {
            return null
        }
        if (!b.regExpMode) {
            c = Ext.String.escapeRegex(c)
        } else {
            try {
                new RegExp(c)
            } catch (a) {
                b.statusBar.setStatus({text: a.message, iconCls: "x-status-error"});
                return null
            }
            if (c === "^" || c === "$") {
                return null
            }
        }
        return c
    },
    onTextFieldChange: function () {
        var e = this, d = 0, b = e.view, a = b.cellSelector, c = b.innerSelector;
        b.refresh();
        e.statusBar.setStatus({text: e.defaultStatusText, iconCls: ""});
        e.searchValue = e.getSearchValue();
        e.indexes = [];
        e.currentIndex = null;
        if (e.searchValue !== null) {
            e.searchRegExp = new RegExp(e.getSearchValue(), "g" + (e.caseSensitive ? "" : "i"));
            e.store.each(function (h, g) {
                var k = Ext.fly(b.getNode(g)).down(a), f, j, i;
                while (k) {
                    f = k.down(c);
                    j = f.dom.innerHTML.match(e.tagsRe);
                    i = f.dom.innerHTML.replace(e.tagsRe, e.tagsProtect);
                    i = i.replace(e.searchRegExp, function (l) {
                        d += 1;
                        if (Ext.Array.indexOf(e.indexes, g) === -1) {
                            e.indexes.push(g)
                        }
                        if (e.currentIndex === null) {
                            e.currentIndex = g
                        }
                        return '<span class="' + e.matchCls + '">' + l + "</span>"
                    });
                    Ext.each(j, function (l) {
                        i = i.replace(e.tagsProtect, l)
                    });
                    f.dom.innerHTML = i;
                    k = k.next()
                }
            }, e);
            if (e.currentIndex !== null) {
                e.getSelectionModel().select(e.currentIndex);
                e.statusBar.setStatus({text: d + " matche(s) found.", iconCls: "x-status-valid"})
            }
        }
        if (e.currentIndex === null) {
            e.getSelectionModel().deselectAll()
        }
        e.textField.focus()
    },
    onPreviousClick: function () {
        var b = this, a;
        if ((a = Ext.Array.indexOf(b.indexes, b.currentIndex)) !== -1) {
            b.currentIndex = b.indexes[a - 1] || b.indexes[b.indexes.length - 1];
            b.getSelectionModel().select(b.currentIndex)
        }
    },
    onNextClick: function () {
        var b = this, a;
        if ((a = Ext.Array.indexOf(b.indexes, b.currentIndex)) !== -1) {
            b.currentIndex = b.indexes[a + 1] || b.indexes[0];
            b.getSelectionModel().select(b.currentIndex)
        }
    },
    caseSensitiveToggle: function (b, a) {
        this.caseSensitive = a;
        this.onTextFieldChange()
    },
    regExpToggle: function (b, a) {
        this.regExpMode = a;
        this.onTextFieldChange()
    }
});
Ext.define("Ext.ux.PreviewPlugin", {
    extend: "Ext.plugin.Abstract",
    alias: "plugin.preview",
    requires: ["Ext.grid.feature.RowBody"],
    hideBodyCls: "x-grid-row-body-hidden",
    bodyField: "",
    previewExpanded: true,
    setCmp: function (f) {
        this.callParent(arguments);
        var d = this, c = d.cmp = f.isXType("gridview") ? f.grid : f, a = d.bodyField, g = d.hideBodyCls, b = Ext.create("Ext.grid.feature.RowBody", {
            grid: c,
            getAdditionalData: function (l, i, j, m) {
                var h = Ext.grid.feature.RowBody.prototype.getAdditionalData, k = {
                    rowBody: l[a],
                    rowBodyCls: c.getView().previewExpanded ? "" : g
                };
                if (Ext.isFunction(h)) {
                    Ext.apply(k, h.apply(this, arguments))
                }
                return k
            }
        }), e = function (i, h) {
            h.previewExpanded = d.previewExpanded;
            h.featuresMC.add(b);
            b.init(i)
        };
        if (c.view) {
            e(c, c.view)
        } else {
            c.on({viewcreated: e, single: true})
        }
    },
    toggleExpanded: function (b) {
        var c = this.getCmp(), a = c && c.getView(), e = a.bufferedRenderer, d = a.scrollManager;
        if (c && a && b !== a.previewExpanded) {
            this.previewExpanded = a.previewExpanded = !!b;
            a.refreshView();
            if (d) {
                if (e) {
                    e.stretchView(a, e.getScrollHeight(true))
                } else {
                    d.refresh(true)
                }
            }
        }
    }
});
Ext.define("Ext.ux.ProgressBarPager", {
    requires: ["Ext.ProgressBar"],
    width: 225,
    defaultText: "Loading...",
    defaultAnimCfg: {duration: 1000, easing: "bounceOut"},
    constructor: function (a) {
        if (a) {
            Ext.apply(this, a)
        }
    },
    init: function (b) {
        var a;
        if (b.displayInfo) {
            this.parent = b;
            a = b.child("#displayItem");
            if (a) {
                b.remove(a, true)
            }
            this.progressBar = Ext.create("Ext.ProgressBar", {
                text: this.defaultText,
                width: this.width,
                animate: this.defaultAnimCfg,
                style: {cursor: "pointer"},
                listeners: {el: {scope: this, click: this.handleProgressBarClick}}
            });
            b.displayItem = this.progressBar;
            b.add(b.displayItem);
            Ext.apply(b, this.parentOverrides)
        }
    },
    handleProgressBarClick: function (i) {
        var f = this.parent, c = f.displayItem, g = this.progressBar.getBox(), h = i.getXY(), b = h[0] - g.x, a = Math.ceil(f.store.getTotalCount() / f.pageSize), d = Math.max(Math.ceil(b / (c.width / a)), 1);
        f.store.loadPage(d)
    },
    parentOverrides: {
        updateInfo: function () {
            if (this.displayItem) {
                var d = this.store.getCount(), b = this.getPageData(), c = d === 0 ? this.emptyMsg : Ext.String.format(this.displayMsg, b.fromRecord, b.toRecord, this.store.getTotalCount()), a = b.pageCount > 0 ? (b.currentPage / b.pageCount) : 0;
                this.displayItem.updateProgress(a, c, this.animate || this.defaultAnimConfig)
            }
        }
    }
});
Ext.define("Ext.ux.RowExpander", {extend: "Ext.grid.plugin.RowExpander"});
Ext.define("Ext.ux.SlidingPager", {
    requires: ["Ext.slider.Single", "Ext.slider.Tip"], constructor: function (a) {
        if (a) {
            Ext.apply(this, a)
        }
    }, init: function (b) {
        var a = b.items.indexOf(b.child("#inputItem")), c;
        Ext.each(b.items.getRange(a - 2, a + 2), function (d) {
            d.hide()
        });
        c = Ext.create("Ext.slider.Single", {
            width: 114, minValue: 1, maxValue: 1, hideLabel: true, tipText: function (d) {
                return Ext.String.format("Page <b>{0}</b> of <b>{1}</b>", d.value, d.slider.maxValue)
            }, listeners: {
                changecomplete: function (e, d) {
                    b.store.loadPage(d)
                }
            }
        });
        b.insert(a + 1, c);
        b.on({
            change: function (d, e) {
                c.setMaxValue(e.pageCount);
                c.setValue(e.currentPage)
            }
        })
    }
});
Ext.define("Ext.ux.Spotlight", {
    baseCls: "x-spotlight",
    animate: true,
    duration: 250,
    easing: null,
    active: false,
    constructor: function (a) {
        Ext.apply(this, a)
    },
    createElements: function () {
        var c = this, b = c.baseCls, a = Ext.getBody();
        c.right = a.createChild({cls: b});
        c.left = a.createChild({cls: b});
        c.top = a.createChild({cls: b});
        c.bottom = a.createChild({cls: b});
        c.all = Ext.create("Ext.CompositeElement", [c.right, c.left, c.top, c.bottom])
    },
    show: function (b, d, a) {
        var c = this;
        c.el = Ext.get(b);
        if (!c.right) {
            c.createElements()
        }
        if (!c.active) {
            c.all.setDisplayed("");
            c.active = true;
            Ext.on("resize", c.syncSize, c);
            c.applyBounds(c.animate, false)
        } else {
            c.applyBounds(false, false)
        }
    },
    hide: function (c, a) {
        var b = this;
        Ext.un("resize", b.syncSize, b);
        b.applyBounds(b.animate, true)
    },
    syncSize: function () {
        this.applyBounds(false, false)
    },
    applyBounds: function (a, g) {
        var j = this, e = j.el.getBox(), f = Ext.Element.getViewportWidth(), c = Ext.Element.getViewportHeight(), d = 0, b = false, l, k, h;
        l = {
            right: {x: e.right, y: c, width: (f - e.right), height: 0},
            left: {x: 0, y: 0, width: e.x, height: 0},
            top: {x: f, y: 0, width: 0, height: e.y},
            bottom: {x: 0, y: (e.y + e.height), width: 0, height: (c - (e.y + e.height)) + "px"}
        };
        k = {
            right: {x: e.right, y: e.y, width: (f - e.right) + "px", height: (c - e.y) + "px"},
            left: {x: 0, y: 0, width: e.x + "px", height: (e.y + e.height) + "px"},
            top: {x: e.x, y: 0, width: (f - e.x) + "px", height: e.y + "px"},
            bottom: {x: 0, y: (e.y + e.height), width: (e.x + e.width) + "px", height: (c - (e.y + e.height)) + "px"}
        };
        if (g) {
            h = Ext.clone(l);
            l = k;
            k = h
        }
        if (a) {
            Ext.Array.forEach(["right", "left", "top", "bottom"], function (i) {
                j[i].setBox(l[i]);
                j[i].animate({duration: j.duration, easing: j.easing, to: k[i]})
            }, this)
        } else {
            Ext.Array.forEach(["right", "left", "top", "bottom"], function (i) {
                j[i].setBox(Ext.apply(l[i], k[i]));
                j[i].repaint()
            }, this)
        }
    },
    destroy: function () {
        var a = this;
        Ext.destroy(a.right, a.left, a.top, a.bottom);
        delete a.el;
        delete a.all
    }
});
Ext.define("Ext.ux.TabCloseMenu", {
    extend: "Ext.plugin.Abstract",
    alias: "plugin.tabclosemenu",
    mixins: {observable: "Ext.util.Observable"},
    closeTabText: "Close Tab",
    showCloseOthers: true,
    closeOthersTabsText: "Close Other Tabs",
    showCloseAll: true,
    closeAllTabsText: "Close All Tabs",
    extraItemsHead: null,
    extraItemsTail: null,
    constructor: function (a) {
        this.callParent([a]);
        this.mixins.observable.constructor.call(this, a)
    },
    init: function (a) {
        this.tabPanel = a;
        this.tabBar = a.down("tabbar");
        this.mon(this.tabPanel, {scope: this, afterlayout: this.onAfterLayout, single: true})
    },
    onAfterLayout: function () {
        this.mon(this.tabBar.el, {scope: this, contextmenu: this.onContextMenu, delegate: ".x-tab"})
    },
    destroy: function () {
        this.callParent();
        Ext.destroy(this.menu)
    },
    onContextMenu: function (d, f) {
        var c = this, g = c.createMenu(), e = true, h = true, b = c.tabBar.getChildByElement(f), a = c.tabBar.items.indexOf(b);
        c.item = c.tabPanel.getComponent(a);
        g.child("#close").setDisabled(!c.item.closable);
        if (c.showCloseAll || c.showCloseOthers) {
            c.tabPanel.items.each(function (i) {
                if (i.closable) {
                    e = false;
                    if (i !== c.item) {
                        h = false;
                        return false
                    }
                }
                return true
            });
            if (c.showCloseAll) {
                g.child("#closeAll").setDisabled(e)
            }
            if (c.showCloseOthers) {
                g.child("#closeOthers").setDisabled(h)
            }
        }
        d.preventDefault();
        c.fireEvent("beforemenu", g, c.item, c);
        g.showAt(d.getXY())
    },
    createMenu: function () {
        var b = this;
        if (!b.menu) {
            var a = [{itemId: "close", text: b.closeTabText, scope: b, handler: b.onClose}];
            if (b.showCloseAll || b.showCloseOthers) {
                a.push("-")
            }
            if (b.showCloseOthers) {
                a.push({itemId: "closeOthers", text: b.closeOthersTabsText, scope: b, handler: b.onCloseOthers})
            }
            if (b.showCloseAll) {
                a.push({itemId: "closeAll", text: b.closeAllTabsText, scope: b, handler: b.onCloseAll})
            }
            if (b.extraItemsHead) {
                a = b.extraItemsHead.concat(a)
            }
            if (b.extraItemsTail) {
                a = a.concat(b.extraItemsTail)
            }
            b.menu = Ext.create("Ext.menu.Menu", {items: a, listeners: {hide: b.onHideMenu, scope: b}})
        }
        return b.menu
    },
    onHideMenu: function () {
        var a = this;
        a.fireEvent("aftermenu", a.menu, a)
    },
    onClose: function () {
        this.tabPanel.remove(this.item)
    },
    onCloseOthers: function () {
        this.doClose(true)
    },
    onCloseAll: function () {
        this.doClose(false)
    },
    doClose: function (b) {
        var a = [];
        this.tabPanel.items.each(function (c) {
            if (c.closable) {
                if (!b || c !== this.item) {
                    a.push(c)
                }
            }
        }, this);
        Ext.suspendLayouts();
        Ext.Array.forEach(a, function (c) {
            this.tabPanel.remove(c)
        }, this);
        Ext.resumeLayouts(true)
    }
});
Ext.define("Ext.ux.TabReorderer", {
    extend: "Ext.ux.BoxReorderer",
    alias: "plugin.tabreorderer",
    itemSelector: "." + Ext.baseCSSPrefix + "tab",
    init: function (b) {
        var a = this;
        a.callParent([b.getTabBar()]);
        b.onAdd = Ext.Function.createSequence(b.onAdd, a.onAdd)
    },
    onBoxReady: function () {
        var c, a, b = 0, d;
        this.callParent(arguments);
        for (c = this.container.items.items, a = c.length; b < a; b++) {
            d = c[b];
            if (d.card) {
                d.reorderable = d.card.reorderable
            }
        }
    },
    onAdd: function (b, a) {
        b.tab.reorderable = b.reorderable
    },
    afterBoxReflow: function () {
        var a = this;
        Ext.ux.BoxReorderer.prototype.afterBoxReflow.apply(a, arguments);
        if (a.dragCmp) {
            a.container.tabPanel.setActiveTab(a.dragCmp.card);
            a.container.tabPanel.move(a.startIndex, a.curIndex)
        }
    }
});
Ext.ns("Ext.ux");
Ext.define("Ext.ux.TabScrollerMenu", {
    alias: "plugin.tabscrollermenu",
    requires: ["Ext.menu.Menu"],
    pageSize: 10,
    maxText: 15,
    menuPrefixText: "Items",
    constructor: function (a) {
        Ext.apply(this, a)
    },
    init: function (b) {
        var a = this;
        a.tabPanel = b;
        b.on({
            render: function () {
                a.tabBar = b.tabBar;
                a.layout = a.tabBar.layout;
                a.layout.overflowHandler.handleOverflow = Ext.Function.bind(a.showButton, a);
                a.layout.overflowHandler.clearOverflow = Ext.Function.createSequence(a.layout.overflowHandler.clearOverflow, a.hideButton, a)
            }, destroy: a.destroy, scope: a, single: true
        })
    },
    showButton: function () {
        var c = this, a = Ext.getClass(c.layout.overflowHandler).prototype.handleOverflow.apply(c.layout.overflowHandler, arguments), b = c.menuButton;
        if (c.tabPanel.items.getCount() > 1) {
            if (!b) {
                b = c.menuButton = c.tabBar.body.createChild({cls: Ext.baseCSSPrefix + "tab-tabmenu-right"}, c.tabBar.body.child("." + Ext.baseCSSPrefix + "box-scroller-right"));
                b.addClsOnOver(Ext.baseCSSPrefix + "tab-tabmenu-over");
                b.on("click", c.showTabsMenu, c)
            }
            b.setVisibilityMode(Ext.dom.Element.DISPLAY);
            b.show();
            a.reservedSpace += b.getWidth()
        } else {
            c.hideButton()
        }
        return a
    },
    hideButton: function () {
        var a = this;
        if (a.menuButton) {
            a.menuButton.hide()
        }
    },
    getPageSize: function () {
        return this.pageSize
    },
    setPageSize: function (a) {
        this.pageSize = a
    },
    getMaxText: function () {
        return this.maxText
    },
    setMaxText: function (a) {
        this.maxText = a
    },
    getMenuPrefixText: function () {
        return this.menuPrefixText
    },
    setMenuPrefixText: function (a) {
        this.menuPrefixText = a
    },
    showTabsMenu: function (d) {
        var a = this;
        if (a.tabsMenu) {
            a.tabsMenu.removeAll()
        } else {
            a.tabsMenu = new Ext.menu.Menu()
        }
        a.generateTabMenuItems();
        var c = Ext.get(d.getTarget()), b = c.getXY();
        b[1] += 24;
        a.tabsMenu.showAt(b)
    },
    generateTabMenuItems: function () {
        var l = this, h = l.tabPanel, a = h.getActiveTab(), j = h.items.getRange(), m = l.getPageSize(), e = l.tabsMenu, q, d, o, f, k, b, n, p, c, g;
        e.suspendLayouts();
        j = Ext.Array.filter(j, function (i) {
            if (i.id == a.id) {
                return false
            }
            return i.hidden ? !!i.hiddenByLayout : true
        });
        q = j.length;
        d = Math.floor(q / m);
        o = q % m;
        if (q > m) {
            for (f = 0; f < d; f++) {
                k = (f + 1) * m;
                b = [];
                for (n = 0; n < m; n++) {
                    g = n + k - m;
                    p = j[g];
                    b.push(l.autoGenMenuItem(p))
                }
                e.add({text: l.getMenuPrefixText() + " " + (k - m + 1) + " - " + k, menu: b})
            }
            if (o > 0) {
                c = d * m;
                b = [];
                for (f = c; f < q; f++) {
                    p = j[f];
                    b.push(l.autoGenMenuItem(p))
                }
                l.tabsMenu.add({text: l.menuPrefixText + " " + (c + 1) + " - " + (c + b.length), menu: b})
            }
        } else {
            for (f = 0; f < q; ++f) {
                e.add(l.autoGenMenuItem(j[f]))
            }
        }
        e.resumeLayouts(true)
    },
    autoGenMenuItem: function (b) {
        var a = this.getMaxText(), c = Ext.util.Format.ellipsis(b.title, a);
        return {
            text: c,
            handler: this.showTabFromMenu,
            scope: this,
            disabled: b.disabled,
            tabToShow: b,
            iconCls: b.iconCls
        }
    },
    showTabFromMenu: function (a) {
        this.tabPanel.setActiveTab(a.tabToShow)
    },
    destroy: function () {
        Ext.destroy(this.tabsMenu, this.menuButton)
    }
});
Ext.define("Ext.ux.ToolbarDroppable", {
    constructor: function (a) {
        Ext.apply(this, a)
    }, init: function (a) {
        this.toolbar = a;
        this.toolbar.on({scope: this, render: this.createDropTarget})
    }, createDropTarget: function () {
        this.dropTarget = Ext.create("Ext.dd.DropTarget", this.toolbar.getEl(), {
            notifyOver: Ext.Function.bind(this.notifyOver, this),
            notifyDrop: Ext.Function.bind(this.notifyDrop, this)
        })
    }, addDDGroup: function (a) {
        this.dropTarget.addToGroup(a)
    }, calculateEntryIndex: function (h) {
        var j = 0, k = this.toolbar, i = k.items.items, f = i.length, b = h.getXY()[0], g = 0, c, d, a, l;
        for (; g < f; g++) {
            c = i[g].getEl();
            d = c.getXY()[0];
            a = c.getWidth();
            l = d + a / 2;
            if (b < l) {
                j = g;
                break
            } else {
                j = g + 1
            }
        }
        return j
    }, canDrop: function (a) {
        return true
    }, notifyOver: function (a, b, c) {
        return this.canDrop.apply(this, arguments) ? this.dropTarget.dropAllowed : this.dropTarget.dropNotAllowed
    }, notifyDrop: function (a, d, e) {
        var c = this.canDrop(a, d, e), f = this.toolbar;
        if (c) {
            var b = this.calculateEntryIndex(d);
            f.insert(b, this.createItem(e));
            f.doLayout();
            this.afterLayout()
        }
        return c
    }, createItem: function (a) {
    }, afterLayout: Ext.emptyFn
});
Ext.define("Ext.ux.TreePicker", {
    extend: "Ext.form.field.Picker",
    xtype: "treepicker",
    uses: ["Ext.tree.Panel"],
    triggerCls: Ext.baseCSSPrefix + "form-arrow-trigger",
    config: {
        store: null,
        displayField: null,
        columns: null,
        selectOnTab: true,
        maxPickerHeight: 300,
        minPickerHeight: 100
    },
    editable: false,
    initComponent: function () {
        var a = this;
        a.callParent(arguments);
        a.mon(a.store, {scope: a, load: a.onLoad, update: a.onUpdate})
    },
    createPicker: function () {
        var c = this, b = new Ext.tree.Panel({
            shrinkWrapDock: 2,
            store: c.store,
            floating: true,
            displayField: c.displayField,
            columns: c.columns,
            minHeight: c.minPickerHeight,
            maxHeight: c.maxPickerHeight,
            manageHeight: false,
            shadow: false,
            listeners: {scope: c, itemclick: c.onItemClick},
            viewConfig: {listeners: {scope: c, render: c.onViewRender}}
        }), a = b.getView();
        if (Ext.isIE9 && Ext.isStrict) {
            a.on({
                scope: c,
                highlightitem: c.repaintPickerView,
                unhighlightitem: c.repaintPickerView,
                afteritemexpand: c.repaintPickerView,
                afteritemcollapse: c.repaintPickerView
            })
        }
        return b
    },
    onViewRender: function (a) {
        a.getEl().on("keypress", this.onPickerKeypress, this)
    },
    repaintPickerView: function () {
        var a = this.picker.getView().getEl().dom.style;
        a.display = a.display
    },
    onItemClick: function (b, a, c, f, d) {
        this.selectItem(a)
    },
    onPickerKeypress: function (c, b) {
        var a = c.getKey();
        if (a === c.ENTER || (a === c.TAB && this.selectOnTab)) {
            this.selectItem(this.picker.getSelectionModel().getSelection()[0])
        }
    },
    selectItem: function (a) {
        var b = this;
        b.setValue(a.getId());
        b.fireEvent("select", b, a);
        b.collapse()
    },
    onExpand: function () {
        var d = this, b = d.picker, a = b.store, e = d.value, c;
        if (e) {
            c = a.getNodeById(e)
        }
        if (!c) {
            c = a.getRoot()
        }
        b.selectPath(c.getPath())
    },
    setValue: function (c) {
        var b = this, a;
        b.value = c;
        if (b.store.loading) {
            return b
        }
        a = c ? b.store.getNodeById(c) : b.store.getRoot();
        if (c === undefined) {
            a = b.store.getRoot();
            b.value = a.getId()
        } else {
            a = b.store.getNodeById(c)
        }
        b.setRawValue(a ? a.get(b.displayField) : "");
        return b
    },
    getSubmitValue: function () {
        return this.value
    },
    getValue: function () {
        return this.value
    },
    onLoad: function () {
        var a = this.value;
        if (a) {
            this.setValue(a)
        }
    },
    onUpdate: function (a, e, b, c) {
        var d = this.displayField;
        if (b === "edit" && c && Ext.Array.contains(c, d) && this.value === e.getId()) {
            this.setRawValue(e.get(d))
        }
    }
});
Ext.define("Ext.ux.ajax.Simlet", function () {
    var d = /([^?#]*)(#.*)?$/, a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/, b = /^[+-]?\d+$/, c = /^[+-]?\d+\.\d+$/;

    function e(g) {
        var f;
        if (Ext.isDefined(g)) {
            g = decodeURIComponent(g);
            if (b.test(g)) {
                g = parseInt(g, 10)
            } else {
                if (c.test(g)) {
                    g = parseFloat(g)
                } else {
                    if (!!(f = a.test(g))) {
                        g = new Date(Date.UTC(+f[1], +f[2] - 1, +f[3], +f[4], +f[5], +f[6]))
                    }
                }
            }
        }
        return g
    }

    return {
        alias: "simlet.basic",
        isSimlet: true,
        responseProps: ["responseText", "responseXML", "status", "statusText"],
        status: 200,
        statusText: "OK",
        constructor: function (f) {
            Ext.apply(this, f)
        },
        doGet: function (f) {
            var h = this, g = {};
            Ext.Array.forEach(h.responseProps, function (i) {
                if (i in h) {
                    g[i] = h[i]
                }
            });
            return g
        },
        doPost: function (f) {
            var h = this, g = {};
            Ext.Array.forEach(h.responseProps, function (i) {
                if (i in h) {
                    g[i] = h[i]
                }
            });
            return g
        },
        doRedirect: function (f) {
            return false
        },
        exec: function (i) {
            var h = this, f = {}, j = "do" + Ext.String.capitalize(i.method.toLowerCase()), g = h[j];
            if (g) {
                f = g.call(h, h.getCtx(i.method, i.url, i))
            } else {
                f = {status: 405, statusText: "Method Not Allowed"}
            }
            return f
        },
        getCtx: function (h, f, g) {
            return {method: h, params: this.parseQueryString(f), url: f, xhr: g}
        },
        openRequest: function (l, h, g, i) {
            var f = this.getCtx(l, h), k = this.doRedirect(f), j;
            if (k) {
                j = k
            } else {
                j = new Ext.ux.ajax.SimXhr({mgr: this.manager, simlet: this, options: g});
                j.open(l, h, i)
            }
            return j
        },
        parseQueryString: function (o) {
            var g = d.exec(o), l = {}, q, p, k, f;
            if (g && g[1]) {
                var j, h = g[1].split("&");
                for (k = 0, f = h.length; k < f; ++k) {
                    if ((j = h[k].split("="))[0]) {
                        q = decodeURIComponent(j.shift());
                        p = e((j.length > 1) ? j.join("=") : j[0]);
                        if (!(q in l)) {
                            l[q] = p
                        } else {
                            if (Ext.isArray(l[q])) {
                                l[q].push(p)
                            } else {
                                l[q] = [l[q], p]
                            }
                        }
                    }
                }
            }
            return l
        },
        redirect: function (h, f, g) {
            switch (arguments.length) {
                case 2:
                    if (typeof f == "string") {
                        break
                    }
                    g = f;
                case 1:
                    f = h;
                    h = "GET";
                    break
            }
            if (g) {
                f = Ext.urlAppend(f, Ext.Object.toQueryString(g))
            }
            return this.manager.openRequest(h, f)
        }
    }
}());
Ext.define("Ext.ux.ajax.DataSimlet", function () {
    function b(f, e) {
        var c = f.direction, d = (c && c.toUpperCase() === "DESC") ? -1 : 1;
        return function (h, i) {
            var g = h[f.property], k = i[f.property], j = (g < k) ? -1 : ((k < g) ? 1 : 0);
            if (j || !e) {
                return j * d
            }
            return e(h, i)
        }
    }

    function a(c, e) {
        for (var f = e, d = c && c.length; d;) {
            f = b(c[--d], f)
        }
        return f
    }

    return {
        extend: "Ext.ux.ajax.Simlet", buildNodes: function (g, l) {
            var k = this, d = {data: []}, j = g.length, f, h, e, c;
            k.nodes[l] = d;
            for (h = 0; h < j; ++h) {
                d.data.push(e = g[h]);
                c = e.text || e.title;
                e.id = l ? l + "/" + c : c;
                f = e.children;
                if (!(e.leaf = !f)) {
                    delete e.children;
                    k.buildNodes(f, e.id)
                }
            }
        }, fixTree: function (d, c) {
            var g = this, f = d.params.node, e;
            if (!(e = g.nodes)) {
                g.nodes = e = {};
                g.buildNodes(c, "")
            }
            f = e[f];
            if (f) {
                if (g.node) {
                    g.node.sortedData = g.sortedData;
                    g.node.currentOrder = g.currentOrder
                }
                g.node = f;
                g.data = f.data;
                g.sortedData = f.sortedData;
                g.currentOrder = f.currentOrder
            } else {
                g.data = null
            }
        }, getData: function (k) {
            var i = this, f = k.params, e = (f.filter || "") + (f.group || "") + "-" + (f.sort || "") + "-" + (f.dir || ""), l = i.tree, c, g, h, j;
            if (l) {
                i.fixTree(k, l)
            }
            g = i.data;
            if (typeof g === "function") {
                c = true;
                g = g.call(this, k)
            }
            if (!g || e === "--") {
                return g || []
            }
            if (!c && e == i.currentOrder) {
                return i.sortedData
            }
            k.filterSpec = f.filter && Ext.decode(f.filter);
            k.groupSpec = f.group && Ext.decode(f.group);
            h = f.sort;
            if (f.dir) {
                h = [{direction: f.dir, property: h}]
            } else {
                h = Ext.decode(f.sort)
            }
            if (k.filterSpec) {
                var d = new Ext.util.FilterCollection();
                d.add(this.processFilters(k.filterSpec));
                g = Ext.Array.filter(g, d.getFilterFn())
            }
            j = a((k.sortSpec = h));
            if (k.groupSpec) {
                j = a([k.groupSpec], j)
            }
            g = Ext.isArray(g) ? g.slice(0) : g;
            if (j) {
                Ext.Array.sort(g, j)
            }
            i.sortedData = g;
            i.currentOrder = e;
            return g
        }, processFilters: Ext.identityFn, getPage: function (d, g) {
            var e = g, f = g.length, h = d.params.start || 0, c = d.params.limit ? Math.min(f, h + d.params.limit) : f;
            if (h || c < f) {
                e = e.slice(h, c)
            }
            return e
        }, getGroupSummary: function (d, e, c) {
            return e[0]
        }, getSummary: function (m, g, h) {
            var j = this, c = m.groupSpec.property, k, f = {}, i = [], d, e;
            Ext.each(h, function (n) {
                d = n[c];
                f[d] = true
            });
            function l() {
                if (k) {
                    i.push(j.getGroupSummary(c, k, m));
                    k = null
                }
            }

            Ext.each(g, function (n) {
                d = n[c];
                if (e !== d) {
                    l();
                    e = d
                }
                if (!f[d]) {
                    return !i.length
                }
                if (k) {
                    k.push(n)
                } else {
                    k = [n]
                }
                return true
            });
            l();
            return i
        }
    }
}());
Ext.define("Ext.ux.ajax.JsonSimlet", {
    extend: "Ext.ux.ajax.DataSimlet", alias: "simlet.json", doGet: function (c) {
        var f = this, h = f.getData(c), g = f.getPage(c, h), a = c.xhr.options.proxy && c.xhr.options.proxy.getReader(), b = a && a.getRootProperty(), e = f.callParent(arguments), d = {};
        if (b && Ext.isArray(g)) {
            d[b] = g;
            d[a.getTotalProperty()] = h.length
        } else {
            d = g
        }
        if (c.groupSpec) {
            d.summaryData = f.getSummary(c, h, g)
        }
        e.responseText = Ext.encode(d);
        return e
    }
});
Ext.define("Ext.ux.ajax.SimXhr", {
    readyState: 0, mgr: null, simlet: null, constructor: function (a) {
        var b = this;
        Ext.apply(b, a);
        b.requestHeaders = {}
    }, abort: function () {
        var a = this;
        if (a.timer) {
            clearTimeout(a.timer);
            a.timer = null
        }
        a.aborted = true
    }, getAllResponseHeaders: function () {
        var a = [];
        if (Ext.isObject(this.responseHeaders)) {
            Ext.Object.each(this.responseHeaders, function (b, c) {
                a.push(b + ": " + c)
            })
        }
        return a.join("\r\n")
    }, getResponseHeader: function (b) {
        var a = this.responseHeaders;
        return (a && a[b]) || null
    }, open: function (f, c, d, a, b) {
        var e = this;
        e.method = f;
        e.url = c;
        e.async = d !== false;
        e.user = a;
        e.password = b;
        e.setReadyState(1)
    }, overrideMimeType: function (a) {
        this.mimeType = a
    }, schedule: function () {
        var b = this, a = b.mgr.delay;
        if (a) {
            b.timer = setTimeout(function () {
                b.onTick()
            }, a)
        } else {
            b.onTick()
        }
    }, send: function (a) {
        var b = this;
        b.body = a;
        if (b.async) {
            b.schedule()
        } else {
            b.onComplete()
        }
    }, setReadyState: function (b) {
        var a = this;
        if (a.readyState != b) {
            a.readyState = b;
            a.onreadystatechange()
        }
    }, setRequestHeader: function (b, a) {
        this.requestHeaders[b] = a
    }, onreadystatechange: Ext.emptyFn, onComplete: function () {
        var me = this, callback;
        me.readyState = 4;
        Ext.apply(me, me.simlet.exec(me));
        callback = me.jsonpCallback;
        if (callback) {
            var text = callback + "(" + me.responseText + ")";
            eval(text)
        }
    }, onTick: function () {
        var a = this;
        a.timer = null;
        a.onComplete();
        a.onreadystatechange && a.onreadystatechange()
    }
});
Ext.define("Ext.ux.ajax.SimManager", {
    singleton: true,
    requires: ["Ext.data.Connection", "Ext.ux.ajax.SimXhr", "Ext.ux.ajax.Simlet", "Ext.ux.ajax.JsonSimlet"],
    defaultType: "basic",
    delay: 150,
    ready: false,
    constructor: function () {
        this.simlets = []
    },
    getSimlet: function (a) {
        var g = this, e = a.indexOf("?"), b = g.simlets, f = b.length, c, j, h, d;
        if (e < 0) {
            e = a.indexOf("#")
        }
        if (e > 0) {
            a = a.substring(0, e)
        }
        for (c = 0; c < f; ++c) {
            j = b[c];
            h = j.url;
            if (h instanceof RegExp) {
                d = h.test(a)
            } else {
                d = h === a
            }
            if (d) {
                return j
            }
        }
        return g.defaultSimlet
    },
    getXhr: function (e, b, a, c) {
        var d = this.getSimlet(b);
        if (d) {
            return d.openRequest(e, b, a, c)
        }
        return null
    },
    init: function (a) {
        var b = this;
        Ext.apply(b, a);
        if (!b.ready) {
            b.ready = true;
            if (!("defaultSimlet" in b)) {
                b.defaultSimlet = new Ext.ux.ajax.Simlet({status: 404, statusText: "Not Found"})
            }
            b._openRequest = Ext.data.Connection.prototype.openRequest;
            Ext.data.Connection.override({
                openRequest: function (d, c, e) {
                    var f = !d.nosim && b.getXhr(c.method, c.url, d, e);
                    if (!f) {
                        f = this.callParent(arguments)
                    }
                    return f
                }
            });
            if (Ext.data.JsonP) {
                Ext.data.JsonP.self.override({
                    createScript: function (f, g, e) {
                        var c = Ext.urlAppend(f, Ext.Object.toQueryString(g)), d = !e.nosim && b.getXhr("GET", c, e, true);
                        if (!d) {
                            d = this.callParent(arguments)
                        }
                        return d
                    }, loadScript: function (d) {
                        var c = d.script;
                        if (c.simlet) {
                            c.jsonpCallback = d.params[d.callbackKey];
                            c.send(null);
                            d.script = document.createElement("script")
                        } else {
                            this.callParent(arguments)
                        }
                    }
                })
            }
        }
        return b
    },
    openRequest: function (d, a, c) {
        var b = {method: d, url: a};
        return this._openRequest.call(Ext.data.Connection.prototype, {}, b, c)
    },
    register: function (c) {
        var b = this;
        b.init();
        function a(d) {
            var e = d;
            if (!e.isSimlet) {
                e = Ext.create("simlet." + (e.type || e.stype || b.defaultType), d)
            }
            b.simlets.push(e);
            e.manager = b
        }

        if (Ext.isArray(c)) {
            Ext.each(c, a)
        } else {
            if (c.isSimlet || c.url) {
                a(c)
            } else {
                Ext.Object.each(c, function (d, e) {
                    e.url = d;
                    a(e)
                })
            }
        }
        return b
    }
});
Ext.define("Ext.ux.ajax.XmlSimlet", {
    extend: "Ext.ux.ajax.DataSimlet",
    alias: "simlet.xml",
    xmlTpl: ["<{root}>\n", '<tpl for="data">', "    <{parent.record}>\n", '<tpl for="parent.fields">', "        <{name}>{[parent[values.name]]}</{name}>\n", "</tpl>", "    </{parent.record}>\n", "</tpl>", "</{root}>"],
    doGet: function (l) {
        var j = this, b = j.getData(l), h = j.getPage(l, b), i = l.xhr.options.operation.getProxy(), e = i && i.getReader(), d = e && e.getModel(), g = j.callParent(arguments), a = {
            data: h,
            reader: e,
            fields: d && d.fields,
            root: e && e.getRootProperty(),
            record: e && e.record
        }, f, c, k;
        if (l.groupSpec) {
            a.summaryData = j.getSummary(l, b, h)
        }
        if (j.xmlTpl) {
            f = Ext.XTemplate.getTpl(j, "xmlTpl");
            c = f.apply(a)
        } else {
            c = b
        }
        if (typeof DOMParser != "undefined") {
            k = (new DOMParser()).parseFromString(c, "text/xml")
        } else {
            k = new ActiveXObject("Microsoft.XMLDOM");
            k.async = false;
            k.loadXML(c)
        }
        g.responseText = c;
        g.responseXML = k;
        return g
    },
    fixTree: function () {
        this.callParent(arguments);
        var a = [];
        this.buildTreeXml(this.data, a);
        this.data = a.join("")
    },
    buildTreeXml: function (c, b) {
        var a = this.rootProperty, d = this.recordProperty;
        b.push("<", a, ">");
        Ext.Array.forEach(c, function (f) {
            b.push("<", d, ">");
            for (var e in f) {
                if (e == "children") {
                    this.buildTreeXml(f.children, b)
                } else {
                    b.push("<", e, ">", f[e], "</", e, ">")
                }
            }
            b.push("</", d, ">")
        });
        b.push("</", a, ">")
    }
});
Ext.define("Ext.ux.google.Api", {
    mixins: ["Ext.mixin.Mashup"],
    requiredScripts: ["http://www.google.com/jsapi"],
    statics: {loadedModules: {}},
    onClassExtended: function (c, d, a) {
        var e = a.onBeforeCreated, b = this;
        a.onBeforeCreated = function (q, j) {
            var n = this, k = [], o = Ext.Array.from(j.requiresGoogle), m = b.loadedModules, g = 0, p = function () {
                if (!--g) {
                    e.call(n, q, j, a)
                }
                Ext.env.Ready.unblock()
            }, l, h, f;
            f = o.length;
            for (h = 0; h < f; ++h) {
                if (Ext.isString(l = o[h])) {
                    k.push({api: l})
                } else {
                    if (Ext.isObject(l)) {
                        k.push(Ext.apply({}, l))
                    }
                }
            }
            Ext.each(k, function (t) {
                var r = t.api, i = String(t.version || "1.x"), s = m[r];
                if (!s) {
                    ++g;
                    Ext.env.Ready.block();
                    m[r] = s = [p].concat(t.callback || []);
                    delete t.api;
                    delete t.version;
                    google.load(r, i, Ext.applyIf({
                        callback: function () {
                            m[r] = true;
                            for (var u = s.length; u-- > 0;) {
                                s[u]()
                            }
                        }
                    }, t))
                } else {
                    if (s !== true) {
                        s.push(p)
                    }
                }
            });
            if (!g) {
                e.call(n, q, j, a)
            }
        }
    }
});
Ext.define("Ext.ux.google.Feeds", {extend: "Ext.ux.google.Api", requiresGoogle: {api: "feeds", nocss: true}});
Ext.define("Ext.ux.dashboard.GoogleRssView", {
    extend: "Ext.Component",
    requires: ["Ext.tip.ToolTip", "Ext.ux.google.Feeds"],
    feedCls: Ext.baseCSSPrefix + "dashboard-googlerss",
    previewCls: Ext.baseCSSPrefix + "dashboard-googlerss-preview",
    closeDetailsCls: Ext.baseCSSPrefix + "dashboard-googlerss-close",
    nextCls: Ext.baseCSSPrefix + "dashboard-googlerss-next",
    prevCls: Ext.baseCSSPrefix + "dashboard-googlerss-prev",
    feedUrl: null,
    scrollable: true,
    maxFeedEntries: 10,
    previewTips: false,
    mode: "detail",
    closeDetailsGlyph: "8657@",
    prevGlyph: "9664@",
    nextGlyph: "9654@",
    detailTpl: '<tpl for="entries[currentEntry]"><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-detail-header"><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-detail-nav"><tpl if="parent.hasPrev"><span class="' + Ext.baseCSSPrefix + "dashboard-googlerss-prev " + Ext.baseCSSPrefix + 'dashboard-googlerss-glyph">{parent.prevGlyph}</span> </tpl> {[parent.currentEntry+1]}/{parent.numEntries} <span class="' + Ext.baseCSSPrefix + "dashboard-googlerss-next " + Ext.baseCSSPrefix + 'dashboard-googlerss-glyph"<tpl if="!parent.hasNext"> style="visibility:hidden"</tpl>> {parent.nextGlyph}</span> <span class="' + Ext.baseCSSPrefix + "dashboard-googlerss-close " + Ext.baseCSSPrefix + 'dashboard-googlerss-glyph"> {parent.closeGlyph}</span> </div><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-title"><a href="{link}" target=_blank>{title}</a></div><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-author">By {author} - {publishedDate:this.date}</div></div><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-detail">{content}</div></tpl>',
    summaryTpl: '<tpl for="entries"><div class="' + Ext.baseCSSPrefix + 'dashboard-googlerss"><span class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-title"><a href="{link}" target=_blank>{title}</a></span> <img src="' + Ext.BLANK_IMAGE_URL + '" data-index="{#}" class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-preview"><br><span class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-author">By {author} - {publishedDate:this.date}</span><br><span class="' + Ext.baseCSSPrefix + 'dashboard-googlerss-snippet">{contentSnippet}</span><br></div></tpl>',
    initComponent: function () {
        var a = this;
        a.feedMgr = new google.feeds.Feed(a.feedUrl);
        a.callParent()
    },
    afterRender: function () {
        var a = this;
        a.callParent();
        if (a.feedMgr) {
            a.refresh()
        }
        a.el.on({click: a.onClick, scope: a});
        if (a.previewTips) {
            a.tip = new Ext.tip.ToolTip({
                target: a.el,
                delegate: "." + a.previewCls,
                maxWidth: 800,
                showDelay: 750,
                autoHide: false,
                scrollable: true,
                anchor: "top",
                listeners: {beforeshow: "onBeforeShowTip", scope: a}
            })
        }
    },
    formatDate: function (b) {
        if (!b) {
            return ""
        }
        b = new Date(b);
        var a = new Date(), e = Ext.Date.clearTime(a, true), c = Ext.Date.clearTime(b, true).getTime();
        if (c === e.getTime()) {
            return "Today " + Ext.Date.format(b, "g:i a")
        }
        e = Ext.Date.add(e, "d", -6);
        if (e.getTime() <= c) {
            return Ext.Date.format(b, "D g:i a")
        }
        if (e.getYear() === a.getYear()) {
            return Ext.Date.format(b, "D M d \\a\\t g:i a")
        }
        return Ext.Date.format(b, "D M d, Y \\a\\t g:i a")
    },
    getTitle: function () {
        var a = this.data;
        return a && a.title
    },
    onBeforeShowTip: function (c) {
        if (this.mode !== "summary") {
            return false
        }
        var b = c.triggerElement, a = parseInt(b.getAttribute("data-index"), 10);
        c.maxHeight = Ext.Element.getViewportHeight() / 2;
        c.update(this.data.entries[a - 1].content)
    },
    onClick: function (d) {
        var b = this, a = b.data.currentEntry, c = Ext.fly(d.getTarget());
        if (c.hasCls(b.nextCls)) {
            b.setCurrentEntry(a + 1)
        } else {
            if (c.hasCls(b.prevCls)) {
                b.setCurrentEntry(a - 1)
            } else {
                if (c.hasCls(b.closeDetailsCls)) {
                    b.setMode("summary")
                } else {
                    if (c.hasCls(b.previewCls)) {
                        b.setMode("detail", parseInt(c.getAttribute("data-index"), 10))
                    }
                }
            }
        }
    },
    refresh: function () {
        var a = this;
        if (!a.feedMgr) {
            return
        }
        a.fireEvent("beforeload", a);
        a.feedMgr.setNumEntries(a.maxFeedEntries);
        a.feedMgr.load(function (b) {
            a.setFeedData(b.feed);
            a.fireEvent("load", a)
        })
    },
    setCurrentEntry: function (a) {
        this.setMode(this.mode, a)
    },
    setFeedData: function (b) {
        var d = this, a = b.entries, c = a && a.length || 0, e = Ext.apply({
            numEntries: c,
            closeGlyph: d.wrapGlyph(d.closeDetailsGlyph),
            prevGlyph: d.wrapGlyph(d.prevGlyph),
            nextGlyph: d.wrapGlyph(d.nextGlyph),
            currentEntry: 0
        }, b);
        d.data = e;
        d.setMode(d.mode)
    },
    setMode: function (e, a) {
        var b = this, c = b.data, d = (a === undefined) ? c.currentEntry : a;
        b.tpl = b.getTpl(e + "Tpl");
        b.tpl.date = b.formatDate;
        b.mode = e;
        c.currentEntry = d;
        c.hasNext = d + 1 < c.numEntries;
        c.hasPrev = d > 0;
        b.update(c);
        b.el.dom.scrollTop = 0
    },
    wrapGlyph: function (c) {
        var d = Ext._glyphFontFamily, b, a;
        if (typeof c === "string") {
            b = c.split("@");
            c = b[0];
            d = b[1]
        }
        a = "&#" + c + ";";
        if (d) {
            a = '<span style="font-family:' + d + '">' + a + "</span>"
        }
        return a
    },
    beforeDestroy: function () {
        Ext.destroy(this.tip);
        this.callParent()
    }
});
Ext.define("Ext.ux.dashboard.GoogleRssPart", {
    extend: "Ext.dashboard.Part",
    alias: "part.google-rss",
    requires: ["Ext.window.MessageBox", "Ext.ux.dashboard.GoogleRssView"],
    viewTemplate: {layout: "fit", items: {xclass: "Ext.ux.dashboard.GoogleRssView", feedUrl: "{feedUrl}"}},
    type: "google-rss",
    config: {suggestedFeed: "http://rss.slashdot.org/Slashdot/slashdot"},
    formTitleAdd: "Add RSS Feed",
    formTitleEdit: "Edit RSS Feed",
    formLabel: "RSS Feed URL",
    displayForm: function (a, b, g, d) {
        var e = this, c = b ? b.feedUrl : e.getSuggestedFeed(), f = a ? e.formTitleEdit : e.formTitleAdd;
        Ext.Msg.prompt(f, e.formLabel, function (h, i) {
            if (h === "ok") {
                g.call(d || e, {feedUrl: i})
            }
        }, e, false, c)
    }
});
Ext.define("Ext.ux.data.PagingMemoryProxy", {
    extend: "Ext.data.proxy.Memory",
    alias: "proxy.pagingmemory",
    alternateClassName: "Ext.data.PagingMemoryProxy",
    constructor: function () {
        Ext.log.warn("Ext.ux.data.PagingMemoryProxy functionality has been merged into Ext.data.proxy.Memory by using the enablePaging flag.");
        this.callParent(arguments)
    },
    read: function (c, g, h) {
        var d = this.getReader(), i = d.read(this.data), e, a, f, b;
        h = h || this;
        a = c.filters;
        if (a.length > 0) {
            b = [];
            Ext.each(i.records, function (j) {
                var o = true, p = a.length, k;
                for (k = 0; k < p; k++) {
                    var n = a[k], m = n.filterFn, l = n.scope;
                    o = o && m.call(l, j)
                }
                if (o) {
                    b.push(j)
                }
            }, this);
            i.records = b;
            i.totalRecords = i.total = b.length
        }
        e = c.sorters;
        if (e.length > 0) {
            f = function (l, k) {
                var j = e[0].sort(l, k), n = e.length, m;
                for (m = 1; m < n; m++) {
                    j = j || e[m].sort.call(this, l, k)
                }
                return j
            };
            i.records.sort(f)
        }
        if (c.start !== undefined && c.limit !== undefined) {
            i.records = i.records.slice(c.start, c.start + c.limit);
            i.count = i.records.length
        }
        Ext.apply(c, {resultSet: i});
        c.setCompleted();
        c.setSuccessful();
        Ext.Function.defer(function () {
            Ext.callback(g, h, [c])
        }, 10)
    }
});
Ext.define("Ext.ux.dd.CellFieldDropZone", {
    extend: "Ext.dd.DropZone", constructor: function (a) {
        a = a || {};
        if (a.onCellDrop) {
            this.onCellDrop = a.onCellDrop
        }
        if (a.ddGroup) {
            this.ddGroup = a.ddGroup
        }
    }, init: function (a) {
        var b = this;
        if (a.rendered) {
            b.grid = a;
            a.getView().on({
                render: function (c) {
                    b.view = c;
                    Ext.ux.dd.CellFieldDropZone.superclass.constructor.call(b, b.view.el)
                }, single: true
            })
        } else {
            a.on("render", b.init, b, {single: true})
        }
    }, containerScroll: true, getTargetFromEvent: function (f) {
        var d = this, b = d.view;
        var a = f.getTarget(b.getCellSelector());
        if (a) {
            var g = b.findItemByChild(a), c = a.cellIndex;
            if (g && Ext.isDefined(c)) {
                return {
                    node: a,
                    record: b.getRecord(g),
                    fieldName: d.grid.getVisibleColumnManager().getColumns()[c].dataIndex
                }
            }
        }
    }, onNodeEnter: function (h, a, g, d) {
        delete this.dropOK;
        if (!h) {
            return
        }
        var b = d.field;
        if (!b) {
            return
        }
        var c = h.record.fieldsMap[h.fieldName];
        if (c.isNumeric) {
            if (!b.isXType("numberfield")) {
                return
            }
        } else {
            if (c.isDateField) {
                if (!b.isXType("datefield")) {
                    return
                }
            } else {
                if (c.isBooleanField) {
                    if (!b.isXType("checkbox")) {
                        return
                    }
                }
            }
        }
        this.dropOK = true;
        Ext.fly(h.node).addCls("x-drop-target-active")
    }, onNodeOver: function (d, a, c, b) {
        return this.dropOK ? this.dropAllowed : this.dropNotAllowed
    }, onNodeOut: function (d, a, c, b) {
        Ext.fly(d.node).removeCls("x-drop-target-active")
    }, onNodeDrop: function (f, a, d, c) {
        if (this.dropOK) {
            var b = c.field.getValue();
            f.record.set(f.fieldName, b);
            this.onCellDrop(f.fieldName, b);
            return true
        }
    }, onCellDrop: Ext.emptyFn
});
Ext.define("Ext.ux.dd.PanelFieldDragZone", {
    extend: "Ext.dd.DragZone", constructor: function (a) {
        a = a || {};
        if (a.ddGroup) {
            this.ddGroup = a.ddGroup
        }
    }, init: function (a) {
        if (a.nodeType) {
            Ext.ux.dd.PanelFieldDragZone.superclass.init.apply(this, arguments)
        } else {
            if (a.rendered) {
                Ext.ux.dd.PanelFieldDragZone.superclass.constructor.call(this, a.getEl())
            } else {
                a.on("afterrender", this.init, this, {single: true})
            }
        }
    }, scroll: false, getDragData: function (f) {
        var c = f.getTarget("label", null, true), g, b, d, a;
        if (c) {
            d = Ext.getCmp(c.up("." + Ext.form.Labelable.prototype.formItemCls).id);
            b = d.preventMark;
            d.preventMark = true;
            if (d.isValid()) {
                d.preventMark = b;
                a = document.createElement("div");
                a.className = Ext.baseCSSPrefix + "form-text";
                g = d.getRawValue();
                a.innerHTML = Ext.isEmpty(g) ? "&#160;" : g;
                Ext.fly(a).setWidth(d.getEl().getWidth());
                return {field: d, ddel: a}
            } else {
                f.stopEvent()
            }
            d.preventMark = b
        }
    }, getRepairXY: function () {
        return this.dragData.field.getEl().getXY()
    }
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.Desktop", {
    extend: "Ext.panel.Panel",
    alias: "widget.desktop",
    uses: ["Ext.util.MixedCollection", "Ext.menu.Menu", "Ext.view.View", "Ext.window.Window", "Ext.ux.desktop.TaskBar", "Ext.ux.desktop.Wallpaper"],
    activeWindowCls: "ux-desktop-active-win",
    inactiveWindowCls: "ux-desktop-inactive-win",
    lastActiveWindow: null,
    border: false,
    html: "&#160;",
    layout: "fit",
    xTickSize: 1,
    yTickSize: 1,
    app: null,
    shortcuts: null,
    shortcutItemSelector: "div.ux-desktop-shortcut",
    shortcutTpl: ['<tpl for=".">', '<div class="ux-desktop-shortcut" id="{name}-shortcut">', '<div class="ux-desktop-shortcut-icon {iconCls}">', '<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">', "</div>", '<span class="ux-desktop-shortcut-text">{name}</span>', "</div>", "</tpl>", '<div class="x-clear"></div>'],
    taskbarConfig: null,
    windowMenu: null,
    initComponent: function () {
        var b = this;
        b.windowMenu = new Ext.menu.Menu(b.createWindowMenu());
        b.bbar = b.taskbar = new Ext.ux.desktop.TaskBar(b.taskbarConfig);
        b.taskbar.windowMenu = b.windowMenu;
        b.windows = new Ext.util.MixedCollection();
        b.contextMenu = new Ext.menu.Menu(b.createDesktopMenu());
        b.items = [{xtype: "wallpaper", id: b.id + "_wallpaper"}, b.createDataView()];
        b.callParent();
        b.shortcutsView = b.items.getAt(1);
        b.shortcutsView.on("itemclick", b.onShortcutItemClick, b);
        var a = b.wallpaper;
        b.wallpaper = b.items.getAt(0);
        if (a) {
            b.setWallpaper(a, b.wallpaperStretch)
        }
    },
    afterRender: function () {
        var a = this;
        a.callParent();
        a.el.on("contextmenu", a.onDesktopMenu, a)
    },
    createDataView: function () {
        var a = this;
        return {
            xtype: "dataview",
            overItemCls: "x-view-over",
            trackOver: true,
            itemSelector: a.shortcutItemSelector,
            store: a.shortcuts,
            style: {position: "absolute"},
            x: 0,
            y: 0,
            tpl: new Ext.XTemplate(a.shortcutTpl)
        }
    },
    createDesktopMenu: function () {
        var b = this, a = {items: b.contextMenuItems || []};
        if (a.items.length) {
            a.items.push("-")
        }
        a.items.push({text: "Tile", handler: b.tileWindows, scope: b, minWindows: 1}, {
            text: "Cascade",
            handler: b.cascadeWindows,
            scope: b,
            minWindows: 1
        });
        return a
    },
    createWindowMenu: function () {
        var a = this;
        return {
            defaultAlign: "br-tr",
            items: [{text: "Restore", handler: a.onWindowMenuRestore, scope: a}, {
                text: "Minimize",
                handler: a.onWindowMenuMinimize,
                scope: a
            }, {text: "Maximize", handler: a.onWindowMenuMaximize, scope: a}, "-", {
                text: "Close",
                handler: a.onWindowMenuClose,
                scope: a
            }],
            listeners: {beforeshow: a.onWindowMenuBeforeShow, hide: a.onWindowMenuHide, scope: a}
        }
    },
    onDesktopMenu: function (b) {
        var a = this, c = a.contextMenu;
        b.stopEvent();
        if (!c.rendered) {
            c.on("beforeshow", a.onDesktopMenuBeforeShow, a)
        }
        c.showAt(b.getXY());
        c.doConstrain()
    },
    onDesktopMenuBeforeShow: function (c) {
        var b = this, a = b.windows.getCount();
        c.items.each(function (e) {
            var d = e.minWindows || 0;
            e.setDisabled(a < d)
        })
    },
    onShortcutItemClick: function (e, a) {
        var c = this, b = c.app.getModule(a.data.module), d = b && b.createWindow();
        if (d) {
            c.restoreWindow(d)
        }
    },
    onWindowClose: function (b) {
        var a = this;
        a.windows.remove(b);
        a.taskbar.removeTaskButton(b.taskButton);
        a.updateActiveWindow()
    },
    onWindowMenuBeforeShow: function (c) {
        var a = c.items.items, b = c.theWin;
        a[0].setDisabled(b.maximized !== true && b.hidden !== true);
        a[1].setDisabled(b.minimized === true);
        a[2].setDisabled(b.maximized === true || b.hidden === true)
    },
    onWindowMenuClose: function () {
        var a = this, b = a.windowMenu.theWin;
        b.close()
    },
    onWindowMenuHide: function (a) {
        Ext.defer(function () {
            a.theWin = null
        }, 1)
    },
    onWindowMenuMaximize: function () {
        var a = this, b = a.windowMenu.theWin;
        b.maximize();
        b.toFront()
    },
    onWindowMenuMinimize: function () {
        var a = this, b = a.windowMenu.theWin;
        b.minimize()
    },
    onWindowMenuRestore: function () {
        var a = this, b = a.windowMenu.theWin;
        a.restoreWindow(b)
    },
    getWallpaper: function () {
        return this.wallpaper.wallpaper
    },
    setTickSize: function (b, c) {
        var e = this, a = e.xTickSize = b, d = e.yTickSize = (arguments.length > 1) ? c : a;
        e.windows.each(function (g) {
            var f = g.dd, h = g.resizer;
            f.xTickSize = a;
            f.yTickSize = d;
            h.widthIncrement = a;
            h.heightIncrement = d
        })
    },
    setWallpaper: function (b, a) {
        this.wallpaper.setWallpaper(b, a);
        return this
    },
    cascadeWindows: function () {
        var a = 0, c = 0, b = this.getDesktopZIndexManager();
        b.eachBottomUp(function (d) {
            if (d.isWindow && d.isVisible() && !d.maximized) {
                d.setPosition(a, c);
                a += 20;
                c += 20
            }
        })
    },
    createWindow: function (c, b) {
        var d = this, e, a = Ext.applyIf(c || {}, {
            stateful: false,
            isWindow: true,
            constrainHeader: true,
            minimizable: true,
            maximizable: true
        });
        b = b || Ext.window.Window;
        e = d.add(new b(a));
        d.windows.add(e);
        e.taskButton = d.taskbar.addTaskButton(e);
        e.animateTarget = e.taskButton.el;
        e.on({
            activate: d.updateActiveWindow,
            beforeshow: d.updateActiveWindow,
            deactivate: d.updateActiveWindow,
            minimize: d.minimizeWindow,
            destroy: d.onWindowClose,
            scope: d
        });
        e.on({
            boxready: function () {
                e.dd.xTickSize = d.xTickSize;
                e.dd.yTickSize = d.yTickSize;
                if (e.resizer) {
                    e.resizer.widthIncrement = d.xTickSize;
                    e.resizer.heightIncrement = d.yTickSize
                }
            }, single: true
        });
        e.doClose = function () {
            e.doClose = Ext.emptyFn;
            e.el.disableShadow();
            e.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        e.destroy()
                    }
                }
            })
        };
        return e
    },
    getActiveWindow: function () {
        var b = null, a = this.getDesktopZIndexManager();
        if (a) {
            a.eachTopDown(function (c) {
                if (c.isWindow && !c.hidden) {
                    b = c;
                    return false
                }
                return true
            })
        }
        return b
    },
    getDesktopZIndexManager: function () {
        var a = this.windows;
        return (a.getCount() && a.getAt(0).zIndexManager) || null
    },
    getWindow: function (a) {
        return this.windows.get(a)
    },
    minimizeWindow: function (a) {
        a.minimized = true;
        a.hide()
    },
    restoreWindow: function (a) {
        if (a.isVisible()) {
            a.restore();
            a.toFront()
        } else {
            a.show()
        }
        return a
    },
    tileWindows: function () {
        var b = this, e = b.body.getWidth(true);
        var a = b.xTickSize, d = b.yTickSize, c = d;
        b.windows.each(function (g) {
            if (g.isVisible() && !g.maximized) {
                var f = g.el.getWidth();
                if (a > b.xTickSize && a + f > e) {
                    a = b.xTickSize;
                    d = c
                }
                g.setPosition(a, d);
                a += f + b.xTickSize;
                c = Math.max(c, d + g.el.getHeight() + b.yTickSize)
            }
        })
    },
    updateActiveWindow: function () {
        var b = this, c = b.getActiveWindow(), a = b.lastActiveWindow;
        if (a && a.isDestroyed) {
            b.lastActiveWindow = null;
            return
        }
        if (c === a) {
            return
        }
        if (a) {
            if (a.el.dom) {
                a.addCls(b.inactiveWindowCls);
                a.removeCls(b.activeWindowCls)
            }
            a.active = false
        }
        b.lastActiveWindow = c;
        if (c) {
            c.addCls(b.activeWindowCls);
            c.removeCls(b.inactiveWindowCls);
            c.minimized = false;
            c.active = true
        }
        b.taskbar.setActiveButton(c && c.taskButton)
    }
});
Ext.define("Ext.ux.desktop.App", {
    mixins: {observable: "Ext.util.Observable"},
    requires: ["Ext.container.Viewport", "Ext.ux.desktop.Desktop"],
    isReady: false,
    modules: null,
    useQuickTips: true,
    constructor: function (a) {
        var b = this;
        b.mixins.observable.constructor.call(this, a);
        if (Ext.isReady) {
            Ext.Function.defer(b.init, 10, b)
        } else {
            Ext.onReady(b.init, b)
        }
    },
    init: function () {
        var b = this, a;
        if (b.useQuickTips) {
            Ext.QuickTips.init()
        }
        b.modules = b.getModules();
        if (b.modules) {
            b.initModules(b.modules)
        }
        a = b.getDesktopConfig();
        b.desktop = new Ext.ux.desktop.Desktop(a);
        b.viewport = new Ext.container.Viewport({layout: "fit", items: [b.desktop]});
        Ext.getWin().on("beforeunload", b.onUnload, b);
        b.isReady = true;
        b.fireEvent("ready", b)
    },
    getDesktopConfig: function () {
        var b = this, a = {app: b, taskbarConfig: b.getTaskbarConfig()};
        Ext.apply(a, b.desktopConfig);
        return a
    },
    getModules: Ext.emptyFn,
    getStartConfig: function () {
        var b = this, a = {app: b, menu: []}, c;
        Ext.apply(a, b.startConfig);
        Ext.each(b.modules, function (d) {
            c = d.launcher;
            if (c) {
                c.handler = c.handler || Ext.bind(b.createWindow, b, [d]);
                a.menu.push(d.launcher)
            }
        });
        return a
    },
    createWindow: function (a) {
        var b = a.createWindow();
        b.show()
    },
    getTaskbarConfig: function () {
        var b = this, a = {app: b, startConfig: b.getStartConfig()};
        Ext.apply(a, b.taskbarConfig);
        return a
    },
    initModules: function (a) {
        var b = this;
        Ext.each(a, function (c) {
            c.app = b
        })
    },
    getModule: function (d) {
        var c = this.modules;
        for (var e = 0, b = c.length; e < b; e++) {
            var a = c[e];
            if (a.id == d || a.appType == d) {
                return a
            }
        }
        return null
    },
    onReady: function (b, a) {
        if (this.isReady) {
            b.call(a, this)
        } else {
            this.on({ready: b, scope: a, single: true})
        }
    },
    getDesktop: function () {
        return this.desktop
    },
    onUnload: function (a) {
        if (this.fireEvent("beforeunload", this) === false) {
            a.stopEvent()
        }
    }
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.Module", {
    mixins: {observable: "Ext.util.Observable"}, constructor: function (a) {
        this.mixins.observable.constructor.call(this, a);
        this.init()
    }, init: Ext.emptyFn
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.ShortcutModel", {
    extend: "Ext.data.Model",
    fields: [{name: "name"}, {name: "iconCls"}, {name: "module"}]
});
Ext.define("Ext.ux.desktop.StartMenu", {
    extend: "Ext.menu.Menu",
    baseCls: Ext.baseCSSPrefix + "panel",
    cls: "x-menu ux-start-menu",
    bodyCls: "ux-start-menu-body",
    defaultAlign: "bl-tl",
    iconCls: "user",
    bodyBorder: true,
    width: 300,
    initComponent: function () {
        var a = this;
        a.layout.align = "stretch";
        a.items = a.menu;
        a.callParent();
        a.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: "right",
            cls: "ux-start-menu-toolbar",
            vertical: true,
            width: 100,
            layout: {align: "stretch"}
        }, a.toolConfig));
        a.addDocked(a.toolbar);
        delete a.toolItems
    },
    addMenuItem: function () {
        var a = this.menu;
        a.add.apply(a, arguments)
    },
    addToolItem: function () {
        var a = this.toolbar;
        a.add.apply(a, arguments)
    }
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.TaskBar", {
    extend: "Ext.toolbar.Toolbar",
    requires: ["Ext.button.Button", "Ext.resizer.Splitter", "Ext.menu.Menu", "Ext.ux.desktop.StartMenu"],
    alias: "widget.taskbar",
    cls: "ux-taskbar",
    startBtnText: "Start",
    initComponent: function () {
        var a = this;
        a.startMenu = new Ext.ux.desktop.StartMenu(a.startConfig);
        a.quickStart = new Ext.toolbar.Toolbar(a.getQuickStart());
        a.windowBar = new Ext.toolbar.Toolbar(a.getWindowBarConfig());
        a.tray = new Ext.toolbar.Toolbar(a.getTrayConfig());
        a.items = [{
            xtype: "button",
            cls: "ux-start-button",
            iconCls: "ux-start-button-icon",
            menu: a.startMenu,
            menuAlign: "bl-tl",
            text: a.startBtnText
        }, a.quickStart, {
            xtype: "splitter",
            html: "&#160;",
            height: 14,
            width: 2,
            cls: "x-toolbar-separator x-toolbar-separator-horizontal"
        }, a.windowBar, "-", a.tray];
        a.callParent()
    },
    afterLayout: function () {
        var a = this;
        a.callParent();
        a.windowBar.el.on("contextmenu", a.onButtonContextMenu, a)
    },
    getQuickStart: function () {
        var b = this, a = {minWidth: 20, width: Ext.themeName === "neptune" ? 70 : 60, items: [], enableOverflow: true};
        Ext.each(this.quickStart, function (c) {
            a.items.push({
                tooltip: {text: c.name, align: "bl-tl"},
                overflowText: c.name,
                iconCls: c.iconCls,
                module: c.module,
                handler: b.onQuickStartClick,
                scope: b
            })
        });
        return a
    },
    getTrayConfig: function () {
        var a = {items: this.trayItems};
        delete this.trayItems;
        return a
    },
    getWindowBarConfig: function () {
        return {flex: 1, cls: "ux-desktop-windowbar", items: ["&#160;"], layout: {overflowHandler: "Scroller"}}
    },
    getWindowBtnFromEl: function (a) {
        var b = this.windowBar.getChildByElement(a);
        return b || null
    },
    onQuickStartClick: function (b) {
        var a = this.app.getModule(b.module), c;
        if (a) {
            c = a.createWindow();
            c.show()
        }
    },
    onButtonContextMenu: function (d) {
        var c = this, b = d.getTarget(), a = c.getWindowBtnFromEl(b);
        if (a) {
            d.stopEvent();
            c.windowMenu.theWin = a.win;
            c.windowMenu.showBy(b)
        }
    },
    onWindowBtnClick: function (a) {
        var b = a.win;
        if (b.minimized || b.hidden) {
            a.disable();
            b.show(null, function () {
                a.enable()
            })
        } else {
            if (b.active) {
                a.disable();
                b.on("hide", function () {
                    a.enable()
                }, null, {single: true});
                b.minimize()
            } else {
                b.toFront()
            }
        }
    },
    addTaskButton: function (c) {
        var a = {
            iconCls: c.iconCls,
            enableToggle: true,
            toggleGroup: "all",
            width: 140,
            margin: "0 2 0 3",
            text: Ext.util.Format.ellipsis(c.title, 20),
            listeners: {click: this.onWindowBtnClick, scope: this},
            win: c
        };
        var b = this.windowBar.add(a);
        b.toggle(true);
        return b
    },
    removeTaskButton: function (a) {
        var c, b = this;
        b.windowBar.items.each(function (d) {
            if (d === a) {
                c = d
            }
            return !c
        });
        if (c) {
            b.windowBar.remove(c)
        }
        return c
    },
    setActiveButton: function (a) {
        if (a) {
            a.toggle(true)
        } else {
            this.windowBar.items.each(function (b) {
                if (b.isButton) {
                    b.toggle(false)
                }
            })
        }
    }
});
Ext.define("Ext.ux.desktop.TrayClock", {
    extend: "Ext.toolbar.TextItem",
    alias: "widget.trayclock",
    cls: "ux-desktop-trayclock",
    html: "&#160;",
    timeFormat: "g:i A",
    tpl: "{time}",
    initComponent: function () {
        var a = this;
        a.callParent();
        if (typeof(a.tpl) == "string") {
            a.tpl = new Ext.XTemplate(a.tpl)
        }
    },
    afterRender: function () {
        var a = this;
        Ext.Function.defer(a.updateTime, 100, a);
        a.callParent()
    },
    onDestroy: function () {
        var a = this;
        if (a.timer) {
            window.clearTimeout(a.timer);
            a.timer = null
        }
        a.callParent()
    },
    updateTime: function () {
        var a = this, b = Ext.Date.format(new Date(), a.timeFormat), c = a.tpl.apply({time: b});
        if (a.lastText != c) {
            a.setText(c);
            a.lastText = c
        }
        a.timer = Ext.Function.defer(a.updateTime, 10000, a)
    }
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.Video", {
    extend: "Ext.panel.Panel",
    alias: "widget.video",
    layout: "fit",
    autoplay: false,
    controls: true,
    bodyStyle: "background-color:#000;color:#fff",
    html: "",
    tpl: ['<video id="{id}-video" autoPlay="{autoplay}" controls="{controls}" poster="{poster}" start="{start}" loopstart="{loopstart}" loopend="{loopend}" autobuffer="{autobuffer}" loop="{loop}" style="width:100%;height:100%">', '<tpl for="src">', '<source src="{src}" type="{type}"/>', "</tpl>", "{html}", "</video>"],
    initComponent: function () {
        var e = this, f, c, b, d;
        if (e.fallbackHTML) {
            f = e.fallbackHTML
        } else {
            f = "Your browser does not support HTML5 Video. ";
            if (Ext.isChrome) {
                f += "Upgrade Chrome."
            } else {
                if (Ext.isGecko) {
                    f += "Upgrade to Firefox 3.5 or newer."
                } else {
                    var a = '<a href="http://www.google.com/chrome">Chrome</a>';
                    f += 'Please try <a href="http://www.mozilla.com">Firefox</a>';
                    if (Ext.isIE) {
                        f += ", " + a + ' or <a href="http://www.apple.com/safari/">Safari</a>.'
                    } else {
                        f += " or " + a + "."
                    }
                }
            }
        }
        e.fallbackHTML = f;
        b = e.data = Ext.copyTo({
            tag: "video",
            html: f
        }, e, "id,poster,start,loopstart,loopend,playcount,autobuffer,loop");
        if (e.autoplay) {
            b.autoplay = 1
        }
        if (e.controls) {
            b.controls = 1
        }
        if (Ext.isArray(e.src)) {
            b.src = e.src
        } else {
            b.src = [{src: e.src}]
        }
        e.callParent()
    },
    afterRender: function () {
        var a = this;
        a.callParent();
        a.video = a.body.getById(a.id + "-video");
        el = a.video.dom;
        a.supported = (el && el.tagName.toLowerCase() == "video");
        if (a.supported) {
            a.video.on("error", a.onVideoError, a)
        }
    },
    getFallback: function () {
        return '<h1 style="background-color:#ff4f4f;padding: 10px;">' + this.fallbackHTML + "</h1>"
    },
    onVideoError: function () {
        var a = this;
        a.video.remove();
        a.supported = false;
        a.body.createChild(a.getFallback())
    },
    onDestroy: function () {
        var c = this;
        var b = c.video;
        if (c.supported && b) {
            var a = b.dom;
            if (a && a.pause) {
                a.pause()
            }
            b.remove();
            c.video = null
        }
        c.callParent()
    }
});
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.define("Ext.ux.desktop.Wallpaper", {
    extend: "Ext.Component",
    alias: "widget.wallpaper",
    cls: "ux-wallpaper",
    html: '<img src="' + Ext.BLANK_IMAGE_URL + '">',
    stretch: false,
    wallpaper: null,
    stateful: true,
    stateId: "desk-wallpaper",
    afterRender: function () {
        var a = this;
        a.callParent();
        a.setWallpaper(a.wallpaper, a.stretch)
    },
    applyState: function () {
        var b = this, a = b.wallpaper;
        b.callParent(arguments);
        if (a != b.wallpaper) {
            b.setWallpaper(b.wallpaper)
        }
    },
    getState: function () {
        return this.wallpaper && {wallpaper: this.wallpaper}
    },
    setWallpaper: function (b, a) {
        var c = this, e, d;
        c.stretch = (a !== false);
        c.wallpaper = b;
        if (c.rendered) {
            e = c.el.dom.firstChild;
            if (!b || b == Ext.BLANK_IMAGE_URL) {
                Ext.fly(e).hide()
            } else {
                if (c.stretch) {
                    e.src = b;
                    c.el.removeCls("ux-wallpaper-tiled");
                    Ext.fly(e).setStyle({width: "100%", height: "100%"}).show()
                } else {
                    Ext.fly(e).hide();
                    d = "url(" + b + ")";
                    c.el.addCls("ux-wallpaper-tiled")
                }
            }
            c.el.setStyle({backgroundImage: d || ""});
            if (c.stateful) {
                c.saveState()
            }
        }
        return c
    }
});
Ext.define("Ext.ux.event.Driver", {
    extend: "Ext.util.Observable",
    active: null,
    specialKeysByName: {PGUP: 33, PGDN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40},
    specialKeysByCode: {},
    getTextSelection: function (d) {
        var e = d.ownerDocument, c, a, f, b;
        if (typeof d.selectionStart === "number") {
            f = d.selectionStart;
            b = d.selectionEnd
        } else {
            if (e.selection) {
                c = e.selection.createRange();
                a = d.createTextRange();
                a.setEndPoint("EndToStart", c);
                f = a.text.length;
                b = f + c.text.length
            }
        }
        return [f, b]
    },
    getTime: function () {
        return new Date().getTime()
    },
    getTimestamp: function () {
        var a = this.getTime();
        return a - this.startTime
    },
    onStart: function () {
    },
    onStop: function () {
    },
    start: function () {
        var a = this;
        if (!a.active) {
            a.active = new Date();
            a.startTime = a.getTime();
            a.onStart();
            a.fireEvent("start", a)
        }
    },
    stop: function () {
        var a = this;
        if (a.active) {
            a.active = null;
            a.onStop();
            a.fireEvent("stop", a)
        }
    }
}, function () {
    var a = this.prototype;
    Ext.Object.each(a.specialKeysByName, function (b, c) {
        a.specialKeysByCode[c] = b
    })
});
Ext.define("Ext.ux.event.Maker", {
    eventQueue: [],
    startAfter: 500,
    timerIncrement: 500,
    currentTiming: 0,
    constructor: function (a) {
        var b = this;
        b.currentTiming = b.startAfter;
        if (!Ext.isArray(a)) {
            a = [a]
        }
        Ext.Array.each(a, function (c) {
            c.el = c.el || "el";
            Ext.Array.each(Ext.ComponentQuery.query(c.cmpQuery), function (g) {
                var f = {}, d, h, e;
                if (!c.domQuery) {
                    e = g[c.el]
                } else {
                    e = g.el.down(c.domQuery)
                }
                f.target = "#" + e.dom.id;
                f.type = c.type;
                f.button = a.button || 0;
                d = e.getX() + (e.getWidth() / 2);
                h = e.getY() + (e.getHeight() / 2);
                f.xy = [d, h];
                f.ts = b.currentTiming;
                b.currentTiming += b.timerIncrement;
                b.eventQueue.push(f)
            });
            if (c.screenshot) {
                b.eventQueue[b.eventQueue.length - 1].screenshot = true
            }
        });
        return b.eventQueue
    }
});
Ext.define("Ext.ux.event.Player", function (d) {
    var h = {}, c = {}, a = {}, g, b = {}, f = {
        resize: 1,
        reset: 1,
        submit: 1,
        change: 1,
        select: 1,
        error: 1,
        abort: 1
    };
    Ext.each(["click", "dblclick", "mouseover", "mouseout", "mousedown", "mouseup", "mousemove"], function (i) {
        f[i] = h[i] = c[i] = {
            bubbles: true,
            cancelable: (i != "mousemove"),
            detail: 1,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0
        }
    });
    Ext.each(["keydown", "keyup", "keypress"], function (i) {
        f[i] = h[i] = a[i] = {
            bubbles: true,
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: 0,
            charCode: 0
        }
    });
    Ext.each(["blur", "change", "focus", "resize", "scroll", "select"], function (i) {
        h[i] = b[i] = {bubbles: (i in f), cancelable: false, detail: 1}
    });
    var e = {
        8: function (j, k, i) {
            if (k < i) {
                j.value = j.value.substring(0, k) + j.value.substring(i)
            } else {
                if (k > 0) {
                    j.value = j.value.substring(0, --k) + j.value.substring(i)
                }
            }
            this.setTextSelection(j, k, k)
        }, 46: function (j, k, i) {
            if (k < i) {
                j.value = j.value.substring(0, k) + j.value.substring(i)
            } else {
                if (k < j.value.length - 1) {
                    j.value = j.value.substring(0, k) + j.value.substring(k + 1)
                }
            }
            this.setTextSelection(j, k, k)
        }
    };
    return {
        extend: "Ext.ux.event.Driver",
        keyFrameEvents: {click: true},
        pauseForAnimations: true,
        speed: 1,
        stallTime: 0,
        _inputSpecialKeys: {INPUT: e, TEXTAREA: Ext.apply({}, e)},
        tagPathRegEx: /(\w+)(?:\[(\d+)\])?/,
        constructor: function (i) {
            var j = this;
            j.callParent(arguments);
            j.timerFn = function () {
                j.onTick()
            };
            j.attachTo = j.attachTo || window;
            g = j.attachTo.document
        },
        getElementFromXPath: function (s) {
            var t = this, p = s.split("/"), u = t.tagPathRegEx, q, l, o, r, v, k, j = t.attachTo.document;
            j = (p[0] == "~") ? j.body : j.getElementById(p[0].substring(1));
            for (q = 1, l = p.length; j && q < l; ++q) {
                o = u.exec(p[q]);
                r = o[2] ? parseInt(o[2], 10) : 1;
                v = o[1].toUpperCase();
                for (k = j.firstChild; k; k = k.nextSibling) {
                    if (k.tagName == v) {
                        if (r == 1) {
                            break
                        }
                        --r
                    }
                }
                j = k
            }
            return j
        },
        offsetToRangeCharacterMove: function (i, j) {
            return j - (i.value.slice(0, j).split("\r\n").length - 1)
        },
        setTextSelection: function (m, i, l) {
            if (i < 0) {
                i += m.value.length
            }
            if (l == null) {
                l = i
            }
            if (l < 0) {
                l += m.value.length
            }
            if (typeof m.selectionStart === "number") {
                m.selectionStart = i;
                m.selectionEnd = l
            } else {
                var k = m.createTextRange();
                var j = this.offsetToRangeCharacterMove(m, i);
                k.collapse(true);
                if (i == l) {
                    k.move("character", j)
                } else {
                    k.moveEnd("character", this.offsetToRangeCharacterMove(m, l));
                    k.moveStart("character", j)
                }
                k.select()
            }
        },
        getTimeIndex: function () {
            var i = this.getTimestamp() - this.stallTime;
            return i * this.speed
        },
        makeToken: function (i, l) {
            var j = this, k;
            i[l] = true;
            i.defer = function () {
                i[l] = false;
                k = j.getTime()
            };
            i.finish = function () {
                i[l] = true;
                j.stallTime += j.getTime() - k;
                j.schedule()
            }
        },
        nextEvent: function (j) {
            var k = this, i = ++k.queueIndex;
            if (k.keyFrameEvents[j.type]) {
                Ext.Array.insert(k.eventQueue, i, [{keyframe: true, ts: j.ts}])
            }
        },
        peekEvent: function () {
            return this.eventQueue[this.queueIndex] || null
        },
        replaceEvent: function (j, m) {
            for (var l, k = 0, o = m.length; k < o; ++k) {
                if (k) {
                    l = m[k - 1];
                    delete l.afterplay;
                    delete l.screenshot;
                    delete m[k].beforeplay
                }
            }
            Ext.Array.replace(this.eventQueue, (j == null) ? this.queueIndex : j, 1, m)
        },
        processEvents: function () {
            var j = this, k = j.pauseForAnimations && j.attachTo.Ext.fx.Manager.items, i;
            while ((i = j.peekEvent()) !== null) {
                if (k && k.getCount()) {
                    return true
                }
                if (i.keyframe) {
                    if (!j.processKeyFrame(i)) {
                        return false
                    }
                    j.nextEvent(i)
                } else {
                    if (i.ts <= j.getTimeIndex() && j.fireEvent("beforeplay", j, i) !== false && j.playEvent(i)) {
                        j.nextEvent(i)
                    } else {
                        return true
                    }
                }
            }
            j.stop();
            return false
        },
        processKeyFrame: function (i) {
            var j = this;
            if (!i.defer) {
                j.makeToken(i, "done");
                j.fireEvent("keyframe", j, i)
            }
            return i.done
        },
        injectEvent: function (n, m) {
            var l = this, k = m.type, i = Ext.apply({}, m, h[k]), j;
            if (k === "type") {
                j = l._inputSpecialKeys[n.tagName];
                if (j) {
                    return l.injectTypeInputEvent(n, m, j)
                }
                return l.injectTypeEvent(n, m)
            }
            if (k === "focus" && n.focus) {
                n.focus();
                return true
            }
            if (k === "blur" && n.blur) {
                n.blur();
                return true
            }
            if (k === "scroll") {
                n.scrollLeft = m.pos[0];
                n.scrollTop = m.pos[1];
                return true
            }
            if (k === "mduclick") {
                return l.injectEvent(n, Ext.applyIf({type: "mousedown"}, m)) && l.injectEvent(n, Ext.applyIf({type: "mouseup"}, m)) && l.injectEvent(n, Ext.applyIf({type: "click"}, m))
            }
            if (c[k]) {
                return d.injectMouseEvent(n, i, l.attachTo)
            }
            if (a[k]) {
                return d.injectKeyEvent(n, i, l.attachTo)
            }
            if (b[k]) {
                return d.injectUIEvent(n, k, i.bubbles, i.cancelable, i.view || l.attachTo, i.detail)
            }
            return false
        },
        injectTypeEvent: function (r, k) {
            var t = this, v = k.text, p = [], j, o, q, m, l, u, s;
            if (v) {
                delete k.text;
                u = v.toUpperCase();
                for (q = 0, m = v.length; q < m; ++q) {
                    j = v.charCodeAt(q);
                    o = u.charCodeAt(q);
                    p.push(Ext.applyIf({type: "keydown", charCode: o, keyCode: o}, k), Ext.applyIf({
                        type: "keypress",
                        charCode: j,
                        keyCode: j
                    }, k), Ext.applyIf({type: "keyup", charCode: o, keyCode: o}, k))
                }
            } else {
                p.push(Ext.applyIf({type: "keydown", charCode: k.keyCode}, k), Ext.applyIf({
                    type: "keyup",
                    charCode: k.keyCode
                }, k))
            }
            for (q = 0, m = p.length; q < m; ++q) {
                t.injectEvent(r, p[q])
            }
            return true
        },
        injectTypeInputEvent: function (m, k, i) {
            var j = this, o = k.text, l, p;
            if (i) {
                l = j.getTextSelection(m);
                if (o) {
                    p = l[0];
                    m.value = m.value.substring(0, p) + o + m.value.substring(l[1]);
                    p += o.length;
                    j.setTextSelection(m, p, p)
                } else {
                    if (!(i = i[k.keyCode])) {
                        if ("caret" in k) {
                            j.setTextSelection(m, k.caret, k.caret)
                        } else {
                            if (k.selection) {
                                j.setTextSelection(m, k.selection[0], k.selection[1])
                            }
                        }
                        return j.injectTypeEvent(m, k)
                    }
                    i.call(this, m, l[0], l[1]);
                    return true
                }
            }
            return true
        },
        playEvent: function (i) {
            var k = this, l = k.getElementFromXPath(i.target), j;
            if (!l) {
                return false
            }
            if (!k.playEventHook(i, "beforeplay")) {
                return false
            }
            if (!i.injected) {
                i.injected = true;
                j = k.translateEvent(i, l);
                k.injectEvent(l, j)
            }
            return k.playEventHook(i, "afterplay")
        },
        playEventHook: function (k, j) {
            var l = this, i = j + ".done", n = j + ".fired", m = k[j];
            if (m && !k[i]) {
                if (!k[n]) {
                    k[n] = true;
                    l.makeToken(k, i);
                    if (l.eventScope && Ext.isString(m)) {
                        m = l.eventScope[m]
                    }
                    if (m) {
                        m.call(l.eventScope || l, k)
                    }
                }
                return false
            }
            return true
        },
        schedule: function () {
            var i = this;
            if (!i.timer) {
                i.timer = setTimeout(i.timerFn, 10)
            }
        },
        _translateAcross: ["type", "button", "charCode", "keyCode", "caret", "pos", "text", "selection"],
        translateEvent: function (q, m) {
            var o = this, j = {}, p = q.modKeys || "", n = o._translateAcross, l = n.length, k, r;
            while (l--) {
                k = n[l];
                if (k in q) {
                    j[k] = q[k]
                }
            }
            j.altKey = p.indexOf("A") > 0;
            j.ctrlKey = p.indexOf("C") > 0;
            j.metaKey = p.indexOf("M") > 0;
            j.shiftKey = p.indexOf("S") > 0;
            if (m && "x" in q) {
                r = Ext.fly(m).getXY();
                r[0] += q.x;
                r[1] += q.y
            } else {
                if ("x" in q) {
                    r = [q.x, q.y]
                } else {
                    if ("px" in q) {
                        r = [q.px, q.py]
                    }
                }
            }
            if (r) {
                j.clientX = j.screenX = r[0];
                j.clientY = j.screenY = r[1]
            }
            if (q.key) {
                j.keyCode = o.specialKeysByName[q.key]
            }
            if (q.type === "wheel") {
                if ("onwheel" in o.attachTo.document) {
                    j.wheelX = q.dx;
                    j.wheelY = q.dy
                } else {
                    j.type = "mousewheel";
                    j.wheelDeltaX = -40 * q.dx;
                    j.wheelDeltaY = j.wheelDelta = -40 * q.dy
                }
            }
            return j
        },
        onStart: function () {
            var i = this;
            i.queueIndex = 0;
            i.schedule()
        },
        onStop: function () {
            var i = this;
            if (i.timer) {
                clearTimeout(i.timer);
                i.timer = null
            }
        },
        onTick: function () {
            var i = this;
            i.timer = null;
            if (i.processEvents()) {
                i.schedule()
            }
        },
        statics: {
            ieButtonCodeMap: {0: 1, 1: 4, 2: 2}, injectKeyEvent: function (n, j, i) {
                var m = j.type, l = null;
                if (m === "textevent") {
                    m = "keypress"
                }
                i = i || window;
                if (g.createEvent) {
                    try {
                        l = g.createEvent("KeyEvents");
                        l.initKeyEvent(m, j.bubbles, j.cancelable, i, j.ctrlKey, j.altKey, j.shiftKey, j.metaKey, j.keyCode, j.charCode)
                    } catch (k) {
                        try {
                            l = g.createEvent("Events")
                        } catch (o) {
                            l = g.createEvent("UIEvents")
                        } finally {
                            l.initEvent(m, j.bubbles, j.cancelable);
                            l.view = i;
                            l.altKey = j.altKey;
                            l.ctrlKey = j.ctrlKey;
                            l.shiftKey = j.shiftKey;
                            l.metaKey = j.metaKey;
                            l.keyCode = j.keyCode;
                            l.charCode = j.charCode
                        }
                    }
                    n.dispatchEvent(l)
                } else {
                    if (g.createEventObject) {
                        l = g.createEventObject();
                        l.bubbles = j.bubbles;
                        l.cancelable = j.cancelable;
                        l.view = i;
                        l.ctrlKey = j.ctrlKey;
                        l.altKey = j.altKey;
                        l.shiftKey = j.shiftKey;
                        l.metaKey = j.metaKey;
                        l.keyCode = (j.charCode > 0) ? j.charCode : j.keyCode;
                        n.fireEvent("on" + m, l)
                    } else {
                        return false
                    }
                }
                return true
            }, injectMouseEvent: function (m, j, i) {
                var l = j.type, k = null;
                i = i || window;
                if (g.createEvent) {
                    k = g.createEvent("MouseEvents");
                    if (k.initMouseEvent) {
                        k.initMouseEvent(l, j.bubbles, j.cancelable, i, j.detail, j.screenX, j.screenY, j.clientX, j.clientY, j.ctrlKey, j.altKey, j.shiftKey, j.metaKey, j.button, j.relatedTarget)
                    } else {
                        k = g.createEvent("UIEvents");
                        k.initEvent(l, j.bubbles, j.cancelable);
                        k.view = i;
                        k.detail = j.detail;
                        k.screenX = j.screenX;
                        k.screenY = j.screenY;
                        k.clientX = j.clientX;
                        k.clientY = j.clientY;
                        k.ctrlKey = j.ctrlKey;
                        k.altKey = j.altKey;
                        k.metaKey = j.metaKey;
                        k.shiftKey = j.shiftKey;
                        k.button = j.button;
                        k.relatedTarget = j.relatedTarget
                    }
                    if (j.relatedTarget && !k.relatedTarget) {
                        if (l == "mouseout") {
                            k.toElement = j.relatedTarget
                        } else {
                            if (l == "mouseover") {
                                k.fromElement = j.relatedTarget
                            }
                        }
                    }
                    m.dispatchEvent(k)
                } else {
                    if (g.createEventObject) {
                        k = g.createEventObject();
                        k.bubbles = j.bubbles;
                        k.cancelable = j.cancelable;
                        k.view = i;
                        k.detail = j.detail;
                        k.screenX = j.screenX;
                        k.screenY = j.screenY;
                        k.clientX = j.clientX;
                        k.clientY = j.clientY;
                        k.ctrlKey = j.ctrlKey;
                        k.altKey = j.altKey;
                        k.metaKey = j.metaKey;
                        k.shiftKey = j.shiftKey;
                        k.button = d.ieButtonCodeMap[j.button] || 0;
                        k.relatedTarget = j.relatedTarget;
                        m.fireEvent("on" + l, k)
                    } else {
                        return false
                    }
                }
                return true
            }, injectUIEvent: function (l, j, i) {
                var k = null;
                i = i || window;
                if (g.createEvent) {
                    k = g.createEvent("UIEvents");
                    k.initUIEvent(j.type, j.bubbles, j.cancelable, i, j.detail);
                    l.dispatchEvent(k)
                } else {
                    if (g.createEventObject) {
                        k = g.createEventObject();
                        k.bubbles = j.bubbles;
                        k.cancelable = j.cancelable;
                        k.view = i;
                        k.detail = j.detail;
                        l.fireEvent("on" + j.type, k)
                    } else {
                        return false
                    }
                }
                return true
            }
        }
    }
});
Ext.define("Ext.ux.event.Recorder", function (c) {
    function a() {
        var f = arguments, j = f.length, h = {kind: "other"}, g;
        for (g = 0; g < j; ++g) {
            Ext.apply(h, arguments[g])
        }
        if (h.alt && !h.event) {
            h.event = h.alt
        }
        return h
    }

    function d(f) {
        return a({kind: "keyboard", modKeys: true, key: true}, f)
    }

    function b(f) {
        return a({kind: "mouse", button: true, modKeys: true, xy: true}, f)
    }

    var e = {
        keydown: d(),
        keypress: d(),
        keyup: d(),
        dragmove: b({alt: "mousemove", pageCoords: true, whileDrag: true}),
        mousemove: b({pageCoords: true}),
        mouseover: b(),
        mouseout: b(),
        click: b(),
        wheel: b({wheel: true}),
        mousedown: b({press: true}),
        mouseup: b({release: true}),
        scroll: a({listen: false}),
        focus: a(),
        blur: a()
    };
    for (var d in e) {
        if (!e[d].event) {
            e[d].event = d
        }
    }
    e.wheel.event = null;
    return {
        extend: "Ext.ux.event.Driver",
        eventsToRecord: e,
        ignoreIdRegEx: /ext-gen(?:\d+)/,
        inputRe: /^(input|textarea)$/i,
        constructor: function (f) {
            var h = this, g = f && f.eventsToRecord;
            if (g) {
                h.eventsToRecord = Ext.apply(Ext.apply({}, h.eventsToRecord), g);
                delete f.eventsToRecord
            }
            h.callParent(arguments);
            h.clear();
            h.modKeys = [];
            h.attachTo = h.attachTo || window
        },
        clear: function () {
            this.eventsRecorded = []
        },
        listenToEvent: function (j) {
            var i = this, h = i.attachTo.document.body, g = function () {
                return i.onEvent.apply(i, arguments)
            }, f = {};
            if (h.attachEvent && h.ownerDocument.documentMode < 10) {
                j = "on" + j;
                h.attachEvent(j, g);
                f.destroy = function () {
                    if (g) {
                        h.detachEvent(j, g);
                        g = null
                    }
                }
            } else {
                h.addEventListener(j, g, true);
                f.destroy = function () {
                    if (g) {
                        h.removeEventListener(j, g, true);
                        g = null
                    }
                }
            }
            return f
        },
        coalesce: function (m, k) {
            var j = this, g = j.eventsRecorded, i = g.length, f = i && g[i - 1], l = (i > 1) && g[i - 2], h = (i > 2) && g[i - 3];
            if (!f) {
                return false
            }
            if (m.type === "mousemove") {
                if (f.type === "mousemove" && m.ts - f.ts < 200) {
                    m.ts = f.ts;
                    g[i - 1] = m;
                    return true
                }
            } else {
                if (m.type === "click") {
                    if (l && f.type === "mouseup" && l.type === "mousedown") {
                        if (m.button == f.button && m.button == l.button && m.target == f.target && m.target == l.target && j.samePt(m, f) && j.samePt(m, l)) {
                            g.pop();
                            l.type = "mduclick";
                            return true
                        }
                    }
                } else {
                    if (m.type === "keyup") {
                        if (l && f.type === "keypress" && l.type === "keydown") {
                            if (m.target === f.target && m.target === l.target) {
                                g.pop();
                                l.type = "type";
                                l.text = String.fromCharCode(f.charCode);
                                delete l.charCode;
                                delete l.keyCode;
                                if (h && h.type === "type") {
                                    if (h.text && h.target === l.target) {
                                        h.text += l.text;
                                        g.pop()
                                    }
                                }
                                return true
                            }
                        } else {
                            if (j.completeKeyStroke(f, m)) {
                                f.type = "type";
                                j.completeSpecialKeyStroke(k.target, f, m);
                                return true
                            } else {
                                if (f.type === "scroll" && j.completeKeyStroke(l, m)) {
                                    l.type = "type";
                                    j.completeSpecialKeyStroke(k.target, l, m);
                                    g.pop();
                                    g.pop();
                                    g.push(f, l);
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return false
        },
        completeKeyStroke: function (g, f) {
            if (g && g.type === "keydown" && g.keyCode === f.keyCode) {
                delete g.charCode;
                return true
            }
            return false
        },
        completeSpecialKeyStroke: function (h, i, f) {
            var g = this.specialKeysByCode[f.keyCode];
            if (g && this.inputRe.test(h.tagName)) {
                delete i.keyCode;
                i.key = g;
                i.selection = this.getTextSelection(h);
                if (i.selection[0] === i.selection[1]) {
                    i.caret = i.selection[0];
                    delete i.selection
                }
                return true
            }
            return false
        },
        getElementXPath: function (j) {
            var m = this, l = false, g = [], k, i, h, f;
            for (h = j; h; h = h.parentNode) {
                if (h == m.attachTo.document.body) {
                    g.unshift("~");
                    l = true;
                    break
                }
                if (h.id && !m.ignoreIdRegEx.test(h.id)) {
                    g.unshift("#" + h.id);
                    l = true;
                    break
                }
                for (k = 1, i = h; !!(i = i.previousSibling);) {
                    if (i.tagName == h.tagName) {
                        ++k
                    }
                }
                f = h.tagName.toLowerCase();
                if (k < 2) {
                    g.unshift(f)
                } else {
                    g.unshift(f + "[" + k + "]")
                }
            }
            return l ? g.join("/") : null
        },
        getRecordedEvents: function () {
            return this.eventsRecorded
        },
        onEvent: function (k) {
            var j = this, h = Ext.EventObject.setEvent(k), f = j.eventsToRecord[h.type], l, m, i, g = {
                type: h.type,
                ts: j.getTimestamp(),
                target: j.getElementXPath(h.target)
            }, n;
            if (!f || !g.target) {
                return
            }
            l = h.target.ownerDocument;
            l = l.defaultView || l.parentWindow;
            if (l !== j.attachTo) {
                return
            }
            if (j.eventsToRecord.scroll) {
                j.syncScroll(h.target)
            }
            if (f.xy) {
                n = h.getXY();
                if (f.pageCoords || !g.target) {
                    g.px = n[0];
                    g.py = n[1]
                } else {
                    i = Ext.fly(h.getTarget()).getXY();
                    n[0] -= i[0];
                    n[1] -= i[1];
                    g.x = n[0];
                    g.y = n[1]
                }
            }
            if (f.button) {
                if ("buttons" in k) {
                    g.button = k.buttons
                } else {
                    if (k.which == null) {
                        g.button = (k.button < 2) ? 1 : ((k.button == 4) ? 4 : 2)
                    } else {
                        if (k.which) {
                            g.button = (k.which < 2) ? 1 : ((k.which == 2) ? 4 : 2)
                        } else {
                            g.button = 0
                        }
                    }
                }
                if (!g.button && f.whileDrag) {
                    return
                }
            }
            if (f.wheel) {
                g.type = "wheel";
                if (f.event === "wheel") {
                    g.dx = k.deltaX;
                    g.dy = k.deltaY
                } else {
                    if (typeof k.wheelDeltaX === "number") {
                        g.dx = -1 / 40 * k.wheelDeltaX;
                        g.dy = -1 / 40 * k.wheelDeltaY
                    } else {
                        if (k.wheelDelta) {
                            g.dy = -1 / 40 * k.wheelDelta
                        } else {
                            if (k.detail) {
                                g.dy = k.detail
                            }
                        }
                    }
                }
            }
            if (f.modKeys) {
                j.modKeys[0] = h.altKey ? "A" : "";
                j.modKeys[1] = h.ctrlKey ? "C" : "";
                j.modKeys[2] = h.metaKey ? "M" : "";
                j.modKeys[3] = h.shiftKey ? "S" : "";
                m = j.modKeys.join("");
                if (m) {
                    g.modKeys = m
                }
            }
            if (f.key) {
                g.charCode = h.getCharCode();
                g.keyCode = h.getKey()
            }
            if (j.coalesce(g, h)) {
                j.fireEvent("coalesce", j, g)
            } else {
                j.eventsRecorded.push(g);
                j.fireEvent("add", j, g)
            }
        },
        onStart: function () {
            var h = this, i = h.attachTo.Ext.dd.DragDropManager, f = h.attachTo.Ext.EventObjectImpl.prototype, g = [];
            c.prototype.eventsToRecord.wheel.event = ("onwheel" in h.attachTo.document) ? "wheel" : "mousewheel";
            h.listeners = [];
            Ext.Object.each(h.eventsToRecord, function (j, k) {
                if (k && k.listen !== false) {
                    if (!k.event) {
                        k.event = j
                    }
                    if (k.alt && k.alt !== j) {
                        if (!h.eventsToRecord[k.alt]) {
                            g.push(k)
                        }
                    } else {
                        h.listeners.push(h.listenToEvent(k.event))
                    }
                }
            });
            Ext.each(g, function (j) {
                h.eventsToRecord[j.alt] = j;
                h.listeners.push(h.listenToEvent(j.alt))
            });
            h.ddmStopEvent = i.stopEvent;
            i.stopEvent = Ext.Function.createSequence(i.stopEvent, function (j) {
                h.onEvent(j)
            });
            h.evStopEvent = f.stopEvent;
            f.stopEvent = Ext.Function.createSequence(f.stopEvent, function () {
                h.onEvent(this)
            })
        },
        onStop: function () {
            var f = this;
            Ext.destroy(f.listeners);
            f.listeners = null;
            f.attachTo.Ext.dd.DragDropManager.stopEvent = f.ddmStopEvent;
            f.attachTo.Ext.EventObjectImpl.prototype.stopEvent = f.evStopEvent
        },
        samePt: function (g, f) {
            return g.x == f.x && g.y == f.y
        },
        syncScroll: function (h) {
            var k = this, j = k.getTimestamp(), o, n, m, l, g, i;
            for (var f = h; f; f = f.parentNode) {
                o = f.$lastScrollLeft;
                n = f.$lastScrollTop;
                m = f.scrollLeft;
                l = f.scrollTop;
                g = false;
                if (o !== m) {
                    if (m) {
                        g = true
                    }
                    f.$lastScrollLeft = m
                }
                if (n !== l) {
                    if (l) {
                        g = true
                    }
                    f.$lastScrollTop = l
                }
                if (g) {
                    k.eventsRecorded.push(i = {type: "scroll", target: k.getElementXPath(f), ts: j, pos: [m, l]});
                    k.fireEvent("add", k, i)
                }
                if (f.tagName === "BODY") {
                    break
                }
            }
        }
    }
});
Ext.define("Ext.ux.event.RecorderManager", {
    extend: "Ext.panel.Panel",
    alias: "widget.eventrecordermanager",
    uses: ["Ext.ux.event.Recorder", "Ext.ux.event.Player"],
    layout: "fit",
    buttonAlign: "left",
    eventsToIgnore: {mousemove: 1, mouseover: 1, mouseout: 1},
    bodyBorder: false,
    playSpeed: 1,
    initComponent: function () {
        var b = this;
        b.recorder = new Ext.ux.event.Recorder({
            attachTo: b.attachTo,
            listeners: {add: b.updateEvents, coalesce: b.updateEvents, buffer: 200, scope: b}
        });
        b.recorder.eventsToRecord = Ext.apply({}, b.recorder.eventsToRecord);
        function c(e, d) {
            return {text: e, speed: d, group: "speed", checked: d == b.playSpeed, handler: b.onPlaySpeed, scope: b}
        }

        b.tbar = [{
            text: "Record",
            xtype: "splitbutton",
            whenIdle: true,
            handler: b.onRecord,
            scope: b,
            menu: b.makeRecordButtonMenu()
        }, {
            text: "Play",
            xtype: "splitbutton",
            whenIdle: true,
            handler: b.onPlay,
            scope: b,
            menu: [c("Recorded Speed (1x)", 1), c("Double Speed (2x)", 2), c("Quad Speed (4x)", 4), "-", c("Full Speed", 1000)]
        }, {text: "Clear", whenIdle: true, handler: b.onClear, scope: b}, "->", {
            text: "Stop",
            whenActive: true,
            disabled: true,
            handler: b.onStop,
            scope: b
        }];
        var a = b.attachTo && b.attachTo.testEvents;
        b.items = [{
            xtype: "textarea",
            itemId: "eventView",
            fieldStyle: "font-family: monospace",
            selectOnFocus: true,
            emptyText: "Events go here!",
            value: a ? b.stringifyEvents(a) : "",
            scrollToBottom: function () {
                var d = this.inputEl.dom;
                d.scrollTop = d.scrollHeight
            }
        }];
        b.fbar = [{xtype: "tbtext", text: "Attached To: " + (b.attachTo && b.attachTo.location.href)}];
        b.callParent()
    },
    makeRecordButtonMenu: function () {
        var b = [], c = {}, e = this.recorder.eventsToRecord, d = this.eventsToIgnore;
        Ext.Object.each(e, function (f, h) {
            var g = c[h.kind];
            if (!g) {
                c[h.kind] = g = [];
                b.push({text: h.kind, menu: g})
            }
            g.push({
                text: f, checked: true, handler: function (i) {
                    if (i.checked) {
                        e[f] = h
                    } else {
                        delete e[f]
                    }
                }
            });
            if (d[f]) {
                g[g.length - 1].checked = false;
                Ext.Function.defer(function () {
                    delete e[f]
                }, 1)
            }
        });
        function a(f, g) {
            return (f.text < g.text) ? -1 : ((g.text < f.text) ? 1 : 0)
        }

        b.sort(a);
        Ext.Array.each(b, function (f) {
            f.menu.sort(a)
        });
        return b
    },
    getEventView: function () {
        return this.down("#eventView")
    },
    onClear: function () {
        var a = this.getEventView();
        a.setValue("")
    },
    onPlay: function () {
        var c = this, a = c.getEventView(), b = a.getValue();
        if (b) {
            b = Ext.decode(b);
            if (b.length) {
                c.player = Ext.create("Ext.ux.event.Player", {
                    attachTo: window.opener,
                    eventQueue: b,
                    listeners: {stop: c.onPlayStop, scope: c}
                });
                c.player.start();
                c.syncBtnUI()
            }
        }
    },
    onPlayStop: function () {
        this.player = null;
        this.syncBtnUI()
    },
    onPlaySpeed: function (a) {
        this.playSpeed = a.speed
    },
    onRecord: function () {
        this.recorder.start();
        this.syncBtnUI()
    },
    onStop: function () {
        var a = this;
        if (a.player) {
            a.player.stop();
            a.player = null
        } else {
            a.recorder.stop()
        }
        a.syncBtnUI();
        a.updateEvents()
    },
    syncBtnUI: function () {
        var c = this, b = !c.player && !c.recorder.active;
        Ext.each(c.query("[whenIdle]"), function (d) {
            d.setDisabled(!b)
        });
        Ext.each(c.query("[whenActive]"), function (d) {
            d.setDisabled(b)
        });
        var a = c.getEventView();
        a.setReadOnly(!b)
    },
    stringifyEvents: function (c) {
        var b, a = [];
        Ext.each(c, function (d) {
            b = [];
            Ext.Object.each(d, function (e, f) {
                if (b.length) {
                    b.push(", ")
                } else {
                    b.push("  { ")
                }
                b.push(e, ": ");
                b.push(Ext.encode(f))
            });
            b.push(" }");
            a.push(b.join(""))
        });
        return "[\n" + a.join(",\n") + "\n]"
    },
    updateEvents: function () {
        var b = this, c = b.stringifyEvents(b.recorder.getRecordedEvents()), a = b.getEventView();
        a.setValue(c);
        a.scrollToBottom()
    }
});
Ext.define("Ext.ux.form.MultiSelect", {
    extend: "Ext.form.FieldContainer",
    mixins: ["Ext.util.StoreHolder", "Ext.form.field.Field"],
    alternateClassName: "Ext.ux.Multiselect",
    alias: ["widget.multiselectfield", "widget.multiselect"],
    requires: ["Ext.panel.Panel", "Ext.view.BoundList", "Ext.layout.container.Fit"],
    uses: ["Ext.view.DragZone", "Ext.view.DropZone"],
    layout: "anchor",
    ddReorder: false,
    appendOnly: false,
    displayField: "text",
    allowBlank: true,
    minSelections: 0,
    maxSelections: Number.MAX_VALUE,
    blankText: "This field is required",
    minSelectionsText: "Minimum {0} item(s) required",
    maxSelectionsText: "Maximum {0} item(s) required",
    delimiter: ",",
    dragText: "{0} Item{1}",
    ignoreSelectChange: 0,
    initComponent: function () {
        var a = this;
        a.items = a.setupItems();
        a.bindStore(a.store, true);
        if (a.store.autoCreated) {
            a.valueField = a.displayField = "field1";
            if (!a.store.expanded) {
                a.displayField = "field2"
            }
        }
        if (!Ext.isDefined(a.valueField)) {
            a.valueField = a.displayField
        }
        a.callParent();
        a.initField()
    },
    setupItems: function () {
        var a = this;
        a.boundList = Ext.create("Ext.view.BoundList", Ext.apply({
            anchor: "none 100%",
            border: 1,
            multiSelect: true,
            store: a.store,
            displayField: a.displayField,
            disabled: a.disabled
        }, a.listConfig));
        a.boundList.getSelectionModel().on("selectionchange", a.onSelectChange, a);
        a.boundList.pickerField = a;
        if (!a.title) {
            return a.boundList
        }
        a.boundList.border = false;
        return {border: true, anchor: "none 100%", layout: "anchor", title: a.title, tbar: a.tbar, items: a.boundList}
    },
    onSelectChange: function (a, b) {
        if (!this.ignoreSelectChange) {
            this.setValue(b)
        }
    },
    getSelected: function () {
        return this.boundList.getSelectionModel().getSelection()
    },
    isEqual: function (e, d) {
        var b = Ext.Array.from, c = 0, a;
        e = b(e);
        d = b(d);
        a = e.length;
        if (a !== d.length) {
            return false
        }
        for (; c < a; c++) {
            if (d[c] !== e[c]) {
                return false
            }
        }
        return true
    },
    afterRender: function () {
        var b = this, a;
        b.callParent();
        if (b.selectOnRender) {
            a = b.getRecordsForValue(b.value);
            if (a.length) {
                ++b.ignoreSelectChange;
                b.boundList.getSelectionModel().select(a);
                --b.ignoreSelectChange
            }
            delete b.toSelect
        }
        if (b.ddReorder && !b.dragGroup && !b.dropGroup) {
            b.dragGroup = b.dropGroup = "MultiselectDD-" + Ext.id()
        }
        if (b.draggable || b.dragGroup) {
            b.dragZone = Ext.create("Ext.view.DragZone", {
                view: b.boundList,
                ddGroup: b.dragGroup,
                dragText: b.dragText
            })
        }
        if (b.droppable || b.dropGroup) {
            b.dropZone = Ext.create("Ext.view.DropZone", {
                view: b.boundList,
                ddGroup: b.dropGroup,
                handleNodeDrop: function (i, h, c) {
                    var d = this.view, f = d.getStore(), e = i.records, g;
                    i.view.store.remove(e);
                    g = f.indexOf(h);
                    if (c === "after") {
                        g++
                    }
                    f.insert(g, e);
                    d.getSelectionModel().select(e);
                    b.fireEvent("drop", b, e)
                }
            })
        }
    },
    isValid: function () {
        var b = this, a = b.disabled, c = b.forceValidation || !a;
        return c ? b.validateValue(b.value) : a
    },
    validateValue: function (b) {
        var a = this, d = a.getErrors(b), c = Ext.isEmpty(d);
        if (!a.preventMark) {
            if (c) {
                a.clearInvalid()
            } else {
                a.markInvalid(d)
            }
        }
        return c
    },
    markInvalid: function (c) {
        var b = this, a = b.getActiveError();
        b.setActiveErrors(Ext.Array.from(c));
        if (a !== b.getActiveError()) {
            b.updateLayout()
        }
    },
    clearInvalid: function () {
        var b = this, a = b.hasActiveError();
        b.unsetActiveError();
        if (a) {
            b.updateLayout()
        }
    },
    getSubmitData: function () {
        var a = this, b = null, c;
        if (!a.disabled && a.submitValue && !a.isFileUpload()) {
            c = a.getSubmitValue();
            if (c !== null) {
                b = {};
                b[a.getName()] = c
            }
        }
        return b
    },
    getSubmitValue: function () {
        var b = this, a = b.delimiter, c = b.getValue();
        return Ext.isString(a) ? c.join(a) : c
    },
    getValue: function () {
        return this.value || []
    },
    getRecordsForValue: function (g) {
        var f = this, a = [], h = f.store.getRange(), l = f.valueField, d = 0, k = h.length, b, c, e;
        for (e = g.length; d < e; ++d) {
            for (c = 0; c < k; ++c) {
                b = h[c];
                if (b.get(l) == g[d]) {
                    a.push(b)
                }
            }
        }
        return a
    },
    setupValue: function (g) {
        var b = this.delimiter, d = this.valueField, e = 0, c, a, f;
        if (Ext.isDefined(g)) {
            if (b && Ext.isString(g)) {
                g = g.split(b)
            } else {
                if (!Ext.isArray(g)) {
                    g = [g]
                }
            }
            for (a = g.length; e < a; ++e) {
                f = g[e];
                if (f && f.isModel) {
                    g[e] = f.get(d)
                }
            }
            c = Ext.Array.unique(g)
        } else {
            c = []
        }
        return c
    },
    setValue: function (d) {
        var c = this, b = c.boundList.getSelectionModel(), a = c.store;
        if (!a.getCount()) {
            a.on({load: Ext.Function.bind(c.setValue, c, [d]), single: true});
            return
        }
        d = c.setupValue(d);
        c.mixins.field.setValue.call(c, d);
        if (c.rendered) {
            ++c.ignoreSelectChange;
            b.deselectAll();
            if (d.length) {
                b.select(c.getRecordsForValue(d))
            }
            --c.ignoreSelectChange
        } else {
            c.selectOnRender = true
        }
    },
    clearValue: function () {
        this.setValue([])
    },
    onEnable: function () {
        var a = this.boundList;
        this.callParent();
        if (a) {
            a.enable()
        }
    },
    onDisable: function () {
        var a = this.boundList;
        this.callParent();
        if (a) {
            a.disable()
        }
    },
    getErrors: function (b) {
        var a = this, c = Ext.String.format, e = [], d;
        b = Ext.Array.from(b || a.getValue());
        d = b.length;
        if (!a.allowBlank && d < 1) {
            e.push(a.blankText)
        }
        if (d < a.minSelections) {
            e.push(c(a.minSelectionsText, a.minSelections))
        }
        if (d > a.maxSelections) {
            e.push(c(a.maxSelectionsText, a.maxSelections))
        }
        return e
    },
    onDestroy: function () {
        var a = this;
        a.bindStore(null);
        Ext.destroy(a.dragZone, a.dropZone);
        a.callParent()
    },
    onBindStore: function (a) {
        var b = this.boundList;
        if (b) {
            b.bindStore(a)
        }
    }
});
Ext.define("Ext.aria.ux.form.MultiSelect", {
    override: "Ext.ux.form.MultiSelect",
    requires: ["Ext.view.BoundListKeyNav"],
    pageSize: 10,
    afterRender: function () {
        var b = this, a = b.boundList;
        b.callParent();
        if (a) {
            a.pageSize = b.pageSize;
            b.keyNav = new Ext.view.BoundListKeyNav(a.el, {
                boundList: a,
                up: Ext.emptyFn,
                down: Ext.emptyFn,
                pageUp: function () {
                    var j = this, g = j.boundList, e = g.getStore(), d = g.getSelectionModel(), c = g.pageSize, i, h, f;
                    i = d.getSelection()[0];
                    h = i ? e.indexOf(i) : -1;
                    f = h < 0 ? 0 : h - c;
                    d.select(f < 0 ? 0 : f)
                },
                pageDown: function () {
                    var f = this, k = f.boundList, g = k.pageSize, j = k.store, e = k.getSelectionModel(), i, c, d, h;
                    i = e.getSelection()[0];
                    h = j.getCount() - 1;
                    c = i ? j.indexOf(i) : -1;
                    d = c < 0 ? g : c + g;
                    e.select(d > h ? h : d)
                },
                home: function () {
                    this.boundList.getSelectionModel().select(0)
                },
                end: function () {
                    var c = this.boundList;
                    c.getSelectionModel().select(c.store.getCount() - 1)
                }
            })
        }
    },
    destroy: function () {
        var b = this, a = b.keyNav;
        if (a) {
            a.destroy()
        }
        b.callParent()
    }
});
Ext.define("Ext.ux.form.ItemSelector", {
    extend: "Ext.ux.form.MultiSelect",
    alias: ["widget.itemselectorfield", "widget.itemselector"],
    alternateClassName: ["Ext.ux.ItemSelector"],
    requires: ["Ext.button.Button", "Ext.ux.form.MultiSelect"],
    hideNavIcons: false,
    buttons: ["top", "up", "add", "remove", "down", "bottom"],
    buttonsText: {
        top: "Move to Top",
        up: "Move Up",
        add: "Add to Selected",
        remove: "Remove from Selected",
        down: "Move Down",
        bottom: "Move to Bottom"
    },
    layout: {type: "hbox", align: "stretch"},
    initComponent: function () {
        var a = this;
        a.ddGroup = a.id + "-dd";
        a.callParent();
        a.bindStore(a.store)
    },
    createList: function (b) {
        var a = this;
        return Ext.create("Ext.ux.form.MultiSelect", {
            submitValue: false,
            getSubmitData: function () {
                return null
            },
            getModelData: function () {
                return null
            },
            flex: 1,
            dragGroup: a.ddGroup,
            dropGroup: a.ddGroup,
            title: b,
            store: {model: a.store.model, data: []},
            displayField: a.displayField,
            valueField: a.valueField,
            disabled: a.disabled,
            listeners: {boundList: {scope: a, itemdblclick: a.onItemDblClick, drop: a.syncValue}}
        })
    },
    setupItems: function () {
        var a = this;
        a.fromField = a.createList(a.fromTitle);
        a.toField = a.createList(a.toTitle);
        return [a.fromField, {
            xtype: "container",
            margin: "0 4",
            layout: {type: "vbox", pack: "center"},
            items: a.createButtons()
        }, a.toField]
    },
    createButtons: function () {
        var b = this, a = [];
        if (!b.hideNavIcons) {
            Ext.Array.forEach(b.buttons, function (c) {
                a.push({
                    xtype: "button",
                    tooltip: b.buttonsText[c],
                    handler: b["on" + Ext.String.capitalize(c) + "BtnClick"],
                    cls: Ext.baseCSSPrefix + "form-itemselector-btn",
                    iconCls: Ext.baseCSSPrefix + "form-itemselector-" + c,
                    navBtn: true,
                    scope: b,
                    margin: "4 0 0 0"
                })
            })
        }
        return a
    },
    getSelections: function (b) {
        var a = b.getStore();
        return Ext.Array.sort(b.getSelectionModel().getSelection(), function (d, c) {
            d = a.indexOf(d);
            c = a.indexOf(c);
            if (d < c) {
                return -1
            } else {
                if (d > c) {
                    return 1
                }
            }
            return 0
        })
    },
    onTopBtnClick: function () {
        var c = this.toField.boundList, a = c.getStore(), b = this.getSelections(c);
        a.suspendEvents();
        a.remove(b, true);
        a.insert(0, b);
        a.resumeEvents();
        c.refresh();
        this.syncValue();
        c.getSelectionModel().select(b)
    },
    onBottomBtnClick: function () {
        var c = this.toField.boundList, a = c.getStore(), b = this.getSelections(c);
        a.suspendEvents();
        a.remove(b, true);
        a.add(b);
        a.resumeEvents();
        c.refresh();
        this.syncValue();
        c.getSelectionModel().select(b)
    },
    onUpBtnClick: function () {
        var f = this.toField.boundList, b = f.getStore(), e = this.getSelections(f), g, d = 0, a = e.length, c = 0;
        b.suspendEvents();
        for (; d < a; ++d, c++) {
            g = e[d];
            c = Math.max(c, b.indexOf(g) - 1);
            b.remove(g, true);
            b.insert(c, g)
        }
        b.resumeEvents();
        f.refresh();
        this.syncValue();
        f.getSelectionModel().select(e)
    },
    onDownBtnClick: function () {
        var e = this.toField.boundList, a = e.getStore(), d = this.getSelections(e), f, c = d.length - 1, b = a.getCount() - 1;
        a.suspendEvents();
        for (; c > -1; --c, b--) {
            f = d[c];
            b = Math.min(b, a.indexOf(f) + 1);
            a.remove(f, true);
            a.insert(b, f)
        }
        a.resumeEvents();
        e.refresh();
        this.syncValue();
        e.getSelectionModel().select(d)
    },
    onAddBtnClick: function () {
        var b = this, a = b.getSelections(b.fromField.boundList);
        b.moveRec(true, a);
        b.toField.boundList.getSelectionModel().select(a)
    },
    onRemoveBtnClick: function () {
        var b = this, a = b.getSelections(b.toField.boundList);
        b.moveRec(false, a);
        b.fromField.boundList.getSelectionModel().select(a)
    },
    moveRec: function (f, e) {
        var c = this, g = c.fromField, a = c.toField, b = f ? g.store : a.store, d = f ? a.store : g.store;
        b.suspendEvents();
        d.suspendEvents();
        b.remove(e);
        d.add(e);
        b.resumeEvents();
        d.resumeEvents();
        g.boundList.refresh();
        a.boundList.refresh();
        c.syncValue()
    },
    syncValue: function () {
        var a = this;
        a.mixins.field.setValue.call(a, a.setupValue(a.toField.store.getRange()))
    },
    onItemDblClick: function (a, b) {
        this.moveRec(a === this.fromField.boundList, b)
    },
    setValue: function (f) {
        var d = this, g = d.fromField, a = d.toField, b = g.store, e = a.store, c;
        if (!d.fromStorePopulated) {
            d.fromField.store.on({load: Ext.Function.bind(d.setValue, d, [f]), single: true});
            return
        }
        f = d.setupValue(f);
        d.mixins.field.setValue.call(d, f);
        c = d.getRecordsForValue(f);
        b.suspendEvents();
        e.suspendEvents();
        b.removeAll();
        e.removeAll();
        d.populateFromStore(d.store);
        Ext.Array.forEach(c, function (h) {
            if (b.indexOf(h) > -1) {
                b.remove(h)
            }
            e.add(h)
        });
        b.resumeEvents();
        e.resumeEvents();
        Ext.suspendLayouts();
        g.boundList.refresh();
        a.boundList.refresh();
        Ext.resumeLayouts(true)
    },
    onBindStore: function (a, b) {
        var c = this;
        if (c.fromField) {
            c.fromField.store.removeAll();
            c.toField.store.removeAll();
            if (a.getCount()) {
                c.populateFromStore(a)
            } else {
                c.store.on("load", c.populateFromStore, c)
            }
        }
    },
    populateFromStore: function (a) {
        var b = this.fromField.store;
        this.fromStorePopulated = true;
        b.add(a.getRange());
        b.fireEvent("load", b)
    },
    onEnable: function () {
        var a = this;
        a.callParent();
        a.fromField.enable();
        a.toField.enable();
        Ext.Array.forEach(a.query("[navBtn]"), function (b) {
            b.enable()
        })
    },
    onDisable: function () {
        var a = this;
        a.callParent();
        a.fromField.disable();
        a.toField.disable();
        Ext.Array.forEach(a.query("[navBtn]"), function (b) {
            b.disable()
        })
    },
    onDestroy: function () {
        this.bindStore(null);
        this.callParent()
    }
});
Ext.define("Ext.ux.form.SearchField", {
    extend: "Ext.form.field.Text",
    alias: "widget.searchfield",
    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + "form-clear-trigger",
            hidden: true,
            handler: "onClearClick",
            scope: "this"
        }, search: {weight: 1, cls: Ext.baseCSSPrefix + "form-search-trigger", handler: "onSearchClick", scope: "this"}
    },
    hasSearch: false,
    paramName: "query",
    initComponent: function () {
        var c = this, a = c.store, b;
        c.callParent(arguments);
        c.on("specialkey", function (d, g) {
            if (g.getKey() == g.ENTER) {
                c.onSearchClick()
            }
        });
        if (!a || !a.isStore) {
            a = c.store = Ext.data.StoreManager.lookup(a)
        }
        a.setRemoteFilter(true);
        b = c.store.getProxy();
        b.setFilterParam(c.paramName);
        b.encodeFilters = function (d) {
            return d[0].getValue()
        }
    },
    onClearClick: function () {
        var b = this, a = b.activeFilter;
        if (a) {
            b.setValue("");
            b.store.getFilters().remove(a);
            b.activeFilter = null;
            b.getTrigger("clear").hide();
            b.updateLayout()
        }
    },
    onSearchClick: function () {
        var a = this, b = a.getValue();
        if (b.length > 0) {
            a.activeFilter = new Ext.util.Filter({property: a.paramName, value: b});
            a.store.getFilters().add(a.activeFilter);
            a.getTrigger("clear").show();
            a.updateLayout()
        }
    }
});
Ext.define("Ext.ux.grid.SubTable", {
    extend: "Ext.grid.plugin.RowExpander",
    alias: "plugin.subtable",
    rowBodyTpl: ['<table class="' + Ext.baseCSSPrefix + 'grid-subtable"><tbody>', "{%", "this.owner.renderTable(out, values);", "%}", "</tbody></table>"],
    init: function (d) {
        var e = this, c = e.columns, a, b, f;
        e.callParent(arguments);
        e.columns = [];
        if (c) {
            for (b = 0, a = c.length; b < a; ++b) {
                f = Ext.apply({preventRegister: true}, c[b]);
                f.xtype = f.xtype || "gridcolumn";
                e.columns.push(Ext.widget(f))
            }
        }
    },
    destroy: function () {
        var c = this.columns, a, b;
        if (c) {
            for (b = 0, a = c.length; b < a; ++b) {
                c[b].destroy()
            }
        }
        this.columns = null;
        this.callParent()
    },
    getRowBodyFeatureData: function (b, a, c) {
        this.callParent(arguments);
        c.rowBodyCls += " " + Ext.baseCSSPrefix + "grid-subtable-row"
    },
    renderTable: function (g, m) {
        var k = this, d = k.columns, a = d.length, c = k.getAssociatedRecords(m.record), n = c.length, e, b, h, f, l;
        g.push("<thead>");
        for (f = 0; f < a; f++) {
            g.push('<th class="' + Ext.baseCSSPrefix + 'grid-subtable-header">', d[f].text, "</th>")
        }
        g.push("</thead>");
        for (h = 0; h < n; h++) {
            e = c[h];
            g.push("<tr>");
            for (f = 0; f < a; f++) {
                b = d[f];
                l = e.get(b.dataIndex);
                if (b.renderer && b.renderer.call) {
                    l = b.renderer.call(b.scope || k, l, {}, e)
                }
                g.push('<td class="' + Ext.baseCSSPrefix + 'grid-subtable-cell"');
                if (b.width != null) {
                    g.push(' style="width:' + b.width + 'px"')
                }
                g.push('><div class="' + Ext.baseCSSPrefix + 'grid-cell-inner">', l, "</div></td>")
            }
            g.push("</tr>")
        }
    },
    getRowBodyContentsFn: function (a) {
        var b = this;
        return function (c) {
            a.owner = b;
            return a.applyTemplate(c)
        }
    },
    getAssociatedRecords: function (a) {
        return a[this.association]().getRange()
    }
});
Ext.define("Ext.ux.grid.TransformGrid", {
    extend: "Ext.grid.Panel", constructor: function (q, f) {
        f = Ext.apply({}, f);
        q = this.table = Ext.get(q);
        var j = f.fields || [], c = f.columns || [], k = [], m = [], e = q.query("thead th"), h = 0, l = e.length, g = q.dom, b, p, n, d, o, a;
        for (; h < l; ++h) {
            d = e[h];
            o = d.innerHTML;
            a = "tcol-" + h;
            k.push(Ext.applyIf(j[h] || {}, {name: a, mapping: "td:nth(" + (h + 1) + ")/@innerHTML"}));
            m.push(Ext.applyIf(c[h] || {}, {
                text: o,
                dataIndex: a,
                width: d.offsetWidth,
                tooltip: d.title,
                sortable: true
            }))
        }
        if (f.width) {
            b = f.width
        } else {
            b = q.getWidth() + 1
        }
        if (f.height) {
            p = f.height
        }
        Ext.applyIf(f, {
            store: {data: g, fields: k, proxy: {type: "memory", reader: {record: "tbody tr", type: "xml"}}},
            columns: m,
            width: b,
            height: p
        });
        this.callParent([f]);
        if (f.remove !== false) {
            g.parentNode.removeChild(g)
        }
    }, onDestroy: function () {
        this.callParent();
        this.table.remove();
        delete this.table
    }
});
Ext.define("Ext.ux.statusbar.ValidationStatus", {
    extend: "Ext.Component",
    requires: ["Ext.util.MixedCollection"],
    errorIconCls: "x-status-error",
    errorListCls: "x-status-error-list",
    validIconCls: "x-status-valid",
    showText: "The form has errors (click for details...)",
    hideText: "Click again to hide the error list",
    submitText: "Saving...",
    init: function (b) {
        var a = this;
        a.statusBar = b;
        b.on({single: true, scope: a, render: a.onStatusbarRender, beforedestroy: a.destroy});
        b.on({click: {element: "el", fn: a.onStatusClick, scope: a, buffer: 200}})
    },
    onStatusbarRender: function (c) {
        var b = this, a = function () {
            b.monitor = true
        };
        b.monitor = true;
        b.errors = Ext.create("Ext.util.MixedCollection");
        b.listAlign = (c.statusAlign === "right" ? "br-tr?" : "bl-tl?");
        if (b.form) {
            b.formPanel = Ext.getCmp(b.form);
            b.basicForm = b.formPanel.getForm();
            b.startMonitoring();
            b.basicForm.on("beforeaction", function (e, d) {
                if (d.type === "submit") {
                    b.monitor = false
                }
            });
            b.basicForm.on("actioncomplete", a);
            b.basicForm.on("actionfailed", a)
        }
    },
    startMonitoring: function () {
        this.basicForm.getFields().each(function (a) {
            a.on("validitychange", this.onFieldValidation, this)
        }, this)
    },
    stopMonitoring: function () {
        this.basicForm.getFields().each(function (a) {
            a.un("validitychange", this.onFieldValidation, this)
        }, this)
    },
    onDestroy: function () {
        this.stopMonitoring();
        this.statusBar.statusEl.un("click", this.onStatusClick, this);
        this.callParent(arguments)
    },
    onFieldValidation: function (b, c) {
        var a = this, d;
        if (!a.monitor) {
            return false
        }
        d = b.getErrors()[0];
        if (d) {
            a.errors.add(b.id, {field: b, msg: d})
        } else {
            a.errors.removeAtKey(b.id)
        }
        this.updateErrorList();
        if (a.errors.getCount() > 0) {
            if (a.statusBar.getText() !== a.showText) {
                a.statusBar.setStatus({text: a.showText, iconCls: a.errorIconCls})
            }
        } else {
            a.statusBar.clearStatus().setIcon(a.validIconCls)
        }
    },
    updateErrorList: function () {
        var b = this, c, a = b.getMsgEl();
        if (b.errors.getCount() > 0) {
            c = ["<ul>"];
            this.errors.each(function (d) {
                c.push('<li id="x-err-', d.field.id, '"><a href="#">', d.msg, "</a></li>")
            });
            c.push("</ul>");
            a.update(c.join(""))
        } else {
            a.update("")
        }
        a.setSize("auto", "auto")
    },
    getMsgEl: function () {
        var c = this, a = c.msgEl, b;
        if (!a) {
            a = c.msgEl = Ext.DomHelper.append(Ext.getBody(), {cls: c.errorListCls}, true);
            a.hide();
            a.on("click", function (d) {
                b = d.getTarget("li", 10, true);
                if (b) {
                    Ext.getCmp(b.id.split("x-err-")[1]).focus();
                    c.hideErrors()
                }
            }, null, {stopEvent: true})
        }
        return a
    },
    showErrors: function () {
        var a = this;
        a.updateErrorList();
        a.getMsgEl().alignTo(a.statusBar.getEl(), a.listAlign).slideIn("b", {duration: 300, easing: "easeOut"});
        a.statusBar.setText(a.hideText);
        a.formPanel.body.on("click", a.hideErrors, a, {single: true})
    },
    hideErrors: function () {
        var a = this.getMsgEl();
        if (a.isVisible()) {
            a.slideOut("b", {duration: 300, easing: "easeIn"});
            this.statusBar.setText(this.showText)
        }
        this.formPanel.body.un("click", this.hideErrors, this)
    },
    onStatusClick: function () {
        if (this.getMsgEl().isVisible()) {
            this.hideErrors()
        } else {
            if (this.errors.getCount() > 0) {
                this.showErrors()
            }
        }
    }
});