Ext.define("Ext.chart.Callout", {
    constructor: function (a) {
        if (a.callouts) {
            a.callouts.styles = Ext.applyIf(a.callouts.styles || {}, {
                color: "#000",
                font: "11px Helvetica, sans-serif"
            });
            this.callouts = Ext.apply(this.callouts || {}, a.callouts);
            this.calloutsArray = []
        }
    }, renderCallouts: function () {
        if (!this.callouts) {
            return
        }
        var u = this, l = u.items, a = u.chart.animate, t = u.callouts, g = t.styles, e = u.calloutsArray, b = u.chart.getChartStore(), r = b.getCount(), d = l.length / r, k = [], q, c, o, m, s, f, h, n;
        for (q = 0, c = 0; q < r; q++) {
            for (o = 0; o < d; o++) {
                s = l[c];
                f = e[c];
                h = b.getAt(q);
                n = (!t.filter || t.filter(h));
                if (!n && !f) {
                    c++;
                    continue
                }
                if (!f) {
                    e[c] = f = u.onCreateCallout(h, s, q, n, o, c)
                }
                for (m in f) {
                    if (f[m] && f[m].setAttributes) {
                        f[m].setAttributes(g, true)
                    }
                }
                if (!n) {
                    for (m in f) {
                        if (f[m]) {
                            if (f[m].setAttributes) {
                                f[m].setAttributes({hidden: true}, true)
                            } else {
                                if (f[m].setVisible) {
                                    f[m].setVisible(false)
                                }
                            }
                        }
                    }
                }
                if (t && t.renderer) {
                    t.renderer(f, h)
                }
                u.onPlaceCallout(f, h, s, q, n, a, o, c, k);
                k.push(f);
                c++
            }
        }
        this.hideCallouts(c)
    }, onCreateCallout: function (f, m, e, h) {
        var j = this, k = j.calloutsGroup, d = j.callouts, n = (d ? d.styles : undefined), c = (n ? n.width : 0), l = (n ? n.height : 0), g = j.chart, b = g.surface, a = {lines: false};
        a.lines = b.add(Ext.apply({}, {type: "path", path: "M0,0", stroke: j.getLegendColor() || "#555"}, n));
        if (d.items) {
            a.panel = new Ext.Panel({style: "position: absolute;", width: c, height: l, items: d.items, renderTo: g.el})
        }
        return a
    }, hideCallouts: function (b) {
        var d = this.calloutsArray, a = d.length, e, c;
        while (a-- > b) {
            e = d[a];
            for (c in e) {
                if (e[c]) {
                    e[c].hide(true)
                }
            }
        }
    }
});
Ext.define("Ext.draw.CompositeSprite", {
    extend: "Ext.util.MixedCollection",
    mixins: {animate: "Ext.util.Animate"},
    autoDestroy: false,
    isCompositeSprite: true,
    constructor: function (a) {
        var b = this;
        Ext.apply(b, a);
        b.id = Ext.id(null, "ext-sprite-group-");
        b.callParent()
    },
    onClick: function (a) {
        this.fireEvent("click", a)
    },
    onMouseUp: function (a) {
        this.fireEvent("mouseup", a)
    },
    onMouseDown: function (a) {
        this.fireEvent("mousedown", a)
    },
    onMouseOver: function (a) {
        this.fireEvent("mouseover", a)
    },
    onMouseOut: function (a) {
        this.fireEvent("mouseout", a)
    },
    attachEvents: function (b) {
        var a = this;
        b.on({
            scope: a,
            mousedown: a.onMouseDown,
            mouseup: a.onMouseUp,
            mouseover: a.onMouseOver,
            mouseout: a.onMouseOut,
            click: a.onClick
        })
    },
    add: function (b, c) {
        var a = this.callParent(arguments);
        this.attachEvents(a);
        return a
    },
    insert: function (a, b, c) {
        return this.callParent(arguments)
    },
    remove: function (b) {
        var a = this;
        b.un({
            scope: a,
            mousedown: a.onMouseDown,
            mouseup: a.onMouseUp,
            mouseover: a.onMouseOver,
            mouseout: a.onMouseOut,
            click: a.onClick
        });
        return a.callParent(arguments)
    },
    getBBox: function () {
        var e = 0, m, h, j = this.items, f = this.length, g = Infinity, c = g, l = -g, b = g, k = -g, d, a;
        for (; e < f; e++) {
            m = j[e];
            if (m.el && !m.bboxExcluded) {
                h = m.getBBox();
                c = Math.min(c, h.x);
                b = Math.min(b, h.y);
                l = Math.max(l, h.height + h.y);
                k = Math.max(k, h.width + h.x)
            }
        }
        return {x: c, y: b, height: l - b, width: k - c}
    },
    setAttributes: function (c, e) {
        var d = 0, b = this.items, a = this.length;
        for (; d < a; d++) {
            b[d].setAttributes(c, e)
        }
        return this
    },
    hide: function (d) {
        var c = 0, b = this.items, a = this.length;
        for (; c < a; c++) {
            b[c].hide(d)
        }
        return this
    },
    show: function (d) {
        var c = 0, b = this.items, a = this.length;
        for (; c < a; c++) {
            b[c].show(d)
        }
        return this
    },
    redraw: function () {
        var e = this, d = 0, c = e.items, b = e.getSurface(), a = e.length;
        if (b) {
            for (; d < a; d++) {
                b.renderItem(c[d])
            }
        }
        return e
    },
    setStyle: function (f) {
        var c = 0, b = this.items, a = this.length, e, d;
        for (; c < a; c++) {
            e = b[c];
            d = e.el;
            if (d) {
                d.setStyle(f)
            }
        }
    },
    addCls: function (e) {
        var d = 0, c = this.items, b = this.getSurface(), a = this.length;
        if (b) {
            for (; d < a; d++) {
                b.addCls(c[d], e)
            }
        }
    },
    removeCls: function (e) {
        var d = 0, c = this.items, b = this.getSurface(), a = this.length;
        if (b) {
            for (; d < a; d++) {
                b.removeCls(c[d], e)
            }
        }
    },
    getSurface: function () {
        var a = this.first();
        if (a) {
            return a.surface
        }
        return null
    },
    destroy: function () {
        var d = this, a = d.getSurface(), c = d.autoDestroy, b;
        if (a) {
            while (d.getCount() > 0) {
                b = d.first();
                d.remove(b);
                a.remove(b, c)
            }
        }
        d.clearListeners()
    }
});
Ext.define("Ext.draw.Surface", {
    mixins: {observable: "Ext.util.Observable"},
    requires: ["Ext.draw.CompositeSprite"],
    uses: ["Ext.draw.engine.Svg", "Ext.draw.engine.Vml", "Ext.draw.engine.SvgExporter", "Ext.draw.engine.ImageExporter"],
    separatorRe: /[, ]+/,
    enginePriority: ["Svg", "Vml"],
    statics: {
        create: function (b, d) {
            d = d || this.prototype.enginePriority;
            var c = 0, a = d.length;
            for (; c < a; c++) {
                if (Ext.supports[d[c]]) {
                    return Ext.create("Ext.draw.engine." + d[c], b)
                }
            }
            return false
        }, save: function (a, b) {
            b = b || {};
            var e = {
                "image/png": "Image",
                "image/jpeg": "Image",
                "image/svg+xml": "Svg"
            }, d = e[b.type] || "Svg", c = Ext.draw.engine[d + "Exporter"];
            return c.generate(a, b)
        }
    },
    availableAttrs: {
        blur: 0,
        "clip-rect": "0 0 1e9 1e9",
        cursor: "default",
        cx: 0,
        cy: 0,
        "dominant-baseline": "auto",
        fill: "none",
        "fill-opacity": 1,
        font: '10px "Arial"',
        "font-family": '"Arial"',
        "font-size": "10",
        "font-style": "normal",
        "font-weight": 400,
        gradient: "",
        height: 0,
        hidden: false,
        href: "http://sencha.com/",
        opacity: 1,
        path: "M0,0",
        radius: 0,
        rx: 0,
        ry: 0,
        scale: "1 1",
        src: "",
        stroke: "none",
        "stroke-dasharray": "",
        "stroke-linecap": "butt",
        "stroke-linejoin": "butt",
        "stroke-miterlimit": 0,
        "stroke-opacity": 1,
        "stroke-width": 1,
        target: "_blank",
        text: "",
        "text-anchor": "middle",
        title: "Ext Draw",
        width: 0,
        x: 0,
        y: 0,
        zIndex: 0
    },
    container: undefined,
    height: 352,
    width: 512,
    x: 0,
    y: 0,
    orderSpritesByZIndex: true,
    constructor: function (a) {
        var b = this;
        a = a || {};
        Ext.apply(b, a);
        b.domRef = Ext.getDoc().dom;
        b.customAttributes = {};
        b.mixins.observable.constructor.call(b);
        b.getId();
        b.initGradients();
        b.initItems();
        if (b.renderTo) {
            b.render(b.renderTo);
            delete b.renderTo
        }
        b.initBackground(a.background)
    },
    initSurface: Ext.emptyFn,
    renderItem: Ext.emptyFn,
    renderItems: Ext.emptyFn,
    setViewBox: function (b, d, c, a) {
        if (isFinite(b) && isFinite(d) && isFinite(c) && isFinite(a)) {
            this.viewBox = {x: b, y: d, width: c, height: a};
            this.applyViewBox()
        }
    },
    addCls: Ext.emptyFn,
    removeCls: Ext.emptyFn,
    setStyle: Ext.emptyFn,
    initGradients: function () {
        if (this.hasOwnProperty("gradients")) {
            var a = this.gradients, b = this.addGradient, d, c;
            if (a) {
                for (d = 0, c = a.length; d < c; d++) {
                    if (b.call(this, a[d], d, c) === false) {
                        break
                    }
                }
            }
        }
    },
    initItems: function () {
        var a = this.items;
        this.items = new Ext.draw.CompositeSprite();
        this.items.autoDestroy = true;
        this.groups = new Ext.draw.CompositeSprite();
        if (a) {
            this.add(a)
        }
    },
    initBackground: function (b) {
        var d = this, c = d.width, a = d.height, e, f;
        if (Ext.isString(b)) {
            b = {fill: b}
        }
        if (b) {
            if (b.gradient) {
                f = b.gradient;
                e = f.id;
                d.addGradient(f);
                d.background = d.add({
                    type: "rect",
                    isBackground: true,
                    x: 0,
                    y: 0,
                    width: c,
                    height: a,
                    fill: "url(#" + e + ")",
                    zIndex: -1
                })
            } else {
                if (b.fill) {
                    d.background = d.add({
                        type: "rect",
                        isBackground: true,
                        x: 0,
                        y: 0,
                        width: c,
                        height: a,
                        fill: b.fill,
                        zIndex: -1
                    })
                } else {
                    if (b.image) {
                        d.background = d.add({
                            type: "image",
                            isBackground: true,
                            x: 0,
                            y: 0,
                            width: c,
                            height: a,
                            src: b.image,
                            zIndex: -1
                        })
                    }
                }
            }
            d.background.bboxExcluded = true
        }
    },
    setSize: function (a, b) {
        this.applyViewBox()
    },
    scrubAttrs: function (d) {
        var c, b = {}, a = {}, e = d.attr;
        for (c in e) {
            if (this.translateAttrs.hasOwnProperty(c)) {
                b[this.translateAttrs[c]] = e[c];
                a[this.translateAttrs[c]] = true
            } else {
                if (this.availableAttrs.hasOwnProperty(c) && !a[c]) {
                    b[c] = e[c]
                }
            }
        }
        return b
    },
    onClick: function (a) {
        this.processEvent("click", a)
    },
    onDblClick: function (a) {
        this.processEvent("dblclick", a)
    },
    onMouseUp: function (a) {
        this.processEvent("mouseup", a)
    },
    onMouseDown: function (a) {
        this.processEvent("mousedown", a)
    },
    onMouseOver: function (a) {
        this.processEvent("mouseover", a)
    },
    onMouseOut: function (a) {
        this.processEvent("mouseout", a)
    },
    onMouseMove: function (a) {
        this.fireEvent("mousemove", a)
    },
    onMouseEnter: Ext.emptyFn,
    onMouseLeave: Ext.emptyFn,
    addGradient: Ext.emptyFn,
    add: function () {
        var b = Array.prototype.slice.call(arguments), e, h = b.length > 1, a, d, c, g, f;
        if (h || Ext.isArray(b[0])) {
            a = h ? b : b[0];
            d = [];
            for (c = 0, g = a.length; c < g; c++) {
                f = a[c];
                f = this.add(f);
                d.push(f)
            }
            return d
        }
        e = this.prepareItems(b[0], true)[0];
        this.insertByZIndex(e);
        this.onAdd(e);
        return e
    },
    insertByZIndex: function (j) {
        var f = this, d = f.items.items, c = d.length, k = Math.ceil, g = j.attr.zIndex, h = c, b = h - 1, e = 0, a;
        if (f.orderSpritesByZIndex && c && g < d[b].attr.zIndex) {
            while (e <= b) {
                h = k((e + b) / 2);
                a = d[h].attr.zIndex;
                if (a > g) {
                    b = h - 1
                } else {
                    if (a < g) {
                        e = h + 1
                    } else {
                        break
                    }
                }
            }
            while (h < c && d[h].attr.zIndex <= g) {
                h++
            }
        }
        f.items.insert(h, j);
        return h
    },
    onAdd: function (d) {
        var f = d.group, b = d.draggable, a, e, c;
        if (f) {
            a = [].concat(f);
            e = a.length;
            for (c = 0; c < e; c++) {
                f = a[c];
                this.getGroup(f).add(d)
            }
            delete d.group
        }
        if (b) {
            d.initDraggable()
        }
    },
    remove: function (b, e) {
        if (b) {
            this.items.remove(b);
            var a = [].concat(this.groups.items), d = a.length, c;
            for (c = 0; c < d; c++) {
                a[c].remove(b)
            }
            b.onRemove();
            if (e === true) {
                b.destroy()
            }
        }
    },
    removeAll: function (d) {
        var a = this.items.items, c = a.length, b;
        for (b = c - 1; b > -1; b--) {
            this.remove(a[b], d)
        }
    },
    onRemove: Ext.emptyFn,
    onDestroy: Ext.emptyFn,
    applyViewBox: function () {
        var d = this, l = d.viewBox, a = d.width || 1, g = d.height || 1, f, e, j, b, h, c, k;
        if (l && (a || g)) {
            f = l.x;
            e = l.y;
            j = l.width;
            b = l.height;
            h = g / b;
            c = a / j;
            k = Math.min(c, h);
            if (j * k < a) {
                f -= (a - j * k) / 2 / k
            }
            if (b * k < g) {
                e -= (g - b * k) / 2 / k
            }
            d.viewBoxShift = {dx: -f, dy: -e, scale: k};
            if (d.background) {
                d.background.setAttributes(Ext.apply({}, {
                    x: f,
                    y: e,
                    width: a / k,
                    height: g / k
                }, {hidden: false}), true)
            }
        } else {
            if (d.background && a && g) {
                d.background.setAttributes(Ext.apply({x: 0, y: 0, width: a, height: g}, {hidden: false}), true)
            }
        }
    },
    getBBox: function (a, b) {
        var c = this["getPath" + a.type](a);
        if (b) {
            a.bbox.plain = a.bbox.plain || Ext.draw.Draw.pathDimensions(c);
            return a.bbox.plain
        }
        if (a.dirtyTransform) {
            this.applyTransformations(a, true)
        }
        a.bbox.transform = a.bbox.transform || Ext.draw.Draw.pathDimensions(Ext.draw.Draw.mapPath(c, a.matrix));
        return a.bbox.transform
    },
    transformToViewBox: function (a, d) {
        if (this.viewBoxShift) {
            var c = this, b = c.viewBoxShift;
            return [a / b.scale - b.dx, d / b.scale - b.dy]
        } else {
            return [a, d]
        }
    },
    applyTransformations: function (b, d) {
        if (b.type == "text") {
            b.bbox.transform = 0;
            this.transform(b, false)
        }
        b.dirtyTransform = false;
        var c = this, a = b.attr;
        if (a.translation.x != null || a.translation.y != null) {
            c.translate(b)
        }
        if (a.scaling.x != null || a.scaling.y != null) {
            c.scale(b)
        }
        if (a.rotation.degrees != null) {
            c.rotate(b)
        }
        b.bbox.transform = 0;
        this.transform(b, d);
        b.transformations = []
    },
    rotate: function (a) {
        var e, b = a.attr.rotation.degrees, d = a.attr.rotation.x, c = a.attr.rotation.y;
        if (!Ext.isNumber(d) || !Ext.isNumber(c)) {
            e = this.getBBox(a, true);
            d = !Ext.isNumber(d) ? e.x + e.width / 2 : d;
            c = !Ext.isNumber(c) ? e.y + e.height / 2 : c
        }
        a.transformations.push({type: "rotate", degrees: b, x: d, y: c})
    },
    translate: function (b) {
        var a = b.attr.translation.x || 0, c = b.attr.translation.y || 0;
        b.transformations.push({type: "translate", x: a, y: c})
    },
    scale: function (b) {
        var e, a = b.attr.scaling.x || 1, f = b.attr.scaling.y || 1, d = b.attr.scaling.centerX, c = b.attr.scaling.centerY;
        if (!Ext.isNumber(d) || !Ext.isNumber(c)) {
            e = this.getBBox(b, true);
            d = !Ext.isNumber(d) ? e.x + e.width / 2 : d;
            c = !Ext.isNumber(c) ? e.y + e.height / 2 : c
        }
        b.transformations.push({type: "scale", x: a, y: f, centerX: d, centerY: c})
    },
    rectPath: function (a, e, b, c, d) {
        if (d) {
            return [["M", a + d, e], ["l", b - d * 2, 0], ["a", d, d, 0, 0, 1, d, d], ["l", 0, c - d * 2], ["a", d, d, 0, 0, 1, -d, d], ["l", d * 2 - b, 0], ["a", d, d, 0, 0, 1, -d, -d], ["l", 0, d * 2 - c], ["a", d, d, 0, 0, 1, d, -d], ["z"]]
        }
        return [["M", a, e], ["l", b, 0], ["l", 0, c], ["l", -b, 0], ["z"]]
    },
    ellipsePath: function (a, d, c, b) {
        if (b == null) {
            b = c
        }
        return [["M", a, d], ["m", 0, -b], ["a", c, b, 0, 1, 1, 0, 2 * b], ["a", c, b, 0, 1, 1, 0, -2 * b], ["z"]]
    },
    getPathpath: function (a) {
        return a.attr.path
    },
    getPathcircle: function (c) {
        var b = c.attr;
        return this.ellipsePath(b.x, b.y, b.radius, b.radius)
    },
    getPathellipse: function (c) {
        var b = c.attr;
        return this.ellipsePath(b.x, b.y, b.radiusX || (b.width / 2) || 0, b.radiusY || (b.height / 2) || 0)
    },
    getPathrect: function (c) {
        var b = c.attr;
        return this.rectPath(b.x || 0, b.y || 0, b.width || 0, b.height || 0, b.r || 0)
    },
    getPathimage: function (c) {
        var b = c.attr;
        return this.rectPath(b.x || 0, b.y || 0, b.width, b.height)
    },
    getPathtext: function (a) {
        var b = this.getBBoxText(a);
        return this.rectPath(b.x, b.y, b.width, b.height)
    },
    createGroup: function (b) {
        var a = this.groups.get(b);
        if (!a) {
            a = new Ext.draw.CompositeSprite({surface: this});
            a.id = b || Ext.id(null, "ext-surface-group-");
            this.groups.add(a)
        }
        return a
    },
    getGroup: function (b) {
        var a;
        if (typeof b == "string") {
            a = this.groups.get(b);
            if (!a) {
                a = this.createGroup(b)
            }
        } else {
            a = b
        }
        return a
    },
    prepareItems: function (a, c) {
        a = [].concat(a);
        var e, b, d;
        for (b = 0, d = a.length; b < d; b++) {
            e = a[b];
            if (!(e instanceof Ext.draw.Sprite)) {
                e.surface = this;
                a[b] = this.createItem(e)
            } else {
                e.surface = this
            }
        }
        return a
    },
    setText: Ext.emptyFn,
    createItem: Ext.emptyFn,
    getId: function () {
        return this.id || (this.id = Ext.id(null, "ext-surface-"))
    },
    destroy: function () {
        var a = this;
        delete a.domRef;
        if (a.background) {
            a.background.destroy()
        }
        a.removeAll(true);
        Ext.destroy(a.groups.items)
    }
});
Ext.define("Ext.draw.layout.Component", {
    alias: "layout.draw",
    extend: "Ext.layout.component.Auto",
    setHeightInDom: true,
    setWidthInDom: true,
    type: "draw",
    measureContentWidth: function (b) {
        var c = b.target, a = b.getPaddingInfo(), d = this.getBBox(b);
        if (!c.viewBox) {
            if (c.autoSize) {
                return d.width + a.width
            } else {
                return d.x + d.width + a.width
            }
        } else {
            if (b.heightModel.shrinkWrap) {
                return a.width
            } else {
                return d.width / d.height * (b.getProp("contentHeight") - a.height) + a.width
            }
        }
    },
    measureContentHeight: function (b) {
        var c = b.target, a = b.getPaddingInfo(), d = this.getBBox(b);
        if (!b.target.viewBox) {
            if (c.autoSize) {
                return d.height + a.height
            } else {
                return d.y + d.height + a.height
            }
        } else {
            if (b.widthModel.shrinkWrap) {
                return a.height
            } else {
                return d.height / d.width * (b.getProp("contentWidth") - a.width) + a.height
            }
        }
    },
    getBBox: function (a) {
        var b = a.surfaceBBox;
        if (!b) {
            b = a.target.surface.items.getBBox();
            if (b.width === -Infinity && b.height === -Infinity) {
                b.width = b.height = b.x = b.y = 0
            }
            a.surfaceBBox = b
        }
        return b
    },
    publishInnerWidth: function (b, a) {
        b.setContentWidth(a - b.getFrameInfo().width, true)
    },
    publishInnerHeight: function (b, a) {
        b.setContentHeight(a - b.getFrameInfo().height, true)
    },
    finishedLayout: function (c) {
        var b = c.props, a = c.getPaddingInfo();
        this.owner.setSurfaceSize(b.contentWidth - a.width, b.contentHeight - a.height);
        this.callParent(arguments)
    }
});
Ext.define("Ext.draw.Component", {
    alias: "widget.draw",
    extend: "Ext.Component",
    requires: ["Ext.draw.Surface", "Ext.draw.layout.Component"],
    enginePriority: ["Svg", "Vml"],
    baseCls: Ext.baseCSSPrefix + "surface",
    componentLayout: "draw",
    viewBox: true,
    shrinkWrap: 3,
    autoSize: false,
    suspendSizing: 0,
    onRender: function () {
        this.callParent(arguments);
        if (this.createSurface() !== false) {
            this.configureSurfaceSize()
        }
    },
    configureSurfaceSize: function () {
        var b = this, d = b.viewBox, a = b.autoSize, c;
        if ((d || a) && !b.suspendSizing) {
            c = b.surface.items.getBBox();
            if (d) {
                b.surface.setViewBox(c.x, c.y, c.width, c.height)
            } else {
                b.autoSizeSurface(c)
            }
        }
    },
    autoSizeSurface: function (a) {
        a = a || this.surface.items.getBBox();
        this.setSurfaceSize(a.width, a.height)
    },
    setSurfaceSize: function (b, a) {
        this.surface.setSize(b, a);
        if (this.autoSize) {
            var c = this.surface.items.getBBox();
            this.surface.setViewBox(c.x, c.y - (+Ext.isOpera), b, a)
        }
    },
    createSurface: function () {
        var d = this, b = Ext.applyIf({
            renderTo: d.el,
            height: d.height,
            width: d.width,
            items: d.items
        }, d.initialConfig), a;
        delete b.listeners;
        if (!b.gradients) {
            b.gradients = d.gradients
        }
        d.initSurfaceCfg(b);
        a = Ext.draw.Surface.create(b, d.enginePriority);
        if (!a) {
            return false
        }
        d.surface = a;
        a.owner = d;
        function c(e) {
            return function (f) {
                d.fireEvent(e, f)
            }
        }

        a.on({
            scope: d,
            mouseup: c("mouseup"),
            mousedown: c("mousedown"),
            mousemove: c("mousemove"),
            mouseenter: c("mouseenter"),
            mouseleave: c("mouseleave"),
            click: c("click"),
            dblclick: c("dblclick")
        })
    },
    initSurfaceCfg: Ext.emptyFn,
    onDestroy: function () {
        Ext.destroy(this.surface);
        this.callParent(arguments)
    }
});
Ext.define("Ext.rtl.draw.Component", {
    override: "Ext.draw.Component", initSurfaceCfg: function (a) {
        if (this.getInherited().rtl) {
            a.isRtl = true
        }
    }
});
Ext.define("Ext.draw.Color", {
    isColor: true,
    colorToHexRe: /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
    rgbRe: /\s*rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)\s*/,
    hexRe: /\s*#([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)\s*/,
    lightnessFactor: 0.2,
    constructor: function (d, c, a) {
        var b = this, e = Ext.Number.constrain;
        b.r = e(d, 0, 255);
        b.g = e(c, 0, 255);
        b.b = e(a, 0, 255)
    },
    getRed: function () {
        return this.r
    },
    getGreen: function () {
        return this.g
    },
    getBlue: function () {
        return this.b
    },
    getRGB: function () {
        var a = this;
        return [a.r, a.g, a.b]
    },
    getHSL: function () {
        var j = this, a = j.r / 255, f = j.g / 255, k = j.b / 255, m = Math.max(a, f, k), d = Math.min(a, f, k), n = m - d, e, o = 0, c = 0.5 * (m + d);
        if (d != m) {
            o = (c <= 0.5) ? n / (m + d) : n / (2 - m - d);
            if (a == m) {
                e = 60 * (f - k) / n
            } else {
                if (f == m) {
                    e = 120 + 60 * (k - a) / n
                } else {
                    e = 240 + 60 * (a - f) / n
                }
            }
            if (e < 0) {
                e += 360
            }
            if (e >= 360) {
                e -= 360
            }
        }
        return [e, o, c]
    },
    getHSV: function () {
        var j = this, a = j.r / 255, f = j.g / 255, k = j.b / 255, l = Math.max(a, f, k), d = Math.min(a, f, k), c = l - d, e, n = 0, m = l;
        if (d != l) {
            n = m ? c / m : 0;
            if (a === l) {
                e = 60 * (f - k) / c
            } else {
                if (f === l) {
                    e = 60 * (k - a) / c + 120
                } else {
                    e = 60 * (a - f) / c + 240
                }
            }
            if (e < 0) {
                e += 360
            }
            if (e >= 360) {
                e -= 360
            }
        }
        return [e, n, m]
    },
    getLighter: function (b) {
        var a = this.getHSL();
        b = b || this.lightnessFactor;
        a[2] = Ext.Number.constrain(a[2] + b, 0, 1);
        return this.fromHSL(a[0], a[1], a[2])
    },
    getDarker: function (a) {
        a = a || this.lightnessFactor;
        return this.getLighter(-a)
    },
    toString: function () {
        var f = this, c = Math.round, e = c(f.r).toString(16), d = c(f.g).toString(16), a = c(f.b).toString(16);
        e = (e.length == 1) ? "0" + e : e;
        d = (d.length == 1) ? "0" + d : d;
        a = (a.length == 1) ? "0" + a : a;
        return ["#", e, d, a].join("")
    },
    toHex: function (b) {
        if (Ext.isArray(b)) {
            b = b[0]
        }
        if (!Ext.isString(b)) {
            return ""
        }
        if (b.substr(0, 1) === "#") {
            return b
        }
        var e = this.colorToHexRe.exec(b), f, d, a, c;
        if (Ext.isArray(e)) {
            f = parseInt(e[2], 10);
            d = parseInt(e[3], 10);
            a = parseInt(e[4], 10);
            c = a | (d << 8) | (f << 16);
            return e[1] + "#" + ("000000" + c.toString(16)).slice(-6)
        } else {
            return b
        }
    },
    fromString: function (k) {
        var c, h, f, a, j = parseInt, e = k.substr(0, 1), d;
        if (e != "#") {
            d = Ext.draw.Color.cssColors[k];
            if (d) {
                k = d;
                e = k.substr(0, 1)
            }
        }
        if ((k.length == 4 || k.length == 7) && e === "#") {
            c = k.match(this.hexRe);
            if (c) {
                h = j(c[1], 16) >> 0;
                f = j(c[2], 16) >> 0;
                a = j(c[3], 16) >> 0;
                if (k.length == 4) {
                    h += (h * 16);
                    f += (f * 16);
                    a += (a * 16)
                }
            }
        } else {
            c = k.match(this.rgbRe);
            if (c) {
                h = c[1];
                f = c[2];
                a = c[3]
            }
        }
        return (typeof h == "undefined") ? undefined : new Ext.draw.Color(h, f, a)
    },
    getGrayscale: function () {
        return this.r * 0.3 + this.g * 0.59 + this.b * 0.11
    },
    fromHSL: function (f, e, c) {
        var g, j, b, d = [], a = Math.abs;
        if (e == 0 || f == null) {
            d = [c, c, c]
        } else {
            f /= 60;
            g = e * (1 - a(2 * c - 1));
            j = g * (1 - a(f % 2 - 1));
            b = c - g / 2;
            switch (Math.floor(f)) {
                case 0:
                    d = [g, j, 0];
                    break;
                case 1:
                    d = [j, g, 0];
                    break;
                case 2:
                    d = [0, g, j];
                    break;
                case 3:
                    d = [0, j, g];
                    break;
                case 4:
                    d = [j, 0, g];
                    break;
                case 5:
                    d = [g, 0, j];
                    break
            }
            d = [d[0] + b, d[1] + b, d[2] + b]
        }
        return new Ext.draw.Color(d[0] * 255, d[1] * 255, d[2] * 255)
    },
    fromHSV: function (e, d, b) {
        var f, g, a, c = [];
        if (d == 0 || e == null) {
            c = [b, b, b]
        } else {
            e /= 60;
            f = b * d;
            g = f * (1 - Math.abs(e % 2 - 1));
            a = b - f;
            switch (Math.floor(e)) {
                case 0:
                    c = [f, g, 0];
                    break;
                case 1:
                    c = [g, f, 0];
                    break;
                case 2:
                    c = [0, f, g];
                    break;
                case 3:
                    c = [0, g, f];
                    break;
                case 4:
                    c = [g, 0, f];
                    break;
                case 5:
                    c = [f, 0, g];
                    break
            }
            c = [c[0] + a, c[1] + a, c[2] + a]
        }
        return new Ext.draw.Color(c[0] * 255, c[1] * 255, c[2] * 255)
    }
}, function () {
    var a = this.prototype, b = ["fromHSL", "fromHSV", "fromString", "toHex"], c = {};
    Ext.Array.each(b, function (d) {
        c[d] = function () {
            return a[d].apply(a, arguments)
        }
    });
    c.cssColors = {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#00FFFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blue: "#0000FF",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgreen: "#006400",
        darkgrey: "#A9A9A9",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgreen: "#90EE90",
        lightgrey: "#D3D3D3",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#00FF00",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#800000",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#000080",
        oldlace: "#FDF5E6",
        olive: "#808000",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#800080",
        red: "#FF0000",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#C0C0C0",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#008080",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFFF00",
        yellowgreen: "#9ACD32"
    };
    this.addStatics(c)
});
Ext.chart = Ext.chart || {};
Ext.define("Ext.chart.theme.Theme", (function () {
    (function () {
        Ext.chart.theme = function (c, b) {
            c = c || {};
            var k = 0, o = Ext.Date.now(), h, a, j, q, r, f, n, p, m = [], e, g;
            if (c.baseColor) {
                e = Ext.draw.Color.fromString(c.baseColor);
                g = e.getHSL()[2];
                if (g < 0.15) {
                    e = e.getLighter(0.3)
                } else {
                    if (g < 0.3) {
                        e = e.getLighter(0.15)
                    } else {
                        if (g > 0.85) {
                            e = e.getDarker(0.3)
                        } else {
                            if (g > 0.7) {
                                e = e.getDarker(0.15)
                            }
                        }
                    }
                }
                c.colors = [e.getDarker(0.3).toString(), e.getDarker(0.15).toString(), e.toString(), e.getLighter(0.15).toString(), e.getLighter(0.3).toString()];
                delete c.baseColor
            }
            if (c.colors) {
                a = c.colors.slice();
                r = b.markerThemes;
                q = b.seriesThemes;
                h = a.length;
                b.colors = a;
                for (; k < h; k++) {
                    j = a[k];
                    n = r[k] || {};
                    f = q[k] || {};
                    n.fill = f.fill = n.stroke = f.stroke = j;
                    r[k] = n;
                    q[k] = f
                }
                b.markerThemes = r.slice(0, h);
                b.seriesThemes = q.slice(0, h)
            }
            for (p in b) {
                if (p in c) {
                    if (Ext.isObject(c[p]) && Ext.isObject(b[p])) {
                        Ext.apply(b[p], c[p])
                    } else {
                        b[p] = c[p]
                    }
                }
            }
            if (c.useGradients) {
                a = b.colors || (function () {
                        var d = [];
                        for (k = 0, q = b.seriesThemes, h = q.length; k < h; k++) {
                            d.push(q[k].fill || q[k].stroke)
                        }
                        return d
                    }());
                for (k = 0, h = a.length; k < h; k++) {
                    e = Ext.draw.Color.fromString(a[k]);
                    if (e) {
                        j = e.getDarker(0.1).toString();
                        e = e.toString();
                        p = "theme-" + e.substr(1) + "-" + j.substr(1) + "-" + o;
                        m.push({id: p, angle: 45, stops: {0: {color: e.toString()}, 100: {color: j.toString()}}});
                        a[k] = "url(#" + p + ")"
                    }
                }
                b.gradients = m;
                b.colors = a
            }
            Ext.apply(this, b)
        }
    }());
    return {
        requires: ["Ext.draw.Color"], theme: "Base", themeAttrs: false, initTheme: function (e) {
            var d = this, b = Ext.chart.theme, c, a;
            if (e) {
                e = e.split(":");
                for (c in b) {
                    if (c == e[0]) {
                        a = e[1] == "gradients";
                        d.themeAttrs = new b[c]({useGradients: a});
                        if (a) {
                            d.gradients = d.themeAttrs.gradients
                        }
                        if (d.themeAttrs.background) {
                            d.background = d.themeAttrs.background
                        }
                        return
                    }
                }
            }
        }
    }
})());
Ext.define("Ext.chart.MaskLayer", {
    extend: "Ext.Component", constructor: function (a) {
        a = Ext.apply(a || {}, {style: "position:absolute;background-color:#ff9;cursor:crosshair;opacity:0.5;border:1px solid #00f;"});
        this.callParent([a])
    }, privates: {
        initDraggable: function () {
            this.callParent(arguments);
            this.dd.onStart = function (c) {
                var b = this, a = b.comp;
                this.startPosition = a.getPosition(true);
                if (a.ghost && !a.liveDrag) {
                    b.proxy = a.ghost();
                    b.dragTarget = b.proxy.header.el
                }
                if (b.constrain || b.constrainDelegate) {
                    b.constrainTo = b.calculateConstrainRegion()
                }
            }
        }
    }
});
Ext.define("Ext.chart.Mask", {
    mixinId: "mask", requires: ["Ext.chart.MaskLayer"], constructor: function (a) {
        var b = this;
        if (a) {
            Ext.apply(b, a)
        }
        if (b.enableMask) {
            b.on("afterrender", function () {
                var c = new Ext.chart.MaskLayer({renderTo: b.el, hidden: true});
                c.el.on({
                    mousemove: function (d) {
                        b.onMouseMove(d)
                    }, mouseup: function (d) {
                        b.onMouseUp(d)
                    }
                });
                c.initDraggable();
                b.maskType = b.mask;
                b.mask = c;
                b.maskSprite = b.surface.add({
                    type: "path",
                    path: ["M", 0, 0],
                    zIndex: 1001,
                    opacity: 0.6,
                    hidden: true,
                    stroke: "#00f",
                    cursor: "crosshair"
                })
            }, b, {single: true})
        }
    }, onMouseUp: function (c) {
        var a = this, d = a.bbox || a.chartBBox, b;
        a.maskMouseDown = false;
        a.mouseDown = false;
        if (a.mouseMoved) {
            a.handleMouseEvent(c);
            a.mouseMoved = false;
            b = a.maskSelection;
            a.fireEvent("select", a, {x: b.x - d.x, y: b.y - d.y, width: b.width, height: b.height})
        }
    }, onMouseDown: function (a) {
        this.handleMouseEvent(a)
    }, onMouseMove: function (a) {
        this.handleMouseEvent(a)
    }, handleMouseEvent: function (d) {
        var g = this, s = g.maskType, o = g.bbox || g.chartBBox, l = o.x, j = o.y, k = Math, c = k.floor, r = k.abs, b = k.min, h = k.max, n = c(j + o.height), a = c(l + o.width), p = d.getPageX() - g.el.getX(), m = d.getPageY() - g.el.getY(), f = g.maskMouseDown, q;
        p = h(p, l);
        m = h(m, j);
        p = b(p, a);
        m = b(m, n);
        if (d.type === "mousedown") {
            g.mouseDown = true;
            g.mouseMoved = false;
            g.maskMouseDown = {x: p, y: m}
        } else {
            g.mouseMoved = g.mouseDown;
            if (f && g.mouseDown) {
                if (s == "horizontal") {
                    m = j;
                    f.y = n
                } else {
                    if (s == "vertical") {
                        p = l;
                        f.x = a
                    }
                }
                a = f.x - p;
                n = f.y - m;
                q = ["M", p, m, "l", a, 0, 0, n, -a, 0, "z"];
                g.maskSelection = {
                    x: (a > 0 ? p : p + a) + g.el.getX(),
                    y: (n > 0 ? m : m + n) + g.el.getY(),
                    width: r(a),
                    height: r(n)
                };
                g.mask.updateBox(g.maskSelection);
                g.mask.show();
                g.maskSprite.setAttributes({hidden: true}, true)
            } else {
                if (s == "horizontal") {
                    q = ["M", p, j, "L", p, n]
                } else {
                    if (s == "vertical") {
                        q = ["M", l, m, "L", a, m]
                    } else {
                        q = ["M", p, j, "L", p, n, "M", l, m, "L", a, m]
                    }
                }
                g.maskSprite.setAttributes({path: q, "stroke-width": s === true ? 1 : 1, hidden: false}, true)
            }
        }
    }, onMouseLeave: function (b) {
        var a = this;
        a.mouseMoved = false;
        a.mouseDown = false;
        a.maskMouseDown = false;
        a.mask.hide();
        a.maskSprite.hide(true)
    }
});
Ext.define("Ext.chart.Navigation", {
    mixinId: "navigation", setZoom: function (o) {
        var s = this, n = s.axes.items, q, l, c, a = s.chartBBox, t = a.width, d = a.height, f = {
            x: o.x - s.el.getX(),
            y: o.y - s.el.getY(),
            width: o.width,
            height: o.height
        }, h, m, p, b, g, k, j, e, r;
        for (q = 0, l = n.length; q < l; q++) {
            c = n[q];
            r = (c.position == "bottom" || c.position == "top");
            if (c.type == "Category") {
                if (!g) {
                    g = s.getChartStore();
                    k = g.data.items.length
                }
                h = f;
                e = c.length;
                j = Math.round(e / k);
                if (r) {
                    p = (h.x ? Math.floor(h.x / j) + 1 : 0);
                    b = (h.x + h.width) / j
                } else {
                    p = (h.y ? Math.floor(h.y / j) + 1 : 0);
                    b = (h.y + h.height) / j
                }
            } else {
                h = {x: f.x / t, y: f.y / d, width: f.width / t, height: f.height / d};
                m = c.calcEnds();
                if (r) {
                    p = (m.to - m.from) * h.x + m.from;
                    b = (m.to - m.from) * h.width + p
                } else {
                    b = (m.to - m.from) * (1 - h.y) + m.from;
                    p = b - (m.to - m.from) * h.height
                }
            }
            c.minimum = p;
            c.maximum = b;
            if (r) {
                if (c.doConstrain && s.maskType != "vertical") {
                    c.doConstrain()
                }
            } else {
                if (c.doConstrain && s.maskType != "horizontal") {
                    c.doConstrain()
                }
            }
        }
        s.redraw(false)
    }, restoreZoom: function () {
        var e = this, b = e.axes.items, a, d, c;
        e.setSubStore(null);
        for (a = 0, d = b.length; a < d; a++) {
            c = b[a];
            delete c.minimum;
            delete c.maximum
        }
        e.redraw(false)
    }
});
Ext.define("Ext.chart.Shape", {
    singleton: true, circle: function (a, b) {
        return a.add(Ext.apply({type: "circle", x: b.x, y: b.y, stroke: null, radius: b.radius}, b))
    }, line: function (a, b) {
        return a.add(Ext.apply({
            type: "rect",
            x: b.x - b.radius,
            y: b.y - b.radius,
            height: 2 * b.radius,
            width: 2 * b.radius / 5
        }, b))
    }, square: function (a, b) {
        return a.add(Ext.applyIf({
            type: "rect",
            x: b.x - b.radius,
            y: b.y - b.radius,
            height: 2 * b.radius,
            width: 2 * b.radius,
            radius: null
        }, b))
    }, triangle: function (a, b) {
        b.radius *= 1.75;
        return a.add(Ext.apply({
            type: "path",
            stroke: null,
            path: "M".concat(b.x, ",", b.y, "m0-", b.radius * 0.58, "l", b.radius * 0.5, ",", b.radius * 0.87, "-", b.radius, ",0z")
        }, b))
    }, diamond: function (a, c) {
        var b = c.radius;
        b *= 1.5;
        return a.add(Ext.apply({
            type: "path",
            stroke: null,
            path: ["M", c.x, c.y - b, "l", b, b, -b, b, -b, -b, b, -b, "z"]
        }, c))
    }, cross: function (a, c) {
        var b = c.radius;
        b = b / 1.7;
        return a.add(Ext.apply({
            type: "path",
            stroke: null,
            path: "M".concat(c.x - b, ",", c.y, "l", [-b, -b, b, -b, b, b, b, -b, b, b, -b, b, b, b, -b, b, -b, -b, -b, b, -b, -b, "z"])
        }, c))
    }, plus: function (a, c) {
        var b = c.radius / 1.3;
        return a.add(Ext.apply({
            type: "path",
            stroke: null,
            path: "M".concat(c.x - b / 2, ",", c.y - b / 2, "l", [0, -b, b, 0, 0, b, b, 0, 0, b, -b, 0, 0, b, -b, 0, 0, -b, -b, 0, 0, -b, "z"])
        }, c))
    }, arrow: function (a, c) {
        var b = c.radius;
        return a.add(Ext.apply({
            type: "path",
            path: "M".concat(c.x - b * 0.7, ",", c.y - b * 0.4, "l", [b * 0.6, 0, 0, -b * 0.4, b, b * 0.8, -b, b * 0.8, 0, -b * 0.4, -b * 0.6, 0], "z")
        }, c))
    }, drop: function (b, a, f, e, c, d) {
        c = c || 30;
        d = d || 0;
        b.add({
            type: "path",
            path: ["M", a, f, "l", c, 0, "A", c * 0.4, c * 0.4, 0, 1, 0, a + c * 0.7, f - c * 0.7, "z"],
            fill: "#000",
            stroke: "none",
            rotate: {degrees: 22.5 - d, x: a, y: f}
        });
        d = (d + 90) * Math.PI / 180;
        b.add({
            type: "text",
            x: a + c * Math.sin(d) - 10,
            y: f + c * Math.cos(d) + 5,
            text: e,
            "font-size": c * 12 / 40,
            stroke: "none",
            fill: "#fff"
        })
    }
});
Ext.define("Ext.chart.LegendItem", {
    extend: "Ext.draw.CompositeSprite",
    requires: ["Ext.chart.Shape"],
    hiddenSeries: false,
    label: undefined,
    x: 0,
    y: 0,
    zIndex: 500,
    boldRe: /bold\s\d{1,}.*/i,
    constructor: function (a) {
        this.callParent(arguments);
        this.createLegend(a)
    },
    createLegend: function (b) {
        var d = this, c = d.series, a = b.yFieldIndex;
        d.label = d.createLabel(b);
        d.createSeriesMarkers(b);
        d.setAttributes({hidden: false}, true);
        d.yFieldIndex = a;
        d.on("mouseover", d.onMouseOver, d);
        d.on("mouseout", d.onMouseOut, d);
        d.on("mousedown", d.onMouseDown, d);
        if (!c.visibleInLegend(a)) {
            d.hiddenSeries = true;
            d.label.setAttributes({opacity: 0.5}, true)
        }
        d.updatePosition({x: 0, y: 0})
    },
    getLabelText: function () {
        var d = this, c = d.series, a = d.yFieldIndex;

        function b(e) {
            var f = c[e];
            return (Ext.isArray(f) ? f[a] : f)
        }

        return b("title") || b("yField")
    },
    createLabel: function (a) {
        var c = this, b = c.legend;
        return c.add("label", c.surface.add({
            type: "text",
            x: 20,
            y: 0,
            zIndex: (c.zIndex || 0) + 2,
            fill: b.labelColor,
            font: b.labelFont,
            text: c.getLabelText(),
            style: {cursor: "pointer"}
        }))
    },
    createSeriesMarkers: function (c) {
        var h = this, f = c.yFieldIndex, e = h.series, d = e.type, a = h.surface, g = h.zIndex;
        if (d === "line" || d === "scatter") {
            if (d === "line") {
                var j = Ext.apply(e.seriesStyle, e.style);
                h.drawLine(0.5, 0.5, 16.5, 0.5, g, j, f)
            }
            if (e.showMarkers || d === "scatter") {
                var b = Ext.apply(e.markerStyle, e.markerConfig || {}, {fill: e.getLegendColor(f)});
                h.drawMarker(8.5, 0.5, g, b)
            }
        } else {
            h.drawFilledBox(12, 12, g, f)
        }
    },
    drawLine: function (h, f, j, g, d, k, c) {
        var e = this, a = e.surface, b = e.series;
        return e.add("line", a.add({
            type: "path",
            path: "M" + h + "," + f + "L" + j + "," + g,
            zIndex: (d || 0) + 2,
            "stroke-width": b.lineWidth,
            "stroke-linejoin": "round",
            "stroke-dasharray": b.dash,
            stroke: k.stroke || b.getLegendColor(c) || "#000",
            style: {cursor: "pointer"}
        }))
    },
    drawMarker: function (b, g, f, e) {
        var d = this, a = d.surface, c = d.series;
        return d.add("marker", Ext.chart.Shape[e.type](a, {
            fill: e.fill,
            x: b,
            y: g,
            zIndex: (f || 0) + 2,
            radius: e.radius || e.size,
            style: {cursor: "pointer"}
        }))
    },
    drawFilledBox: function (e, b, g, c) {
        var f = this, a = f.surface, d = f.series;
        return f.add("box", a.add({
            type: "rect",
            zIndex: (g || 0) + 2,
            x: 0,
            y: 0,
            width: e,
            height: b,
            fill: d.getLegendColor(c),
            style: {cursor: "pointer"}
        }))
    },
    onMouseOver: function () {
        var a = this;
        a.label.setAttributes({"font-weight": "bold"}, true);
        a.series._index = a.yFieldIndex;
        a.series.highlightItem()
    },
    onMouseOut: function () {
        var b = this, a = b.legend, c = b.boldRe;
        b.label.setAttributes({"font-weight": a.labelFont && c.test(a.labelFont) ? "bold" : "normal"}, true);
        b.series._index = b.yFieldIndex;
        b.series.unHighlightItem()
    },
    onMouseDown: function () {
        var b = this, a = b.yFieldIndex;
        if (!b.hiddenSeries) {
            b.series.hideAll(a);
            b.label.setAttributes({opacity: 0.5}, true)
        } else {
            b.series.showAll(a);
            b.label.setAttributes({opacity: 1}, true)
        }
        b.hiddenSeries = !b.hiddenSeries;
        b.legend.chart.redraw()
    },
    updatePosition: function (e) {
        var l = this, k = l.items, j = k.length, c = l.x, b = l.y, p, f, n, m, d, a, h, g;
        if (!e) {
            e = l.legend
        }
        h = e.x;
        g = e.y;
        for (f = 0; f < j; f++) {
            d = true;
            p = k[f];
            switch (p.type) {
                case"text":
                    n = 20 + h + c;
                    m = g + b;
                    d = false;
                    break;
                case"rect":
                    n = h + c;
                    m = g + b - 6;
                    break;
                default:
                    n = h + c;
                    m = g + b
            }
            a = {x: n, y: m};
            p.setAttributes(d ? {translate: a} : a, true)
        }
    }
});
Ext.define("Ext.rtl.chart.LegendItem", {
    override: "Ext.chart.LegendItem", updatePosition: function (f) {
        var m = this, l = m.items, k = l.length, q = m.legend, d = m.x, c = m.y, r, g, p, n, e, b, a, j, h;
        if (!f) {
            f = q
        }
        if (!q.chart.getInherited().rtl || !f.width) {
            m.callParent(arguments);
            return
        }
        j = f.x;
        h = f.y;
        a = f.width;
        for (g = 0; g < k; g++) {
            e = true;
            r = l[g];
            switch (r.type) {
                case"text":
                    p = a + j + d - 30 - r.getBBox().width;
                    n = h + c;
                    e = false;
                    break;
                case"rect":
                    p = a + j + d - 25;
                    n = h + c - 6;
                    break;
                default:
                    p = a + j + d - 25;
                    n = h + c
            }
            b = {x: p, y: n};
            r.setAttributes(e ? {translate: b} : b, true)
        }
    }
});
Ext.define("Ext.chart.Legend", {
    requires: ["Ext.chart.LegendItem"],
    visible: true,
    update: true,
    position: "bottom",
    x: 0,
    y: 0,
    labelColor: "#000",
    labelFont: "12px Helvetica, sans-serif",
    boxStroke: "#000",
    boxStrokeWidth: 1,
    boxFill: "#FFF",
    itemSpacing: 10,
    padding: 5,
    width: 0,
    height: 0,
    boxZIndex: 100,
    constructor: function (a) {
        var b = this;
        if (a) {
            Ext.apply(b, a)
        }
        b.items = [];
        b.isVertical = ("left|right|float".indexOf(b.position) !== -1);
        b.origX = b.x;
        b.origY = b.y
    },
    create: function () {
        var e = this, a = e.chart.series.items, c, d, b;
        e.createBox();
        if (e.rebuild !== false) {
            e.createItems()
        }
        if (!e.created && e.isDisplayed()) {
            e.created = true;
            for (c = 0, d = a.length; c < d; c++) {
                b = a[c];
                b.on("titlechange", e.redraw, e)
            }
        }
    },
    init: Ext.emptyFn,
    redraw: function () {
        var a = this;
        a.create();
        a.updatePosition()
    },
    isDisplayed: function () {
        return this.visible && this.chart.series.findIndex("showInLegend", true) !== -1
    },
    createItems: function () {
        var g = this, d = g.chart.series.items, f = g.items, e, c, k, a, h, b, l;
        g.removeItems();
        for (c = 0, k = d.length; c < k; c++) {
            b = d[c];
            if (b.showInLegend) {
                e = [].concat(b.yField);
                for (a = 0, h = e.length; a < h; a++) {
                    l = g.createLegendItem(b, a);
                    f.push(l)
                }
            }
        }
        g.alignItems()
    },
    removeItems: function () {
        var d = this, b = d.items, a = b ? b.length : 0, c;
        if (a) {
            for (c = 0; c < a; c++) {
                b[c].destroy()
            }
        }
        b.length = []
    },
    alignItems: function () {
        var e = this, f = e.padding, a = e.isVertical, j = Math.floor, b, g, h, c, d;
        b = e.updateItemDimensions();
        g = b.maxWidth;
        h = b.maxHeight;
        c = b.totalWidth;
        d = b.totalHeight;
        e.width = j((a ? g : c) + f * 2) + 10;
        e.height = j((a ? d : h) + f * 2)
    },
    updateItemDimensions: function () {
        var r = this, h = r.items, f = r.padding, s = r.itemSpacing, o = 0, j = 0, d = 0, q = 0, b = r.isVertical, c = Math.floor, t = Math.max, e = 0, n, m, p, a, k, g;
        for (n = 0, m = h.length; n < m; n++) {
            p = h[n];
            a = p.getBBox();
            k = a.width;
            g = a.height;
            e = (n === 0 ? 0 : s);
            p.x = f + c(b ? 0 : d + e);
            p.y = f + c(b ? q + e : 0) + g / 2;
            d += e + k;
            q += e + g;
            o = t(o, k);
            j = t(j, g)
        }
        return {totalWidth: d, totalHeight: q, maxWidth: o, maxHeight: j}
    },
    createLegendItem: function (b, a) {
        var c = this;
        return new Ext.chart.LegendItem({legend: c, series: b, surface: c.chart.surface, yFieldIndex: a})
    },
    getBBox: function () {
        var a = this;
        return {
            x: Math.round(a.x) - a.boxStrokeWidth / 2,
            y: Math.round(a.y) - a.boxStrokeWidth / 2,
            width: a.width + a.boxStrokeWidth,
            height: a.height + a.boxStrokeWidth
        }
    },
    createBox: function () {
        var b = this, a, c;
        if (b.boxSprite) {
            b.boxSprite.destroy()
        }
        c = b.getBBox();
        if (isNaN(c.width) || isNaN(c.height)) {
            b.boxSprite = false;
            return
        }
        a = b.boxSprite = b.chart.surface.add(Ext.apply({
            type: "rect",
            stroke: b.boxStroke,
            "stroke-width": b.boxStrokeWidth,
            fill: b.boxFill,
            zIndex: b.boxZIndex
        }, c));
        a.redraw()
    },
    calcPosition: function () {
        var h = this, k, j, m = h.width, l = h.height, g = h.chart, n = g.chartBBox, b = g.insetPadding, d = n.width - (b * 2), c = n.height - (b * 2), f = n.x + b, e = n.y + b, a = g.surface, o = Math.floor;
        switch (h.position) {
            case"left":
                k = b;
                j = o(e + c / 2 - l / 2);
                break;
            case"right":
                k = o(a.width - m) - b;
                j = o(e + c / 2 - l / 2);
                break;
            case"top":
                k = o(f + d / 2 - m / 2);
                j = b;
                break;
            case"bottom":
                k = o(f + d / 2 - m / 2);
                j = o(a.height - l) - b;
                break;
            default:
                k = o(h.origX) + b;
                j = o(h.origY) + b
        }
        return {x: k, y: j}
    },
    updatePosition: function () {
        var d = this, b = d.items, f, c, a, e;
        if (d.isDisplayed()) {
            f = d.calcPosition();
            d.x = f.x;
            d.y = f.y;
            for (c = 0, a = b.length; c < a; c++) {
                b[c].updatePosition()
            }
            e = d.getBBox();
            if (isNaN(e.width) || isNaN(e.height)) {
                if (d.boxSprite) {
                    d.boxSprite.hide(true)
                }
            } else {
                if (!d.boxSprite) {
                    d.createBox()
                }
                d.boxSprite.setAttributes(e, true);
                d.boxSprite.show(true)
            }
        }
    },
    toggle: function (b) {
        var e = this, d = 0, c = e.items, a = c.length;
        if (e.boxSprite) {
            if (b) {
                e.boxSprite.show(true)
            } else {
                e.boxSprite.hide(true)
            }
        }
        for (; d < a; ++d) {
            if (b) {
                c[d].show(true)
            } else {
                c[d].hide(true)
            }
        }
        e.visible = b
    }
});
Ext.define("Ext.rtl.chart.Legend", {
    override: "Ext.chart.Legend", init: function () {
        var a = this;
        a.callParent(arguments);
        a.position = a.chart.invertPosition(a.position);
        a.rtl = a.chart.getInherited().rtl
    }, updateItemDimensions: function () {
        var h = this, m = h.callParent(), j = h.padding, g = h.itemSpacing, f = h.items, d = f.length, l = Math.floor, a = m.totalWidth, b = 0, c, k, e;
        if (h.rtl && !h.isVertical) {
            for (c = 0; c < d; ++c) {
                k = f[c];
                e = l(k.getBBox().width + g);
                k.x = -b + j;
                b += e
            }
        }
        return m
    }
});
Ext.define("Ext.chart.theme.Base", {
    requires: ["Ext.chart.theme.Theme"], constructor: function (a) {
        var b = Ext.identityFn;
        Ext.chart.theme.call(this, a, {
            background: false,
            axis: {stroke: "#444", "stroke-width": 1},
            axisLabelTop: {
                fill: "#444",
                font: "12px Arial, Helvetica, sans-serif",
                spacing: 2,
                padding: 5,
                renderer: b
            },
            axisLabelRight: {
                fill: "#444",
                font: "12px Arial, Helvetica, sans-serif",
                spacing: 2,
                padding: 5,
                renderer: b
            },
            axisLabelBottom: {
                fill: "#444",
                font: "12px Arial, Helvetica, sans-serif",
                spacing: 2,
                padding: 5,
                renderer: b
            },
            axisLabelLeft: {
                fill: "#444",
                font: "12px Arial, Helvetica, sans-serif",
                spacing: 2,
                padding: 5,
                renderer: b
            },
            axisTitleTop: {font: "bold 18px Arial", fill: "#444"},
            axisTitleRight: {font: "bold 18px Arial", fill: "#444", rotate: {x: 0, y: 0, degrees: 270}},
            axisTitleBottom: {font: "bold 18px Arial", fill: "#444"},
            axisTitleLeft: {font: "bold 18px Arial", fill: "#444", rotate: {x: 0, y: 0, degrees: 270}},
            series: {"stroke-width": 0},
            seriesLabel: {font: "12px Arial", fill: "#333"},
            marker: {stroke: "#555", radius: 3, size: 3},
            colors: ["#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"],
            seriesThemes: [{fill: "#94ae0a"}, {fill: "#115fa6"}, {fill: "#a61120"}, {fill: "#ff8809"}, {fill: "#ffd13e"}, {fill: "#a61187"}, {fill: "#24ad9a"}, {fill: "#7c7474"}, {fill: "#115fa6"}, {fill: "#94ae0a"}, {fill: "#a61120"}, {fill: "#ff8809"}, {fill: "#ffd13e"}, {fill: "#a61187"}, {fill: "#24ad9a"}, {fill: "#7c7474"}, {fill: "#a66111"}],
            markerThemes: [{fill: "#115fa6", type: "circle"}, {fill: "#94ae0a", type: "cross"}, {
                fill: "#115fa6",
                type: "plus"
            }, {fill: "#94ae0a", type: "circle"}, {fill: "#a61120", type: "cross"}]
        })
    }
}, function () {
    var c = ["#b1da5a", "#4ce0e7", "#e84b67", "#da5abd", "#4d7fe6", "#fec935"], h = ["Green", "Sky", "Red", "Purple", "Blue", "Yellow"], g = 0, f = 0, b = c.length, a = Ext.chart.theme, d = [["#f0a50a", "#c20024", "#2044ba", "#810065", "#7eae29"], ["#6d9824", "#87146e", "#2a9196", "#d39006", "#1e40ac"], ["#fbbc29", "#ce2e4e", "#7e0062", "#158b90", "#57880e"], ["#ef5773", "#fcbd2a", "#4f770d", "#1d3eaa", "#9b001f"], ["#7eae29", "#fdbe2a", "#910019", "#27b4bc", "#d74dbc"], ["#44dce1", "#0b2592", "#996e05", "#7fb325", "#b821a1"]], e = d.length;
    for (; g < b; g++) {
        a[h[g]] = (function (j) {
            return Ext.extend(a.Base, {
                constructor: function (k) {
                    a.Base.prototype.constructor.call(this, Ext.apply({baseColor: j}, k))
                }
            })
        }(c[g]))
    }
    for (g = 0; g < e; g++) {
        a["Category" + (g + 1)] = (function (j) {
            return Ext.extend(a.Base, {
                constructor: function (k) {
                    a.Base.prototype.constructor.call(this, Ext.apply({colors: j}, k))
                }
            })
        }(d[g]))
    }
});
Ext.define("Ext.chart.Chart", {
    extend: "Ext.draw.Component",
    alias: "widget.chart",
    mixins: ["Ext.chart.theme.Theme", "Ext.chart.Mask", "Ext.chart.Navigation", "Ext.util.StoreHolder", "Ext.util.Observable"],
    uses: ["Ext.chart.series.Series"],
    requires: ["Ext.util.MixedCollection", "Ext.data.StoreManager", "Ext.chart.Legend", "Ext.chart.theme.Base", "Ext.chart.theme.Theme", "Ext.util.DelayedTask"],
    viewBox: false,
    animate: false,
    legend: false,
    insetPadding: 10,
    background: false,
    refreshBuffer: 1,
    constructor: function (b) {
        var c = this, a;
        b = Ext.apply({}, b);
        c.initTheme(b.theme || c.theme);
        if (c.gradients) {
            Ext.apply(b, {gradients: c.gradients})
        }
        if (c.background) {
            Ext.apply(b, {background: c.background})
        }
        if (b.animate) {
            a = {easing: "ease", duration: 500};
            if (Ext.isObject(b.animate)) {
                b.animate = Ext.applyIf(b.animate, a)
            } else {
                b.animate = a
            }
        }
        c.mixins.observable.constructor.call(c, b);
        if (b.mask) {
            b = Ext.apply({enableMask: true}, b)
        }
        if (b.enableMask) {
            c.mixins.mask.constructor.call(c, b)
        }
        c.mixins.navigation.constructor.call(c);
        c.callParent([b])
    },
    getChartStore: function () {
        return this.substore || this.store
    },
    initComponent: function () {
        var b = this, c, a;
        b.callParent();
        Ext.applyIf(b, {zoom: {width: 1, height: 1, x: 0, y: 0}});
        b.maxGutters = {left: 0, right: 0, bottom: 0, top: 0};
        b.store = Ext.data.StoreManager.lookup(b.store);
        c = b.axes;
        b.axes = new Ext.util.MixedCollection(false, function (d) {
            return d.position
        });
        if (c) {
            b.axes.addAll(c)
        }
        a = b.series;
        b.series = new Ext.util.MixedCollection(false, function (d) {
            return d.seriesId || (d.seriesId = Ext.id(null, "ext-chart-series-"))
        });
        if (a) {
            b.series.addAll(a)
        }
        if (b.legend !== false) {
            b.legend = new Ext.chart.Legend(Ext.applyIf({chart: b}, b.legend))
        }
        b.on({
            mousemove: b.onMouseMove,
            mouseleave: b.onMouseLeave,
            mousedown: b.onMouseDown,
            mouseup: b.onMouseUp,
            click: b.onClick,
            dblclick: b.onDblClick,
            scope: b
        })
    },
    afterComponentLayout: function (c, a, b, e) {
        var d = this;
        if (Ext.isNumber(c) && Ext.isNumber(a)) {
            if (c !== b || a !== e) {
                d.curWidth = c;
                d.curHeight = a;
                d.redraw(true);
                d.needsRedraw = false
            } else {
                if (d.needsRedraw) {
                    d.redraw();
                    d.needsRedraw = false
                }
            }
        }
        this.callParent(arguments)
    },
    redraw: function (c) {
        var j = this, h = j.series.items, f = h.length, b = j.axes.items, d = b.length, a = 0, g, m, l = j.chartBBox = {
            x: 0,
            y: 0,
            height: j.curHeight,
            width: j.curWidth
        }, k = j.legend, e;
        j.surface.setSize(l.width, l.height);
        for (g = 0; g < f; g++) {
            m = h[g];
            if (!m.initialized) {
                e = j.initializeSeries(m, g, a)
            } else {
                e = m
            }
            e.onRedraw();
            if (Ext.isArray(m.yField)) {
                a += m.yField.length
            } else {
                ++a
            }
        }
        for (g = 0; g < d; g++) {
            m = b[g];
            if (!m.initialized) {
                j.initializeAxis(m)
            }
        }
        for (g = 0; g < d; g++) {
            b[g].processView()
        }
        for (g = 0; g < d; g++) {
            b[g].drawAxis(true)
        }
        if (k !== false && k.visible) {
            if (k.update || !k.created) {
                k.create()
            }
        }
        j.alignAxes();
        if (k !== false && k.visible) {
            k.updatePosition()
        }
        j.getMaxGutters();
        j.resizing = !!c;
        for (g = 0; g < d; g++) {
            b[g].drawAxis()
        }
        for (g = 0; g < f; g++) {
            j.drawCharts(h[g])
        }
        j.resizing = false
    },
    afterRender: function () {
        var b = this, a = b.legend;
        b.callParent(arguments);
        if (b.categoryNames) {
            b.setCategoryNames(b.categoryNames)
        }
        if (a) {
            a.init()
        }
        b.bindStore(b.store, true);
        b.refresh();
        if (b.surface.engine === "Vml") {
            b.on("added", b.onAddedVml, b);
            b.mon(Ext.GlobalEvents, "added", b.onContainerAddedVml, b)
        }
    },
    onAddedVml: function () {
        this.needsRedraw = true
    },
    onContainerAddedVml: function (a) {
        if (this.isDescendantOf(a)) {
            this.needsRedraw = true
        }
    },
    getEventXY: function (c) {
        var b = this.surface.getRegion(), f = c.getXY(), a = f[0] - b.left, d = f[1] - b.top;
        return [a, d]
    },
    onClick: function (a) {
        this.handleClick("itemclick", a)
    },
    onDblClick: function (a) {
        this.handleClick("itemdblclick", a)
    },
    handleClick: function (a, g) {
        var j = this, f = j.getEventXY(g), d = j.series.items, b, h, c, k;
        for (b = 0, h = d.length; b < h; b++) {
            c = d[b];
            if (Ext.draw.Draw.withinBox(f[0], f[1], c.bbox)) {
                if (c.getItemForPoint) {
                    k = c.getItemForPoint(f[0], f[1]);
                    if (k) {
                        c.fireEvent(a, k)
                    }
                }
            }
        }
    },
    onMouseDown: function (j) {
        var h = this, a = h.getEventXY(j), b = h.series.items, d, g, c, f;
        if (h.enableMask) {
            h.mixins.mask.onMouseDown.call(h, j)
        }
        for (d = 0, g = b.length; d < g; d++) {
            c = b[d];
            if (Ext.draw.Draw.withinBox(a[0], a[1], c.bbox)) {
                if (c.getItemForPoint) {
                    f = c.getItemForPoint(a[0], a[1]);
                    if (f) {
                        c.fireEvent("itemmousedown", f)
                    }
                }
            }
        }
    },
    onMouseUp: function (j) {
        var h = this, a = h.getEventXY(j), b = h.series.items, d, g, c, f;
        if (h.enableMask) {
            h.mixins.mask.onMouseUp.call(h, j)
        }
        for (d = 0, g = b.length; d < g; d++) {
            c = b[d];
            if (Ext.draw.Draw.withinBox(a[0], a[1], c.bbox)) {
                if (c.getItemForPoint) {
                    f = c.getItemForPoint(a[0], a[1]);
                    if (f) {
                        c.fireEvent("itemmouseup", f)
                    }
                }
            }
        }
    },
    onMouseMove: function (g) {
        var j = this, d = j.getEventXY(g), c = j.series.items, a, h, b, m, k, f, l;
        if (j.enableMask) {
            j.mixins.mask.onMouseMove.call(j, g)
        }
        for (a = 0, h = c.length; a < h; a++) {
            b = c[a];
            if (Ext.draw.Draw.withinBox(d[0], d[1], b.bbox)) {
                if (b.getItemForPoint) {
                    m = b.getItemForPoint(d[0], d[1]);
                    k = b._lastItemForPoint;
                    f = b._lastStoreItem;
                    l = b._lastStoreField;
                    if (m !== k || m && (m.storeItem != f || m.storeField != l)) {
                        if (k) {
                            b.fireEvent("itemmouseout", k);
                            delete b._lastItemForPoint;
                            delete b._lastStoreField;
                            delete b._lastStoreItem
                        }
                        if (m) {
                            b.fireEvent("itemmouseover", m);
                            b._lastItemForPoint = m;
                            b._lastStoreItem = m.storeItem;
                            b._lastStoreField = m.storeField
                        }
                    }
                }
            } else {
                k = b._lastItemForPoint;
                if (k) {
                    b.fireEvent("itemmouseout", k);
                    delete b._lastItemForPoint;
                    delete b._lastStoreField;
                    delete b._lastStoreItem
                }
            }
        }
    },
    onMouseLeave: function (g) {
        var f = this, a = f.series.items, c, d, b;
        if (f.enableMask) {
            f.mixins.mask.onMouseLeave.call(f, g)
        }
        for (c = 0, d = a.length; c < d; c++) {
            b = a[c];
            delete b._lastItemForPoint
        }
    },
    delayRefresh: function () {
        var a = this;
        if (!a.refreshTask) {
            a.refreshTask = new Ext.util.DelayedTask(a.refresh, a)
        }
        a.refreshTask.delay(a.refreshBuffer)
    },
    refresh: function () {
        var a = this;
        if (a.rendered && a.curWidth !== undefined && a.curHeight !== undefined) {
            if (!a.isVisible(true)) {
                if (!a.refreshPending) {
                    a.setShowListeners("mon");
                    a.refreshPending = true
                }
                return
            }
            if (a.fireEvent("beforerefresh", a) !== false) {
                a.redraw();
                a.fireEvent("refresh", a)
            }
        }
    },
    onShow: function () {
        var a = this;
        a.callParent(arguments);
        if (a.refreshPending) {
            a.delayRefresh();
            a.setShowListeners("mun")
        }
        delete a.refreshPending
    },
    setShowListeners: function (b) {
        var a = this;
        a[b](Ext.GlobalEvents, {scope: a, single: true, show: a.forceRefresh, expand: a.forceRefresh})
    },
    doRefresh: function () {
        this.setSubStore(null);
        this.refresh()
    },
    forceRefresh: function (a) {
        var b = this;
        if (b.isDescendantOf(a) && b.refreshPending) {
            b.setShowListeners("mun");
            b.delayRefresh()
        }
        delete b.refreshPending
    },
    bindStore: function (a, b) {
        var c = this;
        c.mixins.storeholder.bindStore.apply(c, arguments);
        if (c.store && !b) {
            c.refresh()
        }
    },
    getStoreListeners: function () {
        var b = this.doRefresh, a = this.delayRefresh;
        return {refresh: b, add: a, remove: a, update: a, clear: b}
    },
    setSubStore: function (a) {
        this.substore = a
    },
    initializeAxis: function (b) {
        var f = this, l = f.chartBBox, k = l.width, d = l.height, j = l.x, g = l.y, c = f.themeAttrs, e = f.axes, a = {chart: f};
        if (c) {
            a.axisStyle = Ext.apply({}, c.axis);
            a.axisLabelLeftStyle = Ext.apply({}, c.axisLabelLeft);
            a.axisLabelRightStyle = Ext.apply({}, c.axisLabelRight);
            a.axisLabelTopStyle = Ext.apply({}, c.axisLabelTop);
            a.axisLabelBottomStyle = Ext.apply({}, c.axisLabelBottom);
            a.axisTitleLeftStyle = Ext.apply({}, c.axisTitleLeft);
            a.axisTitleRightStyle = Ext.apply({}, c.axisTitleRight);
            a.axisTitleTopStyle = Ext.apply({}, c.axisTitleTop);
            a.axisTitleBottomStyle = Ext.apply({}, c.axisTitleBottom);
            f.configureAxisStyles(a)
        }
        switch (b.position) {
            case"top":
                Ext.apply(a, {length: k, width: d, x: j, y: g});
                break;
            case"bottom":
                Ext.apply(a, {length: k, width: d, x: j, y: d});
                break;
            case"left":
                Ext.apply(a, {length: d, width: k, x: j, y: d});
                break;
            case"right":
                Ext.apply(a, {length: d, width: k, x: k, y: d});
                break
        }
        if (!b.chart) {
            Ext.apply(a, b);
            b = Ext.createByAlias("axis." + b.type.toLowerCase(), a);
            e.replace(b)
        } else {
            Ext.apply(b, a)
        }
        b.initialized = true
    },
    configureAxisStyles: Ext.emptyFn,
    getInsets: function () {
        var b = this, a = b.insetPadding;
        return {top: a, right: a, bottom: a, left: a}
    },
    calculateInsets: function () {
        var j = this, m = j.legend, h = j.axes, f = ["top", "right", "bottom", "left"], d, g, e, a, k, c, n;

        function b(o) {
            var l = h.findIndex("position", o);
            return (l < 0) ? null : h.getAt(l)
        }

        d = j.getInsets();
        for (g = 0, e = f.length; g < e; g++) {
            a = f[g];
            k = (a === "left" || a === "right");
            c = b(a);
            if (m !== false) {
                if (m.position === a) {
                    n = m.getBBox();
                    d[a] += (k ? n.width : n.height) + j.insetPadding
                }
            }
            if (c && c.bbox) {
                n = c.bbox;
                d[a] += (k ? n.width : n.height)
            }
        }
        return d
    },
    alignAxes: function () {
        var f = this, a = f.axes.items, c, j, e, d, b, g, h;
        c = f.calculateInsets();
        j = {x: c.left, y: c.top, width: f.curWidth - c.left - c.right, height: f.curHeight - c.top - c.bottom};
        f.chartBBox = j;
        for (e = 0, d = a.length; e < d; e++) {
            b = a[e];
            g = b.position;
            h = g === "left" || g === "right";
            b.x = (g === "right" ? j.x + j.width : j.x);
            b.y = (g === "top" ? j.y : j.y + j.height);
            b.width = (h ? j.width : j.height);
            b.length = (h ? j.height : j.width)
        }
    },
    initializeSeries: function (h, k, a) {
        var j = this, f = j.themeAttrs, d, g, n, p, o, m = [], e = (h instanceof Ext.chart.series.Series).i = 0, c, b;
        if (!h.initialized) {
            b = {chart: j, seriesId: h.seriesId};
            if (f) {
                n = f.seriesThemes;
                o = f.markerThemes;
                d = Ext.apply({}, f.series);
                g = Ext.apply({}, f.marker);
                b.seriesStyle = Ext.apply(d, n[a % n.length]);
                b.seriesLabelStyle = Ext.apply({}, f.seriesLabel);
                b.markerStyle = Ext.apply(g, o[a % o.length]);
                if (f.colors) {
                    b.colorArrayStyle = f.colors
                } else {
                    m = [];
                    for (c = n.length; i < c; i++) {
                        p = n[i];
                        if (p.fill || p.stroke) {
                            m.push(p.fill || p.stroke)
                        }
                    }
                    if (m.length) {
                        b.colorArrayStyle = m
                    }
                }
                b.seriesIdx = k;
                b.themeIdx = a
            }
            if (e) {
                Ext.applyIf(h, b)
            } else {
                Ext.applyIf(b, h);
                h = j.series.replace(Ext.createByAlias("series." + h.type.toLowerCase(), b))
            }
        }
        h.initialize();
        h.initialized = true;
        return h
    },
    getMaxGutters: function () {
        var h = this, e = h.series.items, b, g, c, j, f = 0, a = 0, k = 0, d = 0;
        for (b = 0, g = e.length; b < g; b++) {
            j = e[b].getGutters();
            if (j) {
                if (j.verticalAxis) {
                    k = Math.max(k, j.lower);
                    d = Math.max(d, j.upper)
                } else {
                    f = Math.max(f, j.lower);
                    a = Math.max(a, j.upper)
                }
            }
        }
        h.maxGutters = {left: f, right: a, bottom: k, top: d}
    },
    drawAxis: function (a) {
        a.drawAxis()
    },
    drawCharts: function (a) {
        a.triggerafterrender = false;
        a.drawSeries();
        if (!this.animate) {
            a.fireEvent("afterrender", a)
        }
    },
    save: function (a) {
        return Ext.draw.Surface.save(this.surface, a)
    },
    destroy: function () {
        var b = this, a = b.refreshTask;
        if (a) {
            a.cancel();
            b.refreshTask = null
        }
        b.bindStore(null);
        b.callParent(arguments)
    }
});
Ext.define("Ext.rtl.chart.Chart", {
    override: "Ext.chart.Chart", initSurfaceCfg: function (a) {
        this.callParent(arguments);
        a.forceLtr = true
    }, configureAxisStyles: function (b) {
        var a;
        if (this.getInherited().rtl) {
            a = b.axisLabelLeftStyle;
            b.axisLabelLeftStyle = b.axisLabelRightStyle;
            b.axisLabelRightStyle = a;
            a = b.axisTitleLeftStyle;
            b.axisTitleLeftStyle = b.axisTitleRightStyle;
            b.axisTitleRightStyle = a
        }
    }, beforeRender: function () {
        var e = this, f = e.axes, b, c, a, d;
        if (e.getInherited().rtl) {
            e.rtlEvent = !e.isOppositeRootDirection();
            b = f.getRange();
            f.removeAll();
            for (c = 0, a = b.length; c < a; ++c) {
                d = b[c];
                d.position = this.invertPosition(d.position);
                f.add(d)
            }
        }
        e.callParent(arguments)
    }, invertPosition: function (d) {
        if (Ext.isArray(d)) {
            var b = [], a = d.length, c;
            for (c = 0; c < a; ++c) {
                b.push(this.invertPosition(d[c]))
            }
            return b
        }
        if (this.getInherited().rtl) {
            if (d == "left") {
                d = "right"
            } else {
                if (d == "right") {
                    d = "left"
                }
            }
        }
        return d
    }, getEventXY: function (d) {
        var c, g, a, f, b;
        if (this.rtlEvent) {
            c = this.surface.getRegion();
            g = d.getXY();
            b = c.right - c.left;
            a = b - (g[0] - c.left);
            f = g[1] - c.top;
            return [a, f]
        } else {
            return this.callParent(arguments)
        }
    }
});
Ext.define("Ext.chart.Highlight", {
    requires: ["Ext.fx.Anim"],
    highlight: false,
    highlightCfg: {fill: "#fdd", "stroke-width": 5, stroke: "#f55"},
    constructor: function (a) {
        if (a.highlight && (typeof a.highlight !== "boolean")) {
            this.highlightCfg = Ext.merge({}, this.highlightCfg, a.highlight)
        }
    },
    highlightItem: function (k) {
        if (!k) {
            return
        }
        var f = this, j = k.sprite, a = Ext.merge({}, f.highlightCfg, f.highlight), d = f.chart.surface, c = f.chart.animate, b, h, g, e;
        if (!f.highlight || !j || j._highlighted) {
            return
        }
        if (j._anim) {
            j._anim.paused = true
        }
        j._highlighted = true;
        if (!j._defaults) {
            j._defaults = Ext.apply({}, j.attr);
            h = {};
            g = {};
            for (b in a) {
                if (!(b in j._defaults)) {
                    j._defaults[b] = d.availableAttrs[b]
                }
                h[b] = j._defaults[b];
                g[b] = a[b];
                if (Ext.isObject(a[b])) {
                    h[b] = {};
                    g[b] = {};
                    Ext.apply(j._defaults[b], j.attr[b]);
                    Ext.apply(h[b], j._defaults[b]);
                    for (e in j._defaults[b]) {
                        if (!(e in a[b])) {
                            g[b][e] = h[b][e]
                        } else {
                            g[b][e] = a[b][e]
                        }
                    }
                    for (e in a[b]) {
                        if (!(e in g[b])) {
                            g[b][e] = a[b][e]
                        }
                    }
                }
            }
            j._from = h;
            j._to = g;
            j._endStyle = g
        }
        if (c) {
            j._anim = new Ext.fx.Anim({target: j, from: j._from, to: j._to, duration: 150})
        } else {
            j.setAttributes(j._to, true)
        }
    },
    unHighlightItem: function () {
        if (!this.highlight || !this.items) {
            return
        }
        var h = this, g = h.items, f = g.length, a = Ext.merge({}, h.highlightCfg, h.highlight), c = h.chart.animate, e = 0, d, b, j;
        for (; e < f; e++) {
            if (!g[e]) {
                continue
            }
            j = g[e].sprite;
            if (j && j._highlighted) {
                if (j._anim) {
                    j._anim.paused = true
                }
                d = {};
                for (b in a) {
                    if (Ext.isObject(j._defaults[b])) {
                        d[b] = Ext.apply({}, j._defaults[b])
                    } else {
                        d[b] = j._defaults[b]
                    }
                }
                if (c) {
                    j._endStyle = d;
                    j._anim = new Ext.fx.Anim({target: j, to: d, duration: 150})
                } else {
                    j.setAttributes(d, true)
                }
                delete j._highlighted
            }
        }
    },
    cleanHighlights: function () {
        if (!this.highlight) {
            return
        }
        var d = this.group, c = this.markerGroup, b = 0, a;
        for (a = d.getCount(); b < a; b++) {
            delete d.getAt(b)._defaults
        }
        if (c) {
            for (a = c.getCount(); b < a; b++) {
                delete c.getAt(b)._defaults
            }
        }
    }
});
Ext.define("Ext.chart.Label", {
    requires: ["Ext.draw.Color"],
    colorStringRe: /url\s*\(\s*#([^\/)]+)\s*\)/,
    constructor: function (a) {
        var b = this;
        b.label = Ext.applyIf(b.label || {}, {
            display: "none",
            stackedDisplay: "none",
            color: "#000",
            field: "name",
            minMargin: 50,
            font: "11px Helvetica, sans-serif",
            orientation: "horizontal",
            renderer: Ext.identityFn
        });
        if (b.label.display !== "none") {
            b.labelsGroup = b.chart.surface.getGroup(b.seriesId + "-labels")
        }
    },
    renderLabels: function () {
        var p = this, Q = p.chart, z = Q.gradients, s = p.items, L = Q.animate, D = p.label, v = D.display, d = D.stackedDisplay, y = D.renderer, w = D.color, e = [].concat(D.field), r = p.labelsGroup, l = (r || 0) && r.length, b = p.chart.getChartStore(), q = b.getCount(), h = (s || 0) && s.length, G = h / q, C = (z || 0) && z.length, m = Ext.draw.Color, P = [], o, O, I, c, B, N, K, f, g, u, x, J, R, t, T, F, E, a, A, S, H, n, M;
        if (v == "none" || !r) {
            return
        }
        if (h == 0) {
            while (l--) {
                P.push(l)
            }
        } else {
            for (O = 0, I = 0, c = 0; O < q; O++) {
                B = 0;
                for (N = 0; N < G; N++) {
                    x = s[I];
                    J = r.getAt(c);
                    R = b.getAt(O);
                    while (this.__excludes && this.__excludes[B]) {
                        B++
                    }
                    if (!x && J) {
                        J.hide(true);
                        c++
                    }
                    if (x && e[N]) {
                        if (!J) {
                            J = p.onCreateLabel(R, x, O, v);
                            if (!J) {
                                break
                            }
                        }
                        J.setAttributes({fill: String(w)}, true);
                        p.onPlaceLabel(J, R, x, O, v, L, B);
                        c++;
                        if (D.contrast && x.sprite) {
                            t = x.sprite;
                            if (L && t._endStyle) {
                                a = t._endStyle.fill
                            } else {
                                if (L && t._to) {
                                    a = t._to.fill
                                } else {
                                    a = t.attr.fill
                                }
                            }
                            a = a || t.attr.fill;
                            T = m.fromString(a);
                            if (a && !T) {
                                a = a.match(p.colorStringRe)[1];
                                for (K = 0; K < C; K++) {
                                    o = z[K];
                                    if (o.id == a) {
                                        u = 0;
                                        f = 0;
                                        for (g in o.stops) {
                                            u++;
                                            f += m.fromString(o.stops[g].color).getGrayscale()
                                        }
                                        F = (f / u) / 255;
                                        break
                                    }
                                }
                            } else {
                                F = T.getGrayscale() / 255
                            }
                            if (J.isOutside) {
                                F = 1
                            }
                            E = m.fromString(J.attr.fill || J.attr.color).getHSL();
                            E[2] = F > 0.5 ? 0.2 : 0.8;
                            J.setAttributes({fill: String(m.fromHSL.apply({}, E))}, true)
                        }
                        if (p.stacked && d && (x.totalPositiveValues || x.totalNegativeValues)) {
                            S = (x.totalPositiveValues || 0);
                            H = (x.totalNegativeValues || 0);
                            A = S + H;
                            if (d == "total") {
                                n = y(A)
                            } else {
                                if (d == "balances") {
                                    if (S == 0 && H == 0) {
                                        n = y(0)
                                    } else {
                                        n = y(S);
                                        M = y(H)
                                    }
                                }
                            }
                            if (n) {
                                J = r.getAt(c);
                                if (!J) {
                                    J = p.onCreateLabel(R, x, O, "over")
                                }
                                E = m.fromString(J.attr.color || J.attr.fill).getHSL();
                                J.setAttributes({text: n, style: D.font, fill: String(m.fromHSL.apply({}, E))}, true);
                                p.onPlaceLabel(J, R, x, O, "over", L, B);
                                c++
                            }
                            if (M) {
                                J = r.getAt(c);
                                if (!J) {
                                    J = p.onCreateLabel(R, x, O, "under")
                                }
                                E = m.fromString(J.attr.color || J.attr.fill).getHSL();
                                J.setAttributes({text: M, style: D.font, fill: String(m.fromHSL.apply({}, E))}, true);
                                p.onPlaceLabel(J, R, x, O, "under", L, B);
                                c++
                            }
                        }
                    }
                    I++;
                    B++
                }
            }
            l = r.length;
            while (l > c) {
                P.push(c);
                c++
            }
        }
        p.hideLabels(P)
    },
    hideLabels: function (b) {
        var a = this.labelsGroup, c = !!b && b.length;
        if (!a) {
            return
        }
        if (c === false) {
            c = a.getCount();
            while (c--) {
                a.getAt(c).hide(true)
            }
        } else {
            while (c--) {
                a.getAt(b[c]).hide(true)
            }
        }
    }
});
Ext.define("Ext.chart.TipSurface", {
    extend: "Ext.draw.Component",
    spriteArray: false,
    renderFirst: true,
    constructor: function (a) {
        this.callParent([a]);
        if (a.sprites) {
            this.spriteArray = [].concat(a.sprites);
            delete a.sprites
        }
    },
    onRender: function () {
        var c = this, b = 0, a = 0, d, e;
        this.callParent(arguments);
        e = c.spriteArray;
        if (c.renderFirst && e) {
            c.renderFirst = false;
            for (a = e.length; b < a; b++) {
                d = c.surface.add(e[b]);
                d.setAttributes({hidden: false}, true)
            }
        }
    }
});
Ext.define("Ext.chart.Tip", {
    requires: ["Ext.tip.ToolTip", "Ext.chart.TipSurface"], constructor: function (b) {
        var c = this, a, d, e;
        if (b.tips) {
            c.tipTimeout = null;
            c.tipConfig = Ext.apply({}, b.tips, {
                renderer: Ext.emptyFn,
                constrainPosition: true,
                autoHide: true,
                shrinkWrapDock: true
            });
            c.tooltip = new Ext.tip.ToolTip(c.tipConfig);
            c.chart.surface.on("mousemove", c.tooltip.onMouseMove, c.tooltip);
            c.chart.surface.on("mouseleave", function () {
                c.hideTip()
            });
            if (c.tipConfig.surface) {
                a = c.tipConfig.surface;
                d = a.sprites;
                e = new Ext.chart.TipSurface({id: "tipSurfaceComponent", sprites: d});
                if (a.width && a.height) {
                    e.setSize(a.width, a.height)
                }
                c.tooltip.add(e);
                c.spriteTip = e
            }
        }
    }, showTip: function (l) {
        var e = this, m, a, c, d, k, b, j, g, h, f;
        if (!e.tooltip) {
            return
        }
        clearTimeout(e.tipTimeout);
        m = e.tooltip;
        a = e.spriteTip;
        c = e.tipConfig;
        d = m.trackMouse;
        if (!d) {
            m.trackMouse = true;
            k = l.sprite;
            b = k.surface;
            j = Ext.get(b.getId());
            if (j) {
                g = j.getXY();
                h = g[0] + (k.attr.x || 0) + (k.attr.translation && k.attr.translation.x || 0);
                f = g[1] + (k.attr.y || 0) + (k.attr.translation && k.attr.translation.y || 0);
                m.targetXY = [h, f]
            }
        }
        if (a) {
            c.renderer.call(m, l.storeItem, l, a.surface)
        } else {
            c.renderer.call(m, l.storeItem, l)
        }
        m.delayShow(d);
        m.trackMouse = d
    }, hideTip: function (a) {
        var b = this.tooltip;
        if (!b) {
            return
        }
        clearTimeout(this.tipTimeout);
        this.tipTimeout = Ext.defer(function () {
            b.delayHide()
        }, 1)
    }
});
Ext.define("Ext.chart.axis.Abstract", {
    requires: ["Ext.chart.Chart"], constructor: function (a) {
        a = a || {};
        var b = this, c = a.position || "left";
        c = c.charAt(0).toUpperCase() + c.substring(1);
        a.label = Ext.apply(a["axisLabel" + c + "Style"] || {}, a.label || {});
        a.axisTitleStyle = Ext.apply(a["axisTitle" + c + "Style"] || {}, a.labelTitle || {});
        Ext.apply(b, a);
        b.fields = Ext.Array.from(b.fields);
        this.callParent();
        b.labels = [];
        b.getId();
        b.labelGroup = b.chart.surface.getGroup(b.axisId + "-labels")
    }, alignment: null, grid: false, steps: 10, x: 0, y: 0, minValue: 0, maxValue: 0, getId: function () {
        return this.axisId || (this.axisId = Ext.id(null, "ext-axis-"))
    }, processView: Ext.emptyFn, drawAxis: Ext.emptyFn, addDisplayAndLabels: Ext.emptyFn
});
Ext.define("Ext.draw.Draw", {
    singleton: true,
    requires: ["Ext.draw.Color"],
    pathToStringRE: /,?([achlmqrstvxz]),?/gi,
    pathCommandRE: /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
    pathValuesRE: /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
    stopsRE: /^(\d+%?)$/,
    radian: Math.PI / 180,
    availableAnimAttrs: {
        along: "along",
        blur: null,
        "clip-rect": "csv",
        cx: null,
        cy: null,
        fill: "color",
        "fill-opacity": null,
        "font-size": null,
        height: null,
        opacity: null,
        path: "path",
        r: null,
        rotation: "csv",
        rx: null,
        ry: null,
        scale: "csv",
        stroke: "color",
        "stroke-opacity": null,
        "stroke-width": null,
        translation: "csv",
        width: null,
        x: null,
        y: null
    },
    is: function (b, a) {
        a = String(a).toLowerCase();
        return (a == "object" && b === Object(b)) || (a == "undefined" && typeof b == a) || (a == "null" && b === null) || (a == "array" && Array.isArray && Array.isArray(b)) || (Object.prototype.toString.call(b).toLowerCase().slice(8, -1)) == a
    },
    ellipsePath: function (b) {
        var a = b.attr;
        return Ext.String.format("M{0},{1}A{2},{3},0,1,1,{0},{4}A{2},{3},0,1,1,{0},{1}z", a.x, a.y - a.ry, a.rx, a.ry, a.y + a.ry)
    },
    rectPath: function (b) {
        var a = b.attr;
        if (a.radius) {
            return Ext.String.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", a.x + a.radius, a.y, a.width - a.radius * 2, a.radius, -a.radius, a.height - a.radius * 2, a.radius * 2 - a.width, a.radius * 2 - a.height)
        } else {
            return Ext.String.format("M{0},{1}L{2},{1},{2},{3},{0},{3}z", a.x, a.y, a.width + a.x, a.height + a.y)
        }
    },
    path2string: function () {
        return this.join(",").replace(Ext.draw.Draw.pathToStringRE, "$1")
    },
    pathToString: function (a) {
        return a.join(",").replace(Ext.draw.Draw.pathToStringRE, "$1")
    },
    parsePathString: function (a) {
        if (!a) {
            return null
        }
        var d = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}, c = [], b = this;
        if (b.is(a, "array") && b.is(a[0], "array")) {
            c = b.pathClone(a)
        }
        if (!c.length) {
            String(a).replace(b.pathCommandRE, function (f, e, j) {
                var h = [], g = e.toLowerCase();
                j.replace(b.pathValuesRE, function (l, k) {
                    k && h.push(+k)
                });
                if (g == "m" && h.length > 2) {
                    c.push([e].concat(Ext.Array.splice(h, 0, 2)));
                    g = "l";
                    e = (e == "m") ? "l" : "L"
                }
                while (h.length >= d[g]) {
                    c.push([e].concat(Ext.Array.splice(h, 0, d[g])));
                    if (!d[g]) {
                        break
                    }
                }
            })
        }
        c.toString = b.path2string;
        return c
    },
    mapPath: function (k, f) {
        if (!f) {
            return k
        }
        var g, e, c, h, a, d, b;
        k = this.path2curve(k);
        for (c = 0, h = k.length; c < h; c++) {
            b = k[c];
            for (a = 1, d = b.length; a < d - 1; a += 2) {
                g = f.x(b[a], b[a + 1]);
                e = f.y(b[a], b[a + 1]);
                b[a] = g;
                b[a + 1] = e
            }
        }
        return k
    },
    pathClone: function (f) {
        var c = [], a, e, b, d;
        if (!this.is(f, "array") || !this.is(f && f[0], "array")) {
            f = this.parsePathString(f)
        }
        for (b = 0, d = f.length; b < d; b++) {
            c[b] = [];
            for (a = 0, e = f[b].length; a < e; a++) {
                c[b][a] = f[b][a]
            }
        }
        c.toString = this.path2string;
        return c
    },
    pathToAbsolute: function (c) {
        if (!this.is(c, "array") || !this.is(c && c[0], "array")) {
            c = this.parsePathString(c)
        }
        var h = [], l = 0, k = 0, n = 0, m = 0, f = 0, g = c.length, b, d, e, a;
        if (g && c[0][0] == "M") {
            l = +c[0][1];
            k = +c[0][2];
            n = l;
            m = k;
            f++;
            h[0] = ["M", l, k]
        }
        for (; f < g; f++) {
            b = h[f] = [];
            d = c[f];
            if (d[0] != d[0].toUpperCase()) {
                b[0] = d[0].toUpperCase();
                switch (b[0]) {
                    case"A":
                        b[1] = d[1];
                        b[2] = d[2];
                        b[3] = d[3];
                        b[4] = d[4];
                        b[5] = d[5];
                        b[6] = +(d[6] + l);
                        b[7] = +(d[7] + k);
                        break;
                    case"V":
                        b[1] = +d[1] + k;
                        break;
                    case"H":
                        b[1] = +d[1] + l;
                        break;
                    case"M":
                        n = +d[1] + l;
                        m = +d[2] + k;
                    default:
                        e = 1;
                        a = d.length;
                        for (; e < a; e++) {
                            b[e] = +d[e] + ((e % 2) ? l : k)
                        }
                }
            } else {
                e = 0;
                a = d.length;
                for (; e < a; e++) {
                    h[f][e] = d[e]
                }
            }
            switch (b[0]) {
                case"Z":
                    l = n;
                    k = m;
                    break;
                case"H":
                    l = b[1];
                    break;
                case"V":
                    k = b[1];
                    break;
                case"M":
                    d = h[f];
                    a = d.length;
                    n = d[a - 2];
                    m = d[a - 1];
                default:
                    d = h[f];
                    a = d.length;
                    l = d[a - 2];
                    k = d[a - 1]
            }
        }
        h.toString = this.path2string;
        return h
    },
    pathToRelative: function (d) {
        if (!this.is(d, "array") || !this.is(d && d[0], "array")) {
            d = this.parsePathString(d)
        }
        var m = [], o = 0, n = 0, s = 0, q = 0, c = 0, a, p, g, f, e, l, t, h, b;
        if (d[0][0] == "M") {
            o = d[0][1];
            n = d[0][2];
            s = o;
            q = n;
            c++;
            m.push(["M", o, n])
        }
        for (g = c, t = d.length; g < t; g++) {
            a = m[g] = [];
            p = d[g];
            if (p[0] != p[0].toLowerCase()) {
                a[0] = p[0].toLowerCase();
                switch (a[0]) {
                    case"a":
                        a[1] = p[1];
                        a[2] = p[2];
                        a[3] = p[3];
                        a[4] = p[4];
                        a[5] = p[5];
                        a[6] = +(p[6] - o).toFixed(3);
                        a[7] = +(p[7] - n).toFixed(3);
                        break;
                    case"v":
                        a[1] = +(p[1] - n).toFixed(3);
                        break;
                    case"m":
                        s = p[1];
                        q = p[2];
                    default:
                        for (f = 1, h = p.length; f < h; f++) {
                            a[f] = +(p[f] - ((f % 2) ? o : n)).toFixed(3)
                        }
                }
            } else {
                a = m[g] = [];
                if (p[0] == "m") {
                    s = p[1] + o;
                    q = p[2] + n
                }
                for (e = 0, b = p.length; e < b; e++) {
                    m[g][e] = p[e]
                }
            }
            l = m[g].length;
            switch (m[g][0]) {
                case"z":
                    o = s;
                    n = q;
                    break;
                case"h":
                    o += +m[g][l - 1];
                    break;
                case"v":
                    n += +m[g][l - 1];
                    break;
                default:
                    o += +m[g][l - 2];
                    n += +m[g][l - 1]
            }
        }
        m.toString = this.path2string;
        return m
    },
    path2curve: function (j) {
        var d = this, g = d.pathToAbsolute(j), c = g.length, h = {
            x: 0,
            y: 0,
            bx: 0,
            by: 0,
            X: 0,
            Y: 0,
            qx: null,
            qy: null
        }, b, a, f, e;
        for (b = 0; b < c; b++) {
            g[b] = d.command2curve(g[b], h);
            if (g[b].length > 7) {
                g[b].shift();
                e = g[b];
                while (e.length) {
                    Ext.Array.splice(g, b++, 0, ["C"].concat(Ext.Array.splice(e, 0, 6)))
                }
                Ext.Array.erase(g, b, 1);
                c = g.length;
                b--
            }
            a = g[b];
            f = a.length;
            h.x = a[f - 2];
            h.y = a[f - 1];
            h.bx = parseFloat(a[f - 4]) || h.x;
            h.by = parseFloat(a[f - 3]) || h.y
        }
        return g
    },
    interpolatePaths: function (q, k) {
        var h = this, d = h.pathToAbsolute(q), l = h.pathToAbsolute(k), m = {
            x: 0,
            y: 0,
            bx: 0,
            by: 0,
            X: 0,
            Y: 0,
            qx: null,
            qy: null
        }, a = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null}, b = function (p, r) {
            if (p[r].length > 7) {
                p[r].shift();
                var s = p[r];
                while (s.length) {
                    Ext.Array.splice(p, r++, 0, ["C"].concat(Ext.Array.splice(s, 0, 6)))
                }
                Ext.Array.erase(p, r, 1);
                n = Math.max(d.length, l.length || 0)
            }
        }, c = function (u, t, r, p, s) {
            if (u && t && u[s][0] == "M" && t[s][0] != "M") {
                Ext.Array.splice(t, s, 0, ["M", p.x, p.y]);
                r.bx = 0;
                r.by = 0;
                r.x = u[s][1];
                r.y = u[s][2];
                n = Math.max(d.length, l.length || 0)
            }
        }, g, n, f, o, e, j;
        for (g = 0, n = Math.max(d.length, l.length || 0); g < n; g++) {
            d[g] = h.command2curve(d[g], m);
            b(d, g);
            (l[g] = h.command2curve(l[g], a));
            b(l, g);
            c(d, l, m, a, g);
            c(l, d, a, m, g);
            f = d[g];
            o = l[g];
            e = f.length;
            j = o.length;
            m.x = f[e - 2];
            m.y = f[e - 1];
            m.bx = parseFloat(f[e - 4]) || m.x;
            m.by = parseFloat(f[e - 3]) || m.y;
            a.bx = (parseFloat(o[j - 4]) || a.x);
            a.by = (parseFloat(o[j - 3]) || a.y);
            a.x = o[j - 2];
            a.y = o[j - 1]
        }
        return [d, l]
    },
    command2curve: function (c, b) {
        var a = this;
        if (!c) {
            return ["C", b.x, b.y, b.x, b.y, b.x, b.y]
        }
        if (c[0] != "T" && c[0] != "Q") {
            b.qx = b.qy = null
        }
        switch (c[0]) {
            case"M":
                b.X = c[1];
                b.Y = c[2];
                break;
            case"A":
                c = ["C"].concat(a.arc2curve.apply(a, [b.x, b.y].concat(c.slice(1))));
                break;
            case"S":
                c = ["C", b.x + (b.x - (b.bx || b.x)), b.y + (b.y - (b.by || b.y))].concat(c.slice(1));
                break;
            case"T":
                b.qx = b.x + (b.x - (b.qx || b.x));
                b.qy = b.y + (b.y - (b.qy || b.y));
                c = ["C"].concat(a.quadratic2curve(b.x, b.y, b.qx, b.qy, c[1], c[2]));
                break;
            case"Q":
                b.qx = c[1];
                b.qy = c[2];
                c = ["C"].concat(a.quadratic2curve(b.x, b.y, c[1], c[2], c[3], c[4]));
                break;
            case"L":
                c = ["C"].concat(b.x, b.y, c[1], c[2], c[1], c[2]);
                break;
            case"H":
                c = ["C"].concat(b.x, b.y, c[1], b.y, c[1], b.y);
                break;
            case"V":
                c = ["C"].concat(b.x, b.y, b.x, c[1], b.x, c[1]);
                break;
            case"Z":
                c = ["C"].concat(b.x, b.y, b.X, b.Y, b.X, b.Y);
                break
        }
        return c
    },
    quadratic2curve: function (b, d, g, e, a, c) {
        var f = 1 / 3, h = 2 / 3;
        return [f * b + h * g, f * d + h * e, f * a + h * g, f * c + h * e, a, c]
    },
    rotate: function (b, g, a) {
        var d = Math.cos(a), c = Math.sin(a), f = b * d - g * c, e = b * c + g * d;
        return {x: f, y: e}
    },
    arc2curve: function (r, ae, G, E, w, m, f, q, ad, z) {
        var u = this, d = Math.PI, v = u.radian, D = d * 120 / 180, b = v * (+w || 0), L = [], I = Math, S = I.cos, a = I.sin, U = I.sqrt, s = I.abs, n = I.asin, H, N, M, Z, c, Q, T, B, A, l, j, p, g, ac, e, ab, O, R, P, aa, Y, X, V, K, W, J, C, F, o;
        if (!z) {
            H = u.rotate(r, ae, -b);
            r = H.x;
            ae = H.y;
            H = u.rotate(q, ad, -b);
            q = H.x;
            ad = H.y;
            N = (r - q) / 2;
            M = (ae - ad) / 2;
            Z = (N * N) / (G * G) + (M * M) / (E * E);
            if (Z > 1) {
                Z = U(Z);
                G = Z * G;
                E = Z * E
            }
            c = G * G;
            Q = E * E;
            T = (m == f ? -1 : 1) * U(s((c * Q - c * M * M - Q * N * N) / (c * M * M + Q * N * N)));
            B = T * G * M / E + (r + q) / 2;
            A = T * -E * N / G + (ae + ad) / 2;
            l = n(((ae - A) / E).toFixed(7));
            j = n(((ad - A) / E).toFixed(7));
            l = r < B ? d - l : l;
            j = q < B ? d - j : j;
            if (l < 0) {
                l = d * 2 + l
            }
            if (j < 0) {
                j = d * 2 + j
            }
            if (f && l > j) {
                l = l - d * 2
            }
            if (!f && j > l) {
                j = j - d * 2
            }
        } else {
            l = z[0];
            j = z[1];
            B = z[2];
            A = z[3]
        }
        p = j - l;
        if (s(p) > D) {
            C = j;
            F = q;
            o = ad;
            j = l + D * (f && j > l ? 1 : -1);
            q = B + G * S(j);
            ad = A + E * a(j);
            L = u.arc2curve(q, ad, G, E, w, 0, f, F, o, [j, C, B, A])
        }
        p = j - l;
        g = S(l);
        ac = a(l);
        e = S(j);
        ab = a(j);
        O = I.tan(p / 4);
        R = 4 / 3 * G * O;
        P = 4 / 3 * E * O;
        aa = [r, ae];
        Y = [r + R * ac, ae - P * g];
        X = [q + R * ab, ad - P * e];
        V = [q, ad];
        Y[0] = 2 * aa[0] - Y[0];
        Y[1] = 2 * aa[1] - Y[1];
        if (z) {
            return [Y, X, V].concat(L)
        } else {
            L = [Y, X, V].concat(L).join().split(",");
            K = [];
            J = L.length;
            for (W = 0; W < J; W++) {
                K[W] = W % 2 ? u.rotate(L[W - 1], L[W], b).y : u.rotate(L[W], L[W + 1], b).x
            }
            return K
        }
    },
    rotateAndTranslatePath: function (h) {
        var c = h.rotation.degrees, d = h.rotation.x, b = h.rotation.y, n = h.translation.x, k = h.translation.y, m, f, a, l, e, g = [];
        if (!c && !n && !k) {
            return this.pathToAbsolute(h.attr.path)
        }
        n = n || 0;
        k = k || 0;
        m = this.pathToAbsolute(h.attr.path);
        for (f = m.length; f--;) {
            a = g[f] = m[f].slice();
            if (a[0] == "A") {
                l = this.rotatePoint(a[6], a[7], c, d, b);
                a[6] = l.x + n;
                a[7] = l.y + k
            } else {
                e = 1;
                while (a[e + 1] != null) {
                    l = this.rotatePoint(a[e], a[e + 1], c, d, b);
                    a[e] = l.x + n;
                    a[e + 1] = l.y + k;
                    e += 2
                }
            }
        }
        return g
    },
    rotatePoint: function (b, g, e, a, f) {
        if (!e) {
            return {x: b, y: g}
        }
        a = a || 0;
        f = f || 0;
        b = b - a;
        g = g - f;
        e = e * this.radian;
        var d = Math.cos(e), c = Math.sin(e);
        return {x: b * d - g * c + a, y: b * c + g * d + f}
    },
    pathDimensions: function (n) {
        if (!n || !(n + "")) {
            return {x: 0, y: 0, width: 0, height: 0}
        }
        n = this.path2curve(n);
        var l = 0, k = 0, e = [], b = [], g = 0, j = n.length, c, a, m, f, d, h;
        for (; g < j; g++) {
            c = n[g];
            if (c[0] == "M") {
                l = c[1];
                k = c[2];
                e.push(l);
                b.push(k)
            } else {
                h = this.curveDim(l, k, c[1], c[2], c[3], c[4], c[5], c[6]);
                e = e.concat(h.min.x, h.max.x);
                b = b.concat(h.min.y, h.max.y);
                l = c[5];
                k = c[6]
            }
        }
        a = Math.min.apply(0, e);
        m = Math.min.apply(0, b);
        f = Math.max.apply(0, e);
        d = Math.max.apply(0, b);
        return {x: Math.round(a), y: Math.round(m), path: n, width: Math.round(f - a), height: Math.round(d - m)}
    },
    intersectInside: function (b, c, a) {
        return (a[0] - c[0]) * (b[1] - c[1]) > (a[1] - c[1]) * (b[0] - c[0])
    },
    intersectIntersection: function (n, m, f, d) {
        var c = [], b = f[0] - d[0], a = f[1] - d[1], k = n[0] - m[0], h = n[1] - m[1], l = f[0] * d[1] - f[1] * d[0], j = n[0] * m[1] - n[1] * m[0], g = 1 / (b * h - a * k);
        c[0] = (l * k - j * b) * g;
        c[1] = (l * h - j * a) * g;
        return c
    },
    intersect: function (n, c) {
        var m = this, h = 0, l = c.length, g = c[l - 1], o = n, f, p, k, a, b, d;
        for (; h < l; ++h) {
            f = c[h];
            b = o;
            o = [];
            p = b[b.length - 1];
            d = 0;
            a = b.length;
            for (; d < a; d++) {
                k = b[d];
                if (m.intersectInside(k, g, f)) {
                    if (!m.intersectInside(p, g, f)) {
                        o.push(m.intersectIntersection(p, k, g, f))
                    }
                    o.push(k)
                } else {
                    if (m.intersectInside(p, g, f)) {
                        o.push(m.intersectIntersection(p, k, g, f))
                    }
                }
                p = k
            }
            g = f
        }
        return o
    },
    bezier: function (g, f, m, l, e) {
        if (e === 0) {
            return g
        } else {
            if (e === 1) {
                return l
            }
        }
        var j = 1 - e, h = j * j * j, k = e / j;
        return h * (g + k * (3 * f + k * (3 * m + l * k)))
    },
    bezierDim: function (q, p, m, l) {
        var u = [], f, h, o, g, t, e, v, j, n, k;
        if (q + 3 * m == l + 3 * p) {
            f = q - p;
            f /= 2 * (q - p - p + m);
            if (f < 1 && f > 0) {
                u.push(f)
            }
        } else {
            h = q - 3 * p + 3 * m - l;
            o = 2 * (q - p - p + m);
            g = q - p;
            t = o * o - 4 * h * g;
            e = h + h;
            if (t === 0) {
                f = o / e;
                if (f < 1 && f > 0) {
                    u.push(f)
                }
            } else {
                if (t > 0) {
                    v = Math.sqrt(t);
                    f = (v + o) / e;
                    if (f < 1 && f > 0) {
                        u.push(f)
                    }
                    f = (o - v) / e;
                    if (f < 1 && f > 0) {
                        u.push(f)
                    }
                }
            }
        }
        j = Math.min(q, l);
        n = Math.max(q, l);
        for (k = 0; k < u.length; k++) {
            j = Math.min(j, this.bezier(q, p, m, l, u[k]));
            n = Math.max(n, this.bezier(q, p, m, l, u[k]))
        }
        return [j, n]
    },
    curveDim: function (b, a, d, c, k, j, g, e) {
        var h = this.bezierDim(b, d, k, g), f = this.bezierDim(a, c, j, e);
        return {min: {x: h[0], y: f[0]}, max: {x: h[1], y: f[1]}}
    },
    getAnchors: function (e, d, k, j, v, u, q) {
        q = q || 4;
        var h = Math, p = h.PI, r = p / 2, m = h.abs, a = h.sin, b = h.cos, f = h.atan, t, s, g, l, o, n, x, w, c;
        t = (k - e) / q;
        s = (v - k) / q;
        if ((j >= d && j >= u) || (j <= d && j <= u)) {
            g = l = r
        } else {
            g = f((k - e) / m(j - d));
            if (d < j) {
                g = p - g
            }
            l = f((v - k) / m(j - u));
            if (u < j) {
                l = p - l
            }
        }
        c = r - ((g + l) % (p * 2)) / 2;
        if (c > r) {
            c -= p
        }
        g += c;
        l += c;
        o = k - t * a(g);
        n = j + t * b(g);
        x = k + s * a(l);
        w = j + s * b(l);
        if ((j > d && n < d) || (j < d && n > d)) {
            o += m(d - n) * (o - k) / (n - j);
            n = d
        }
        if ((j > u && w < u) || (j < u && w > u)) {
            x -= m(u - w) * (x - k) / (w - j);
            w = u
        }
        return {x1: o, y1: n, x2: x, y2: w}
    },
    smooth: function (a, o) {
        var n = this.path2curve(a), c = [n[0]], f = n[0][1], e = n[0][2], p, r, s = 1, g = n.length, d = 1, k = f, h = e, v, u, t, l, q, m, b;
        for (; s < g; s++) {
            v = n[s];
            u = v.length;
            t = n[s - 1];
            l = t.length;
            q = n[s + 1];
            m = q && q.length;
            if (v[0] == "M") {
                k = v[1];
                h = v[2];
                p = s + 1;
                while (n[p][0] != "C") {
                    p++
                }
                c.push(["M", k, h]);
                d = c.length;
                f = k;
                e = h;
                continue
            }
            if (v[u - 2] == k && v[u - 1] == h && (!q || q[0] == "M")) {
                b = c[d].length;
                r = this.getAnchors(t[l - 2], t[l - 1], k, h, c[d][b - 2], c[d][b - 1], o);
                c[d][1] = r.x2;
                c[d][2] = r.y2
            } else {
                if (!q || q[0] == "M") {
                    r = {x1: v[u - 2], y1: v[u - 1]}
                } else {
                    r = this.getAnchors(t[l - 2], t[l - 1], v[u - 2], v[u - 1], q[m - 2], q[m - 1], o)
                }
            }
            c.push(["C", f, e, r.x1, r.y1, v[u - 2], v[u - 1]]);
            f = r.x2;
            e = r.y2
        }
        return c
    },
    findDotAtSegment: function (b, a, d, c, j, h, g, f, k) {
        var e = 1 - k;
        return {
            x: Math.pow(e, 3) * b + Math.pow(e, 2) * 3 * k * d + e * 3 * k * k * j + Math.pow(k, 3) * g,
            y: Math.pow(e, 3) * a + Math.pow(e, 2) * 3 * k * c + e * 3 * k * k * h + Math.pow(k, 3) * f
        }
    },
    snapEnds: function (n, c, j, t) {
        if (Ext.isDate(n)) {
            return this.snapEndsByDate(n, c, j)
        }
        var e = (c - n) / j, b = Math.floor(Math.log(e) / Math.LN10) + 1, l = Math.pow(10, b), d, p, q = Math.round((e % l) * Math.pow(10, 2 - b)), r = [[0, 15], [10, 1], [20, 4], [25, 2], [50, 9], [100, 15]], a = 0, k, h, o, g, s = 1000000000, f = r.length;
        p = Math.floor(n / l) * l;
        if (n == p && p > 0) {
            p = Math.floor((n - (l / 10)) / l) * l
        }
        if (t) {
            for (o = 0; o < f; o++) {
                k = r[o][0];
                h = (k - q) < 0 ? 1000000 : (k - q) / r[o][1];
                if (h < s) {
                    g = k;
                    s = h
                }
            }
            e = Math.floor(e * Math.pow(10, -b)) * Math.pow(10, b) + g * Math.pow(10, b - 2);
            if (n < 0 && c >= 0) {
                d = 0;
                while (d > n) {
                    d -= e;
                    a++
                }
                n = +d.toFixed(10);
                d = 0;
                while (d < c) {
                    d += e;
                    a++
                }
                c = +d.toFixed(10)
            } else {
                d = n = p;
                while (d < c) {
                    d += e;
                    a++
                }
            }
            c = +d.toFixed(10)
        } else {
            n = p;
            a = j
        }
        return {from: n, to: c, power: b, step: e, steps: a}
    },
    snapEndsByDate: function (k, l, b, m) {
        var e = false, g = [[Ext.Date.MILLI, [1, 2, 5, 10, 20, 50, 100, 200, 250, 500]], [Ext.Date.SECOND, [1, 2, 5, 10, 15, 30]], [Ext.Date.MINUTE, [1, 2, 5, 10, 15, 30]], [Ext.Date.HOUR, [1, 2, 3, 4, 6, 12]], [Ext.Date.DAY, [1, 2, 7, 14]], [Ext.Date.MONTH, [1, 2, 3, 6]]], f = g.length, h = false, c, d, a, n;
        for (n = 0; n < f; n++) {
            c = g[n];
            if (!h) {
                for (d = 0; d < c[1].length; d++) {
                    if (l < Ext.Date.add(k, c[0], c[1][d] * b)) {
                        e = [c[0], c[1][d]];
                        h = true;
                        break
                    }
                }
            }
        }
        if (!e) {
            a = this.snapEnds(k.getFullYear(), l.getFullYear() + 1, b, m);
            e = [Date.YEAR, Math.round(a.step)]
        }
        return this.snapEndsByDateAndStep(k, l, e, m)
    },
    snapEndsByDateAndStep: function (m, n, a, p) {
        var o = [m.getFullYear(), m.getMonth(), m.getDate(), m.getHours(), m.getMinutes(), m.getSeconds(), m.getMilliseconds()], c, q, b, j, e, l, d, h, g = a[0], f = a[1], k = 0;
        if (p) {
            c = m
        } else {
            switch (g) {
                case Ext.Date.MILLI:
                    c = new Date(o[0], o[1], o[2], o[3], o[4], o[5], Math.floor(o[6] / f) * f);
                    break;
                case Ext.Date.SECOND:
                    c = new Date(o[0], o[1], o[2], o[3], o[4], Math.floor(o[5] / f) * f, 0);
                    break;
                case Ext.Date.MINUTE:
                    c = new Date(o[0], o[1], o[2], o[3], Math.floor(o[4] / f) * f, 0, 0);
                    break;
                case Ext.Date.HOUR:
                    c = new Date(o[0], o[1], o[2], Math.floor(o[3] / f) * f, 0, 0, 0);
                    break;
                case Ext.Date.DAY:
                    c = new Date(o[0], o[1], Math.floor((o[2] - 1) / f) * f + 1, 0, 0, 0, 0);
                    break;
                case Ext.Date.MONTH:
                    c = new Date(o[0], Math.floor(o[1] / f) * f, 1, 0, 0, 0, 0);
                    k = [];
                    h = true;
                    break;
                default:
                    c = new Date(Math.floor(o[0] / f) * f, 0, 1, 0, 0, 0, 0);
                    k = [];
                    h = true;
                    break
            }
        }
        d = ((g === Ext.Date.MONTH) && (f == 1 / 2 || f == 1 / 3 || f == 1 / 4));
        q = new Date(c);
        while (q < n) {
            if (d) {
                b = new Date(q);
                j = b.getFullYear();
                e = b.getMonth();
                l = b.getDate();
                switch (f) {
                    case 1 / 2:
                        if (l >= 15) {
                            l = 1;
                            if (++e > 11) {
                                j++
                            }
                        } else {
                            l = 15
                        }
                        break;
                    case 1 / 3:
                        if (l >= 20) {
                            l = 1;
                            if (++e > 11) {
                                j++
                            }
                        } else {
                            if (l >= 10) {
                                l = 20
                            } else {
                                l = 10
                            }
                        }
                        break;
                    case 1 / 4:
                        if (l >= 22) {
                            l = 1;
                            if (++e > 11) {
                                j++
                            }
                        } else {
                            if (l >= 15) {
                                l = 22
                            } else {
                                if (l >= 8) {
                                    l = 15
                                } else {
                                    l = 8
                                }
                            }
                        }
                        break
                }
                q.setYear(j);
                q.setMonth(e);
                q.setDate(l);
                k.push(new Date(q))
            } else {
                if (h) {
                    q = Ext.Date.add(q, g, f);
                    k.push(new Date(q))
                } else {
                    q = Ext.Date.add(q, g, f);
                    k++
                }
            }
        }
        if (p) {
            q = n
        }
        if (h) {
            return {from: +c, to: +q, steps: k}
        } else {
            return {from: +c, to: +q, step: (q - c) / k, steps: k}
        }
    },
    sorter: function (d, c) {
        return d.offset - c.offset
    },
    rad: function (a) {
        return a % 360 * Math.PI / 180
    },
    normalizeRadians: function (b) {
        var a = 2 * Math.PI;
        if (b >= 0) {
            return b % a
        }
        return ((b % a) + a) % a
    },
    degrees: function (a) {
        return a * 180 / Math.PI % 360
    },
    normalizeDegrees: function (a) {
        if (a >= 0) {
            return a % 360
        }
        return ((a % 360) + 360) % 360
    },
    withinBox: function (a, c, b) {
        b = b || {};
        return (a >= b.x && a <= (b.x + b.width) && c >= b.y && c <= (b.y + b.height))
    },
    parseGradient: function (k) {
        var e = this, f = k.type || "linear", c = k.angle || 0, h = e.radian, l = k.stops, a = [], j, b, g, d;
        if (f == "linear") {
            b = [0, 0, Math.cos(c * h), Math.sin(c * h)];
            g = 1 / (Math.max(Math.abs(b[2]), Math.abs(b[3])) || 1);
            b[2] *= g;
            b[3] *= g;
            if (b[2] < 0) {
                b[0] = -b[2];
                b[2] = 0
            }
            if (b[3] < 0) {
                b[1] = -b[3];
                b[3] = 0
            }
        }
        for (j in l) {
            if (l.hasOwnProperty(j) && e.stopsRE.test(j)) {
                d = {
                    offset: parseInt(j, 10),
                    color: Ext.draw.Color.toHex(l[j].color) || "#ffffff",
                    opacity: l[j].opacity || 1
                };
                a.push(d)
            }
        }
        Ext.Array.sort(a, e.sorter);
        if (f == "linear") {
            return {id: k.id, type: f, vector: b, stops: a}
        } else {
            return {
                id: k.id,
                type: f,
                centerX: k.centerX,
                centerY: k.centerY,
                focalX: k.focalX,
                focalY: k.focalY,
                radius: k.radius,
                vector: b,
                stops: a
            }
        }
    }
});
Ext.define("Ext.chart.axis.Axis", {
    extend: "Ext.chart.axis.Abstract",
    alternateClassName: "Ext.chart.Axis",
    requires: ["Ext.draw.Draw"],
    hidden: false,
    forceMinMax: false,
    dashSize: 3,
    position: "bottom",
    skipFirst: false,
    length: 0,
    width: 0,
    adjustEnd: true,
    majorTickSteps: false,
    nullGutters: {lower: 0, upper: 0, verticalAxis: undefined},
    applyData: Ext.emptyFn,
    getRange: function () {
        var B = this, o = B.chart, h = o.getChartStore(), D = h.data.items, n = o.series.items, C = B.position, x, a = Ext.chart.series, t = [], s = Infinity, w = -Infinity, c = B.position === "left" || B.position === "right" || B.position === "radial", y, m, d, v, u, l = D.length, f, A = {}, r = {}, z = true, p, g, e, b, q;
        p = B.fields;
        for (v = 0, m = p.length; v < m; v++) {
            r[p[v]] = true
        }
        for (y = 0, m = n.length; y < m; y++) {
            if (n[y].seriesIsHidden) {
                continue
            }
            if (!n[y].getAxesForXAndYFields) {
                continue
            }
            x = n[y].getAxesForXAndYFields();
            if (x.xAxis && x.xAxis !== C && x.yAxis && x.yAxis !== C) {
                continue
            }
            if (a.Bar && n[y] instanceof a.Bar && !n[y].column) {
                p = c ? Ext.Array.from(n[y].xField) : Ext.Array.from(n[y].yField)
            } else {
                p = c ? Ext.Array.from(n[y].yField) : Ext.Array.from(n[y].xField)
            }
            if (B.fields.length) {
                for (v = 0, d = p.length; v < d; v++) {
                    if (r[p[v]]) {
                        break
                    }
                }
                if (v == d) {
                    continue
                }
            }
            if (f = n[y].stacked) {
                if (a.Bar && n[y] instanceof a.Bar) {
                    if (n[y].column != c) {
                        f = false;
                        z = false
                    }
                } else {
                    if (!c) {
                        f = false;
                        z = false
                    }
                }
            }
            if (f) {
                g = {};
                for (v = 0; v < p.length; v++) {
                    if (z && n[y].__excludes && n[y].__excludes[v]) {
                        continue
                    }
                    if (!r[p[v]]) {
                        Ext.Logger.warn("Field `" + p[v] + "` is not included in the " + C + " axis config.")
                    }
                    r[p[v]] = g[p[v]] = true
                }
                t.push({fields: g, positiveValue: 0, negativeValue: 0})
            } else {
                if (!p || p.length == 0) {
                    p = B.fields
                }
                for (v = 0; v < p.length; v++) {
                    if (z && n[y].__excludes && n[y].__excludes[v]) {
                        continue
                    }
                    r[p[v]] = A[p[v]] = true
                }
            }
        }
        for (y = 0; y < l; y++) {
            e = D[y];
            for (u = 0; u < t.length; u++) {
                t[u].positiveValue = 0;
                t[u].negativeValue = 0
            }
            for (b in r) {
                q = e.get(b);
                if (B.type == "Time" && typeof q == "string") {
                    q = Date.parse(q)
                }
                if (isNaN(q)) {
                    continue
                }
                if (q === undefined) {
                    q = 0
                } else {
                    q = Number(q)
                }
                if (A[b]) {
                    if (s > q) {
                        s = q
                    }
                    if (w < q) {
                        w = q
                    }
                }
                for (u = 0; u < t.length; u++) {
                    if (t[u].fields[b]) {
                        if (q >= 0) {
                            t[u].positiveValue += q;
                            if (w < t[u].positiveValue) {
                                w = t[u].positiveValue
                            }
                            if (s > 0) {
                                s = 0
                            }
                        } else {
                            t[u].negativeValue += q;
                            if (s > t[u].negativeValue) {
                                s = t[u].negativeValue
                            }
                            if (w < 0) {
                                w = 0
                            }
                        }
                    }
                }
            }
        }
        if (!isFinite(w)) {
            w = B.prevMax || 0
        }
        if (!isFinite(s)) {
            s = B.prevMin || 0
        }
        if (typeof s === "number") {
            s = Ext.Number.correctFloat(s)
        }
        if (typeof w === "number") {
            w = Ext.Number.correctFloat(w)
        }
        if (s != w && (w != Math.floor(w) || s != Math.floor(s))) {
            s = Math.floor(s);
            w = Math.floor(w) + 1
        }
        if (!isNaN(B.minimum)) {
            s = B.minimum
        }
        if (!isNaN(B.maximum)) {
            w = B.maximum
        }
        if (s >= w) {
            s = Math.floor(s);
            w = s + 1
        }
        return {min: s, max: w}
    },
    calcEnds: function () {
        var g = this, d = g.getRange(), f = d.min, a = d.max, c, h, e, b;
        c = (Ext.isNumber(g.majorTickSteps) ? g.majorTickSteps + 1 : g.steps);
        h = !(Ext.isNumber(g.maximum) && Ext.isNumber(g.minimum) && Ext.isNumber(g.majorTickSteps) && g.majorTickSteps > 0);
        e = Ext.draw.Draw.snapEnds(f, a, c, h);
        if (Ext.isNumber(g.maximum)) {
            e.to = g.maximum;
            b = true
        }
        if (Ext.isNumber(g.minimum)) {
            e.from = g.minimum;
            b = true
        }
        if (g.adjustMaximumByMajorUnit) {
            e.to = Math.ceil(e.to / e.step) * e.step;
            b = true
        }
        if (g.adjustMinimumByMajorUnit) {
            e.from = Math.floor(e.from / e.step) * e.step;
            b = true
        }
        if (b) {
            e.steps = Math.ceil((e.to - e.from) / e.step)
        }
        g.prevMin = (f == a ? 0 : f);
        g.prevMax = a;
        return e
    },
    drawAxis: function (O) {
        var n = this, Q, I = n.x, H = n.y, V = n.dashSize, q = n.length, J = n.position, b = (J == "left" || J == "right"), l = [], k = (n.isNumericAxis), u = n.applyData(), A = u.step, E = u.steps, G = Ext.isArray(E), j = u.from, U = u.to, h = (U - j) || 1, S, z, w, M, C = n.minorTickSteps || 0, B = n.minorTickSteps || 0, p = Math.max(C + 1, 0), o = Math.max(B + 1, 0), K = (J == "left" || J == "top" ? -1 : 1), e = V * K, d = n.chart.series.items, N = d[0], r = Ext.clone(N ? N.nullGutters : n.nullGutters), T, f, c, P, R, s, F = 0, D = 0, a, L, v, t, g, m;
        n.from = j;
        n.to = U;
        if (n.hidden || (j > U)) {
            return
        }
        if ((G && (E.length == 0)) || (!G && isNaN(A))) {
            return
        }
        if (G) {
            E = Ext.Array.filter(E, function (y, x, W) {
                return (+y > +n.from && +y < +n.to)
            }, this);
            E = Ext.Array.union([n.from], E, [n.to])
        } else {
            E = new Array();
            for (t = +n.from; t < +n.to; t += A) {
                E.push(t)
            }
            E.push(+n.to)
        }
        D = E.length;
        for (Q = 0, v = d.length; Q < v; Q++) {
            if (d[Q].seriesIsHidden) {
                continue
            }
            if (!d[Q].getAxesForXAndYFields) {
                continue
            }
            L = d[Q].getAxesForXAndYFields();
            if (!L.xAxis || !L.yAxis || (L.xAxis === J) || (L.yAxis === J)) {
                T = Ext.clone(d[Q].getGutters());
                f = (T.verticalAxis !== undefined);
                c = (f && (T.verticalAxis == b));
                if (f) {
                    if (!c) {
                        P = d[Q].getPadding();
                        if (b) {
                            T = {lower: P.bottom, upper: P.top, verticalAxis: true}
                        } else {
                            T = {lower: P.left, upper: P.right, verticalAxis: false}
                        }
                    }
                    if (r.lower < T.lower) {
                        r.lower = T.lower
                    }
                    if (r.upper < T.upper) {
                        r.upper = T.upper
                    }
                    r.verticalAxis = b
                }
            }
        }
        if (k) {
            n.labels = []
        }
        if (r) {
            if (b) {
                z = Math.floor(I);
                M = ["M", z + 0.5, H, "l", 0, -q];
                S = q - (r.lower + r.upper);
                for (a = 0; a < D; a++) {
                    w = H - r.lower - (E[a] - E[0]) * S / h;
                    M.push("M", z, Math.floor(w) + 0.5, "l", e * 2, 0);
                    l.push([z, Math.floor(w)]);
                    if (k) {
                        n.labels.push(E[a])
                    }
                }
            } else {
                w = Math.floor(H);
                M = ["M", I, w + 0.5, "l", q, 0];
                S = q - (r.lower + r.upper);
                for (a = 0; a < D; a++) {
                    z = I + r.lower + (E[a] - E[0]) * S / h;
                    M.push("M", Math.floor(z) + 0.5, w, "l", 0, e * 2 + 1);
                    l.push([Math.floor(z), w]);
                    if (k) {
                        n.labels.push(E[a])
                    }
                }
            }
        }
        R = (b ? B : C);
        if (Ext.isArray(R)) {
            if (R.length == 2) {
                s = +Ext.Date.add(new Date(), R[0], R[1]) - Date.now()
            } else {
                s = R[0]
            }
        } else {
            if (Ext.isNumber(R) && R > 0) {
                s = A / (R + 1)
            }
        }
        if (r && s) {
            for (a = 0; a < D - 1; a++) {
                g = +E[a];
                m = +E[a + 1];
                if (b) {
                    for (value = g + s; value < m; value += s) {
                        w = H - r.lower - (value - E[0]) * S / h;
                        M.push("M", z, Math.floor(w) + 0.5, "l", e, 0)
                    }
                } else {
                    for (value = g + s; value < m; value += s) {
                        z = I + r.upper + (value - E[0]) * S / h;
                        M.push("M", Math.floor(z) + 0.5, w, "l", 0, e + 1)
                    }
                }
            }
        }
        if (!n.axis) {
            n.axis = n.chart.surface.add(Ext.apply({type: "path", path: M}, n.axisStyle))
        }
        n.axis.setAttributes({path: M}, true);
        n.inflections = l;
        if (!O && n.grid) {
            n.drawGrid()
        }
        n.axisBBox = n.axis.getBBox();
        n.drawLabel()
    },
    drawGrid: function () {
        var s = this, n = s.chart.surface, b = s.grid, d = b.odd, e = b.even, g = s.inflections, h = g.length - ((d || e) ? 0 : 1), t = s.position, c = s.chart.maxGutters, m = s.width - 2, o, p, q = 1, l = [], f, a, j, k = [], r = [];
        if (((c.bottom !== 0 || c.top !== 0) && (t == "left" || t == "right")) || ((c.left !== 0 || c.right !== 0) && (t == "top" || t == "bottom"))) {
            q = 0;
            h++
        }
        for (; q < h; q++) {
            o = g[q];
            p = g[q - 1];
            if (d || e) {
                l = (q % 2) ? k : r;
                f = ((q % 2) ? d : e) || {};
                a = (f.lineWidth || f["stroke-width"] || 0) / 2;
                j = 2 * a;
                if (t == "left") {
                    l.push("M", p[0] + 1 + a, p[1] + 0.5 - a, "L", p[0] + 1 + m - a, p[1] + 0.5 - a, "L", o[0] + 1 + m - a, o[1] + 0.5 + a, "L", o[0] + 1 + a, o[1] + 0.5 + a, "Z")
                } else {
                    if (t == "right") {
                        l.push("M", p[0] - a, p[1] + 0.5 - a, "L", p[0] - m + a, p[1] + 0.5 - a, "L", o[0] - m + a, o[1] + 0.5 + a, "L", o[0] - a, o[1] + 0.5 + a, "Z")
                    } else {
                        if (t == "top") {
                            l.push("M", p[0] + 0.5 + a, p[1] + 1 + a, "L", p[0] + 0.5 + a, p[1] + 1 + m - a, "L", o[0] + 0.5 - a, o[1] + 1 + m - a, "L", o[0] + 0.5 - a, o[1] + 1 + a, "Z")
                        } else {
                            l.push("M", p[0] + 0.5 + a, p[1] - a, "L", p[0] + 0.5 + a, p[1] - m + a, "L", o[0] + 0.5 - a, o[1] - m + a, "L", o[0] + 0.5 - a, o[1] - a, "Z")
                        }
                    }
                }
            } else {
                if (t == "left") {
                    l = l.concat(["M", o[0] + 0.5, o[1] + 0.5, "l", m, 0])
                } else {
                    if (t == "right") {
                        l = l.concat(["M", o[0] - 0.5, o[1] + 0.5, "l", -m, 0])
                    } else {
                        if (t == "top") {
                            l = l.concat(["M", o[0] + 0.5, o[1] + 0.5, "l", 0, m])
                        } else {
                            l = l.concat(["M", o[0] + 0.5, o[1] - 0.5, "l", 0, -m])
                        }
                    }
                }
            }
        }
        if (d || e) {
            if (k.length) {
                if (!s.gridOdd && k.length) {
                    s.gridOdd = n.add({type: "path", path: k})
                }
                s.gridOdd.setAttributes(Ext.apply({path: k, hidden: false}, d || {}), true)
            }
            if (r.length) {
                if (!s.gridEven) {
                    s.gridEven = n.add({type: "path", path: r})
                }
                s.gridEven.setAttributes(Ext.apply({path: r, hidden: false}, e || {}), true)
            }
        } else {
            if (l.length) {
                if (!s.gridLines) {
                    s.gridLines = s.chart.surface.add({
                        type: "path",
                        path: l,
                        "stroke-width": s.lineWidth || 1,
                        stroke: s.gridColor || "#ccc"
                    })
                }
                s.gridLines.setAttributes({hidden: false, path: l}, true)
            } else {
                if (s.gridLines) {
                    s.gridLines.hide(true)
                }
            }
        }
    },
    getOrCreateLabel: function (c, f) {
        var d = this, b = d.labelGroup, e = b.getAt(c), a = d.chart.surface;
        if (e) {
            if (f != e.attr.text) {
                e.setAttributes(Ext.apply({text: f}, d.label), true);
                e._bbox = e.getBBox()
            }
        } else {
            e = a.add(Ext.apply({group: b, type: "text", x: 0, y: 0, text: f}, d.label));
            a.renderItem(e);
            e._bbox = e.getBBox()
        }
        if (d.label.rotation) {
            e.setAttributes({rotation: {degrees: 0}}, true);
            e._ubbox = e.getBBox();
            e.setAttributes(d.label, true)
        } else {
            e._ubbox = e._bbox
        }
        return e
    },
    rect2pointArray: function (l) {
        var b = this.chart.surface, f = b.getBBox(l, true), m = [f.x, f.y], d = m.slice(), k = [f.x + f.width, f.y], a = k.slice(), j = [f.x + f.width, f.y + f.height], e = j.slice(), h = [f.x, f.y + f.height], c = h.slice(), g = l.matrix;
        m[0] = g.x.apply(g, d);
        m[1] = g.y.apply(g, d);
        k[0] = g.x.apply(g, a);
        k[1] = g.y.apply(g, a);
        j[0] = g.x.apply(g, e);
        j[1] = g.y.apply(g, e);
        h[0] = g.x.apply(g, c);
        h[1] = g.y.apply(g, c);
        return [m, k, j, h]
    },
    intersect: function (c, a) {
        var d = this.rect2pointArray(c), b = this.rect2pointArray(a);
        return !!Ext.draw.Draw.intersect(d, b).length
    },
    drawHorizontalLabels: function () {
        var E = this, e = E.label, A = Math.floor, w = Math.max, z = E.chart.axes, g = E.chart.insetPadding, f = E.chart.maxGutters, F = E.position, k = E.inflections, o = k.length, D = E.labels, t = 0, h, c, u, p, b, C = E.adjustEnd, a = z.findIndex("position", "left") != -1, n = z.findIndex("position", "right") != -1, j = E.reverse, B, r, s, m, q, l, v, d;
        m = o - 1;
        u = k[0];
        d = E.getOrCreateLabel(0, E.label.renderer(D[0]));
        h = Math.floor(Math.abs(Math.sin(e.rotate && (e.rotate.degrees * Math.PI / 180) || 0)));
        for (v = 0; v < o; v++) {
            u = k[v];
            s = v;
            if (j) {
                s = o - v - 1
            }
            r = E.label.renderer(D[s]);
            B = E.getOrCreateLabel(v, r);
            c = B._bbox;
            t = w(t, c.height + E.dashSize + E.label.padding);
            q = A(u[0] - (h ? c.height : c.width) / 2);
            if (C && f.left == 0 && f.right == 0) {
                if (v == 0 && !a) {
                    q = u[0]
                } else {
                    if (v == m && !n) {
                        q = Math.min(q, u[0] - c.width + g)
                    }
                }
            }
            if (F == "top") {
                l = u[1] - (E.dashSize * 2) - E.label.padding - (c.height / 2)
            } else {
                l = u[1] + (E.dashSize * 2) + E.label.padding + (c.height / 2)
            }
            B.setAttributes({hidden: false, x: q, y: l}, true);
            if (v != 0 && (E.intersect(B, p) || E.intersect(B, d))) {
                if (v === m && b !== 0) {
                    p.hide(true)
                } else {
                    B.hide(true);
                    continue
                }
            }
            p = B;
            b = v
        }
        return t
    },
    drawVerticalLabels: function () {
        var B = this, f = B.inflections, C = B.position, j = f.length, o = B.chart, e = o.insetPadding, A = B.labels, u = 0, r = Math.max, t = Math.floor, c = Math.ceil, s = B.chart.axes, d = B.chart.maxGutters, b, p, k, a, n = s.findIndex("position", "top") != -1, v = s.findIndex("position", "bottom") != -1, z = B.adjustEnd, w, m, h = j - 1, l, g, q;
        for (q = 0; q < j; q++) {
            p = f[q];
            m = B.label.renderer(A[q]);
            w = B.getOrCreateLabel(q, m);
            b = w._bbox;
            u = r(u, b.width + B.dashSize + B.label.padding);
            g = p[1];
            if (z && (d.bottom + d.top) < b.height / 2) {
                if (q == h && !n) {
                    g = Math.max(g, B.y - B.length + c(b.height / 2) - e)
                } else {
                    if (q == 0 && !v) {
                        g = B.y + d.bottom - t(b.height / 2)
                    }
                }
            }
            if (C == "left") {
                l = p[0] - b.width - B.dashSize - B.label.padding - 2
            } else {
                l = p[0] + B.dashSize + B.label.padding + 2
            }
            w.setAttributes(Ext.apply({hidden: false, x: l, y: g}, B.label), true);
            if (q != 0 && B.intersect(w, k)) {
                if (q === h && a !== 0) {
                    k.hide(true)
                } else {
                    w.hide(true);
                    continue
                }
            }
            k = w;
            a = q
        }
        return u
    },
    drawLabel: function () {
        var g = this, a = g.position, b = g.labelGroup, h = g.inflections, f = 0, e = 0, d, c;
        if (a == "left" || a == "right") {
            f = g.drawVerticalLabels()
        } else {
            e = g.drawHorizontalLabels()
        }
        d = b.getCount();
        c = h.length;
        for (; c < d; c++) {
            b.getAt(c).hide(true)
        }
        g.bbox = {};
        Ext.apply(g.bbox, g.axisBBox);
        g.bbox.height = e;
        g.bbox.width = f;
        if (Ext.isString(g.title)) {
            g.drawTitle(f, e)
        }
    },
    setTitle: function (a) {
        this.title = a;
        this.drawLabel()
    },
    drawTitle: function (m, n) {
        var h = this, g = h.position, e = h.titleAlign, b = h.chart.surface, c = h.displaySprite, l = h.title, f = (g == "left" || g == "right"), k = h.x, j = h.y, a, o, d;
        if (c) {
            c.setAttributes({text: l}, true)
        } else {
            a = {type: "text", x: 0, y: 0, text: l};
            c = h.displaySprite = b.add(Ext.apply(a, h.axisTitleStyle, h.labelTitle));
            b.renderItem(c)
        }
        o = c.getBBox();
        d = h.dashSize + h.label.padding;
        if (f) {
            if (e === "end") {
                j -= h.length - o.height
            } else {
                if (!e || e === "center") {
                    j -= ((h.length / 2) - (o.height / 2))
                }
            }
            if (g == "left") {
                k -= (m + d + (o.width / 2))
            } else {
                k += (m + d + o.width - (o.width / 2))
            }
            h.bbox.width += o.width + 10
        } else {
            if (e === "end" || (h.reverse && e === "start")) {
                k += h.length - o.width
            } else {
                if (!e || e === "center") {
                    k += (h.length / 2) - (o.width * 0.5)
                }
            }
            if (g == "top") {
                j -= (n + d + (o.height * 0.3))
            } else {
                j += (n + d + (o.height * 0.8))
            }
            h.bbox.height += o.height + 10
        }
        c.setAttributes({translate: {x: k, y: j}}, true)
    }
});
Ext.define("Ext.rtl.chart.axis.Axis", {
    override: "Ext.chart.axis.Axis", constructor: function () {
        var a = this, b;
        a.callParent(arguments);
        b = a.position;
        if (a.chart.getInherited().rtl && (b == "top" || b == "bottom")) {
            a.reverse = true
        }
    }
});
Ext.define("Ext.chart.axis.Category", {
    extend: "Ext.chart.axis.Axis",
    alternateClassName: "Ext.chart.CategoryAxis",
    alias: "axis.category",
    isCategoryAxis: true,
    doConstrain: function () {
        var g = this, f = g.chart, c = f.getChartStore(), b = c.data.items, e = f.series.items, a = e.length, h = [], d;
        for (d = 0; d < a; d++) {
            if (e[d].type === "bar" && e[d].stacked) {
                return
            }
        }
        for (d = g.minimum; d < g.maximum; d++) {
            h.push(b[d])
        }
        f.setSubStore(new Ext.data.Store({model: c.model, data: h}))
    },
    setLabels: function () {
        var l = this.chart.getChartStore(), c = l.data.items, j, g, e, h = this.fields, k = h.length, f, a, b;
        f = this.labels = [];
        for (j = 0, g = c.length; j < g; j++) {
            e = c[j];
            for (b = 0; b < k; b++) {
                a = e.get(h[b]);
                f.push(a)
            }
        }
    },
    applyData: function () {
        this.callParent();
        this.setLabels();
        var a = this.chart.getChartStore().getCount();
        return {from: 0, to: a - 1, power: 1, step: 1, steps: a - 1}
    }
});
Ext.define("Ext.chart.axis.Gauge", {
    extend: "Ext.chart.axis.Abstract",
    position: "gauge",
    alias: "axis.gauge",
    drawAxis: function (p) {
        var h = this.chart, a = h.surface, o = h.chartBBox, d = o.x + (o.width / 2), b = o.y + o.height, c = this.margin || 10, l = Math.min(o.width, 2 * o.height) / 2 + c, g = [], m, k = this.steps, e, f = Math.PI, n = Math.cos, j = Math.sin;
        if (this.sprites && !h.resizing) {
            this.drawLabel();
            return
        }
        if (this.margin >= 0) {
            if (!this.sprites) {
                for (e = 0; e <= k; e++) {
                    m = a.add({
                        type: "path",
                        path: ["M", d + (l - c) * n(e / k * f - f), b + (l - c) * j(e / k * f - f), "L", d + l * n(e / k * f - f), b + l * j(e / k * f - f), "Z"],
                        stroke: "#ccc"
                    });
                    m.setAttributes({hidden: false}, true);
                    g.push(m)
                }
            } else {
                g = this.sprites;
                for (e = 0; e <= k; e++) {
                    g[e].setAttributes({
                        path: ["M", d + (l - c) * n(e / k * f - f), b + (l - c) * j(e / k * f - f), "L", d + l * n(e / k * f - f), b + l * j(e / k * f - f), "Z"],
                        stroke: "#ccc"
                    }, true)
                }
            }
        }
        this.sprites = g;
        this.drawLabel();
        if (this.title) {
            this.drawTitle()
        }
    },
    drawTitle: function () {
        var e = this, d = e.chart, a = d.surface, f = d.chartBBox, c = e.titleSprite, b;
        if (!c) {
            e.titleSprite = c = a.add(Ext.apply({type: "text", zIndex: 2}, e.axisTitleStyle, e.labelTitle))
        }
        c.setAttributes(Ext.apply({text: e.title}, e.label || {}), true);
        b = c.getBBox();
        c.setAttributes({x: f.x + (f.width / 2) - (b.width / 2), y: f.y + f.height - (b.height / 2) - 4}, true)
    },
    setTitle: function (a) {
        this.title = a;
        this.drawTitle()
    },
    drawLabel: function () {
        var x = this, m = x.chart, q = m.surface, b = m.chartBBox, j = b.x + (b.width / 2), g = b.y + b.height, n = x.margin || 10, d = Math.min(b.width, 2 * b.height) / 2 + 2 * n, v = Math.round, o = [], f, t = x.maximum || 0, l = x.minimum || 0, s = x.steps, u = Math.PI, c = Math.cos, a = Math.sin, e = this.label, p = e.renderer || Ext.identityFn, h = x.reverse, r, w, k;
        if (!this.labelArray) {
            for (r = 0; r <= s; r++) {
                w = (r === 0 || r === s) ? 7 : 0;
                k = h ? s - r : r;
                f = q.add({
                    type: "text",
                    text: p(v(l + k / s * (t - l))),
                    x: j + d * c(r / s * u - u),
                    y: g + d * a(r / s * u - u) - w,
                    "text-anchor": "middle",
                    "stroke-width": 0.2,
                    zIndex: 10,
                    stroke: "#333"
                });
                f.setAttributes({hidden: false}, true);
                o.push(f)
            }
        } else {
            o = this.labelArray;
            for (r = 0; r <= s; r++) {
                w = (r === 0 || r === s) ? 7 : 0;
                k = h ? s - r : r;
                o[r].setAttributes({
                    text: p(v(l + k / s * (t - l))),
                    x: j + d * c(r / s * u - u),
                    y: g + d * a(r / s * u - u) - w
                }, true)
            }
        }
        this.labelArray = o
    }
});
Ext.define("Ext.rtl.chart.axis.Gauge", {
    override: "Ext.chart.axis.Gauge", constructor: function () {
        var a = this;
        a.callParent(arguments);
        if (a.chart.getInherited().rtl) {
            a.reverse = true
        }
    }
});
Ext.define("Ext.chart.axis.Numeric", {
    extend: "Ext.chart.axis.Axis",
    alternateClassName: "Ext.chart.NumericAxis",
    type: "Numeric",
    isNumericAxis: true,
    alias: "axis.numeric",
    uses: ["Ext.data.Store"],
    constructor: function (c) {
        var d = this, a = !!(c.label && c.label.renderer), b;
        d.callParent([c]);
        b = d.label;
        if (c.constrain == null) {
            d.constrain = (c.minimum != null && c.maximum != null)
        }
        if (!a) {
            b.renderer = function (e) {
                return d.roundToDecimal(e, d.decimals)
            }
        }
    },
    roundToDecimal: function (a, c) {
        var b = Math.pow(10, c || 0);
        return Math.round(a * b) / b
    },
    minimum: NaN,
    maximum: NaN,
    constrain: true,
    decimals: 2,
    scale: "linear",
    doConstrain: function () {
        var t = this, g = t.chart, b = g.getChartStore(), h = b.data.items, s, v, a, e = g.series.items, j = t.fields, c = j.length, f = t.calcEnds(), m = f.from, p = f.to, q, n, r = false, k, u = [], o;
        for (s = 0, v = h.length; s < v; s++) {
            o = true;
            a = h[s];
            for (q = 0; q < c; q++) {
                k = a.get(j[q]);
                if (t.type == "Time" && typeof k == "string") {
                    k = Date.parse(k)
                }
                if (+k < +m) {
                    o = false;
                    break
                }
                if (+k > +p) {
                    o = false;
                    break
                }
            }
            if (o) {
                u.push(a)
            }
        }
        g.setSubStore(new Ext.data.Store({model: b.model, data: u}))
    },
    position: "left",
    adjustMaximumByMajorUnit: false,
    adjustMinimumByMajorUnit: false,
    processView: function () {
        var e = this, d = e.chart, c = d.series.items, b, a;
        for (b = 0, a = c.length; b < a; b++) {
            if (c[b].stacked) {
                delete e.minimum;
                delete e.maximum;
                e.constrain = false;
                break
            }
        }
        if (e.constrain) {
            e.doConstrain()
        }
    },
    applyData: function () {
        this.callParent();
        return this.calcEnds()
    }
});
Ext.define("Ext.chart.axis.Radial", {
    extend: "Ext.chart.axis.Numeric",
    position: "radial",
    alias: "axis.radial",
    drawAxis: function (t) {
        var k = this.chart, a = k.surface, s = k.chartBBox, p = k.getChartStore(), b = p.getCount(), e = s.x + (s.width / 2), c = s.y + (s.height / 2), o = Math.min(s.width, s.height) / 2, h = [], q, n = this.steps, f, d, g = Math.PI * 2, r = Math.cos, m = Math.sin;
        if (this.sprites && !k.resizing) {
            this.drawLabel();
            return
        }
        if (!this.sprites) {
            for (f = 1; f <= n; f++) {
                q = a.add({type: "circle", x: e, y: c, radius: Math.max(o * f / n, 0), stroke: "#ccc"});
                q.setAttributes({hidden: false}, true);
                h.push(q)
            }
            for (f = 0; f < b; f++) {
                q = a.add({
                    type: "path",
                    path: ["M", e, c, "L", e + o * r(f / b * g), c + o * m(f / b * g), "Z"],
                    stroke: "#ccc"
                });
                q.setAttributes({hidden: false}, true);
                h.push(q)
            }
        } else {
            h = this.sprites;
            for (f = 0; f < n; f++) {
                h[f].setAttributes({x: e, y: c, radius: Math.max(o * (f + 1) / n, 0), stroke: "#ccc"}, true)
            }
            for (d = 0; d < b; d++) {
                h[f + d].setAttributes({
                    path: ["M", e, c, "L", e + o * r(d / b * g), c + o * m(d / b * g), "Z"],
                    stroke: "#ccc"
                }, true)
            }
        }
        this.sprites = h;
        this.drawLabel()
    },
    drawLabel: function () {
        var w = this.chart, c = w.series.items, q, B = w.surface, b = w.chartBBox, k = w.getChartStore(), J = k.data.items, o, h, n = b.x + (b.width / 2), m = b.y + (b.height / 2), g = Math.min(b.width, b.height) / 2, F = Math.max, I = Math.round, x = [], l, z = [], d, A = [], f, v = !this.maximum, H = this.maximum || 0, u = this.minimum || 0, G = this.steps, E = 0, D, s, r, y = Math.PI * 2, e = Math.cos, a = Math.sin, C = this.label.display, p = C !== "none", t = 10;
        if (!p) {
            return
        }
        for (E = 0, o = c.length; E < o; E++) {
            q = c[E];
            z.push(q.yField);
            f = q.xField
        }
        for (D = 0, o = J.length; D < o; D++) {
            h = J[D];
            A.push(h.get(f));
            if (v) {
                for (E = 0, d = z.length; E < d; E++) {
                    H = F(+h.get(z[E]), H)
                }
            }
        }
        if (!this.labelArray) {
            if (C != "categories") {
                for (E = 1; E <= G; E++) {
                    l = B.add({
                        type: "text",
                        text: I(E / G * H),
                        x: n,
                        y: m - g * E / G,
                        "text-anchor": "middle",
                        "stroke-width": 0.1,
                        stroke: "#333"
                    });
                    l.setAttributes({hidden: false}, true);
                    x.push(l)
                }
            }
            if (C != "scale") {
                for (D = 0, G = A.length; D < G; D++) {
                    s = e(D / G * y) * (g + t);
                    r = a(D / G * y) * (g + t);
                    l = B.add({
                        type: "text",
                        text: A[D],
                        x: n + s,
                        y: m + r,
                        "text-anchor": s * s <= 0.001 ? "middle" : (s < 0 ? "end" : "start")
                    });
                    l.setAttributes({hidden: false}, true);
                    x.push(l)
                }
            }
        } else {
            x = this.labelArray;
            if (C != "categories") {
                for (E = 0; E < G; E++) {
                    x[E].setAttributes({
                        text: I((E + 1) / G * (H - u) + u),
                        x: n,
                        y: m - g * (E + 1) / G,
                        "text-anchor": "middle",
                        "stroke-width": 0.1,
                        stroke: "#333"
                    }, true)
                }
            }
            if (C != "scale") {
                for (D = 0, G = A.length; D < G; D++) {
                    s = e(D / G * y) * (g + t);
                    r = a(D / G * y) * (g + t);
                    if (x[E + D]) {
                        x[E + D].setAttributes({
                            type: "text",
                            text: A[D],
                            x: n + s,
                            y: m + r,
                            "text-anchor": s * s <= 0.001 ? "middle" : (s < 0 ? "end" : "start")
                        }, true)
                    }
                }
            }
        }
        this.labelArray = x
    },
    processView: function () {
        var g = this, c = g.chart.series.items, e, f, d, b, a = [];
        for (e = 0, f = c.length; e < f; e++) {
            d = c[e];
            a.push(d.yField)
        }
        g.fields = a;
        b = g.calcEnds();
        g.maximum = b.to;
        g.steps = b.steps
    }
});
Ext.define("Ext.chart.axis.Time", {
    extend: "Ext.chart.axis.Numeric",
    alternateClassName: "Ext.chart.TimeAxis",
    type: "Time",
    alias: "axis.time",
    uses: ["Ext.data.Store"],
    dateFormat: false,
    fromDate: false,
    toDate: false,
    step: [Ext.Date.DAY, 1],
    constrain: false,
    constructor: function (b) {
        var c = this, a, d, e;
        c.callParent([b]);
        a = c.label || {};
        e = this.dateFormat;
        if (e) {
            if (a.renderer) {
                d = a.renderer;
                a.renderer = function (f) {
                    f = d(f);
                    return Ext.Date.format(new Date(d(f)), e)
                }
            } else {
                a.renderer = function (f) {
                    return Ext.Date.format(new Date(f >> 0), e)
                }
            }
        }
    },
    processView: function () {
        var a = this;
        if (a.fromDate) {
            a.minimum = +a.fromDate
        }
        if (a.toDate) {
            a.maximum = +a.toDate
        }
        if (a.constrain) {
            a.doConstrain()
        }
    },
    calcEnds: function () {
        var c = this, a, b = c.step;
        if (b) {
            a = c.getRange();
            a = Ext.draw.Draw.snapEndsByDateAndStep(new Date(a.min), new Date(a.max), Ext.isNumber(b) ? [Date.MILLI, b] : b);
            if (c.minimum) {
                a.from = c.minimum
            }
            if (c.maximum) {
                a.to = c.maximum
            }
            return a
        } else {
            return c.callParent(arguments)
        }
    }
});
Ext.define("Ext.chart.series.Series", {
    mixins: {
        observable: "Ext.util.Observable",
        labels: "Ext.chart.Label",
        highlights: "Ext.chart.Highlight",
        tips: "Ext.chart.Tip",
        callouts: "Ext.chart.Callout"
    },
    type: null,
    title: null,
    showInLegend: true,
    renderer: function (e, a, c, d, b) {
        return c
    },
    shadowAttributes: null,
    animating: false,
    nullGutters: {lower: 0, upper: 0, verticalAxis: undefined},
    nullPadding: {left: 0, right: 0, width: 0, bottom: 0, top: 0, height: 0},
    constructor: function (a) {
        var b = this;
        if (a) {
            Ext.apply(b, a)
        }
        b.shadowGroups = [];
        b.mixins.labels.constructor.call(b, a);
        b.mixins.highlights.constructor.call(b, a);
        b.mixins.tips.constructor.call(b, a);
        b.mixins.callouts.constructor.call(b, a);
        b.mixins.observable.constructor.call(b, a);
        b.on({scope: b, itemmouseover: b.onItemMouseOver, itemmouseout: b.onItemMouseOut, mouseleave: b.onMouseLeave});
        if (b.style) {
            Ext.apply(b.seriesStyle, b.style)
        }
    },
    initialize: Ext.emptyFn,
    onRedraw: Ext.emptyFn,
    eachRecord: function (c, b) {
        var a = this.chart;
        a.getChartStore().each(c, b)
    },
    getRecordCount: function () {
        var b = this.chart, a = b.getChartStore();
        return a ? a.getCount() : 0
    },
    isExcluded: function (a) {
        var b = this.__excludes;
        return !!(b && b[a])
    },
    setBBox: function (a) {
        var d = this, c = d.chart, b = c.chartBBox, g = a ? {left: 0, right: 0, bottom: 0, top: 0} : c.maxGutters, e, f;
        e = {x: b.x, y: b.y, width: b.width, height: b.height};
        d.clipBox = e;
        f = {
            x: (e.x + g.left) - (c.zoom.x * c.zoom.width),
            y: (e.y + g.bottom) - (c.zoom.y * c.zoom.height),
            width: (e.width - (g.left + g.right)) * c.zoom.width,
            height: (e.height - (g.bottom + g.top)) * c.zoom.height
        };
        d.bbox = f
    },
    onAnimate: function (b, a) {
        var c = this;
        b.stopAnimation();
        if (c.animating) {
            return b.animate(Ext.applyIf(a, c.chart.animate))
        } else {
            c.animating = true;
            return b.animate(Ext.apply(Ext.applyIf(a, c.chart.animate), {
                callback: function () {
                    c.animating = false;
                    c.fireEvent("afterrender", c)
                }
            }))
        }
    },
    getGutters: function () {
        return this.nullGutters
    },
    getPadding: function () {
        return this.nullPadding
    },
    onItemMouseOver: function (b) {
        var a = this;
        if (b.series === a) {
            if (a.highlight) {
                a.highlightItem(b)
            }
            if (a.tooltip) {
                a.showTip(b)
            }
        }
    },
    onItemMouseOut: function (b) {
        var a = this;
        if (b.series === a) {
            a.unHighlightItem();
            if (a.tooltip) {
                a.hideTip(b)
            }
        }
    },
    onMouseLeave: function () {
        var a = this;
        a.unHighlightItem();
        if (a.tooltip) {
            a.hideTip()
        }
    },
    getItemForPoint: function (a, h) {
        if (!this.items || !this.items.length || this.seriesIsHidden) {
            return null
        }
        var f = this, b = f.items, g = f.bbox, e, c, d;
        if (!Ext.draw.Draw.withinBox(a, h, g)) {
            return null
        }
        for (c = 0, d = b.length; c < d; c++) {
            if (b[c] && this.isItemInPoint(a, h, b[c], c)) {
                return b[c]
            }
        }
        return null
    },
    isItemInPoint: function (a, d, c, b) {
        return false
    },
    hideAll: function () {
        var g = this, f = g.items, k, e, d, c, a, h, b;
        g.seriesIsHidden = true;
        g._prevShowMarkers = g.showMarkers;
        g.showMarkers = false;
        g.hideLabels(0);
        for (d = 0, e = f.length; d < e; d++) {
            k = f[d];
            h = k.sprite;
            if (h) {
                h.setAttributes({hidden: true}, true)
            }
            if (h && h.shadows) {
                b = h.shadows;
                for (c = 0, a = b.length; c < a; ++c) {
                    b[c].setAttributes({hidden: true}, true)
                }
            }
        }
    },
    showAll: function () {
        var a = this, b = a.chart.animate;
        a.chart.animate = false;
        a.seriesIsHidden = false;
        a.showMarkers = a._prevShowMarkers;
        a.drawSeries();
        a.chart.animate = b
    },
    hide: function () {
        if (this.items) {
            var g = this, b = g.items, d, c, a, f, e;
            if (b && b.length) {
                for (d = 0, f = b.length; d < f; ++d) {
                    if (b[d].sprite) {
                        b[d].sprite.hide(true);
                        e = b[d].shadows || b[d].sprite.shadows;
                        if (e) {
                            for (c = 0, a = e.length; c < a; ++c) {
                                e[c].hide(true)
                            }
                        }
                    }
                }
                g.hideLabels()
            }
        }
    },
    getLegendColor: function (a) {
        var b = this, d, c;
        if (b.seriesStyle) {
            d = b.seriesStyle.fill;
            c = b.seriesStyle.stroke;
            if (d && d != "none") {
                return d
            }
            if (c) {
                return c
            }
        }
        return (b.colorArrayStyle) ? b.colorArrayStyle[b.themeIdx % b.colorArrayStyle.length] : "#000"
    },
    visibleInLegend: function (a) {
        var b = this.__excludes;
        if (b) {
            return !b[a]
        }
        return !this.seriesIsHidden
    },
    setTitle: function (a, d) {
        var c = this, b = c.title;
        if (Ext.isString(a)) {
            d = a;
            a = 0
        }
        if (Ext.isArray(b)) {
            b[a] = d
        } else {
            c.title = d
        }
        c.fireEvent("titlechange", d, a)
    }
});
Ext.define("Ext.chart.series.Cartesian", {
    extend: "Ext.chart.series.Series",
    alternateClassName: ["Ext.chart.CartesianSeries", "Ext.chart.CartesianChart"],
    xField: null,
    yField: null,
    axis: "left",
    getLegendLabels: function () {
        var h = this, e = [], f, d, g, j = h.combinations, k, a, c, b;
        f = [].concat(h.yField);
        for (d = 0, g = f.length; d < g; d++) {
            k = h.title;
            e.push((Ext.isArray(k) ? k[d] : k) || f[d])
        }
        if (j) {
            j = Ext.Array.from(j);
            for (d = 0, g = j.length; d < g; d++) {
                a = j[d];
                c = e[a[0]];
                b = e[a[1]];
                e[a[1]] = c + " & " + b;
                e.splice(a[0], 1)
            }
        }
        return e
    },
    eachYValue: function (b, e, d) {
        var h = this, g = h.getYValueAccessors(), c, f, a;
        for (c = 0, f = g.length; c < f; c++) {
            a = g[c];
            e.call(d, a(b), c)
        }
    },
    getYValueCount: function () {
        return this.getYValueAccessors().length
    },
    getYValueAccessors: function () {
        var d = this, a = d.yValueAccessors, f, b, c;

        function e(g) {
            return function (h) {
                return h.get(g)
            }
        }

        if (!a) {
            a = d.yValueAccessors = [];
            f = [].concat(d.yField);
            for (b = 0, c = f.length; b < c; b++) {
                a.push(e(f[b]))
            }
        }
        return a
    },
    getMinMaxXValues: function () {
        var k = this, j = k.chart, m = j.getChartStore(), d = m.data.items, g = k.getRecordCount(), e, h, f, c, l, a = k.xField, b;
        if (g > 0) {
            c = Infinity;
            l = -c;
            for (e = 0, h = d.length; e < h; e++) {
                f = d[e];
                b = f.get(a);
                if (b > l) {
                    l = b
                }
                if (b < c) {
                    c = b
                }
            }
            if (c == Infinity) {
                c = 0
            }
            if (l == -Infinity) {
                l = g - 1
            }
        } else {
            c = l = 0
        }
        return [c, l]
    },
    getMinMaxYValues: function () {
        var k = this, j = k.chart, o = j.getChartStore(), c = o.data.items, f = k.getRecordCount(), d, h, e, g = k.stacked, b, l, n, m;

        function a(r, q) {
            if (!k.isExcluded(q)) {
                if (r < 0) {
                    m += r
                } else {
                    n += r
                }
            }
        }

        function p(r, q) {
            if (!k.isExcluded(q)) {
                if (r > l) {
                    l = r
                }
                if (r < b) {
                    b = r
                }
            }
        }

        if (f > 0) {
            b = Infinity;
            l = -b;
            for (d = 0, h = c.length; d < h; d++) {
                e = c[d];
                if (g) {
                    n = 0;
                    m = 0;
                    k.eachYValue(e, a);
                    if (n > l) {
                        l = n
                    }
                    if (m < b) {
                        b = m
                    }
                } else {
                    k.eachYValue(e, p)
                }
            }
            if (b == Infinity) {
                b = 0
            }
            if (l == -Infinity) {
                l = f - 1
            }
        } else {
            b = l = 0
        }
        return [b, l]
    },
    getAxesForXAndYFields: function () {
        var m = this, l = m.chart.axes, j = m.reverse, d = [].concat(m.axis), c = {}, e = [].concat(m.yField), n = {}, o = [].concat(m.xField), h, b, a, g, k, f;
        f = m.type === "bar" && m.column === false;
        if (f) {
            h = e;
            e = o;
            o = h
        }
        if (Ext.Array.indexOf(d, "top") > -1) {
            b = "top"
        } else {
            if (Ext.Array.indexOf(d, "bottom") > -1) {
                b = "bottom"
            } else {
                if (l.get("top") && l.get("bottom")) {
                    for (g = 0, k = o.length; g < k; g++) {
                        n[o[g]] = true
                    }
                    h = [].concat(l.get("bottom").fields);
                    for (g = 0, k = h.length; g < k; g++) {
                        if (n[h[g]]) {
                            b = "bottom";
                            break
                        }
                    }
                    h = [].concat(l.get("top").fields);
                    for (g = 0, k = h.length; g < k; g++) {
                        if (n[h[g]]) {
                            b = "top";
                            break
                        }
                    }
                } else {
                    if (l.get("top")) {
                        b = "top"
                    } else {
                        if (l.get("bottom")) {
                            b = "bottom"
                        }
                    }
                }
            }
        }
        if (Ext.Array.indexOf(d, "left") > -1) {
            a = f ? "right" : "left"
        } else {
            if (Ext.Array.indexOf(d, "right") > -1) {
                a = f ? "left" : "right"
            } else {
                if (l.get("left") && l.get("right")) {
                    for (g = 0, k = e.length; g < k; g++) {
                        c[e[g]] = true
                    }
                    h = [].concat(l.get("right").fields);
                    for (g = 0, k = h.length; g < k; g++) {
                        if (c[h[g]]) {
                            break
                        }
                    }
                    h = [].concat(l.get("left").fields);
                    for (g = 0, k = h.length; g < k; g++) {
                        if (c[h[g]]) {
                            a = "left";
                            break
                        }
                    }
                } else {
                    if (l.get("left")) {
                        a = "left"
                    } else {
                        if (l.get("right")) {
                            a = "right"
                        }
                    }
                }
            }
        }
        return f ? {xAxis: a, yAxis: b} : {xAxis: b, yAxis: a}
    }
});
Ext.define("Ext.rtl.chart.series.Cartesian", {
    override: "Ext.chart.series.Cartesian", initialize: function () {
        var a = this;
        a.callParent(arguments);
        a.axis = a.chart.invertPosition(a.axis);
        if (a.chart.getInherited().rtl) {
            a.reverse = true
        }
    }
});
Ext.define("Ext.chart.series.Area", {
    extend: "Ext.chart.series.Cartesian",
    alias: "series.area",
    requires: ["Ext.chart.axis.Axis", "Ext.draw.Color", "Ext.fx.Anim"],
    type: "area",
    stacked: true,
    style: {},
    constructor: function (c) {
        this.callParent(arguments);
        var e = this, a = e.chart.surface, d, b;
        c.highlightCfg = Ext.Object.merge({}, {
            lineWidth: 3,
            stroke: "#55c",
            opacity: 0.8,
            color: "#f00"
        }, c.highlightCfg);
        Ext.apply(e, c, {__excludes: []});
        if (e.highlight) {
            e.highlightSprite = a.add({
                type: "path",
                path: ["M", 0, 0],
                zIndex: 1000,
                opacity: 0.3,
                lineWidth: 5,
                hidden: true,
                stroke: "#444"
            })
        }
        e.group = a.getGroup(e.seriesId)
    },
    shrink: function (b, m, n) {
        var h = b.length, l = Math.floor(h / n), g, f, d = 0, k = this.areas.length, a = [], e = [], c = [];
        for (f = 0; f < k; ++f) {
            a[f] = 0
        }
        for (g = 0; g < h; ++g) {
            d += +b[g];
            for (f = 0; f < k; ++f) {
                a[f] += +m[g][f]
            }
            if (g % l == 0) {
                e.push(d / l);
                for (f = 0; f < k; ++f) {
                    a[f] /= l
                }
                c.push(a);
                d = 0;
                for (f = 0, a = []; f < k; ++f) {
                    a[f] = 0
                }
            }
        }
        return {x: e, y: c}
    },
    getBounds: function () {
        var h = this, M = h.chart, a = M.getChartStore(), L = a.data.items, I, F, w, u = [].concat(h.yField), z = u.length, y = [], C = [], f = Infinity, B = f, A = f, m = -f, k = -f, r = Math, v = r.min, e = r.max, o = h.getAxesForXAndYFields(), J = o.xAxis, t = o.yAxis, G, q, D, j, g, E, p, N, K, b, s, H, c, d, n, x;
        h.setBBox();
        j = h.bbox;
        if (n = M.axes.get(J)) {
            if (n.type === "Time") {
                q = true
            }
            G = n.applyData();
            B = G.from;
            m = G.to
        }
        if (n = M.axes.get(t)) {
            G = n.applyData();
            A = G.from;
            k = G.to
        }
        if (h.xField && !Ext.isNumber(B)) {
            n = h.getMinMaxXValues();
            q = true;
            B = n[0];
            m = n[1]
        }
        if (h.yField && !Ext.isNumber(A)) {
            n = h.getMinMaxYValues();
            A = n[0];
            k = n[1]
        }
        if (!Ext.isNumber(A)) {
            A = 0
        }
        if (!Ext.isNumber(k)) {
            k = 0
        }
        F = L.length;
        if (F > 0 && q) {
            D = L[0].get(h.xField);
            if (typeof D != "number") {
                D = +D;
                if (isNaN(D)) {
                    q = false
                }
            }
        }
        for (I = 0; I < F; I++) {
            w = L[I];
            p = w.get(h.xField);
            N = [];
            if (typeof p != "number") {
                if (q) {
                    p = +p
                } else {
                    p = I
                }
            }
            y.push(p);
            b = 0;
            for (K = 0; K < z; K++) {
                if (h.__excludes[K]) {
                    continue
                }
                d = w.get(u[K]);
                if (typeof d == "number") {
                    N.push(d)
                }
            }
            C.push(N)
        }
        g = j.width / ((m - B) || 1);
        E = j.height / ((k - A) || 1);
        s = y.length;
        if ((s > j.width) && h.areas) {
            H = h.shrink(y, C, j.width);
            y = H.x;
            C = H.y
        }
        return {bbox: j, minX: B, minY: A, xValues: y, yValues: C, xScale: g, yScale: E, areasLen: z}
    },
    getPaths: function () {
        var A = this, n = A.chart, c = n.getChartStore(), e = true, f = A.getBounds(), a = f.bbox, o = A.items = [], z = [], b, d = 0, q = [], g = A.reverse, t, j, k, h, r, v, l, B, s, w, p, u, m;
        j = f.xValues.length;
        for (t = 0; t < j; t++) {
            r = f.xValues[t];
            m = g ? j - t - 1 : t;
            v = f.yValues[m];
            k = a.x + (r - f.minX) * f.xScale;
            if (u === undefined) {
                u = k
            }
            l = 0;
            d = 0;
            for (B = 0; B < f.areasLen; B++) {
                if (A.__excludes[B]) {
                    continue
                }
                if (!z[B]) {
                    z[B] = []
                }
                w = v[d];
                l += w;
                h = a.y + a.height - (l - f.minY) * f.yScale;
                if (!q[B]) {
                    q[B] = ["M", k, h];
                    z[B].push(["L", k, h])
                } else {
                    q[B].push("L", k, h);
                    z[B].push(["L", k, h])
                }
                if (!o[B]) {
                    o[B] = {pointsUp: [], pointsDown: [], series: A}
                }
                o[B].pointsUp.push([k, h]);
                d++
            }
        }
        for (B = 0; B < f.areasLen; B++) {
            if (A.__excludes[B]) {
                continue
            }
            p = q[B];
            if (B == 0 || e) {
                e = false;
                p.push("L", k, a.y + a.height, "L", u, a.y + a.height, "Z")
            } else {
                b = z[s];
                b.reverse();
                p.push("L", k, b[0][2]);
                for (t = 0; t < j; t++) {
                    p.push(b[t][0], b[t][1], b[t][2]);
                    o[B].pointsDown[j - t - 1] = [b[t][1], b[t][2]]
                }
                p.push("L", u, p[2], "Z")
            }
            s = B
        }
        return {paths: q, areasLen: f.areasLen}
    },
    drawSeries: function () {
        var h = this, g = h.chart, k = g.getChartStore(), d = g.surface, c = g.animate, m = h.group, b = Ext.apply(h.seriesStyle, h.style), n = h.colorArrayStyle, q = n && n.length || 0, a = h.themeIdx, e, f, p, o, l, j;
        h.unHighlightItem();
        h.cleanHighlights();
        if (!k || !k.getCount() || h.seriesIsHidden) {
            h.hide();
            h.items = [];
            return
        }
        p = h.getPaths();
        if (!h.areas) {
            h.areas = []
        }
        for (e = 0; e < p.areasLen; e++) {
            if (h.__excludes[e]) {
                continue
            }
            j = a + e;
            if (!h.areas[e]) {
                h.items[e].sprite = h.areas[e] = d.add(Ext.apply({}, {
                    type: "path",
                    group: m,
                    path: p.paths[e],
                    stroke: b.stroke || n[j % q],
                    fill: n[j % q]
                }, b || {}))
            }
            f = h.areas[e];
            o = p.paths[e];
            if (c) {
                l = h.renderer(f, false, {path: o, fill: n[e % q], stroke: b.stroke || n[e % q]}, e, k);
                h.animation = h.onAnimate(f, {to: l})
            } else {
                l = h.renderer(f, false, {path: o, hidden: false, fill: n[j % q], stroke: b.stroke || n[j % q]}, e, k);
                h.areas[e].setAttributes(l, true)
            }
        }
        h.renderLabels();
        h.renderCallouts()
    },
    onAnimate: function (b, a) {
        b.show();
        return this.callParent(arguments)
    },
    onCreateLabel: function (d, j, c, e) {
        return null;
        var f = this, g = f.labelsGroup, a = f.label, h = f.bbox, b = Ext.apply({}, a, f.seriesLabelStyle || {});
        return f.chart.surface.add(Ext.apply({
            type: "text",
            "text-anchor": "middle",
            group: g,
            x: Number(j.point[0]),
            y: h.y + h.height / 2
        }, b || {}))
    },
    onPlaceLabel: function (e, h, r, o, m, c, d) {
        var t = this, j = t.chart, q = j.resizing, s = t.label, p = s.renderer, b = s.field, a = t.bbox, g = Number(r.point[o][0]), f = Number(r.point[o][1]), n, l, k;
        e.setAttributes({text: p(h.get(b[d]), e, h, r, o, m, c, d), hidden: true}, true);
        n = e.getBBox();
        l = n.width / 2;
        k = n.height / 2;
        if (g < a.x + l) {
            g = a.x + l
        } else {
            if (g + l > a.x + a.width) {
                g = a.x + a.width - l
            }
        }
        f = f - k;
        if (f < a.y + k) {
            f += 2 * k
        } else {
            if (f + k > a.y + a.height) {
                f -= 2 * k
            }
        }
        if (t.chart.animate && !t.chart.resizing) {
            e.show(true);
            t.onAnimate(e, {to: {x: g, y: f}})
        } else {
            e.setAttributes({x: g, y: f}, true);
            if (q && t.animation) {
                t.animation.on("afteranimate", function () {
                    e.show(true)
                })
            } else {
                e.show(true)
            }
        }
    },
    onPlaceCallout: function (l, q, I, F, E, d, j) {
        var L = this, r = L.chart, C = r.surface, G = r.resizing, K = L.callouts, s = L.items, u = (F == 0) ? false : s[F - 1].point, w = (F == s.length - 1) ? false : s[F + 1].point, c = I.point, z, f, M, J, n, o, b = (l && l.label ? l.label.getBBox() : {
            width: 0,
            height: 0
        }), H = 30, B = 10, A = 3, g, e, h, v, t, D = L.clipRect, m, k;
        if (!b.width || !b.height) {
            return
        }
        if (!u) {
            u = c
        }
        if (!w) {
            w = c
        }
        J = (w[1] - u[1]) / (w[0] - u[0]);
        n = (c[1] - u[1]) / (c[0] - u[0]);
        o = (w[1] - c[1]) / (w[0] - c[0]);
        f = Math.sqrt(1 + J * J);
        z = [1 / f, J / f];
        M = [-z[1], z[0]];
        if (n > 0 && o < 0 && M[1] < 0 || n < 0 && o > 0 && M[1] > 0) {
            M[0] *= -1;
            M[1] *= -1
        } else {
            if (Math.abs(n) < Math.abs(o) && M[0] < 0 || Math.abs(n) > Math.abs(o) && M[0] > 0) {
                M[0] *= -1;
                M[1] *= -1
            }
        }
        m = c[0] + M[0] * H;
        k = c[1] + M[1] * H;
        g = m + (M[0] > 0 ? 0 : -(b.width + 2 * A));
        e = k - b.height / 2 - A;
        h = b.width + 2 * A;
        v = b.height + 2 * A;
        if (g < D[0] || (g + h) > (D[0] + D[2])) {
            M[0] *= -1
        }
        if (e < D[1] || (e + v) > (D[1] + D[3])) {
            M[1] *= -1
        }
        m = c[0] + M[0] * H;
        k = c[1] + M[1] * H;
        g = m + (M[0] > 0 ? 0 : -(b.width + 2 * A));
        e = k - b.height / 2 - A;
        h = b.width + 2 * A;
        v = b.height + 2 * A;
        l.lines.setAttributes({path: ["M", c[0], c[1], "L", m, k, "Z"]}, true);
        l.box.setAttributes({x: g, y: e, width: h, height: v}, true);
        l.label.setAttributes({x: m + (M[0] > 0 ? A : -(b.width + A)), y: k}, true);
        for (t in l) {
            l[t].show(true)
        }
    },
    isItemInPoint: function (j, h, m, c) {
        var g = this, b = m.pointsUp, e = m.pointsDown, q = Math.abs, o = false, l = false, d = g.reverse, f = Infinity, a, n, k;
        for (a = 0, n = b.length; a < n; a++) {
            k = [b[a][0], b[a][1]];
            o = false;
            l = a == n - 1;
            if (f > q(j - k[0])) {
                f = q(j - k[0]);
                o = true;
                if (l) {
                    ++a
                }
            }
            if (!o || (o && l)) {
                k = b[a - 1];
                if (h >= k[1] && (!e.length || h <= (e[a - 1][1]))) {
                    idx = d ? n - a : a - 1;
                    m.storeIndex = idx;
                    m.storeField = g.yField[c];
                    m.storeItem = g.chart.getChartStore().getAt(idx);
                    m._points = e.length ? [k, e[a - 1]] : [k];
                    return true
                } else {
                    break
                }
            }
        }
        return false
    },
    highlightSeries: function () {
        var a, c, b;
        if (this._index !== undefined) {
            a = this.areas[this._index];
            if (a.__highlightAnim) {
                a.__highlightAnim.paused = true
            }
            a.__highlighted = true;
            a.__prevOpacity = a.__prevOpacity || a.attr.opacity || 1;
            a.__prevFill = a.__prevFill || a.attr.fill;
            a.__prevLineWidth = a.__prevLineWidth || a.attr.lineWidth;
            b = Ext.draw.Color.fromString(a.__prevFill);
            c = {lineWidth: (a.__prevLineWidth || 0) + 2};
            if (b) {
                c.fill = b.getLighter(0.2).toString()
            } else {
                c.opacity = Math.max(a.__prevOpacity - 0.3, 0)
            }
            if (this.chart.animate) {
                a.__highlightAnim = new Ext.fx.Anim(Ext.apply({target: a, to: c}, this.chart.animate))
            } else {
                a.setAttributes(c, true)
            }
        }
    },
    unHighlightSeries: function () {
        var a;
        if (this._index !== undefined) {
            a = this.areas[this._index];
            if (a.__highlightAnim) {
                a.__highlightAnim.paused = true
            }
            if (a.__highlighted) {
                a.__highlighted = false;
                a.__highlightAnim = new Ext.fx.Anim({
                    target: a,
                    to: {fill: a.__prevFill, opacity: a.__prevOpacity, lineWidth: a.__prevLineWidth}
                })
            }
        }
    },
    highlightItem: function (c) {
        var b = this, a, d;
        if (!c) {
            this.highlightSeries();
            return
        }
        a = c._points;
        if (a.length === 2) {
            d = ["M", a[0][0], a[0][1], "L", a[1][0], a[1][1]]
        } else {
            d = ["M", a[0][0], a[0][1], "L", a[0][0], b.bbox.y + b.bbox.height]
        }
        b.highlightSprite.setAttributes({path: d, hidden: false}, true)
    },
    unHighlightItem: function (a) {
        if (!a) {
            this.unHighlightSeries()
        }
        if (this.highlightSprite) {
            this.highlightSprite.hide(true)
        }
    },
    hideAll: function (a) {
        var b = this;
        a = (isNaN(b._index) ? a : b._index) || 0;
        b.__excludes[a] = true;
        b.areas[a].hide(true);
        b.redraw()
    },
    showAll: function (a) {
        var b = this;
        a = (isNaN(b._index) ? a : b._index) || 0;
        b.__excludes[a] = false;
        b.areas[a].show(true);
        b.redraw()
    },
    redraw: function () {
        var a = this, b;
        b = a.chart.legend.rebuild;
        a.chart.legend.rebuild = false;
        a.chart.redraw();
        a.chart.legend.rebuild = b
    },
    hide: function () {
        if (this.areas) {
            var g = this, b = g.areas, d, c, a, f, e;
            if (b && b.length) {
                for (d = 0, f = b.length; d < f; ++d) {
                    if (b[d]) {
                        b[d].hide(true)
                    }
                }
                g.hideLabels()
            }
        }
    },
    getLegendColor: function (a) {
        var b = this;
        a += b.themeIdx;
        return b.colorArrayStyle[a % b.colorArrayStyle.length]
    }
});
Ext.define("Ext.chart.series.Bar", {
    extend: "Ext.chart.series.Cartesian",
    alternateClassName: ["Ext.chart.BarSeries", "Ext.chart.BarChart", "Ext.chart.StackedBarChart"],
    requires: ["Ext.chart.axis.Axis", "Ext.fx.Anim"],
    type: "bar",
    alias: "series.bar",
    column: false,
    style: {},
    gutter: 38.2,
    groupGutter: 38.2,
    xPadding: 0,
    yPadding: 10,
    defaultRotate: {x: 0, y: 0, degrees: 0},
    constructor: function (c) {
        this.callParent(arguments);
        var e = this, a = e.chart.surface, f = e.chart.shadow, d, b;
        c.highlightCfg = Ext.Object.merge({lineWidth: 3, stroke: "#55c", opacity: 0.8, color: "#f00"}, c.highlightCfg);
        Ext.apply(e, c, {
            shadowAttributes: [{
                "stroke-width": 6,
                "stroke-opacity": 0.05,
                stroke: "rgb(200, 200, 200)",
                translate: {x: 1.2, y: 1.2}
            }, {
                "stroke-width": 4,
                "stroke-opacity": 0.1,
                stroke: "rgb(150, 150, 150)",
                translate: {x: 0.9, y: 0.9}
            }, {"stroke-width": 2, "stroke-opacity": 0.15, stroke: "rgb(100, 100, 100)", translate: {x: 0.6, y: 0.6}}]
        });
        e.group = a.getGroup(e.seriesId + "-bars");
        if (f) {
            for (d = 0, b = e.shadowAttributes.length; d < b; d++) {
                e.shadowGroups.push(a.getGroup(e.seriesId + "-shadows" + d))
            }
        }
    },
    getPadding: function () {
        var c = this, b = c.xPadding, a = c.yPadding, d = {};
        if (Ext.isNumber(b)) {
            d.left = b;
            d.right = b
        } else {
            if (Ext.isObject(b)) {
                d.left = b.left;
                d.right = b.right
            } else {
                d.left = 0;
                d.right = 0
            }
        }
        d.width = d.left + d.right;
        if (Ext.isNumber(a)) {
            d.bottom = a;
            d.top = a
        } else {
            if (Ext.isObject(a)) {
                d.bottom = a.bottom;
                d.top = a.top
            } else {
                d.bottom = 0;
                d.top = 0
            }
        }
        d.height = d.bottom + d.top;
        return d
    },
    getBarGirth: function () {
        var d = this, a = d.chart.getChartStore(), b = d.column, c = a.getCount(), g = d.gutter / 100, f, e;
        e = (b ? "width" : "height");
        if (d.style && d.style[e]) {
            d.configuredColumnGirth = true;
            return +d.style[e]
        }
        f = d.getPadding();
        return (d.chart.chartBBox[e] - f[e]) / (c * (g + 1) - g)
    },
    getGutters: function () {
        var c = this, b = c.column, e = c.getPadding(), d = c.getBarGirth() / 2, f = Math.ceil((b ? e.left : e.bottom) + d), a = Math.ceil((b ? e.right : e.top) + d);
        return {lower: f, upper: a, verticalAxis: !b}
    },
    getBounds: function () {
        var q = this, V = q.chart, c = V.getChartStore(), U = c.data.items, T, B, H, z = [].concat(q.yField), m = [], r = z.length, n = r, d = q.groupGutter / 100, M = q.column, R = q.getPadding(), P = q.stacked, x = q.getBarGirth(), C = M ? "width" : "height", y = Math, F = y.min, k = y.max, o = y.abs, K = q.getAxesForXAndYFields(), E = K.yAxis, L, v, O, h, u, S, G, f, s, J, t, w, I, D, a, A, N, Q, e, g, p, b, l;
        q.setBBox(true);
        s = q.bbox;
        if (q.__excludes) {
            for (Q = 0, A = q.__excludes.length; Q < A; Q++) {
                if (q.__excludes[Q]) {
                    n--
                }
            }
        }
        w = V.axes.get(E);
        if (w) {
            S = w.applyData();
            J = S.from;
            t = S.to
        }
        if (q.yField && !Ext.isNumber(J)) {
            I = q.getMinMaxYValues();
            J = I[0];
            t = I[1]
        }
        if (!Ext.isNumber(J)) {
            J = 0
        }
        if (!Ext.isNumber(t)) {
            t = 0
        }
        D = (M ? s.height - R.height : s.width - R.width) / (t - J);
        G = x;
        f = (x / ((P ? 1 : n) * (d + 1) - d));
        if (C in q.style) {
            f = F(f, q.style[C]);
            G = f * ((P ? 1 : n) * (d + 1) - d)
        }
        a = (M) ? s.y + s.height - R.bottom : s.x + R.left;
        if (P) {
            A = [[], []];
            for (T = 0, B = U.length; T < B; T++) {
                H = U[T];
                A[0][T] = A[0][T] || 0;
                A[1][T] = A[1][T] || 0;
                for (Q = 0; Q < r; Q++) {
                    if (q.__excludes && q.__excludes[Q]) {
                        continue
                    }
                    N = H.get(z[Q]);
                    A[+(N > 0)][T] += o(N)
                }
            }
            A[+(t > 0)].push(o(t));
            A[+(J > 0)].push(o(J));
            g = k.apply(y, A[0]);
            e = k.apply(y, A[1]);
            D = (M ? s.height - R.height : s.width - R.width) / (e + g);
            a = a + g * D * (M ? -1 : 1)
        } else {
            if (J / t < 0) {
                a = a - J * D * (M ? -1 : 1)
            }
        }
        if (q.boundColumn) {
            w = V.axes.get(K.xAxis);
            if (w) {
                S = w.applyData();
                L = S.from;
                v = S.to
            }
            if (q.xField && !Ext.isNumber(L)) {
                I = q.getMinMaxYValues();
                L = I[0];
                v = I[1]
            }
            if (!Ext.isNumber(L)) {
                L = 0
            }
            if (!Ext.isNumber(v)) {
                v = 0
            }
            u = q.getGutters();
            O = (s.width - (u.lower + u.upper)) / ((v - L) || 1);
            h = s.x + u.lower;
            m = [];
            for (T = 0, B = U.length; T < B; T++) {
                H = U[T];
                N = H.get(q.xField);
                m[T] = h + (N - L) * O - (f / 2)
            }
        } else {
            if (q.configuredColumnGirth) {
                w = V.axes.get(K.xAxis);
                if (w) {
                    p = w.inflections;
                    if (w.isCategoryAxis || p.length == U.length) {
                        m = [];
                        for (T = 0, B = U.length; T < B; T++) {
                            b = p[T];
                            l = M ? b[0] : b[1];
                            m[T] = l - (G / 2)
                        }
                    }
                }
            }
        }
        return {
            bars: z,
            barsLoc: m,
            bbox: s,
            shrunkBarWidth: G,
            barsLen: r,
            groupBarsLen: n,
            barWidth: x,
            groupBarWidth: f,
            scale: D,
            zero: a,
            padding: R,
            signed: J / t < 0,
            minY: J,
            maxY: t
        }
    },
    getPaths: function () {
        var u = this, ae = u.chart, c = ae.getChartStore(), ad = c.data.items, ab, H, O, J = u.bounds = u.getBounds(), y = u.items = [], T = Ext.isArray(u.yField) ? u.yField : [u.yField], m = u.gutter / 100, d = u.groupGutter / 100, Y = ae.animate, Q = u.column, w = u.group, n = ae.shadow, V = u.shadowGroups, U = u.shadowAttributes, q = V.length, x = J.bbox, C = J.barWidth, N = J.shrunkBarWidth, aa = u.getPadding(), W = u.stacked, v = J.barsLen, R = u.colorArrayStyle, k = R && R.length || 0, h = u.themeIdx, S = u.reverse, E = Math, o = E.max, L = E.min, t = E.abs, Z, ag, f, M, G, b, l, s, r, p, g, ah, F, e, I, z, P, K, ac, X, D, af, a, A, B;
        for (ab = 0, H = ad.length; ab < H; ab++) {
            O = ad[ab];
            b = J.zero;
            l = J.zero;
            M = 0;
            G = 0;
            ah = F = 0;
            s = false;
            A = 0;
            for (Z = 0, g = 0; Z < v; Z++) {
                if (u.__excludes && u.__excludes[Z]) {
                    continue
                }
                ag = O.get(J.bars[Z]);
                if (ag >= 0) {
                    ah += ag
                } else {
                    F += ag
                }
                f = Math.round((ag - o(J.minY, 0)) * J.scale);
                ac = h + (v > 1 ? Z : 0);
                r = {fill: R[ac % k]};
                if (Q) {
                    ac = S ? (H - ab - 1) : ab;
                    B = S ? (v - g - 1) : g;
                    if (u.boundColumn) {
                        D = J.barsLoc[ac]
                    } else {
                        if (u.configuredColumnGirth && J.barsLoc.length) {
                            D = J.barsLoc[ac] + B * J.groupBarWidth * (1 + d) * !W
                        } else {
                            D = x.x + aa.left + (C - N) * 0.5 + ac * C * (1 + m) + B * J.groupBarWidth * (1 + d) * !W
                        }
                    }
                    Ext.apply(r, {height: f, width: o(J.groupBarWidth, 0), x: D, y: b - f})
                } else {
                    P = (H - 1) - ab;
                    a = f + (b == J.zero);
                    D = b + (b != J.zero);
                    if (S) {
                        D = J.zero + x.width - a - (A === 0 ? 1 : 0);
                        if (W) {
                            D -= A;
                            A += a
                        }
                    }
                    if (u.configuredColumnGirth && J.barsLoc.length) {
                        af = J.barsLoc[ab] + g * J.groupBarWidth * (1 + d) * !W
                    } else {
                        af = x.y + aa.top + (C - N) * 0.5 + P * C * (1 + m) + g * J.groupBarWidth * (1 + d) * !W + 1
                    }
                    Ext.apply(r, {height: o(J.groupBarWidth, 0), width: a, x: D, y: af})
                }
                if (f < 0) {
                    if (Q) {
                        r.y = l;
                        r.height = t(f)
                    } else {
                        r.x = l + f;
                        r.width = t(f)
                    }
                }
                if (W) {
                    if (f < 0) {
                        l += f * (Q ? -1 : 1)
                    } else {
                        b += f * (Q ? -1 : 1)
                    }
                    M += t(f);
                    if (f < 0) {
                        G += t(f)
                    }
                }
                r.x = Math.floor(r.x) + 1;
                K = Math.floor(r.y);
                if (Ext.isIE8 && r.y > K) {
                    K--
                }
                r.y = K;
                r.width = Math.floor(r.width);
                r.height = Math.floor(r.height);
                y.push({
                    series: u,
                    yField: T[Z],
                    storeItem: O,
                    value: [O.get(u.xField), ag],
                    attr: r,
                    point: Q ? [r.x + r.width / 2, ag >= 0 ? r.y : r.y + r.height] : [ag >= 0 ? r.x + r.width : r.x, r.y + r.height / 2]
                });
                if (Y && ae.resizing) {
                    p = Q ? {x: r.x, y: J.zero, width: r.width, height: 0} : {
                        x: J.zero,
                        y: r.y,
                        width: 0,
                        height: r.height
                    };
                    if (n && (W && !s || !W)) {
                        s = true;
                        for (e = 0; e < q; e++) {
                            I = V[e].getAt(W ? ab : (ab * v + Z));
                            if (I) {
                                I.setAttributes(p, true)
                            }
                        }
                    }
                    z = w.getAt(ab * v + Z);
                    if (z) {
                        z.setAttributes(p, true)
                    }
                }
                g++
            }
            if (W && y.length) {
                y[ab * g].totalDim = M;
                y[ab * g].totalNegDim = G;
                y[ab * g].totalPositiveValues = ah;
                y[ab * g].totalNegativeValues = F
            }
        }
        if (W && g == 0) {
            for (ab = 0, H = ad.length; ab < H; ab++) {
                for (e = 0; e < q; e++) {
                    I = V[e].getAt(ab);
                    if (I) {
                        I.hide(true)
                    }
                }
            }
        }
    },
    renderShadows: function (u, v, y, k) {
        var z = this, p = z.chart, s = p.surface, f = p.animate, x = z.stacked, a = z.shadowGroups, w = z.shadowAttributes, o = a.length, g = p.getChartStore(), d = z.column, r = z.items, b = [], l = z.reverse, m = k.zero, e, q, h, A, n, t, c;
        if ((x && (u % k.groupBarsLen === 0)) || !x) {
            t = u / k.groupBarsLen;
            for (e = 0; e < o; e++) {
                q = Ext.apply({}, w[e]);
                h = a[e].getAt(x ? t : u);
                Ext.copyTo(q, v, "x,y,width,height");
                if (!h) {
                    h = s.add(Ext.apply({type: "rect", isShadow: true, group: a[e]}, Ext.apply({}, y, q)))
                }
                if (x) {
                    A = r[u].totalDim;
                    n = r[u].totalNegDim;
                    if (d) {
                        q.y = m + n - A - 1;
                        q.height = A
                    } else {
                        if (l) {
                            q.x = m + k.bbox.width - A
                        } else {
                            q.x = m - n
                        }
                        q.width = A
                    }
                }
                c = z.renderer(h, g.getAt(t), q, u, g);
                c.hidden = !!v.hidden;
                if (f) {
                    z.onAnimate(h, {zero: k.zero + (l ? k.bbox.width : 0), to: c})
                } else {
                    h.setAttributes(c, true)
                }
                b.push(h)
            }
        }
        return b
    },
    drawSeries: function () {
        var F = this, r = F.chart, l = r.getChartStore(), w = r.surface, h = r.animate, C = F.stacked, d = F.column, D = r.axes, x = F.getAxesForXAndYFields(), v = x.xAxis, m = x.yAxis, b = r.shadow, a = F.shadowGroups, q = a.length, o = F.group, f = F.seriesStyle, s, p, A, z, E, t, c, e, g, n, k, B, u, y;
        if (!l || !l.getCount() || F.seriesIsHidden) {
            F.hide();
            F.items = [];
            return
        }
        k = Ext.apply({}, this.style, f);
        delete k.fill;
        delete k.x;
        delete k.y;
        delete k.width;
        delete k.height;
        F.unHighlightItem();
        F.cleanHighlights();
        F.boundColumn = (v && Ext.Array.contains(F.axis, v) && D.get(v) && D.get(v).isNumericAxis);
        F.getPaths();
        n = F.bounds;
        s = F.items;
        E = d ? {y: n.zero, height: 0} : {x: n.zero, width: 0};
        p = s.length;
        for (A = 0; A < p; A++) {
            t = o.getAt(A);
            B = s[A].attr;
            if (b) {
                s[A].shadows = F.renderShadows(A, B, E, n)
            }
            if (!t) {
                u = Ext.apply({}, E, B);
                u = Ext.apply(u, k || {});
                t = w.add(Ext.apply({}, {type: "rect", group: o}, u))
            }
            if (h) {
                c = F.renderer(t, l.getAt(A), B, A, l);
                t._to = c;
                y = F.onAnimate(t, {zero: n.zero + (F.reverse ? n.bbox.width : 0), to: Ext.apply(c, k)});
                if (b && C && (A % n.barsLen === 0)) {
                    z = A / n.barsLen;
                    for (e = 0; e < q; e++) {
                        y.on("afteranimate", function () {
                            this.show(true)
                        }, a[e].getAt(z))
                    }
                }
            } else {
                c = F.renderer(t, l.getAt(A), Ext.apply(B, {hidden: false}), A, l);
                t.setAttributes(Ext.apply(c, k), true)
            }
            s[A].sprite = t
        }
        p = o.getCount();
        for (z = A; z < p; z++) {
            o.getAt(z).hide(true)
        }
        if (F.stacked) {
            A = l.getCount()
        }
        if (b) {
            for (e = 0; e < q; e++) {
                g = a[e];
                p = g.getCount();
                for (z = A; z < p; z++) {
                    g.getAt(z).hide(true)
                }
            }
        }
        F.renderLabels()
    },
    onCreateLabel: function (e, k, d, f) {
        var g = this, a = g.chart.surface, j = g.labelsGroup, b = g.label, c = Ext.apply({}, b, g.seriesLabelStyle || {}), h;
        return a.add(Ext.apply({type: "text", group: j}, c || {}))
    },
    onPlaceLabel: function (J, Q, s, M, p, L, v) {
        var l = this, m = l.bounds, d = m.groupBarWidth, H = l.column, O = l.chart, u = O.chartBBox, C = O.resizing, o = s.value[0], R = s.value[1], k = s.attr, A = l.label, K = l.stacked, g = A.stackedDisplay, N = (A.orientation == "vertical"), h = [].concat(A.field), t = A.renderer, r, f, a, c, b = m.zero, q = "insideStart", P = "insideEnd", j = "outside", F = "over", n = "under", G = 4, E = 2, e = m.signed, I = l.reverse, D, B, z;
        if (p == q || p == P || p == j) {
            if (K && (p == j)) {
                J.hide(true);
                return
            }
            J.setAttributes({style: undefined});
            r = (Ext.isNumber(v) ? t(Q.get(h[v]), J, Q, s, M, p, L, v) : "");
            J.setAttributes({text: r});
            f = l.getLabelSize(r, J.attr.style);
            a = f.width;
            c = f.height;
            if (H) {
                if (!a || !c || (K && (k.height < c))) {
                    J.hide(true);
                    return
                }
                D = k.x + (N ? d / 2 : (d - a) / 2);
                if (p == j) {
                    var w = (R >= 0 ? (k.y - u.y) : (u.y + u.height - k.y - k.height));
                    if (w < c + E) {
                        p = P
                    }
                }
                if (!K && (p != j)) {
                    if (c + E > k.height) {
                        p = j
                    }
                }
                if (!B) {
                    B = k.y;
                    if (R >= 0) {
                        switch (p) {
                            case q:
                                B += k.height + (N ? -E : -c / 2);
                                break;
                            case P:
                                B += (N ? c + G : c / 2);
                                break;
                            case j:
                                B += (N ? -E : -c / 2);
                                break
                        }
                    } else {
                        switch (p) {
                            case q:
                                B += (N ? c + E : c / 2);
                                break;
                            case P:
                                B += (N ? k.height - E : k.height - c / 2);
                                break;
                            case j:
                                B += (N ? k.height + c + E : k.height + c / 2);
                                break
                        }
                    }
                }
            } else {
                if (!a || !c || (K && !k.width)) {
                    J.hide(true);
                    return
                }
                B = k.y + (N ? (d + c) / 2 : d / 2);
                if (p == j) {
                    var w = (R >= 0 ? (u.x + u.width - k.x - k.width) : (k.x - u.x));
                    if (w < a + G) {
                        p = P
                    }
                }
                if ((p != j) && !N) {
                    if (a + G * 2 >= k.width) {
                        if (K) {
                            if (c > k.width) {
                                J.hide(true);
                                return
                            }
                            D = k.x + k.width / 2;
                            N = true
                        } else {
                            p = j
                        }
                    }
                }
                if (!D) {
                    D = k.x;
                    if (R >= 0) {
                        switch (p) {
                            case q:
                                if (I) {
                                    D += k.width + (N ? -a / 2 : -a - G)
                                } else {
                                    D += (N ? a / 2 : G)
                                }
                                break;
                            case P:
                                if (I) {
                                    D -= N ? -a / 2 : -a - G
                                } else {
                                    D += k.width + (N ? -a / 2 : -a - G)
                                }
                                break;
                            case j:
                                if (I) {
                                    D -= a + (N ? a / 2 : G)
                                } else {
                                    D += k.width + (N ? a / 2 : G)
                                }
                                break
                        }
                    } else {
                        switch (p) {
                            case q:
                                if (I) {
                                    D -= N ? -a / 2 : -a - G
                                } else {
                                    D += k.width + (N ? -a / 2 : -a - G)
                                }
                                break;
                            case P:
                                if (I) {
                                    D += k.width + (N ? -a / 2 : -a - G)
                                } else {
                                    D += (N ? a / 2 : G)
                                }
                                break;
                            case j:
                                if (I) {
                                    D -= a + (N ? a / 2 : G)
                                } else {
                                    D += (N ? -a / 2 : -a - G)
                                }
                                break
                        }
                    }
                }
            }
        } else {
            if (p == F || p == n) {
                if (K && g) {
                    r = J.attr.text;
                    J.setAttributes({
                        style: Ext.applyIf((J.attr && J.attr.style) || {}, {
                            "font-weight": "bold",
                            "font-size": "14px"
                        })
                    });
                    f = l.getLabelSize(r, J.attr.style);
                    a = f.width;
                    c = f.height;
                    switch (p) {
                        case F:
                            if (H) {
                                D = k.x + (N ? d / 2 : (d - a) / 2);
                                B = b - (s.totalDim - s.totalNegDim) - c / 2 - E
                            } else {
                                D = b + (s.totalDim - s.totalNegDim) + G;
                                B = k.y + (N ? (d + c) / 2 : d / 2)
                            }
                            break;
                        case n:
                            if (H) {
                                D = k.x + (N ? d / 2 : (d - a) / 2);
                                B = b + s.totalNegDim + c / 2
                            } else {
                                D = b - s.totalNegDim - a - G;
                                B = k.y + (N ? (d + c) / 2 : d / 2)
                            }
                            break
                    }
                }
            }
        }
        if (D == undefined || B == undefined) {
            J.hide(true);
            return
        }
        J.isOutside = (p == j);
        J.setAttributes({text: r});
        z = {x: D, y: B};
        z.rotate = N ? {x: D, y: B, degrees: 270} : l.defaultRotate;
        if (L && C) {
            if (H) {
                D = k.x + k.width / 2;
                B = b
            } else {
                D = b;
                B = k.y + k.height / 2
            }
            J.setAttributes({x: D, y: B}, true);
            if (N) {
                J.setAttributes({rotate: {x: D, y: B, degrees: 270}}, true)
            }
        }
        if (L) {
            l.onAnimate(J, {zero: s.point[0], to: z})
        } else {
            J.setAttributes(Ext.apply(z, {hidden: false}), true)
        }
    },
    getLabelSize: function (g, f) {
        var l = this.testerLabel, a = this.label, d = Ext.apply({}, a, f, this.seriesLabelStyle || {}), b = a.orientation === "vertical", k, j, e, c;
        if (!l) {
            l = this.testerLabel = this.chart.surface.add(Ext.apply({type: "text", opacity: 0}, d))
        }
        l.setAttributes({style: f, text: g}, true);
        k = l.getBBox();
        j = k.width;
        e = k.height;
        return {width: b ? e : j, height: b ? j : e}
    },
    onAnimate: function (k, e) {
        var f = this, j = e.to, c = f.stacked, d = f.reverse, a = 0, b, l, g, h;
        k.show();
        if (!f.column) {
            if (d) {
                l = k.getBBox();
                b = k.type == "text";
                if (!f.inHighlight) {
                    if (!c) {
                        if (b) {
                            g = l.x >= 5 ? g : e.zero
                        } else {
                            if (l.width) {
                                a = l.width
                            }
                            g = l.width ? l.x : j.x + j.width
                        }
                    } else {
                        g = e.zero
                    }
                }
                e.from = {x: g, width: a}
            }
            if (c) {
                h = e.from;
                if (!h) {
                    h = e.from = {}
                }
                h.y = j.y;
                if (!d) {
                    h.x = e.zero;
                    if (k.isShadow) {
                        h.width = 0
                    }
                }
            }
        }
        return this.callParent(arguments)
    },
    isItemInPoint: function (a, d, b) {
        var c = b.sprite.getBBox();
        return c.x <= a && c.y <= d && (c.x + c.width) >= a && (c.y + c.height) >= d
    },
    hideAll: function (a) {
        var e = this.chart.axes, c = e.items, d = c.length, b = 0;
        a = (isNaN(this._index) ? a : this._index) || 0;
        if (!this.__excludes) {
            this.__excludes = []
        }
        this.__excludes[a] = true;
        this.drawSeries();
        for (b; b < d; b++) {
            c[b].drawAxis()
        }
    },
    showAll: function (a) {
        var e = this.chart.axes, c = e.items, d = c.length, b = 0;
        a = (isNaN(this._index) ? a : this._index) || 0;
        if (!this.__excludes) {
            this.__excludes = []
        }
        this.__excludes[a] = false;
        this.drawSeries();
        for (b; b < d; b++) {
            c[b].drawAxis()
        }
    },
    getLegendColor: function (b) {
        var d = this, a = d.colorArrayStyle, c = a && a.length;
        if (d.style && d.style.fill) {
            return d.style.fill
        } else {
            return (a ? a[(d.themeIdx + b) % c] : "#000")
        }
    },
    highlightItem: function (a) {
        this.callParent(arguments);
        this.inHighlight = true;
        this.renderLabels();
        delete this.inHighlight
    },
    unHighlightItem: function () {
        this.callParent(arguments);
        this.inHighlight = true;
        this.renderLabels();
        delete this.inHighlight
    },
    cleanHighlights: function () {
        this.callParent(arguments);
        this.inHighlight = true;
        this.renderLabels();
        delete this.inHighlight
    }
});
Ext.define("Ext.chart.series.Column", {
    alternateClassName: ["Ext.chart.ColumnSeries", "Ext.chart.ColumnChart", "Ext.chart.StackedColumnChart"],
    extend: "Ext.chart.series.Bar",
    type: "column",
    alias: "series.column",
    column: true,
    boundColumn: false,
    xPadding: 10,
    yPadding: 0
});
Ext.define("Ext.chart.series.Gauge", {
    extend: "Ext.chart.series.Series",
    type: "gauge",
    alias: "series.gauge",
    rad: Math.PI / 180,
    highlightDuration: 150,
    angleField: false,
    needle: false,
    donut: false,
    showInLegend: false,
    style: {},
    constructor: function (b) {
        this.callParent(arguments);
        var g = this, f = g.chart, a = f.surface, h = f.store, j = f.shadow, d, c, e;
        Ext.apply(g, b, {
            shadowAttributes: [{
                "stroke-width": 6,
                "stroke-opacity": 1,
                stroke: "rgb(200, 200, 200)",
                translate: {x: 1.2, y: 2}
            }, {
                "stroke-width": 4,
                "stroke-opacity": 1,
                stroke: "rgb(150, 150, 150)",
                translate: {x: 0.9, y: 1.5}
            }, {"stroke-width": 2, "stroke-opacity": 1, stroke: "rgb(100, 100, 100)", translate: {x: 0.6, y: 1}}]
        });
        g.group = a.getGroup(g.seriesId);
        if (j) {
            for (d = 0, c = g.shadowAttributes.length; d < c; d++) {
                g.shadowGroups.push(a.getGroup(g.seriesId + "-shadows" + d))
            }
        }
        a.customAttributes.segment = function (l) {
            var k = l.series || g;
            delete l.series;
            return g.getSegment.call(k, l)
        }
    },
    initialize: function () {
        var d = this, a = d.chart.getChartStore(), e = a.data.items, b = d.label, c = e.length;
        d.yField = [];
        if (b && b.field && c > 0) {
            d.yField.push(e[0].get(b.field))
        }
    },
    getSegment: function (b) {
        var C = this, B = C.rad, d = Math.cos, a = Math.sin, n = Math.abs, k = C.centerX, h = C.centerY, w = 0, v = 0, u = 0, s = 0, g = 0, f = 0, e = 0, c = 0, z = 0.01, m = b.endRho - b.startRho, q = b.startAngle, p = b.endAngle, j = (q + p) / 2 * B, l = b.margin || 0, t = n(p - q) > 180, D = Math.min(q, p) * B, A = Math.max(q, p) * B, o = false;
        k += l * d(j);
        h += l * a(j);
        w = k + b.startRho * d(D);
        g = h + b.startRho * a(D);
        v = k + b.endRho * d(D);
        f = h + b.endRho * a(D);
        u = k + b.startRho * d(A);
        e = h + b.startRho * a(A);
        s = k + b.endRho * d(A);
        c = h + b.endRho * a(A);
        if (n(w - u) <= z && n(g - e) <= z) {
            o = true
        }
        if (o) {
            return {path: [["M", w, g], ["L", v, f], ["A", b.endRho, b.endRho, 0, +t, 1, s, c], ["Z"]]}
        } else {
            return {path: [["M", w, g], ["L", v, f], ["A", b.endRho, b.endRho, 0, +t, 1, s, c], ["L", u, e], ["A", b.startRho, b.startRho, 0, +t, 0, w, g], ["Z"]]}
        }
    },
    calcMiddle: function (p) {
        var k = this, l = k.rad, o = p.slice, n = k.centerX, m = k.centerY, j = o.startAngle, e = o.endAngle, h = Math.max(("rho" in o) ? o.rho : k.radius, k.label.minMargin), g = +k.donut, b = Math.min(j, e) * l, a = Math.max(j, e) * l, d = -(b + (a - b) / 2), f = n + (p.endRho + p.startRho) / 2 * Math.cos(d), c = m - (p.endRho + p.startRho) / 2 * Math.sin(d);
        p.middle = {x: f, y: c}
    },
    drawSeries: function () {
        var w = this, V = w.chart, b = V.getChartStore(), A = w.group, R = w.chart.animate, D = w.chart.axes.get(0), E = D && D.minimum || w.minimum || 0, I = D && D.maximum || w.maximum || 0, n = w.angleField || w.field || w.xField, K = V.surface, H = V.chartBBox, h = w.rad, d = +w.donut, W = {}, B = [], m = w.seriesStyle, a = w.seriesLabelStyle, g = w.colorArrayStyle, z = g && g.length || 0, k = Math.cos, s = Math.sin, c = -180, O = w.reverse, t, f, e, v, r, C, M, F, G, J, T, S, l, U, x, o, P, Q, q, y, u, N, L;
        Ext.apply(m, w.style || {});
        w.setBBox();
        y = w.bbox;
        if (w.colorSet) {
            g = w.colorSet;
            z = g.length
        }
        if (!b || !b.getCount() || w.seriesIsHidden) {
            w.hide();
            w.items = [];
            return
        }
        f = w.centerX = H.x + (H.width / 2);
        e = w.centerY = H.y + H.height;
        w.radius = Math.min(f - H.x, e - H.y);
        w.slices = r = [];
        w.items = B = [];
        if (!w.value) {
            J = b.getAt(0);
            w.value = J.get(n)
        }
        M = O ? I - w.value : w.value;
        if (w.needle) {
            N = {series: w, value: M, startAngle: c, endAngle: 0, rho: w.radius};
            u = c * (1 - (M - E) / (I - E));
            r.push(N)
        } else {
            u = c * (1 - (M - E) / (I - E));
            N = {series: w, value: M, startAngle: c, endAngle: u, rho: w.radius};
            L = {series: w, value: I - M, startAngle: u, endAngle: 0, rho: w.radius};
            if (O) {
                r.push(L, N)
            } else {
                r.push(N, L)
            }
        }
        for (T = 0, G = r.length; T < G; T++) {
            v = r[T];
            C = A.getAt(T);
            t = Ext.apply({
                segment: {
                    series: w,
                    startAngle: v.startAngle,
                    endAngle: v.endAngle,
                    margin: 0,
                    rho: v.rho,
                    startRho: v.rho * +d / 100,
                    endRho: v.rho
                }
            }, Ext.apply(m, g && {fill: g[T % z]} || {}));
            F = Ext.apply({}, t.segment, {slice: v, series: w, storeItem: J, index: T});
            B[T] = F;
            if (!C) {
                q = Ext.apply({type: "path", group: A}, Ext.apply(m, g && {fill: g[T % z]} || {}));
                C = K.add(Ext.apply(q, t))
            }
            v.sprite = v.sprite || [];
            F.sprite = C;
            v.sprite.push(C);
            if (R) {
                t = w.renderer(C, J, t, T, b);
                C._to = t;
                w.onAnimate(C, {to: t})
            } else {
                t = w.renderer(C, J, Ext.apply(t, {hidden: false}), T, b);
                C.setAttributes(t, true)
            }
        }
        if (w.needle) {
            u = u * Math.PI / 180;
            if (!w.needleSprite) {
                w.needleSprite = w.chart.surface.add({
                    type: "path",
                    path: ["M", f + (w.radius * +d / 100) * k(u), e + -Math.abs((w.radius * +d / 100) * s(u)), "L", f + w.radius * k(u), e + -Math.abs(w.radius * s(u))],
                    "stroke-width": 4,
                    stroke: "#222"
                })
            } else {
                if (R) {
                    w.onAnimate(w.needleSprite, {to: {path: ["M", f + (w.radius * +d / 100) * k(u), e + -Math.abs((w.radius * +d / 100) * s(u)), "L", f + w.radius * k(u), e + -Math.abs(w.radius * s(u))]}})
                } else {
                    w.needleSprite.setAttributes({
                        type: "path",
                        path: ["M", f + (w.radius * +d / 100) * k(u), e + -Math.abs((w.radius * +d / 100) * s(u)), "L", f + w.radius * k(u), e + -Math.abs(w.radius * s(u))]
                    })
                }
            }
            w.needleSprite.setAttributes({hidden: false}, true)
        }
        delete w.value
    },
    setValue: function (a) {
        this.value = a;
        this.drawSeries()
    },
    onCreateLabel: function (c, b, a, d) {
    },
    onPlaceLabel: function (c, f, e, d, g, a, b) {
    },
    onPlaceCallout: function () {
    },
    onAnimate: function (b, a) {
        b.show();
        return this.callParent(arguments)
    },
    isItemInPoint: function (k, h, m, e) {
        var g = this, d = g.centerX, c = g.centerY, o = Math.abs, n = o(k - d), l = o(h - c), f = m.startAngle, a = m.endAngle, j = Math.sqrt(n * n + l * l), b = Math.atan2(h - c, k - d) / g.rad;
        return (e === 0) && (b >= f && b < a && j >= m.startRho && j <= m.endRho)
    },
    getLegendColor: function (b) {
        var a = this.colorSet || this.colorArrayStyle;
        return a[b % a.length]
    }
});
Ext.define("Ext.rtl.chart.series.Gauge", {
    override: "Ext.chart.series.Gauge", initialize: function () {
        var a = this;
        a.callParent(arguments);
        if (a.chart.getInherited().rtl) {
            a.reverse = true
        }
    }
});
Ext.define("Ext.chart.series.Line", {
    extend: "Ext.chart.series.Cartesian",
    alternateClassName: ["Ext.chart.LineSeries", "Ext.chart.LineChart"],
    requires: ["Ext.chart.axis.Axis", "Ext.chart.Shape", "Ext.draw.Draw", "Ext.fx.Anim"],
    type: "line",
    alias: "series.line",
    selectionTolerance: 20,
    showMarkers: true,
    markerConfig: {},
    style: {},
    smooth: false,
    defaultSmoothness: 3,
    fill: false,
    constructor: function (c) {
        this.callParent(arguments);
        var e = this, a = e.chart.surface, f = e.chart.shadow, d, b;
        c.highlightCfg = Ext.Object.merge({"stroke-width": 3}, c.highlightCfg);
        Ext.apply(e, c, {
            shadowAttributes: [{
                "stroke-width": 6,
                "stroke-opacity": 0.05,
                stroke: "rgb(0, 0, 0)",
                translate: {x: 1, y: 1}
            }, {
                "stroke-width": 4,
                "stroke-opacity": 0.1,
                stroke: "rgb(0, 0, 0)",
                translate: {x: 1, y: 1}
            }, {"stroke-width": 2, "stroke-opacity": 0.15, stroke: "rgb(0, 0, 0)", translate: {x: 1, y: 1}}]
        });
        e.group = a.getGroup(e.seriesId);
        if (e.showMarkers) {
            e.markerGroup = a.getGroup(e.seriesId + "-markers")
        }
        if (f) {
            for (d = 0, b = e.shadowAttributes.length; d < b; d++) {
                e.shadowGroups.push(a.getGroup(e.seriesId + "-shadows" + d))
            }
        }
    },
    shrink: function (b, j, k) {
        var g = b.length, h = Math.floor(g / k), f = 1, d = 0, a = 0, e = [+b[0]], c = [+j[0]];
        for (; f < g; ++f) {
            d += +b[f] || 0;
            a += +j[f] || 0;
            if (f % h == 0) {
                e.push(d / h);
                c.push(a / h);
                d = 0;
                a = 0
            }
        }
        return {x: e, y: c}
    },
    drawSeries: function () {
        var ap = this, aC = ap.chart, W = aC.axes, ax = aC.getChartStore(), B = ax.data.items, au, Z = ax.getCount(), z = ap.chart.surface, aw = {}, V = ap.group, N = ap.showMarkers, aI = ap.markerGroup, G = aC.shadow, F = ap.shadowGroups, ac = ap.shadowAttributes, R = ap.smooth, s = F.length, aA = ["M"], X = ["M"], e = ["M"], c = ["M"], M = aC.markerIndex, ao = [].concat(ap.axis), an, aD = [], ag = [], L = false, b = ap.reverse, U = [], aH = Ext.apply({}, ap.markerStyle), af = ap.seriesStyle, w = ap.colorArrayStyle, S = w && w.length || 0, O = Ext.isNumber, aE = ap.seriesIdx, k = ap.getAxesForXAndYFields(), n = k.xAxis, aG = k.yAxis, ah = W && W.get(n), T = W && W.get(aG), ae = n ? ah && ah.type : "", f = aG ? T && T.type : "", aj, l, ai, ak, D, d, al, K, J, h, g, v, t, ab, Q, P, aB, o, I, H, aJ, p, r, E, a, ad, am, C, az, A, ay, q, aF, av, at, Y, m, u, aq, ar, aa;
        if (ap.fireEvent("beforedraw", ap) === false) {
            return
        }
        if (!Z || ap.seriesIsHidden) {
            ap.hide();
            ap.items = [];
            if (ap.line) {
                ap.line.hide(true);
                if (ap.line.shadows) {
                    aj = ap.line.shadows;
                    for (P = 0, s = aj.length; P < s; P++) {
                        l = aj[P];
                        l.hide(true)
                    }
                }
                if (ap.fillPath) {
                    ap.fillPath.hide(true)
                }
            }
            ap.line = null;
            ap.fillPath = null;
            return
        }
        av = Ext.apply(aH || {}, ap.markerConfig, {fill: ap.seriesStyle.fill || w[ap.themeIdx % w.length]});
        Y = av.type;
        delete av.type;
        at = af;
        if (!at["stroke-width"]) {
            at["stroke-width"] = 0.5
        }
        u = "opacity" in at ? at.opacity : 1;
        aa = "opacity" in at ? at.opacity : 0.3;
        aq = "lineOpacity" in at ? at.lineOpacity : u;
        ar = "fillOpacity" in at ? at.fillOpacity : aa;
        if (M && aI && aI.getCount()) {
            for (Q = 0; Q < M; Q++) {
                H = aI.getAt(Q);
                aI.remove(H);
                aI.add(H);
                aJ = aI.getAt(aI.getCount() - 2);
                H.setAttributes({x: 0, y: 0, translate: {x: aJ.attr.translation.x, y: aJ.attr.translation.y}}, true)
            }
        }
        ap.unHighlightItem();
        ap.cleanHighlights();
        ap.setBBox();
        aw = ap.bbox;
        ap.clipRect = [aw.x, aw.y, aw.width, aw.height];
        if (ah) {
            I = ah.applyData();
            C = I.from;
            az = I.to
        }
        if (T) {
            I = T.applyData();
            A = I.from;
            ay = I.to
        }
        if (ap.xField && !Ext.isNumber(C)) {
            o = ap.getMinMaxXValues();
            C = o[0];
            az = o[1]
        }
        if (ap.yField && !Ext.isNumber(A)) {
            o = ap.getMinMaxYValues();
            A = o[0];
            ay = o[1]
        }
        if (isNaN(C)) {
            C = 0;
            ad = aw.width / ((Z - 1) || 1)
        } else {
            ad = aw.width / ((az - C) || (Z - 1) || 1)
        }
        if (isNaN(A)) {
            A = 0;
            am = aw.height / ((Z - 1) || 1)
        } else {
            am = aw.height / ((ay - A) || (Z - 1) || 1)
        }
        for (Q = 0, aB = B.length; Q < aB; Q++) {
            au = B[Q];
            r = au.get(ap.xField);
            if (ae === "Time" && typeof r === "string") {
                r = Date.parse(r)
            }
            if (typeof r === "string" || typeof r === "object" && !Ext.isDate(r) || ae === "Category") {
                r = Q
            }
            E = au.get(ap.yField);
            if (f === "Time" && typeof E === "string") {
                E = Date.parse(E)
            }
            if (typeof E === "undefined" || (typeof E === "string" && !E)) {
                continue
            }
            if (typeof E === "string" || typeof E === "object" && !Ext.isDate(E) || f === "Category") {
                E = Q
            }
            U.push(Q);
            aD.push(r);
            ag.push(E)
        }
        aB = aD.length;
        if (aB > aw.width) {
            a = ap.shrink(aD, ag, aw.width);
            aD = a.x;
            ag = a.y
        }
        ap.items = [];
        m = 0;
        aB = aD.length;
        for (Q = 0; Q < aB; Q++) {
            r = aD[Q];
            E = ag[Q];
            if (E === false) {
                if (X.length == 1) {
                    X = []
                }
                L = true;
                ap.items.push(false);
                continue
            } else {
                if (b) {
                    K = aw.x + aw.width - ((r - C) * ad)
                } else {
                    K = (aw.x + (r - C) * ad)
                }
                K = Ext.Number.toFixed(K, 2);
                J = Ext.Number.toFixed((aw.y + aw.height) - (E - A) * am, 2);
                if (L) {
                    L = false;
                    X.push("M")
                }
                X = X.concat([K, J])
            }
            if ((typeof t == "undefined") && (typeof J != "undefined")) {
                t = J;
                v = K
            }
            if (!ap.line || aC.resizing) {
                aA = aA.concat([K, aw.y + aw.height / 2])
            }
            if (aC.animate && aC.resizing && ap.line) {
                ap.line.setAttributes({path: aA, opacity: aq}, true);
                if (ap.fillPath) {
                    ap.fillPath.setAttributes({path: aA, opacity: ar}, true)
                }
                if (ap.line.shadows) {
                    aj = ap.line.shadows;
                    for (P = 0, s = aj.length; P < s; P++) {
                        l = aj[P];
                        l.setAttributes({path: aA}, true)
                    }
                }
            }
            if (N) {
                H = aI.getAt(m++);
                if (!H) {
                    H = Ext.chart.Shape[Y](z, Ext.apply({
                        group: [V, aI],
                        x: 0,
                        y: 0,
                        translate: {x: +(h || K), y: g || (aw.y + aw.height / 2)},
                        value: '"' + r + ", " + E + '"',
                        zIndex: 4000
                    }, av));
                    H._to = {translate: {x: +K, y: +J}}
                } else {
                    H.setAttributes({value: '"' + r + ", " + E + '"', x: 0, y: 0, hidden: false}, true);
                    H._to = {translate: {x: +K, y: +J}}
                }
            }
            ap.items.push({series: ap, value: [r, E], point: [K, J], sprite: H, storeItem: ax.getAt(U[Q])});
            h = K;
            g = J
        }
        if (X.length <= 1) {
            return
        }
        if (ap.smooth) {
            c = Ext.draw.Draw.smooth(X, O(R) ? R : ap.defaultSmoothness)
        }
        e = R ? c : X;
        if (aC.markerIndex && ap.previousPath) {
            ak = ap.previousPath;
            if (!R) {
                Ext.Array.erase(ak, 1, 2)
            }
        } else {
            ak = X
        }
        if (!ap.line) {
            ap.line = z.add(Ext.apply({type: "path", group: V, path: aA, stroke: at.stroke || at.fill}, at || {}));
            ap.line.setAttributes({opacity: aq}, true);
            if (G) {
                ap.line.setAttributes(Ext.apply({}, ap.shadowOptions), true)
            }
            ap.line.setAttributes({fill: "none", zIndex: 3000});
            if (!at.stroke && S) {
                ap.line.setAttributes({stroke: w[ap.themeIdx % S]}, true)
            }
            if (G) {
                aj = ap.line.shadows = [];
                for (ai = 0; ai < s; ai++) {
                    an = ac[ai];
                    an = Ext.apply({}, an, {path: aA});
                    l = z.add(Ext.apply({}, {type: "path", group: F[ai]}, an));
                    aj.push(l)
                }
            }
        }
        if (ap.fill) {
            d = e.concat([["L", K, aw.y + aw.height], ["L", v, aw.y + aw.height], ["L", v, t]]);
            if (!ap.fillPath) {
                ap.fillPath = z.add({group: V, type: "path", fill: at.fill || w[ap.themeIdx % S], path: aA})
            }
        }
        ab = N && aI.getCount();
        if (aC.animate) {
            D = ap.fill;
            q = ap.line;
            al = ap.renderer(q, false, {path: e}, Q, ax);
            Ext.apply(al, at || {}, {stroke: at.stroke || at.fill});
            delete al.fill;
            q.show(true);
            if (aC.markerIndex && ap.previousPath) {
                ap.animation = aF = ap.onAnimate(q, {to: al, from: {path: ak}})
            } else {
                ap.animation = aF = ap.onAnimate(q, {to: al})
            }
            if (G) {
                aj = q.shadows;
                for (P = 0; P < s; P++) {
                    aj[P].show(true);
                    if (aC.markerIndex && ap.previousPath) {
                        ap.onAnimate(aj[P], {to: {path: e}, from: {path: ak}})
                    } else {
                        ap.onAnimate(aj[P], {to: {path: e}})
                    }
                }
            }
            if (D) {
                ap.fillPath.show(true);
                ap.onAnimate(ap.fillPath, {
                    to: Ext.apply({}, {
                        path: d,
                        fill: at.fill || w[ap.themeIdx % S],
                        "stroke-width": 0,
                        opacity: ar
                    }, at || {})
                })
            }
            if (N) {
                m = 0;
                for (Q = 0; Q < aB; Q++) {
                    if (ap.items[Q]) {
                        p = aI.getAt(m++);
                        if (p) {
                            al = ap.renderer(p, ax.getAt(Q), p._to, Q, ax);
                            ap.onAnimate(p, {to: Ext.applyIf(al, av || {})});
                            p.show(true)
                        }
                    }
                }
                for (; m < ab; m++) {
                    p = aI.getAt(m);
                    p.hide(true)
                }
            }
        } else {
            al = ap.renderer(ap.line, false, {path: e, hidden: false}, Q, ax);
            Ext.apply(al, at || {}, {stroke: at.stroke || at.fill});
            delete al.fill;
            ap.line.setAttributes(al, true);
            ap.line.setAttributes({opacity: aq}, true);
            if (G) {
                aj = ap.line.shadows;
                for (P = 0; P < s; P++) {
                    aj[P].setAttributes({path: e, hidden: false}, true)
                }
            }
            if (ap.fill) {
                ap.fillPath.setAttributes({path: d, hidden: false, opacity: ar}, true)
            }
            if (N) {
                m = 0;
                for (Q = 0; Q < aB; Q++) {
                    if (ap.items[Q]) {
                        p = aI.getAt(m++);
                        if (p) {
                            al = ap.renderer(p, ax.getAt(Q), p._to, Q, ax);
                            p.setAttributes(Ext.apply(av || {}, al || {}), true);
                            if (!p.attr.hidden) {
                                p.show(true)
                            }
                        }
                    }
                }
                for (; m < ab; m++) {
                    p = aI.getAt(m);
                    p.hide(true)
                }
            }
        }
        if (aC.markerIndex) {
            if (ap.smooth) {
                Ext.Array.erase(X, 1, 2)
            } else {
                Ext.Array.splice(X, 1, 0, X[1], X[2])
            }
            ap.previousPath = X
        }
        ap.renderLabels();
        ap.renderCallouts();
        ap.fireEvent("draw", ap)
    },
    onCreateLabel: function (d, j, c, e) {
        var f = this, g = f.labelsGroup, a = f.label, h = f.bbox, b = Ext.apply({}, a, f.seriesLabelStyle || {});
        return f.chart.surface.add(Ext.apply({
            type: "text",
            "text-anchor": "middle",
            group: g,
            x: Number(j.point[0]),
            y: h.y + h.height / 2
        }, b || {}))
    },
    onPlaceLabel: function (g, k, u, r, p, d, e) {
        var w = this, l = w.chart, t = l.resizing, v = w.label, s = v.renderer, b = v.field, a = w.bbox, j = Number(u.point[0]), h = Number(u.point[1]), c = u.sprite.attr.radius, q, o, n, m, z, f;
        g.setAttributes({text: s(k.get(b), g, k, u, r, p, d, e), hidden: true}, true);
        o = u.sprite.getBBox();
        o.width = o.width || (c * 2);
        o.height = o.height || (c * 2);
        q = g.getBBox();
        n = q.width / 2;
        m = q.height / 2;
        if (p == "rotate") {
            z = o.width / 2 + n + m / 2;
            if (j + z + n > a.x + a.width) {
                j -= z
            } else {
                j += z
            }
            g.setAttributes({rotation: {x: j, y: h, degrees: -45}}, true)
        } else {
            if (p == "under" || p == "over") {
                g.setAttributes({rotation: {degrees: 0}}, true);
                if (j < a.x + n) {
                    j = a.x + n
                } else {
                    if (j + n > a.x + a.width) {
                        j = a.x + a.width - n
                    }
                }
                f = o.height / 2 + m;
                h = h + (p == "over" ? -f : f);
                if (h < a.y + m) {
                    h += 2 * f
                } else {
                    if (h + m > a.y + a.height) {
                        h -= 2 * f
                    }
                }
            }
        }
        if (w.chart.animate && !w.chart.resizing) {
            g.show(true);
            w.onAnimate(g, {to: {x: j, y: h}})
        } else {
            g.setAttributes({x: j, y: h}, true);
            if (t && l.animate) {
                w.on({
                    single: true, afterrender: function () {
                        g.show(true)
                    }
                })
            } else {
                g.show(true)
            }
        }
    },
    highlightItem: function () {
        var b = this, a = b.line;
        b.callParent(arguments);
        if (a && !b.highlighted) {
            if (!("__strokeWidth" in a)) {
                a.__strokeWidth = parseFloat(a.attr["stroke-width"]) || 0
            }
            if (a.__anim) {
                a.__anim.paused = true
            }
            a.__anim = new Ext.fx.Anim({target: a, to: {"stroke-width": a.__strokeWidth + 3}});
            b.highlighted = true
        }
    },
    unHighlightItem: function () {
        var c = this, a = c.line, b;
        c.callParent(arguments);
        if (a && c.highlighted) {
            b = a.__strokeWidth || parseFloat(a.attr["stroke-width"]) || 0;
            a.__anim = new Ext.fx.Anim({target: a, to: {"stroke-width": b}});
            c.highlighted = false
        }
    },
    onPlaceCallout: function (l, q, I, F, E, d, j) {
        if (!E) {
            return
        }
        var L = this, r = L.chart, C = r.surface, G = r.resizing, K = L.callouts, s = L.items, u = F == 0 ? false : s[F - 1].point, w = (F == s.length - 1) ? false : s[F + 1].point, c = [+I.point[0], +I.point[1]], z, f, M, J, n, o, H = K.offsetFromViz || 30, B = K.offsetToSide || 10, A = K.offsetBox || 3, g, e, h, v, t, D = L.clipRect, b = {
            width: K.styles.width || 10,
            height: K.styles.height || 10
        }, m, k;
        if (!u) {
            u = c
        }
        if (!w) {
            w = c
        }
        J = (w[1] - u[1]) / (w[0] - u[0]);
        n = (c[1] - u[1]) / (c[0] - u[0]);
        o = (w[1] - c[1]) / (w[0] - c[0]);
        f = Math.sqrt(1 + J * J);
        z = [1 / f, J / f];
        M = [-z[1], z[0]];
        if (n > 0 && o < 0 && M[1] < 0 || n < 0 && o > 0 && M[1] > 0) {
            M[0] *= -1;
            M[1] *= -1
        } else {
            if (Math.abs(n) < Math.abs(o) && M[0] < 0 || Math.abs(n) > Math.abs(o) && M[0] > 0) {
                M[0] *= -1;
                M[1] *= -1
            }
        }
        m = c[0] + M[0] * H;
        k = c[1] + M[1] * H;
        g = m + (M[0] > 0 ? 0 : -(b.width + 2 * A));
        e = k - b.height / 2 - A;
        h = b.width + 2 * A;
        v = b.height + 2 * A;
        if (g < D[0] || (g + h) > (D[0] + D[2])) {
            M[0] *= -1
        }
        if (e < D[1] || (e + v) > (D[1] + D[3])) {
            M[1] *= -1
        }
        m = c[0] + M[0] * H;
        k = c[1] + M[1] * H;
        g = m + (M[0] > 0 ? 0 : -(b.width + 2 * A));
        e = k - b.height / 2 - A;
        h = b.width + 2 * A;
        v = b.height + 2 * A;
        if (r.animate) {
            L.onAnimate(l.lines, {to: {path: ["M", c[0], c[1], "L", m, k, "Z"]}});
            if (l.panel) {
                l.panel.setPosition(g, e, true)
            }
        } else {
            l.lines.setAttributes({path: ["M", c[0], c[1], "L", m, k, "Z"]}, true);
            if (l.panel) {
                l.panel.setPosition(g, e)
            }
        }
        for (t in l) {
            l[t].show(true)
        }
    },
    isItemInPoint: function (h, f, s, m) {
        var t = this, j = t.items, g = j.length, n = t.selectionTolerance, r, c, l, p, q, o, b, a, e, d, k, u = Math.sqrt;
        c = j[m];
        r = m && j[m - 1];
        if (m >= g) {
            r = j[g - 1]
        }
        l = r && r.point;
        p = c && c.point;
        q = r ? l[0] : p[0] - n;
        b = r ? l[1] : p[1];
        o = c ? p[0] : l[0] + n;
        a = c ? p[1] : l[1];
        e = u((h - q) * (h - q) + (f - b) * (f - b));
        d = u((h - o) * (h - o) + (f - a) * (f - a));
        k = Math.min(e, d);
        if (k <= n) {
            return k == e ? r : c
        }
        return false
    },
    toggleAll: function (a) {
        var e = this, b, d, f, c;
        if (!a) {
            Ext.chart.series.Cartesian.prototype.hideAll.call(e)
        } else {
            Ext.chart.series.Cartesian.prototype.showAll.call(e)
        }
        if (e.line) {
            e.line.setAttributes({hidden: !a}, true);
            if (e.line.shadows) {
                for (b = 0, c = e.line.shadows, d = c.length; b < d; b++) {
                    f = c[b];
                    f.setAttributes({hidden: !a}, true)
                }
            }
        }
        if (e.fillPath) {
            e.fillPath.setAttributes({hidden: !a}, true)
        }
    },
    hideAll: function () {
        this.toggleAll(false)
    },
    showAll: function () {
        this.toggleAll(true)
    }
});
Ext.define("Ext.chart.series.Pie", {
    alternateClassName: ["Ext.chart.PieSeries", "Ext.chart.PieChart"],
    extend: "Ext.chart.series.Series",
    type: "pie",
    alias: "series.pie",
    accuracy: 100000,
    rad: Math.PI * 2 / 100000,
    highlightDuration: 150,
    angleField: false,
    lengthField: false,
    donut: false,
    showInLegend: false,
    style: {},
    clockwise: false,
    rotation: undefined,
    constructor: function (b) {
        this.callParent(arguments);
        var h = this, g = h.chart, a = g.surface, j = g.store, k = g.shadow, c = b.highlight, e, d, f;
        if (c) {
            b.highlightCfg = Ext.merge({segment: {margin: 20}}, c, b.highlightCfg)
        }
        Ext.apply(h, b, {
            shadowAttributes: [{
                "stroke-width": 6,
                "stroke-opacity": 1,
                stroke: "rgb(200, 200, 200)",
                translate: {x: 1.2, y: 2}
            }, {
                "stroke-width": 4,
                "stroke-opacity": 1,
                stroke: "rgb(150, 150, 150)",
                translate: {x: 0.9, y: 1.5}
            }, {"stroke-width": 2, "stroke-opacity": 1, stroke: "rgb(100, 100, 100)", translate: {x: 0.6, y: 1}}]
        });
        h.group = a.getGroup(h.seriesId);
        if (k) {
            for (e = 0, d = h.shadowAttributes.length; e < d; e++) {
                h.shadowGroups.push(a.getGroup(h.seriesId + "-shadows" + e))
            }
        }
        a.customAttributes.segment = function (m) {
            var l = h.getSegment(m);
            if (!l.path || l.path.length === 0) {
                l.path = ["M", 0, 0]
            }
            return l
        };
        h.__excludes = h.__excludes || []
    },
    onRedraw: function () {
        this.initialize()
    },
    initialize: function () {
        var d = this, a = d.chart.getChartStore(), e = a.data.items, b, c, f;
        d.callParent();
        d.yField = [];
        if (d.label.field) {
            for (b = 0, c = e.length; b < c; b++) {
                f = e[b];
                d.yField.push(f.get(d.label.field))
            }
        }
    },
    getSegment: function (d) {
        var J = this, I = J.rad, h = Math.cos, a = Math.sin, p = J.centerX, n = J.centerY, E = 0, D = 0, C = 0, A = 0, l = 0, k = 0, j = 0, f = 0, w = 0, c = 0, v = 0, b = 0, G = 0.01, z = d.startAngle, u = d.endAngle, o = (z + u) / 2 * I, r = d.margin || 0, K = Math.min(z, u) * I, H = Math.max(z, u) * I, t = h(K), g = a(K), s = h(H), e = a(H), m = h(o), F = a(o), B = 0, q = 0.7071067811865476;
        if (H - K < G) {
            return {path: ""}
        }
        if (r !== 0) {
            p += r * m;
            n += r * F
        }
        D = p + d.endRho * t;
        k = n + d.endRho * g;
        A = p + d.endRho * s;
        f = n + d.endRho * e;
        v = p + d.endRho * m;
        b = n + d.endRho * F;
        if (d.startRho !== 0) {
            E = p + d.startRho * t;
            l = n + d.startRho * g;
            C = p + d.startRho * s;
            j = n + d.startRho * e;
            w = p + d.startRho * m;
            c = n + d.startRho * F;
            return {path: [["M", D, k], ["A", d.endRho, d.endRho, 0, 0, 1, v, b], ["L", v, b], ["A", d.endRho, d.endRho, 0, B, 1, A, f], ["L", A, f], ["L", C, j], ["A", d.startRho, d.startRho, 0, B, 0, w, c], ["L", w, c], ["A", d.startRho, d.startRho, 0, 0, 0, E, l], ["L", E, l], ["Z"]]}
        } else {
            return {path: [["M", p, n], ["L", D, k], ["A", d.endRho, d.endRho, 0, 0, 1, v, b], ["L", v, b], ["A", d.endRho, d.endRho, 0, B, 1, A, f], ["L", A, f], ["L", p, n], ["Z"]]}
        }
    },
    calcMiddle: function (n) {
        var h = this, j = h.rad, m = n.slice, l = h.centerX, k = h.centerY, g = m.startAngle, d = m.endAngle, f = +h.donut, c = -(g + d) * j / 2, a = (n.endRho + n.startRho) / 2, e = l + a * Math.cos(c), b = k - a * Math.sin(c);
        n.middle = {x: e, y: b}
    },
    drawSeries: function () {
        var r = this, a = r.chart.getChartStore(), W = a.data.items, I, w = r.group, S = r.chart.animate, h = r.angleField || r.field || r.xField, z = [].concat(r.lengthField), R = 0, X = r.chart, J = X.surface, G = X.chartBBox, f = X.shadow, Q = r.shadowGroups, P = r.shadowAttributes, aa = Q.length, K = z.length, A = 0, b = +r.donut, Z = [], x = [], t = 0, M = 0, s = 0, E = r.rotation, g = r.seriesStyle, e = r.colorArrayStyle, v = e && e.length || 0, n, Y, B, H, D, d, c, o, k = 0, q, m, y, L, C, ab, F, U, T, V, N, O, l, u;
        Ext.apply(g, r.style || {});
        r.setBBox();
        u = r.bbox;
        if (r.colorSet) {
            e = r.colorSet;
            v = e.length
        }
        if (!a || !a.getCount() || r.seriesIsHidden) {
            r.hide();
            r.items = [];
            return
        }
        r.unHighlightItem();
        r.cleanHighlights();
        d = r.centerX = G.x + (G.width / 2);
        c = r.centerY = G.y + (G.height / 2);
        r.radius = Math.min(d - G.x, c - G.y);
        r.slices = m = [];
        r.items = x = [];
        for (U = 0, F = W.length; U < F; U++) {
            I = W[U];
            if (this.__excludes && this.__excludes[U]) {
                continue
            }
            t += +I.get(h);
            if (z[0]) {
                for (T = 0, R = 0; T < K; T++) {
                    R += +I.get(z[T])
                }
                Z[U] = R;
                M = Math.max(M, R)
            }
        }
        t = t || 1;
        for (U = 0, F = W.length; U < F; U++) {
            I = W[U];
            if (this.__excludes && this.__excludes[U]) {
                L = 0
            } else {
                L = I.get(h);
                if (k === 0) {
                    k = 1
                }
            }
            if (k == 1) {
                k = 2;
                if (Ext.isEmpty(E)) {
                    r.firstAngle = s = (r.clockwise ? -1 : 1) * (r.accuracy * L / t / 2)
                } else {
                    if (!Ext.isEmpty(E.degrees)) {
                        E = Ext.draw.Draw.rad(E.degrees)
                    } else {
                        if (!Ext.isEmpty(E.radians)) {
                            E = E.radians
                        }
                    }
                    r.firstAngle = s = r.accuracy * E / (2 * Math.PI)
                }
                for (T = 0; T < U; T++) {
                    m[T].startAngle = m[T].endAngle = r.firstAngle
                }
            }
            V = s + (r.clockwise ? 1 : -1) * (r.accuracy * L / t);
            q = {series: r, value: L, startAngle: (r.clockwise ? V : s), endAngle: (r.clockwise ? s : V), storeItem: I};
            if (z[0] && !(this.__excludes && this.__excludes[U])) {
                ab = +Z[U];
                q.rho = Math.floor(r.radius / M * ab)
            } else {
                q.rho = r.radius
            }
            m[U] = q;
            (function () {
                s = V
            })()
        }
        if (f) {
            for (U = 0, F = m.length; U < F; U++) {
                q = m[U];
                q.shadowAttrs = [];
                I = a.getAt(U);
                for (T = 0, A = 0, B = []; T < K; T++) {
                    y = w.getAt(U * K + T);
                    if (z[T] && !(this.__excludes && this.__excludes[U])) {
                        o = I.get(z[T]) / Z[U] * q.rho
                    } else {
                        o = q.rho
                    }
                    n = {
                        segment: {
                            startAngle: q.startAngle,
                            endAngle: q.endAngle,
                            margin: 0,
                            rho: q.rho,
                            startRho: A + (o * b / 100),
                            endRho: A + o
                        }, hidden: !q.value && (q.startAngle % r.accuracy) == (q.endAngle % r.accuracy)
                    };
                    for (D = 0, B = []; D < aa; D++) {
                        Y = P[D];
                        H = Q[D].getAt(U);
                        if (!H) {
                            H = X.surface.add(Ext.apply({}, {type: "path", group: Q[D], strokeLinejoin: "round"}, n, Y))
                        }
                        Y = r.renderer(H, I, Ext.apply({}, n, Y), U, a);
                        if (S) {
                            r.onAnimate(H, {to: Y})
                        } else {
                            H.setAttributes(Y, true)
                        }
                        B.push(H)
                    }
                    q.shadowAttrs[T] = B
                }
            }
        }
        for (U = 0, F = m.length; U < F; U++) {
            q = m[U];
            I = a.getAt(U);
            for (T = 0, A = 0; T < K; T++) {
                y = w.getAt(U * K + T);
                if (z[T] && !(this.__excludes && this.__excludes[U])) {
                    o = I.get(z[T]) / Z[U] * q.rho
                } else {
                    o = q.rho
                }
                n = Ext.apply({
                    segment: {
                        startAngle: q.startAngle,
                        endAngle: q.endAngle,
                        margin: 0,
                        rho: q.rho,
                        startRho: A + (o * b / 100),
                        endRho: A + o
                    }, hidden: (!q.value && (q.startAngle % r.accuracy) == (q.endAngle % r.accuracy))
                }, Ext.apply(g, e && {fill: e[(K > 1 ? T : U) % v]} || {}));
                C = Ext.apply({}, n.segment, {slice: q, series: r, storeItem: q.storeItem, index: U});
                r.calcMiddle(C);
                if (f) {
                    C.shadows = q.shadowAttrs[T]
                }
                x[U] = C;
                if (!y) {
                    l = Ext.apply({
                        type: "path",
                        group: w,
                        middle: C.middle
                    }, Ext.apply(g, e && {fill: e[(K > 1 ? T : U) % v]} || {}));
                    y = J.add(Ext.apply(l, n))
                }
                q.sprite = q.sprite || [];
                C.sprite = y;
                q.sprite.push(y);
                q.point = [C.middle.x, C.middle.y];
                if (S) {
                    n = r.renderer(y, I, n, U, a);
                    y._to = n;
                    y._animating = true;
                    r.onAnimate(y, {
                        to: n, listeners: {
                            afteranimate: {
                                fn: function () {
                                    this._animating = false
                                }, scope: y
                            }
                        }
                    })
                } else {
                    n = r.renderer(y, I, Ext.apply(n, {hidden: false}), U, a);
                    y.setAttributes(n, true)
                }
                A += o
            }
        }
        F = w.getCount();
        for (U = 0; U < F; U++) {
            if (!m[(U / K) >> 0] && w.getAt(U)) {
                w.getAt(U).hide(true)
            }
        }
        if (f) {
            aa = Q.length;
            for (D = 0; D < F; D++) {
                if (!m[(D / K) >> 0]) {
                    for (T = 0; T < aa; T++) {
                        if (Q[T].getAt(D)) {
                            Q[T].getAt(D).hide(true)
                        }
                    }
                }
            }
        }
        r.renderLabels();
        r.renderCallouts()
    },
    setSpriteAttributes: function (c, b, a) {
        var d = this;
        if (a) {
            c.stopAnimation();
            c.animate({to: b, duration: d.highlightDuration})
        } else {
            c.setAttributes(b, true)
        }
    },
    createLabelLine: function (b, d) {
        var c = this, e = c.label.calloutLine, a = c.chart.surface.add({
            type: "path",
            stroke: (b === undefined ? "#555" : ((e && e.color) || c.getLegendColor(b))),
            lineWidth: (e && e.width) || 2,
            path: "M0,0Z",
            hidden: d
        });
        return a
    },
    drawLabelLine: function (c, g, f, b) {
        var d = this, a = c.lineSprite, e = "M" + g.x + " " + g.y + "L" + f.x + " " + f.y + "Z";
        d.setSpriteAttributes(a, {path: e}, b)
    },
    onCreateLabel: function (f, k, e, g) {
        var h = this, j = h.labelsGroup, a = h.label, d = h.centerX, c = h.centerY, l = k.middle, b = Ext.apply(h.seriesLabelStyle || {}, a || {});
        return h.chart.surface.add(Ext.apply({type: "text", "text-anchor": "middle", group: j, x: l.x, y: l.y}, b))
    },
    onPlaceLabel: function (R, aa, E, W, D, V, G) {
        var z = this, f = z.rad, Z = z.chart, M = Z.resizing, K = z.label, F = K.renderer, m = K.field, e = z.centerX, d = z.centerY, l = E.startAngle, X = E.endAngle, I = E.middle, B = {
            x: I.x,
            y: I.y
        }, O = I.x - e, N = I.y - d, t = {}, J = 1, A = Math.atan2(N, O || 1), r = Ext.draw.Draw.degrees(A), h, U, a, c, Y = (D === "outside"), T = R.attr.calloutLine, C = (T && T.width) || 2, k = (R.attr.padding || 20) + (Y ? C / 2 + 4 : 0), w = 0, u = 0, S, Q, H;
        B.hidden = false;
        if (this.__excludes && this.__excludes[W]) {
            B.hidden = true
        }
        if (K.hideLessThan) {
            S = Math.min(l, X) * f;
            Q = Math.max(l, X) * f;
            H = (Q - S) * E.rho;
            if (H < K.hideLessThan) {
                B.hidden = R.showOnHighlight = true
            }
        }
        R.setAttributes({opacity: (B.hidden ? 0 : 1), text: F(aa.get(m), R, aa, E, W, D, V, G)}, true);
        if (R.lineSprite) {
            var o = {opacity: (B.hidden ? 0 : 1)};
            if (B.hidden) {
                o.translate = {x: 0, y: 0}
            }
            z.setSpriteAttributes(R.lineSprite, o, false)
        }
        switch (D) {
            case"outside":
                R.isOutside = true;
                J = E.endRho;
                w = (Math.abs(r) <= 90 ? k : -k);
                u = (r >= 0 ? k : -k);
                R.setAttributes({rotation: {degrees: 0}}, true);
                U = R.getBBox();
                a = U.width / 2 * Math.cos(A);
                c = U.height / 2 * Math.sin(A);
                a += w;
                c += u;
                J += Math.sqrt(a * a + c * c);
                B.x = J * Math.cos(A) + e;
                B.y = J * Math.sin(A) + d;
                break;
            case"rotate":
                r = Ext.draw.Draw.normalizeDegrees(r);
                r = (r > 90 && r < 270) ? r + 180 : r;
                h = R.attr.rotation.degrees;
                if (h != null && Math.abs(h - r) > 180 * 0.5) {
                    if (r > h) {
                        r -= 360
                    } else {
                        r += 360
                    }
                    r = r % 360
                } else {
                    r = Ext.draw.Draw.normalizeDegrees(r)
                }
                B.rotate = {degrees: r, x: B.x, y: B.y};
                break;
            default:
                break
        }
        B.translate = {x: 0, y: 0};
        if (V && !M && (D != "rotate" || h != null)) {
            z.onAnimate(R, {to: B})
        } else {
            R.setAttributes(B, true)
        }
        R._from = t;
        if (R.isOutside && T) {
            var n = R.lineSprite, b = V, v = {
                x: (E.endRho - C / 2) * Math.cos(A) + e,
                y: (E.endRho - C / 2) * Math.sin(A) + d
            }, L = {x: B.x, y: B.y}, ab = {};

            function q(y) {
                return y ? y < 0 ? -1 : 1 : 0
            }

            if (T && T.length) {
                ab = {x: (E.endRho + T.length) * Math.cos(A) + e, y: (E.endRho + T.length) * Math.sin(A) + d}
            } else {
                var s = Ext.draw.Draw.normalizeRadians(-A), g = Math.cos(s), p = Math.sin(s), j = (U.width + C + 4) / 2, P = (U.height + C + 4) / 2;
                if (Math.abs(g) * P > Math.abs(p) * j) {
                    ab.x = L.x - j * q(g);
                    ab.y = L.y + j * p / g * q(g)
                } else {
                    ab.x = L.x - P * g / p * q(p);
                    ab.y = L.y + P * q(p)
                }
            }
            if (!n) {
                n = R.lineSprite = z.createLabelLine(W, B.hidden);
                b = false
            }
            z.drawLabelLine(R, v, ab, b)
        } else {
            delete R.lineSprite
        }
    },
    onPlaceCallout: function (k, n, w, u, t, d, e) {
        var z = this, o = z.chart, h = z.centerX, g = z.centerY, A = w.middle, b = {
            x: A.x,
            y: A.y
        }, l = A.x - h, j = A.y - g, c = 1, m, f = Math.atan2(j, l || 1), a = (k && k.label ? k.label.getBBox() : {
            width: 0,
            height: 0
        }), v = 20, s = 10, r = 10, q;
        if (!a.width || !a.height) {
            return
        }
        c = w.endRho + v;
        m = (w.endRho + w.startRho) / 2 + (w.endRho - w.startRho) / 3;
        b.x = c * Math.cos(f) + h;
        b.y = c * Math.sin(f) + g;
        l = m * Math.cos(f);
        j = m * Math.sin(f);
        if (o.animate) {
            z.onAnimate(k.lines, {to: {path: ["M", l + h, j + g, "L", b.x, b.y, "Z", "M", b.x, b.y, "l", l > 0 ? s : -s, 0, "z"]}});
            z.onAnimate(k.box, {
                to: {
                    x: b.x + (l > 0 ? s : -(s + a.width + 2 * r)),
                    y: b.y + (j > 0 ? (-a.height - r / 2) : (-a.height - r / 2)),
                    width: a.width + 2 * r,
                    height: a.height + 2 * r
                }
            });
            z.onAnimate(k.label, {
                to: {
                    x: b.x + (l > 0 ? (s + r) : -(s + a.width + r)),
                    y: b.y + (j > 0 ? -a.height / 4 : -a.height / 4)
                }
            })
        } else {
            k.lines.setAttributes({path: ["M", l + h, j + g, "L", b.x, b.y, "Z", "M", b.x, b.y, "l", l > 0 ? s : -s, 0, "z"]}, true);
            k.box.setAttributes({
                x: b.x + (l > 0 ? s : -(s + a.width + 2 * r)),
                y: b.y + (j > 0 ? (-a.height - r / 2) : (-a.height - r / 2)),
                width: a.width + 2 * r,
                height: a.height + 2 * r
            }, true);
            k.label.setAttributes({
                x: b.x + (l > 0 ? (s + r) : -(s + a.width + r)),
                y: b.y + (j > 0 ? -a.height / 4 : -a.height / 4)
            }, true)
        }
        for (q in k) {
            k[q].show(true)
        }
    },
    onAnimate: function (b, a) {
        b.show();
        return this.callParent(arguments)
    },
    isItemInPoint: function (k, h, m, e) {
        var g = this, d = g.centerX, c = g.centerY, o = Math.abs, n = o(k - d), l = o(h - c), f = m.startAngle, a = m.endAngle, j = Math.sqrt(n * n + l * l), b = Math.atan2(h - c, k - d) / g.rad;
        if (g.clockwise) {
            if (b < g.firstAngle) {
                b += g.accuracy
            }
        } else {
            if (b > g.firstAngle) {
                b -= g.accuracy
            }
        }
        return (b <= f && b > a && j >= m.startRho && j <= m.endRho)
    },
    hideAll: function (e) {
        var c, a, f, b, d, h, g;
        e = (isNaN(this._index) ? e : this._index) || 0;
        this.__excludes = this.__excludes || [];
        this.__excludes[e] = true;
        g = this.slices[e].sprite;
        for (d = 0, h = g.length; d < h; d++) {
            g[d].setAttributes({hidden: true}, true);
            var j = g[d].lineSprite;
            if (j) {
                j.setAttributes({hidden: true}, true)
            }
        }
        if (this.slices[e].shadowAttrs) {
            for (c = 0, b = this.slices[e].shadowAttrs, a = b.length; c < a; c++) {
                f = b[c];
                for (d = 0, h = f.length; d < h; d++) {
                    f[d].setAttributes({hidden: true}, true)
                }
            }
        }
        this.drawSeries()
    },
    showAll: function (a) {
        a = (isNaN(this._index) ? a : this._index) || 0;
        this.__excludes[a] = false;
        this.drawSeries()
    },
    highlightItem: function (s) {
        var u = this, t = u.rad, w, d, o, q, a, e, j, b, m, c, f, p, g, v, n, k, h, l;
        s = s || this.items[this._index];
        this.unHighlightItem();
        if (!s || u.animating || (s.sprite && s.sprite._animating)) {
            return
        }
        u.callParent([s]);
        if (!u.highlight) {
            return
        }
        if ("segment" in u.highlightCfg) {
            w = u.highlightCfg.segment;
            d = u.chart.animate;
            if (u.labelsGroup) {
                f = u.labelsGroup;
                p = u.label.display;
                g = f.getAt(s.index);
                v = (s.startAngle + s.endAngle) / 2 * t;
                n = w.margin || 0;
                k = n * Math.cos(v);
                h = n * Math.sin(v);
                if (Math.abs(k) < 1e-10) {
                    k = 0
                }
                if (Math.abs(h) < 1e-10) {
                    h = 0
                }
                o = {translate: {x: k, y: h}};
                if (g.showOnHighlight) {
                    o.opacity = 1;
                    o.hidden = false
                }
                u.setSpriteAttributes(g, o, d);
                l = g.lineSprite;
                if (l) {
                    u.setSpriteAttributes(l, o, d)
                }
            }
            if (u.chart.shadow && s.shadows) {
                q = 0;
                a = s.shadows;
                j = a.length;
                for (; q < j; q++) {
                    e = a[q];
                    b = {};
                    m = s.sprite._from.segment;
                    for (c in m) {
                        if (!(c in w)) {
                            b[c] = m[c]
                        }
                    }
                    o = {segment: Ext.applyIf(b, u.highlightCfg.segment)};
                    u.setSpriteAttributes(e, o, d)
                }
            }
        }
    },
    unHighlightItem: function () {
        var w = this, l, e, d, h, t, s, r, q, x, m, c, a, v, n, b, f, u, g, o;
        if (!w.highlight) {
            return
        }
        if (("segment" in w.highlightCfg) && w.items) {
            l = w.items;
            e = w.chart.animate;
            d = !!w.chart.shadow;
            h = w.labelsGroup;
            t = l.length;
            s = 0;
            r = 0;
            q = w.label.display;
            for (; s < t; s++) {
                u = l[s];
                if (!u) {
                    continue
                }
                n = u.sprite;
                if (n && n._highlighted) {
                    if (h) {
                        g = h.getAt(u.index);
                        o = Ext.apply({translate: {x: 0, y: 0}}, q == "rotate" ? {
                            rotate: {
                                x: g.attr.x,
                                y: g.attr.y,
                                degrees: g.attr.rotation.degrees
                            }
                        } : {});
                        if (g.showOnHighlight) {
                            o.opacity = 0;
                            o.hidden = true
                        }
                        w.setSpriteAttributes(g, o, e);
                        var k = g.lineSprite;
                        if (k) {
                            w.setSpriteAttributes(k, o, e)
                        }
                    }
                    if (d) {
                        b = u.shadows;
                        x = b.length;
                        for (; r < x; r++) {
                            c = {};
                            a = u.sprite._to.segment;
                            v = u.sprite._from.segment;
                            Ext.apply(c, v);
                            for (m in a) {
                                if (!(m in v)) {
                                    c[m] = a[m]
                                }
                            }
                            f = b[r];
                            w.setSpriteAttributes(f, {segment: c}, e)
                        }
                    }
                }
            }
        }
        w.callParent(arguments)
    },
    getLegendColor: function (a) {
        var b = this;
        return (b.colorSet && b.colorSet[a % b.colorSet.length]) || b.colorArrayStyle[a % b.colorArrayStyle.length]
    }
});
Ext.define("Ext.chart.series.Radar", {
    extend: "Ext.chart.series.Series",
    requires: ["Ext.chart.Shape", "Ext.fx.Anim"],
    type: "radar",
    alias: "series.radar",
    rad: Math.PI / 180,
    showInLegend: false,
    style: {},
    constructor: function (b) {
        this.callParent(arguments);
        var c = this, a = c.chart.surface;
        c.group = a.getGroup(c.seriesId);
        if (c.showMarkers) {
            c.markerGroup = a.getGroup(c.seriesId + "-markers")
        }
    },
    drawSeries: function () {
        var u = this, b = u.chart.getChartStore(), N = b.data.items, O, E, v = u.group, P = u.chart, H = P.series.items, I, t, k, n = u.field || u.yField, G = P.surface, B = P.chartBBox, g = u.colorArrayStyle, e, c, w, J, p = 0, h = 0, a = [], A = Math.max, j = Math.cos, q = Math.sin, o = Math.PI * 2, L = b.getCount(), f, K, F, D, C, M, r, m = u.seriesStyle, z = P.axes && P.axes.get(0), Q = !(z && z.maximum);
        u.setBBox();
        p = Q ? 0 : (z.maximum || 0);
        h = z.minimum || 0;
        Ext.apply(m, u.style || {});
        if (!b || !b.getCount() || u.seriesIsHidden) {
            u.hide();
            u.items = [];
            if (u.radar) {
                u.radar.hide(true)
            }
            u.radar = null;
            return
        }
        if (!m.stroke) {
            m.stroke = g[u.themeIdx % g.length]
        }
        u.unHighlightItem();
        u.cleanHighlights();
        e = u.centerX = B.x + (B.width / 2);
        c = u.centerY = B.y + (B.height / 2);
        u.radius = J = Math.min(B.width, B.height) / 2;
        u.items = w = [];
        if (Q) {
            for (I = 0, t = H.length; I < t; I++) {
                k = H[I];
                a.push(k.yField)
            }
            for (O = 0; O < L; O++) {
                E = N[O];
                for (M = 0, r = a.length; M < r; M++) {
                    p = A(+E.get(a[M]), p)
                }
            }
        }
        p = p || 1;
        if (h >= p) {
            h = p - 1
        }
        f = [];
        K = [];
        for (M = 0; M < L; M++) {
            E = N[M];
            C = J * (E.get(n) - h) / (p - h);
            if (C < 0) {
                C = 0
            }
            F = C * j(M / L * o);
            D = C * q(M / L * o);
            if (M == 0) {
                K.push("M", F + e, D + c);
                f.push("M", 0.01 * F + e, 0.01 * D + c)
            } else {
                K.push("L", F + e, D + c);
                f.push("L", 0.01 * F + e, 0.01 * D + c)
            }
            w.push({sprite: false, point: [e + F, c + D], storeItem: E, series: u})
        }
        K.push("Z");
        if (!u.radar) {
            u.radar = G.add(Ext.apply({type: "path", group: v, path: f}, m || {}))
        }
        if (P.resizing) {
            u.radar.setAttributes({path: f}, true)
        }
        if (P.animate) {
            u.onAnimate(u.radar, {to: Ext.apply({path: K}, m || {})})
        } else {
            u.radar.setAttributes(Ext.apply({path: K}, m || {}), true)
        }
        if (u.showMarkers) {
            u.drawMarkers()
        }
        u.renderLabels();
        u.renderCallouts()
    },
    drawMarkers: function () {
        var m = this, j = m.chart, a = j.surface, o = j.getChartStore(), b = Ext.apply({}, m.markerStyle || {}), h = Ext.apply(b, m.markerConfig, {fill: m.colorArrayStyle[m.themeIdx % m.colorArrayStyle.length]}), k = m.items, n = h.type, r = m.markerGroup, e = m.centerX, d = m.centerY, q, g, c, f, p;
        delete h.type;
        for (g = 0, c = k.length; g < c; g++) {
            q = k[g];
            f = r.getAt(g);
            if (!f) {
                f = Ext.chart.Shape[n](a, Ext.apply({group: r, x: 0, y: 0, translate: {x: e, y: d}}, h))
            } else {
                f.show()
            }
            q.sprite = f;
            if (j.resizing) {
                f.setAttributes({x: 0, y: 0, translate: {x: e, y: d}}, true)
            }
            f._to = {translate: {x: q.point[0], y: q.point[1]}};
            p = m.renderer(f, o.getAt(g), f._to, g, o);
            p = Ext.applyIf(p || {}, h || {});
            if (j.animate) {
                m.onAnimate(f, {to: p})
            } else {
                f.setAttributes(p, true)
            }
        }
    },
    isItemInPoint: function (c, f, e) {
        var b, d = 10, a = Math.abs;
        b = e.point;
        return (a(b[0] - c) <= d && a(b[1] - f) <= d)
    },
    onCreateLabel: function (f, k, e, g) {
        var h = this, j = h.labelsGroup, a = h.label, d = h.centerX, c = h.centerY, b = Ext.apply({}, a, h.seriesLabelStyle || {});
        return h.chart.surface.add(Ext.apply({type: "text", "text-anchor": "middle", group: j, x: d, y: c}, b || {}))
    },
    onPlaceLabel: function (g, n, u, r, p, d, e) {
        var z = this, o = z.chart, t = o.resizing, w = z.label, s = w.renderer, c = w.field, j = z.centerX, h = z.centerY, b = {
            x: Number(u.point[0]),
            y: Number(u.point[1])
        }, l = b.x - j, k = b.y - h, f = Math.atan2(k, l || 1), m = f * 180 / Math.PI, q, v;

        function a(x) {
            if (x < 0) {
                x += 360
            }
            return x % 360
        }

        g.setAttributes({text: s(n.get(c), g, n, u, r, p, d, e), hidden: true}, true);
        q = g.getBBox();
        m = a(m);
        if ((m > 45 && m < 135) || (m > 225 && m < 315)) {
            v = (m > 45 && m < 135 ? 1 : -1);
            b.y += v * q.height / 2
        } else {
            v = (m >= 135 && m <= 225 ? -1 : 1);
            b.x += v * q.width / 2
        }
        if (t) {
            g.setAttributes({x: j, y: h}, true)
        }
        if (d) {
            g.show(true);
            z.onAnimate(g, {to: b})
        } else {
            g.setAttributes(b, true);
            g.show(true)
        }
    },
    toggleAll: function (a) {
        var e = this, b, d, f, c;
        if (!a) {
            Ext.chart.series.Radar.superclass.hideAll.call(e)
        } else {
            Ext.chart.series.Radar.superclass.showAll.call(e)
        }
        if (e.radar) {
            e.radar.setAttributes({hidden: !a}, true);
            if (e.radar.shadows) {
                for (b = 0, c = e.radar.shadows, d = c.length; b < d; b++) {
                    f = c[b];
                    f.setAttributes({hidden: !a}, true)
                }
            }
        }
    },
    hideAll: function () {
        this.toggleAll(false);
        this.hideMarkers(0)
    },
    showAll: function () {
        this.toggleAll(true)
    },
    hideMarkers: function (a) {
        var d = this, c = d.markerGroup && d.markerGroup.getCount() || 0, b = a || 0;
        for (; b < c; b++) {
            d.markerGroup.getAt(b).hide(true)
        }
    },
    getAxesForXAndYFields: function () {
        var c = this, b = c.chart, d = b.axes, a = [].concat(d && d.get(0));
        return {yAxis: a}
    }
});
Ext.define("Ext.chart.series.Scatter", {
    extend: "Ext.chart.series.Cartesian",
    requires: ["Ext.chart.axis.Axis", "Ext.chart.Shape", "Ext.fx.Anim"],
    type: "scatter",
    alias: "series.scatter",
    constructor: function (c) {
        this.callParent(arguments);
        var e = this, f = e.chart.shadow, a = e.chart.surface, d, b;
        Ext.apply(e, c, {
            style: {},
            markerConfig: {},
            shadowAttributes: [{"stroke-width": 6, "stroke-opacity": 0.05, stroke: "rgb(0, 0, 0)"}, {
                "stroke-width": 4,
                "stroke-opacity": 0.1,
                stroke: "rgb(0, 0, 0)"
            }, {"stroke-width": 2, "stroke-opacity": 0.15, stroke: "rgb(0, 0, 0)"}]
        });
        e.group = a.getGroup(e.seriesId);
        if (f) {
            for (d = 0, b = e.shadowAttributes.length; d < b; d++) {
                e.shadowGroups.push(a.getGroup(e.seriesId + "-shadows" + d))
            }
        }
    },
    getBounds: function () {
        var r = this, h = r.chart, d = h.getChartStore(), n = h.axes, k = r.getAxesForXAndYFields(), j = k.xAxis, e = k.yAxis, a, s, c, f, q, o, p, m, l, b, g;
        r.setBBox();
        a = r.bbox;
        if (b = n.get(j)) {
            g = b.applyData();
            q = g.from;
            p = g.to
        }
        if (b = n.get(e)) {
            g = b.applyData();
            o = g.from;
            m = g.to
        }
        if (r.xField && !Ext.isNumber(q)) {
            b = r.getMinMaxXValues();
            q = b[0];
            p = b[1]
        }
        if (r.yField && !Ext.isNumber(o)) {
            b = r.getMinMaxYValues();
            o = b[0];
            m = b[1]
        }
        if (isNaN(q)) {
            q = 0;
            p = d.getCount() - 1;
            s = a.width / (d.getCount() - 1)
        } else {
            s = a.width / (p - q)
        }
        if (isNaN(o)) {
            o = 0;
            m = d.getCount() - 1;
            c = a.height / (d.getCount() - 1)
        } else {
            c = a.height / (m - o)
        }
        return {bbox: a, minX: q, minY: o, xScale: s, yScale: c}
    },
    getPaths: function () {
        var z = this, n = z.chart, b = n.shadow, e = n.getChartStore(), B = e.data.items, s, l, d, h = z.group, f = z.bounds = z.getBounds(), a = z.bbox, C = f.xScale, c = f.yScale, v = f.minX, u = f.minY, A = a.x, w = a.y, g = a.height, o = z.items = [], q = [], j = z.reverse, m, k, r, t, p;
        for (s = 0, l = B.length; s < l; s++) {
            d = B[s];
            r = d.get(z.xField);
            t = d.get(z.yField);
            if (typeof t == "undefined" || (typeof t == "string" && !t) || r == null || t == null) {
                continue
            }
            if (typeof r == "string" || typeof r == "object" && !Ext.isDate(r)) {
                r = s
            }
            if (typeof t == "string" || typeof t == "object" && !Ext.isDate(t)) {
                t = s
            }
            if (j) {
                m = A + a.width - ((r - v) * C)
            } else {
                m = A + (r - v) * C
            }
            k = w + g - (t - u) * c;
            q.push({x: m, y: k});
            z.items.push({series: z, value: [r, t], point: [m, k], storeItem: d});
            if (n.animate && n.resizing) {
                p = h.getAt(s);
                if (p) {
                    z.resetPoint(p);
                    if (b) {
                        z.resetShadow(p)
                    }
                }
            }
        }
        return q
    },
    resetPoint: function (a) {
        var b = this.bbox;
        a.setAttributes({translate: {x: (b.x + b.width) / 2, y: (b.y + b.height) / 2}}, true)
    },
    resetShadow: function (c) {
        var f = this, e = c.shadows, h = f.shadowAttributes, d = f.shadowGroups.length, g = f.bbox, b, a;
        for (b = 0; b < d; b++) {
            a = Ext.apply({}, h[b]);
            if (a.translate) {
                a.translate.x += (g.x + g.width) / 2;
                a.translate.y += (g.y + g.height) / 2
            } else {
                a.translate = {x: (g.x + g.width) / 2, y: (g.y + g.height) / 2}
            }
            e[b].setAttributes(a, true)
        }
    },
    createPoint: function (a, c) {
        var d = this, b = d.chart, e = d.group, f = d.bbox;
        return Ext.chart.Shape[c](b.surface, Ext.apply({}, {
            x: 0,
            y: 0,
            group: e,
            translate: {x: (f.x + f.width) / 2, y: (f.y + f.height) / 2}
        }, a))
    },
    createShadow: function (m, f, j) {
        var h = this, g = h.chart, k = h.shadowGroups, d = h.shadowAttributes, a = k.length, n = h.bbox, c, l, b, e;
        m.shadows = b = [];
        for (c = 0; c < a; c++) {
            e = Ext.apply({}, d[c]);
            if (e.translate) {
                e.translate.x += (n.x + n.width) / 2;
                e.translate.y += (n.y + n.height) / 2
            } else {
                Ext.apply(e, {translate: {x: (n.x + n.width) / 2, y: (n.y + n.height) / 2}})
            }
            Ext.apply(e, f);
            l = Ext.chart.Shape[j](g.surface, Ext.apply({}, {x: 0, y: 0, group: k[c]}, e));
            b.push(l)
        }
    },
    drawSeries: function () {
        var t = this, k = t.chart, g = k.getChartStore(), h = t.group, c = k.shadow, a = t.shadowGroups, p = t.shadowAttributes, q = a.length, l, m, n, j, o, s, e, f, b, d, r;
        if (!g || !g.getCount() || t.seriesIsHidden) {
            t.hide();
            t.items = [];
            return
        }
        s = Ext.apply({}, t.markerStyle, t.markerConfig);
        f = s.type || "circle";
        delete s.type;
        if (!g || !g.getCount()) {
            t.hide();
            t.items = [];
            return
        }
        t.unHighlightItem();
        t.cleanHighlights();
        m = t.getPaths();
        j = m.length;
        for (o = 0; o < j; o++) {
            n = m[o];
            l = h.getAt(o);
            Ext.apply(n, s);
            if (!l) {
                l = t.createPoint(n, f);
                if (c) {
                    t.createShadow(l, s, f)
                }
            }
            b = l.shadows;
            if (k.animate) {
                d = t.renderer(l, g.getAt(o), {translate: n}, o, g);
                l._to = d;
                t.onAnimate(l, {to: d});
                for (e = 0; e < q; e++) {
                    r = Ext.apply({}, p[e]);
                    d = t.renderer(b[e], g.getAt(o), Ext.apply({}, {
                        hidden: false,
                        translate: {
                            x: n.x + (r.translate ? r.translate.x : 0),
                            y: n.y + (r.translate ? r.translate.y : 0)
                        }
                    }, r), o, g);
                    t.onAnimate(b[e], {to: d})
                }
            } else {
                d = t.renderer(l, g.getAt(o), {translate: n}, o, g);
                l._to = d;
                l.setAttributes(d, true);
                for (e = 0; e < q; e++) {
                    r = Ext.apply({}, p[e]);
                    d = t.renderer(b[e], g.getAt(o), Ext.apply({}, {
                        hidden: false,
                        translate: {
                            x: n.x + (r.translate ? r.translate.x : 0),
                            y: n.y + (r.translate ? r.translate.y : 0)
                        }
                    }, r), o, g);
                    b[e].setAttributes(d, true)
                }
            }
            t.items[o].sprite = l
        }
        j = h.getCount();
        for (o = m.length; o < j; o++) {
            l = h.getAt(o);
            l.hide(true);
            b = l.shadows;
            if (b) {
                for (e = 0; e < q; e++) {
                    b[e].hide(true)
                }
            }
        }
        t.renderLabels();
        t.renderCallouts()
    },
    onCreateLabel: function (d, j, c, e) {
        var f = this, g = f.labelsGroup, a = f.label, b = Ext.apply({}, a, f.seriesLabelStyle), h = f.bbox;
        return f.chart.surface.add(Ext.apply({
            type: "text",
            "text-anchor": "middle",
            group: g,
            x: Number(j.point[0]),
            y: h.y + h.height / 2
        }, b))
    },
    onPlaceLabel: function (g, k, v, s, q, d, e) {
        var z = this, l = z.chart, u = l.resizing, w = z.label, t = w.renderer, b = w.field, a = z.bbox, j = Number(v.point[0]), h = Number(v.point[1]), c = v.sprite.attr.radius, r, o, n, m, A, f, p;
        g.setAttributes({text: t(k.get(b), g, k, v, s, q, d, e), hidden: true}, true);
        o = v.sprite.getBBox();
        o.width = o.width || (c * 2);
        o.height = o.height || (c * 2);
        r = g.getBBox();
        n = r.width / 2;
        m = r.height / 2;
        if (q == "rotate") {
            A = o.width / 2 + n + m / 2;
            if (j + A + n > a.x + a.width) {
                j -= A
            } else {
                j += A
            }
            g.setAttributes({rotation: {x: j, y: h, degrees: -45}}, true)
        } else {
            if (q == "under" || q == "over") {
                g.setAttributes({rotation: {degrees: 0}}, true);
                if (j < a.x + n) {
                    j = a.x + n
                } else {
                    if (j + n > a.x + a.width) {
                        j = a.x + a.width - n
                    }
                }
                f = o.height / 2 + m;
                h = h + (q == "over" ? -f : f);
                if (h < a.y + m) {
                    h += 2 * f
                } else {
                    if (h + m > a.y + a.height) {
                        h -= 2 * f
                    }
                }
            }
        }
        if (!l.animate) {
            g.setAttributes({x: j, y: h}, true);
            g.show(true)
        } else {
            if (u) {
                p = v.sprite.getActiveAnimation();
                if (p) {
                    p.on("afteranimate", function () {
                        g.setAttributes({x: j, y: h}, true);
                        g.show(true)
                    })
                } else {
                    g.show(true)
                }
            } else {
                z.onAnimate(g, {to: {x: j, y: h}})
            }
        }
    },
    onPlaceCallout: function (j, l, A, w, v, c, g) {
        var D = this, m = D.chart, t = m.surface, z = m.resizing, C = D.callouts, n = D.items, b = A.point, E, a = j.label.getBBox(), B = 30, s = 10, r = 3, e, d, f, q, o, u = D.bbox, k, h;
        E = [Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)];
        k = b[0] + E[0] * B;
        h = b[1] + E[1] * B;
        e = k + (E[0] > 0 ? 0 : -(a.width + 2 * r));
        d = h - a.height / 2 - r;
        f = a.width + 2 * r;
        q = a.height + 2 * r;
        if (e < u[0] || (e + f) > (u[0] + u[2])) {
            E[0] *= -1
        }
        if (d < u[1] || (d + q) > (u[1] + u[3])) {
            E[1] *= -1
        }
        k = b[0] + E[0] * B;
        h = b[1] + E[1] * B;
        e = k + (E[0] > 0 ? 0 : -(a.width + 2 * r));
        d = h - a.height / 2 - r;
        f = a.width + 2 * r;
        q = a.height + 2 * r;
        if (m.animate) {
            D.onAnimate(j.lines, {to: {path: ["M", b[0], b[1], "L", k, h, "Z"]}}, true);
            D.onAnimate(j.box, {to: {x: e, y: d, width: f, height: q}}, true);
            D.onAnimate(j.label, {to: {x: k + (E[0] > 0 ? r : -(a.width + r)), y: h}}, true)
        } else {
            j.lines.setAttributes({path: ["M", b[0], b[1], "L", k, h, "Z"]}, true);
            j.box.setAttributes({x: e, y: d, width: f, height: q}, true);
            j.label.setAttributes({x: k + (E[0] > 0 ? r : -(a.width + r)), y: h}, true)
        }
        for (o in j) {
            j[o].show(true)
        }
    },
    onAnimate: function (b, a) {
        b.show();
        return this.callParent(arguments)
    },
    isItemInPoint: function (c, g, e) {
        var b, d = 10, a = Math.abs;

        function f(h) {
            var k = a(h[0] - c), j = a(h[1] - g);
            return Math.sqrt(k * k + j * j)
        }

        b = e.point;
        return (b[0] - d <= c && b[0] + d >= c && b[1] - d <= g && b[1] + d >= g)
    }
});
Ext.define("Ext.draw.Matrix", {
    requires: ["Ext.draw.Draw"], constructor: function (h, g, m, l, k, j) {
        if (h != null) {
            this.matrix = [[h, m, k], [g, l, j], [0, 0, 1]]
        } else {
            this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        }
    }, add: function (t, q, n, l, j, h) {
        var o = this, g = [[], [], []], s = [[t, n, j], [q, l, h], [0, 0, 1]], r, p, m, k;
        for (r = 0; r < 3; r++) {
            for (p = 0; p < 3; p++) {
                k = 0;
                for (m = 0; m < 3; m++) {
                    k += o.matrix[r][m] * s[m][p]
                }
                g[r][p] = k
            }
        }
        o.matrix = g
    }, prepend: function (t, q, n, l, j, h) {
        var o = this, g = [[], [], []], s = [[t, n, j], [q, l, h], [0, 0, 1]], r, p, m, k;
        for (r = 0; r < 3; r++) {
            for (p = 0; p < 3; p++) {
                k = 0;
                for (m = 0; m < 3; m++) {
                    k += s[r][m] * o.matrix[m][p]
                }
                g[r][p] = k
            }
        }
        o.matrix = g
    }, invert: function () {
        var k = this.matrix, j = k[0][0], h = k[1][0], o = k[0][1], n = k[1][1], m = k[0][2], l = k[1][2], g = j * n - h * o;
        return new Ext.draw.Matrix(n / g, -h / g, -o / g, j / g, (o * l - n * m) / g, (h * m - j * l) / g)
    }, clone: function () {
        var j = this.matrix, h = j[0][0], g = j[1][0], n = j[0][1], m = j[1][1], l = j[0][2], k = j[1][2];
        return new Ext.draw.Matrix(h, g, n, m, l, k)
    }, translate: function (a, b) {
        this.prepend(1, 0, 0, 1, a, b)
    }, scale: function (b, e, a, d) {
        var c = this;
        if (e == null) {
            e = b
        }
        c.add(b, 0, 0, e, a * (1 - b), d * (1 - e))
    }, rotate: function (c, b, g) {
        c = Ext.draw.Draw.rad(c);
        var e = this, f = +Math.cos(c).toFixed(9), d = +Math.sin(c).toFixed(9);
        e.add(f, d, -d, f, b - f * b + d * g, -(d * b) + g - f * g)
    }, x: function (a, c) {
        var b = this.matrix;
        return a * b[0][0] + c * b[0][1] + b[0][2]
    }, y: function (a, c) {
        var b = this.matrix;
        return a * b[1][0] + c * b[1][1] + b[1][2]
    }, get: function (b, a) {
        return +this.matrix[b][a].toFixed(4)
    }, toString: function () {
        var a = this;
        return [a.get(0, 0), a.get(0, 1), a.get(1, 0), a.get(1, 1), 0, 0].join()
    }, toSvg: function () {
        var a = this;
        return "matrix(" + [a.get(0, 0), a.get(1, 0), a.get(0, 1), a.get(1, 1), a.get(0, 2), a.get(1, 2)].join() + ")"
    }, toFilter: function (b, a) {
        var c = this;
        b = b || 0;
        a = a || 0;
        return "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', filterType='bilinear', M11=" + c.get(0, 0) + ", M12=" + c.get(0, 1) + ", M21=" + c.get(1, 0) + ", M22=" + c.get(1, 1) + ", Dx=" + (c.get(0, 2) + b) + ", Dy=" + (c.get(1, 2) + a) + ")"
    }, offset: function () {
        var a = this.matrix;
        return [(a[0][2] || 0).toFixed(4), (a[1][2] || 0).toFixed(4)]
    }, split: function () {
        function d(f) {
            return f[0] * f[0] + f[1] * f[1]
        }

        function b(f) {
            var g = Math.sqrt(d(f));
            f[0] /= g;
            f[1] /= g
        }

        var a = this.matrix, c = {translateX: a[0][2], translateY: a[1][2]}, e;
        e = [[a[0][0], a[0][1]], [a[1][1], a[1][1]]];
        c.scaleX = Math.sqrt(d(e[0]));
        b(e[0]);
        c.shear = e[0][0] * e[1][0] + e[0][1] * e[1][1];
        e[1] = [e[1][0] - e[0][0] * c.shear, e[1][1] - e[0][1] * c.shear];
        c.scaleY = Math.sqrt(d(e[1]));
        b(e[1]);
        c.shear /= c.scaleY;
        c.rotate = Math.asin(-e[0][1]);
        c.isSimple = !+c.shear.toFixed(9) && (c.scaleX.toFixed(9) == c.scaleY.toFixed(9) || !c.rotate);
        return c
    }
});
Ext.define("Ext.draw.SpriteDD", {
    extend: "Ext.dd.DragSource", constructor: function (b, a) {
        var d = this, c = b.el;
        d.sprite = b;
        d.el = c;
        d.dragData = {el: c, sprite: b};
        d.callParent([c, a]);
        d.sprite.setStyle("cursor", "move")
    }, showFrame: Ext.emptyFn, createFrame: Ext.emptyFn, getDragEl: function (a) {
        return this.el
    }, getRegion: function () {
        var j = this, f = j.el, m, d, c, o, n, s, a, k, g, q, p;
        p = j.sprite;
        q = p.getBBox();
        try {
            m = Ext.Element.getXY(f)
        } catch (h) {
        }
        if (!m) {
            return null
        }
        d = m[0];
        c = d + q.width;
        o = m[1];
        n = o + q.height;
        return new Ext.util.Region(o, c, n, d)
    }, startDrag: function (b, d) {
        var c = this, a = c.sprite.attr;
        c.prev = c.sprite.surface.transformToViewBox(b, d)
    }, onDrag: function (h) {
        var g = h.getXY(), f = this, d = f.sprite, a = d.attr, c, b;
        g = f.sprite.surface.transformToViewBox(g[0], g[1]);
        c = g[0] - f.prev[0];
        b = g[1] - f.prev[1];
        d.setAttributes({translate: {x: a.translation.x + c, y: a.translation.y + b}}, true);
        f.prev = g
    }, setDragElPos: function () {
        return false
    }
});
Ext.define("Ext.draw.Sprite", {
    mixins: {observable: "Ext.util.Observable", animate: "Ext.util.Animate"},
    requires: ["Ext.draw.SpriteDD"],
    dirty: false,
    dirtyHidden: false,
    dirtyTransform: false,
    dirtyPath: true,
    dirtyFont: true,
    zIndexDirty: true,
    isSprite: true,
    zIndex: 0,
    fontProperties: ["font", "font-size", "font-weight", "font-style", "font-family", "text-anchor", "text"],
    pathProperties: ["x", "y", "d", "path", "height", "width", "radius", "r", "rx", "ry", "cx", "cy"],
    constructor: function (a) {
        var b = this;
        a = Ext.merge({}, a || {});
        b.id = Ext.id(null, "ext-sprite-");
        b.transformations = [];
        Ext.copyTo(this, a, "surface,group,type,draggable");
        b.bbox = {};
        b.attr = {
            zIndex: 0,
            translation: {x: null, y: null},
            rotation: {degrees: null, x: null, y: null},
            scaling: {x: null, y: null, cx: null, cy: null}
        };
        delete a.surface;
        delete a.group;
        delete a.type;
        delete a.draggable;
        b.setAttributes(a);
        b.mixins.observable.constructor.apply(this, arguments)
    },
    initDraggable: function () {
        var a = this;
        if (!a.el) {
            a.surface.createSpriteElement(a)
        }
        a.dd = new Ext.draw.SpriteDD(a, Ext.isBoolean(a.draggable) ? null : a.draggable);
        a.on("beforedestroy", a.dd.destroy, a.dd)
    },
    setAttributes: function (k, n) {
        var s = this, h = s.fontProperties, p = h.length, g = s.pathProperties, f = g.length, q = !!s.surface, a = q && s.surface.customAttributes || {}, c = s.attr, b = false, l, o, j, d, r, m, t, e;
        k = Ext.apply({}, k);
        for (l in a) {
            if (k.hasOwnProperty(l) && typeof a[l] == "function") {
                Ext.apply(k, a[l].apply(s, [].concat(k[l])))
            }
        }
        if (!!k.hidden !== !!c.hidden) {
            s.dirtyHidden = true
        }
        for (o = 0; o < f; o++) {
            l = g[o];
            if (l in k && k[l] !== c[l]) {
                s.dirtyPath = true;
                b = true;
                break
            }
        }
        if ("zIndex" in k) {
            s.zIndexDirty = true
        }
        if ("text" in k) {
            s.dirtyFont = true;
            b = true;
            k.text = s.transformText(k.text)
        }
        for (o = 0; o < p; o++) {
            l = h[o];
            if (l in k && k[l] !== c[l]) {
                s.dirtyFont = true;
                b = true;
                break
            }
        }
        j = k.translation || k.translate;
        delete k.translate;
        delete k.translation;
        d = c.translation;
        if (j) {
            if (("x" in j && j.x !== d.x) || ("y" in j && j.y !== d.y)) {
                s.dirtyTransform = true;
                d.x = j.x;
                d.y = j.y
            }
        }
        r = k.rotation || k.rotate;
        m = c.rotation;
        delete k.rotate;
        delete k.rotation;
        if (r) {
            if (("x" in r && r.x !== m.x) || ("y" in r && r.y !== m.y) || ("degrees" in r && r.degrees !== m.degrees)) {
                s.dirtyTransform = true;
                m.x = r.x;
                m.y = r.y;
                m.degrees = r.degrees
            }
        }
        t = k.scaling || k.scale;
        e = c.scaling;
        delete k.scale;
        delete k.scaling;
        if (t) {
            if (("x" in t && t.x !== e.x) || ("y" in t && t.y !== e.y) || ("cx" in t && t.cx !== e.cx) || ("cy" in t && t.cy !== e.cy)) {
                s.dirtyTransform = true;
                e.x = t.x;
                e.y = t.y;
                e.cx = t.cx;
                e.cy = t.cy
            }
        }
        if (!s.dirtyTransform && b) {
            if (c.scaling.x === null || c.scaling.y === null || c.rotation.y === null || c.rotation.y === null) {
                s.dirtyTransform = true
            }
        }
        Ext.apply(c, k);
        s.dirty = true;
        if (n === true && q) {
            s.redraw()
        }
        return this
    },
    transformText: Ext.identityFn,
    getBBox: function () {
        return this.surface.getBBox(this)
    },
    setText: function (a) {
        this.attr.text = a;
        this.surface.applyAttrs(this);
        return this
    },
    hide: function (a) {
        this.setAttributes({hidden: true}, a);
        return this
    },
    show: function (a) {
        this.setAttributes({hidden: false}, a);
        return this
    },
    remove: function () {
        if (this.surface) {
            this.surface.remove(this);
            return true
        }
        return false
    },
    onRemove: function () {
        this.surface.onRemove(this)
    },
    destroy: function () {
        var a = this;
        if (a.fireEvent("beforedestroy", a) !== false) {
            a.remove();
            a.surface.onDestroy(a);
            a.clearListeners();
            a.fireEvent("destroy")
        }
    },
    redraw: function () {
        var c = this, d = !c.el || c.dirty, b = c.surface, a;
        b.renderItem(c);
        if (d) {
            a = b.owner;
            if (!c.isBackground && a && (a.viewBox || a.autoSize)) {
                a.configureSurfaceSize()
            }
        }
        return this
    },
    setStyle: function () {
        this.el.setStyle.apply(this.el, arguments);
        return this
    },
    addCls: function (a) {
        this.surface.addCls(this, a);
        return this
    },
    removeCls: function (a) {
        this.surface.removeCls(this, a);
        return this
    }
});
Ext.define("Ext.rtl.draw.Sprite", {
    override: "Ext.draw.Sprite",
    RLM: "",
    rtlRe: /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/,
    transformText: function (c) {
        var b = this, a = b.surface;
        if (c && a && a.isRtl && !Ext.isNumber(c) && b.rtlRe.test(c)) {
            return b.RLM + c
        }
        return b.callParent(arguments)
    }
});
Ext.define("Ext.draw.Text", {
    extend: "Ext.draw.Component",
    uses: ["Ext.util.CSS"],
    alias: "widget.text",
    text: "",
    focusable: false,
    viewBox: false,
    autoSize: true,
    baseCls: Ext.baseCSSPrefix + "surface " + Ext.baseCSSPrefix + "draw-text",
    initComponent: function () {
        var a = this;
        a.textConfig = Ext.apply({type: "text", text: a.text, rotate: {degrees: a.degrees || 0}}, a.textStyle);
        Ext.apply(a.textConfig, a.getStyles(a.styleSelectors || a.styleSelector));
        a.initialConfig.items = [a.textConfig];
        a.callParent(arguments)
    },
    getStyles: function (d) {
        d = Ext.Array.from(d);
        var c = 0, b = d.length, f, e, g, a = {};
        for (; c < b; c++) {
            f = Ext.util.CSS.getRule(d[c]);
            if (f) {
                e = f.style;
                if (e) {
                    Ext.apply(a, {
                        "font-family": e.fontFamily,
                        "font-weight": e.fontWeight,
                        "line-height": e.lineHeight,
                        "font-size": e.fontSize,
                        fill: e.color
                    })
                }
            }
        }
        return a
    },
    setAngle: function (d) {
        var c = this, a, b;
        if (c.rendered) {
            a = c.surface;
            b = a.items.items[0];
            c.degrees = d;
            b.setAttributes({rotate: {degrees: d}}, true);
            if (c.autoSize || c.viewBox) {
                c.updateLayout()
            }
        } else {
            c.degrees = d
        }
    },
    setText: function (d) {
        var c = this, a, b;
        if (c.rendered) {
            a = c.surface;
            b = a.items.items[0];
            c.text = d || "";
            a.remove(b);
            c.textConfig.type = "text";
            c.textConfig.text = c.text;
            b = a.add(c.textConfig);
            b.setAttributes({rotate: {degrees: c.degrees}}, true);
            if (c.autoSize || c.viewBox) {
                c.updateLayout()
            }
        } else {
            c.on({
                render: function () {
                    c.setText(d)
                }, single: true
            })
        }
    }
});
Ext.define("Ext.draw.engine.ImageExporter", {
    singleton: true,
    defaultUrl: "http://svg.sencha.io",
    supportedTypes: ["image/png", "image/jpeg"],
    widthParam: "width",
    heightParam: "height",
    typeParam: "type",
    svgParam: "svg",
    formCls: Ext.baseCSSPrefix + "hide-display",
    generate: function (a, b) {
        b = b || {};
        var e = this, c = b.type, d;
        if (Ext.Array.indexOf(e.supportedTypes, c) === -1) {
            return false
        }
        d = Ext.getBody().createChild({
            tag: "form",
            method: "POST",
            action: b.url || e.defaultUrl,
            cls: e.formCls,
            children: [{
                tag: "input",
                type: "hidden",
                name: b.widthParam || e.widthParam,
                value: b.width || a.width
            }, {
                tag: "input",
                type: "hidden",
                name: b.heightParam || e.heightParam,
                value: b.height || a.height
            }, {tag: "input", type: "hidden", name: b.typeParam || e.typeParam, value: c}, {
                tag: "input",
                type: "hidden",
                name: b.svgParam || e.svgParam
            }]
        });
        d.last(null, true).value = Ext.draw.engine.SvgExporter.generate(a);
        d.dom.submit();
        d.remove();
        return true
    }
});
Ext.define("Ext.draw.engine.Svg", {
    extend: "Ext.draw.Surface",
    requires: ["Ext.draw.Draw", "Ext.draw.Sprite", "Ext.draw.Matrix", "Ext.Element"],
    engine: "Svg",
    trimRe: /^\s+|\s+$/g,
    spacesRe: /\s+/,
    xlink: "http://www.w3.org/1999/xlink",
    translateAttrs: {
        radius: "r",
        radiusX: "rx",
        radiusY: "ry",
        path: "d",
        lineWidth: "stroke-width",
        fillOpacity: "fill-opacity",
        strokeOpacity: "stroke-opacity",
        strokeLinejoin: "stroke-linejoin"
    },
    parsers: {},
    fontRe: /^font-?/,
    minDefaults: {
        circle: {
            cx: 0,
            cy: 0,
            r: 0,
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        ellipse: {
            cx: 0,
            cy: 0,
            rx: 0,
            ry: 0,
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        rect: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            rx: 0,
            ry: 0,
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        text: {
            x: 0,
            y: 0,
            "text-anchor": "start",
            "font-family": null,
            "font-size": null,
            "font-weight": null,
            "font-style": null,
            fill: "#000",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        path: {
            d: "M0,0",
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        image: {x: 0, y: 0, width: 0, height: 0, preserveAspectRatio: "none", opacity: null}
    },
    createSvgElement: function (d, a) {
        var c = this.domRef.createElementNS("http://www.w3.org/2000/svg", d), b;
        if (a) {
            for (b in a) {
                c.setAttribute(b, String(a[b]))
            }
        }
        return c
    },
    createSpriteElement: function (a) {
        var b = this.createSvgElement(a.type);
        b.id = a.id;
        if (b.style) {
            b.style.webkitTapHighlightColor = "rgba(0,0,0,0)"
        }
        a.el = Ext.get(b);
        this.applyZIndex(a);
        a.matrix = new Ext.draw.Matrix();
        a.bbox = {plain: 0, transform: 0};
        this.applyAttrs(a);
        this.applyTransformations(a);
        a.fireEvent("render", a);
        return b
    },
    getBBoxText: function (h) {
        var j = {}, f, k, a, c, g, b;
        if (h && h.el) {
            b = h.el.dom;
            try {
                j = b.getBBox();
                return j
            } catch (d) {
            }
            j = {x: j.x, y: Infinity, width: 0, height: 0};
            g = b.getNumberOfChars();
            for (c = 0; c < g; c++) {
                f = b.getExtentOfChar(c);
                j.y = Math.min(f.y, j.y);
                k = f.y + f.height - j.y;
                j.height = Math.max(j.height, k);
                a = f.x + f.width - j.x;
                j.width = Math.max(j.width, a)
            }
            return j
        }
    },
    hide: function () {
        Ext.get(this.el).hide()
    },
    show: function () {
        Ext.get(this.el).show()
    },
    hidePrim: function (a) {
        this.addCls(a, Ext.baseCSSPrefix + "hide-visibility")
    },
    showPrim: function (a) {
        this.removeCls(a, Ext.baseCSSPrefix + "hide-visibility")
    },
    getDefs: function () {
        return this._defs || (this._defs = this.createSvgElement("defs"))
    },
    transform: function (j, a) {
        var g = this, h = new Ext.draw.Matrix(), e = j.transformations, d = e.length, c = 0, b, f;
        for (; c < d; c++) {
            b = e[c];
            f = b.type;
            if (f == "translate") {
                h.translate(b.x, b.y)
            } else {
                if (f == "rotate") {
                    h.rotate(b.degrees, b.x, b.y)
                } else {
                    if (f == "scale") {
                        h.scale(b.x, b.y, b.centerX, b.centerY)
                    }
                }
            }
        }
        j.matrix = h;
        if (!a) {
            j.el.set({transform: h.toSvg()})
        }
    },
    setSize: function (c, a) {
        var d = this, b = d.el;
        c = +c || d.width;
        a = +a || d.height;
        d.width = c;
        d.height = a;
        b.setSize(c, a);
        b.set({width: c, height: a});
        d.callParent([c, a])
    },
    getRegion: function () {
        var e = this.el.getXY(), c = this.bgRect.getXY(), b = Math.max, a = b(e[0], c[0]), d = b(e[1], c[1]);
        return {left: a, top: d, right: a + this.width, bottom: d + this.height}
    },
    onRemove: function (a) {
        if (a.el) {
            a.el.destroy();
            delete a.el
        }
        this.callParent(arguments)
    },
    setViewBox: function (b, d, c, a) {
        if (isFinite(b) && isFinite(d) && isFinite(c) && isFinite(a)) {
            this.callParent(arguments);
            this.el.dom.setAttribute("viewBox", [b, d, c, a].join(" "))
        }
    },
    render: function (c) {
        var e = this, b, d, a, f, g;
        if (!e.el) {
            b = {xmlns: "http://www.w3.org/2000/svg", version: 1.1, width: e.width || 0, height: e.height || 0};
            if (e.forceLtr) {
                b.direction = "ltr"
            }
            d = e.createSvgElement("svg", b);
            a = e.getDefs();
            f = e.createSvgElement("rect", {width: "100%", height: "100%", fill: "#000", stroke: "none", opacity: 0});
            if (Ext.isSafari3) {
                g = e.createSvgElement("rect", {
                    x: -10,
                    y: -10,
                    width: "110%",
                    height: "110%",
                    fill: "none",
                    stroke: "#000"
                })
            }
            d.appendChild(a);
            if (Ext.isSafari3) {
                d.appendChild(g)
            }
            d.appendChild(f);
            c.appendChild(d);
            e.el = Ext.get(d);
            e.bgRect = Ext.get(f);
            if (Ext.isSafari3) {
                e.webkitRect = Ext.get(g);
                e.webkitRect.hide()
            }
            e.el.on({
                scope: e,
                mouseup: e.onMouseUp,
                mousedown: e.onMouseDown,
                mouseover: e.onMouseOver,
                mouseout: e.onMouseOut,
                mousemove: e.onMouseMove,
                mouseenter: e.onMouseEnter,
                mouseleave: e.onMouseLeave,
                click: e.onClick,
                dblclick: e.onDblClick
            })
        }
        e.renderAll()
    },
    onMouseEnter: function (a) {
        if (this.el.parent().getRegion().contains(a.getPoint())) {
            this.fireEvent("mouseenter", a)
        }
    },
    onMouseLeave: function (a) {
        if (!this.el.parent().getRegion().contains(a.getPoint())) {
            this.fireEvent("mouseleave", a)
        }
    },
    processEvent: function (b, f) {
        var d = f.getTarget(), a = this.surface, c;
        this.fireEvent(b, f);
        if (d.nodeName == "tspan" && d.parentNode) {
            d = d.parentNode
        }
        c = this.items.get(d.id);
        if (c) {
            c.fireEvent(b, c, f)
        }
    },
    tuneText: function (j, k) {
        var a = j.el.dom, b = [], m, g, l, d, e, c, f, h;
        if (k.hasOwnProperty("text")) {
            l = j.tspans && Ext.Array.map(j.tspans, function (n) {
                    return n.textContent
                }).join("");
            if (!j.tspans || k.text != l) {
                b = this.setText(j, k.text);
                j.tspans = b
            } else {
                b = j.tspans || []
            }
        }
        if (b.length) {
            m = this.getBBoxText(j).height;
            h = j.el.dom.getAttribute("x");
            for (d = 0, e = b.length; d < e; d++) {
                f = (Ext.isFF3_0 || Ext.isFF3_5) ? 2 : 4;
                b[d].setAttribute("x", h);
                b[d].setAttribute("dy", d ? m * 1.2 : m / f)
            }
            j.dirty = true
        }
    },
    setText: function (j, d) {
        var g = this, a = j.el.dom, b = [], l, h, k, e, f, c;
        while (a.firstChild) {
            a.removeChild(a.firstChild)
        }
        c = String(d).split("\n");
        for (e = 0, f = c.length; e < f; e++) {
            k = c[e];
            if (k) {
                h = g.createSvgElement("tspan");
                h.appendChild(document.createTextNode(Ext.htmlDecode(k)));
                a.appendChild(h);
                b[e] = h
            }
        }
        return b
    },
    renderAll: function () {
        this.items.each(this.renderItem, this)
    },
    renderItem: function (a) {
        if (!this.el) {
            return
        }
        if (!a.el) {
            this.createSpriteElement(a)
        }
        if (a.zIndexDirty) {
            this.applyZIndex(a)
        }
        if (a.dirty) {
            this.applyAttrs(a);
            if (a.dirtyTransform) {
                this.applyTransformations(a)
            }
        }
    },
    redraw: function (a) {
        a.dirty = a.zIndexDirty = true;
        this.renderItem(a)
    },
    applyAttrs: function (k) {
        var r = this, b = k.el, f = k.group, l = k.attr, e = r.parsers, c = r.gradientsMap || {}, q = Ext.isSafari && !Ext.isStrict, d = r.fontRe, p, n, g, m, j, t, o, u, a, h, s;
        if (f) {
            p = [].concat(f);
            g = p.length;
            for (n = 0; n < g; n++) {
                f = p[n];
                r.getGroup(f).add(k)
            }
            delete k.group
        }
        m = r.scrubAttrs(k) || {};
        k.bbox.plain = 0;
        k.bbox.transform = 0;
        if (k.type == "circle" || k.type == "ellipse") {
            m.cx = m.cx || m.x;
            m.cy = m.cy || m.y
        } else {
            if (k.type == "rect") {
                m.rx = m.ry = m.r
            } else {
                if (k.type == "path" && m.d) {
                    m.d = Ext.draw.Draw.pathToString(Ext.draw.Draw.pathToAbsolute(m.d))
                }
            }
        }
        k.dirtyPath = false;
        if (m["clip-rect"]) {
            r.setClip(k, m);
            delete m["clip-rect"]
        }
        if (k.type == "text" && m.font && k.dirtyFont) {
            b.set({style: "font: " + m.font})
        }
        if (k.type == "image") {
            b.dom.setAttributeNS(r.xlink, "href", m.src)
        }
        Ext.applyIf(m, r.minDefaults[k.type]);
        if (k.dirtyHidden) {
            (l.hidden) ? r.hidePrim(k) : r.showPrim(k);
            k.dirtyHidden = false
        }
        for (t in m) {
            s = m[t];
            if (m.hasOwnProperty(t) && s != null) {
                if (q && ("color|stroke|fill".indexOf(t) > -1) && (s in c)) {
                    s = c[s]
                }
                if (t == "hidden" && k.type == "text") {
                    continue
                }
                if (t in e) {
                    b.dom.setAttribute(t, e[t](s, k, r))
                } else {
                    b.dom.setAttribute(t, s);
                    if (d.test(t)) {
                        h = h || {};
                        h[t] = s;
                        b.setStyle(t, s)
                    }
                }
            }
        }
        if (k.type == "text") {
            r.tuneText(k, m)
        }
        k.dirtyFont = false;
        o = l.style;
        if (o) {
            b.setStyle(o)
        }
        k.dirty = false;
        if (Ext.isSafari3) {
            r.webkitRect.show();
            Ext.defer(function () {
                r.webkitRect.hide()
            }, 1)
        }
    },
    setClip: function (b, f) {
        var e = this, d = f["clip-rect"], a, c;
        if (d) {
            if (b.clip) {
                b.clip.parentNode.parentNode.removeChild(b.clip.parentNode)
            }
            a = e.createSvgElement("clipPath");
            c = e.createSvgElement("rect");
            a.id = Ext.id(null, "ext-clip-");
            c.setAttribute("x", d.x);
            c.setAttribute("y", d.y);
            c.setAttribute("width", d.width);
            c.setAttribute("height", d.height);
            a.appendChild(c);
            e.getDefs().appendChild(a);
            b.el.dom.setAttribute("clip-path", "url(#" + a.id + ")");
            b.clip = c
        }
    },
    applyZIndex: function (d) {
        var f = this, b = f.items, a = b.indexOf(d), e = d.el, c;
        if (f.el.dom.childNodes[a + 2] !== e.dom) {
            if (a > 0) {
                do {
                    c = b.getAt(--a).el
                } while (!c && a > 0)
            }
            e.insertAfter(c || f.bgRect)
        }
        d.zIndexDirty = false
    },
    createItem: function (a) {
        var b = new Ext.draw.Sprite(a);
        b.surface = this;
        return b
    },
    addGradient: function (g) {
        g = Ext.draw.Draw.parseGradient(g);
        var e = this, d = g.stops.length, a = g.vector, k = Ext.isSafari && !Ext.isStrict, h, f, j, c, b;
        b = e.gradientsMap || {};
        if (!k) {
            if (g.type == "linear") {
                h = e.createSvgElement("linearGradient");
                h.setAttribute("x1", a[0]);
                h.setAttribute("y1", a[1]);
                h.setAttribute("x2", a[2]);
                h.setAttribute("y2", a[3])
            } else {
                h = e.createSvgElement("radialGradient");
                h.setAttribute("cx", g.centerX);
                h.setAttribute("cy", g.centerY);
                h.setAttribute("r", g.radius);
                if (Ext.isNumber(g.focalX) && Ext.isNumber(g.focalY)) {
                    h.setAttribute("fx", g.focalX);
                    h.setAttribute("fy", g.focalY)
                }
            }
            h.id = g.id;
            e.getDefs().appendChild(h);
            for (c = 0; c < d; c++) {
                f = g.stops[c];
                j = e.createSvgElement("stop");
                j.setAttribute("offset", f.offset + "%");
                j.setAttribute("stop-color", f.color);
                j.setAttribute("stop-opacity", f.opacity);
                h.appendChild(j)
            }
        } else {
            b["url(#" + g.id + ")"] = g.stops[0].color
        }
        e.gradientsMap = b
    },
    hasCls: function (a, b) {
        return b && (" " + (a.el.dom.getAttribute("class") || "") + " ").indexOf(" " + b + " ") != -1
    },
    addCls: function (e, g) {
        var f = e.el, d, a, c, b = [], h = f.getAttribute("class") || "";
        if (!Ext.isArray(g)) {
            if (typeof g == "string" && !this.hasCls(e, g)) {
                f.set({"class": h + " " + g})
            }
        } else {
            for (d = 0, a = g.length; d < a; d++) {
                c = g[d];
                if (typeof c == "string" && (" " + h + " ").indexOf(" " + c + " ") == -1) {
                    b.push(c)
                }
            }
            if (b.length) {
                f.set({"class": " " + b.join(" ")})
            }
        }
    },
    removeCls: function (j, f) {
        var g = this, b = j.el, d = b.getAttribute("class") || "", c, h, e, k, a;
        if (!Ext.isArray(f)) {
            f = [f]
        }
        if (d) {
            a = d.replace(g.trimRe, " ").split(g.spacesRe);
            for (c = 0, e = f.length; c < e; c++) {
                k = f[c];
                if (typeof k == "string") {
                    k = k.replace(g.trimRe, "");
                    h = Ext.Array.indexOf(a, k);
                    if (h != -1) {
                        Ext.Array.erase(a, h, 1)
                    }
                }
            }
            b.set({"class": a.join(" ")})
        }
    },
    destroy: function () {
        var a = this;
        a.callParent();
        if (a.el) {
            a.el.destroy()
        }
        if (a._defs) {
            Ext.get(a._defs).destroy()
        }
        if (a.bgRect) {
            Ext.get(a.bgRect).destroy()
        }
        if (a.webkitRect) {
            Ext.get(a.webkitRect).destroy()
        }
        delete a.el
    }
});
Ext.define("Ext.draw.engine.SvgExporter", function () {
    var b = /,/g, c = /(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)\s('*.*'*)/, j = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, g = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,([\d\.]+)\)/g, f, h, e, m, n = function (o) {
        f = o;
        h = f.length;
        e = f.width;
        m = f.height
    }, k = {
        path: function (s) {
            var o = s.attr, v = o.path, r = "", t, u, q;
            if (Ext.isArray(v[0])) {
                q = v.length;
                for (u = 0; u < q; u++) {
                    r += v[u].join(" ")
                }
            } else {
                if (Ext.isArray(v)) {
                    r = v.join(" ")
                } else {
                    r = v.replace(b, " ")
                }
            }
            t = d({
                d: r,
                fill: o.fill || "none",
                stroke: o.stroke,
                "fill-opacity": o.opacity,
                "stroke-width": o["stroke-width"],
                "stroke-opacity": o["stroke-opacity"],
                "z-index": o.zIndex,
                transform: s.matrix.toSvg()
            });
            return "<path " + t + "/>"
        }, text: function (u) {
            var r = u.attr, q = c.exec(r.font), w = (q && q[1]) || "12", p = (q && q[3]) || "Arial", v = r.text, t = (Ext.isFF3_0 || Ext.isFF3_5) ? 2 : 4, o = "", s;
            u.getBBox();
            o += '<tspan x="' + (r.x || "") + '" dy="';
            o += (w / t) + '">';
            o += Ext.htmlEncode(v) + "</tspan>";
            s = d({
                x: r.x,
                y: r.y,
                "font-size": w,
                "font-family": p,
                "font-weight": r["font-weight"],
                "text-anchor": r["text-anchor"],
                fill: r.fill || "#000",
                "fill-opacity": r.opacity,
                transform: u.matrix.toSvg()
            });
            return "<text " + s + ">" + o + "</text>"
        }, rect: function (p) {
            var o = p.attr, q = d({
                x: o.x,
                y: o.y,
                rx: o.rx,
                ry: o.ry,
                width: o.width,
                height: o.height,
                fill: o.fill || "none",
                "fill-opacity": o.opacity,
                stroke: o.stroke,
                "stroke-opacity": o["stroke-opacity"],
                "stroke-width": o["stroke-width"],
                transform: p.matrix && p.matrix.toSvg()
            });
            return "<rect " + q + "/>"
        }, circle: function (p) {
            var o = p.attr, q = d({
                cx: o.x,
                cy: o.y,
                r: o.radius,
                fill: o.translation.fill || o.fill || "none",
                "fill-opacity": o.opacity,
                stroke: o.stroke,
                "stroke-opacity": o["stroke-opacity"],
                "stroke-width": o["stroke-width"],
                transform: p.matrix.toSvg()
            });
            return "<circle " + q + " />"
        }, image: function (p) {
            var o = p.attr, q = d({
                x: o.x - (o.width / 2 >> 0),
                y: o.y - (o.height / 2 >> 0),
                width: o.width,
                height: o.height,
                "xlink:href": o.src,
                transform: p.matrix.toSvg()
            });
            return "<image " + q + " />"
        }
    }, a = function () {
        var o = '<?xml version="1.0" standalone="yes"?>';
        o += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
        return o
    }, l = function () {
        var w = '<svg width="' + e + 'px" height="' + m + 'px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', p = "", H, F, v, q, G, J, z, x, t, y, B, o, K, u, E, C, I, D, s, r;
        v = f.items.items;
        F = v.length;
        G = function (O) {
            var V = O.childNodes, S = V.length, R = 0, P, Q, L = "", M, U, N, T;
            for (; R < S; R++) {
                M = V[R];
                U = M.attributes;
                N = M.tagName;
                L += "<" + N;
                for (Q = 0, P = U.length; Q < P; Q++) {
                    T = U.item(Q);
                    L += " " + T.name + '="' + T.value + '"'
                }
                L += ">";
                if (M.childNodes.length > 0) {
                    L += G(M)
                }
                L += "</" + N + ">"
            }
            return L
        };
        if (f.getDefs) {
            p = G(f.getDefs())
        } else {
            x = f.gradientsColl;
            if (x) {
                t = x.keys;
                y = x.items;
                B = 0;
                o = t.length
            }
            for (; B < o; B++) {
                K = t[B];
                u = y[B];
                q = f.gradientsColl.getByKey(K);
                p += '<linearGradient id="' + K + '" x1="0" y1="0" x2="1" y2="1">';
                var A = q.colors.replace(j, "rgb($1|$2|$3)");
                A = A.replace(g, "rgba($1|$2|$3|$4)");
                J = A.split(",");
                for (E = 0, I = J.length; E < I; E++) {
                    z = J[E].split(" ");
                    A = Ext.draw.Color.fromString(z[1].replace(/\|/g, ","));
                    p += '<stop offset="' + z[0] + '" stop-color="' + A.toString() + '" stop-opacity="1"></stop>'
                }
                p += "</linearGradient>"
            }
        }
        w += "<defs>" + p + "</defs>";
        w += k.rect({attr: {width: "100%", height: "100%", fill: "#fff", stroke: "none", opacity: "0"}});
        D = new Array(F);
        for (E = 0; E < F; E++) {
            D[E] = E
        }
        D.sort(function (M, L) {
            s = v[M].attr.zIndex || 0;
            r = v[L].attr.zIndex || 0;
            if (s == r) {
                return M - L
            }
            return s - r
        });
        for (E = 0; E < F; E++) {
            H = v[D[E]];
            if (!H.attr.hidden) {
                w += k[H.type](H)
            }
        }
        w += "</svg>";
        return w
    }, d = function (q) {
        var p = "", o;
        for (o in q) {
            if (q.hasOwnProperty(o) && q[o] != null) {
                p += o + '="' + q[o] + '" '
            }
        }
        return p
    };
    return {
        singleton: true, generate: function (o, p) {
            p = p || {};
            n(o);
            return a() + l()
        }
    }
});
Ext.define("Ext.draw.engine.Vml", {
    extend: "Ext.draw.Surface",
    requires: ["Ext.draw.Draw", "Ext.draw.Color", "Ext.draw.Sprite", "Ext.draw.Matrix", "Ext.Element"],
    engine: "Vml",
    map: {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
    bitesRe: /([clmz]),?([^clmz]*)/gi,
    valRe: /-?[^,\s\-]+/g,
    fillUrlRe: /^url\(\s*['"]?([^\)]+?)['"]?\s*\)$/i,
    pathlike: /^(path|rect)$/,
    NonVmlPathRe: /[ahqstv]/ig,
    partialPathRe: /[clmz]/g,
    fontFamilyRe: /^['"]+|['"]+$/g,
    baseVmlCls: Ext.baseCSSPrefix + "vml-base",
    vmlGroupCls: Ext.baseCSSPrefix + "vml-group",
    spriteCls: Ext.baseCSSPrefix + "vml-sprite",
    measureSpanCls: Ext.baseCSSPrefix + "vml-measure-span",
    zoom: 21600,
    coordsize: 1000,
    coordorigin: "0 0",
    zIndexShift: 0,
    orderSpritesByZIndex: false,
    path2vml: function (s) {
        var m = this, t = m.NonVmlPathRe, b = m.map, e = m.valRe, q = m.zoom, d = m.bitesRe, f = Ext.Function.bind(Ext.draw.Draw.pathToAbsolute, Ext.draw.Draw), l, n, c, a, h, o, g, k;
        if (String(s).match(t)) {
            f = Ext.Function.bind(Ext.draw.Draw.path2curve, Ext.draw.Draw)
        } else {
            if (!String(s).match(m.partialPathRe)) {
                l = String(s).replace(d, function (u, w, p) {
                    var v = [], j = w.toLowerCase() == "m", r = b[w];
                    p.replace(e, function (x) {
                        if (j && v.length === 2) {
                            r += v + b[w == "m" ? "l" : "L"];
                            v = []
                        }
                        v.push(Math.round(x * q))
                    });
                    return r + v
                });
                return l
            }
        }
        n = f(s);
        l = [];
        for (h = 0, o = n.length; h < o; h++) {
            c = n[h];
            a = n[h][0].toLowerCase();
            if (a == "z") {
                a = "x"
            }
            for (g = 1, k = c.length; g < k; g++) {
                a += Math.round(c[g] * m.zoom) + (g != k - 1 ? "," : "")
            }
            l.push(a)
        }
        return l.join(" ")
    },
    translateAttrs: {
        radius: "r",
        radiusX: "rx",
        radiusY: "ry",
        lineWidth: "stroke-width",
        fillOpacity: "fill-opacity",
        strokeOpacity: "stroke-opacity",
        strokeLinejoin: "stroke-linejoin"
    },
    minDefaults: {
        circle: {
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        ellipse: {
            cx: 0,
            cy: 0,
            rx: 0,
            ry: 0,
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        rect: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            rx: 0,
            ry: 0,
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        text: {
            x: 0,
            y: 0,
            "text-anchor": "start",
            font: '10px "Arial"',
            fill: "#000",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        path: {
            d: "M0,0",
            fill: "none",
            stroke: null,
            "stroke-width": null,
            opacity: null,
            "fill-opacity": null,
            "stroke-opacity": null
        },
        image: {x: 0, y: 0, width: 0, height: 0, preserveAspectRatio: "none", opacity: null}
    },
    onMouseEnter: function (a) {
        this.fireEvent("mouseenter", a)
    },
    onMouseLeave: function (a) {
        this.fireEvent("mouseleave", a)
    },
    processEvent: function (a, d) {
        var c = d.getTarget(), b;
        this.fireEvent(a, d);
        b = this.items.get(c.id);
        if (b) {
            b.fireEvent(a, b, d)
        }
    },
    createSpriteElement: function (g) {
        var e = this, d = g.attr, f = g.type, j = e.zoom, b = g.vml || (g.vml = {}), c = (f === "image") ? e.createNode("image") : e.createNode("shape"), k, h, a;
        c.coordsize = j + " " + j;
        c.coordorigin = d.coordorigin || "0 0";
        Ext.get(c).addCls(e.spriteCls);
        if (f == "text") {
            b.path = k = e.createNode("path");
            k.textpathok = true;
            b.textpath = a = e.createNode("textpath");
            a.on = true;
            c.appendChild(a);
            c.appendChild(k)
        }
        c.id = g.id;
        g.el = Ext.get(c);
        g.el.setStyle("zIndex", -e.zIndexShift);
        e.el.appendChild(c);
        if (f !== "image") {
            h = e.createNode("skew");
            h.on = true;
            c.appendChild(h);
            g.skew = h
        }
        g.matrix = new Ext.draw.Matrix();
        g.bbox = {plain: null, transform: null};
        this.applyAttrs(g);
        this.applyTransformations(g);
        g.fireEvent("render", g);
        return g.el
    },
    getBBoxText: function (b) {
        var a = b.vml;
        return {x: a.X + (a.bbx || 0) - a.W / 2, y: a.Y - a.H / 2, width: a.W, height: a.H}
    },
    applyAttrs: function (o) {
        var l = this, n = o.group, p = o.attr, d = o.el, h = d.dom, b, e, j, k, m, g, f, c, a;
        if (n) {
            e = [].concat(n);
            k = e.length;
            for (j = 0; j < k; j++) {
                n = e[j];
                l.getGroup(n).add(o)
            }
            delete o.group
        }
        m = l.scrubAttrs(o) || {};
        if (o.zIndexDirty) {
            l.setZIndex(o)
        }
        Ext.applyIf(m, l.minDefaults[o.type]);
        if (o.type == "image") {
            Ext.apply(o.attr, {x: m.x, y: m.y, width: m.width, height: m.height});
            d.setStyle({width: m.width + "px", height: m.height + "px"});
            h.src = m.src
        }
        if (h.href) {
            h.href = m.href
        }
        if (h.title) {
            h.title = m.title
        }
        if (h.target) {
            h.target = m.target
        }
        if (h.cursor) {
            h.cursor = m.cursor
        }
        if (o.dirtyHidden) {
            (m.hidden) ? l.hidePrim(o) : l.showPrim(o);
            o.dirtyHidden = false
        }
        if (o.dirtyPath) {
            if (o.type == "circle" || o.type == "ellipse") {
                g = m.x;
                f = m.y;
                c = m.rx || m.r || 0;
                a = m.ry || m.r || 0;
                h.path = Ext.String.format("ar{0},{1},{2},{3},{4},{1},{4},{1}", Math.round((g - c) * l.zoom), Math.round((f - a) * l.zoom), Math.round((g + c) * l.zoom), Math.round((f + a) * l.zoom), Math.round(g * l.zoom));
                o.dirtyPath = false
            } else {
                o.attr.path = m.path = l.setPaths(o, m) || m.path;
                h.path = l.path2vml(m.path);
                o.dirtyPath = false
            }
        }
        if ("clip-rect" in m) {
            l.setClip(o, m)
        }
        if (o.type == "text") {
            l.setTextAttributes(o, m)
        }
        if (m.opacity || m["stroke-opacity"] || m.fill) {
            l.setFill(o, m)
        }
        if (m.stroke || m["stroke-opacity"] || m.fill) {
            l.setStroke(o, m)
        }
        b = p.style;
        if (b) {
            d.setStyle(b)
        }
        o.dirty = false
    },
    setZIndex: function (e) {
        var g = this, h = e.attr.zIndex, b = g.zIndexShift, c, a, f, d;
        if (h < b) {
            c = g.items.items;
            a = c.length;
            for (d = 0; d < a; d++) {
                if ((h = c[d].attr.zIndex) && h < b) {
                    b = h
                }
            }
            g.zIndexShift = b;
            for (d = 0; d < a; d++) {
                f = c[d];
                if (f.el) {
                    f.el.setStyle("zIndex", f.attr.zIndex - b)
                }
                f.zIndexDirty = false
            }
        } else {
            if (e.el) {
                e.el.setStyle("zIndex", h - b);
                e.zIndexDirty = false
            }
        }
    },
    setPaths: function (b, c) {
        var a = b.attr;
        b.bbox.plain = null;
        b.bbox.transform = null;
        if (b.type == "circle") {
            a.rx = a.ry = c.r;
            return Ext.draw.Draw.ellipsePath(b)
        } else {
            if (b.type == "ellipse") {
                a.rx = c.rx;
                a.ry = c.ry;
                return Ext.draw.Draw.ellipsePath(b)
            } else {
                if (b.type == "rect") {
                    a.rx = a.ry = c.r;
                    return Ext.draw.Draw.rectPath(b)
                } else {
                    if (b.type == "path" && a.path) {
                        return Ext.draw.Draw.pathToAbsolute(a.path)
                    }
                }
            }
        }
        return false
    },
    setFill: function (j, e) {
        var f = this, c = j.el.dom, h = c.fill, b = false, g, a, k, d;
        if (!h) {
            h = c.fill = f.createNode("fill");
            b = true
        }
        if (Ext.isArray(e.fill)) {
            e.fill = e.fill[0]
        }
        if (e.fill == "none") {
            h.on = false
        } else {
            if (typeof e.opacity == "number") {
                h.opacity = e.opacity
            }
            if (typeof e["fill-opacity"] == "number") {
                h.opacity = e["fill-opacity"]
            }
            h.on = true;
            if (typeof e.fill == "string") {
                a = e.fill.match(f.fillUrlRe);
                if (a) {
                    a = a[1];
                    if (a.charAt(0) == "#") {
                        g = f.gradientsColl.getByKey(a.substring(1))
                    }
                    if (g) {
                        k = e.rotation;
                        d = -(g.angle + 270 + (k ? k.degrees : 0)) % 360;
                        if (d === 0) {
                            d = 180
                        }
                        h.angle = d;
                        h.type = "gradient";
                        h.method = "sigma";
                        if (h.colors) {
                            h.colors.value = g.colors
                        } else {
                            h.colors = g.colors
                        }
                    } else {
                        h.src = a;
                        h.type = "tile"
                    }
                } else {
                    h.color = Ext.draw.Color.toHex(e.fill);
                    h.src = "";
                    h.type = "solid"
                }
            }
        }
        if (b) {
            c.appendChild(h)
        }
    },
    setStroke: function (b, g) {
        var e = this, d = b.el.dom, h = b.strokeEl, f = false, c, a;
        if (!h) {
            h = b.strokeEl = e.createNode("stroke");
            f = true
        }
        if (Ext.isArray(g.stroke)) {
            g.stroke = g.stroke[0]
        }
        if (!g.stroke || g.stroke == "none" || g.stroke == 0 || g["stroke-width"] == 0) {
            h.on = false
        } else {
            h.on = true;
            if (g.stroke && !g.stroke.match(e.fillUrlRe)) {
                h.color = Ext.draw.Color.toHex(g.stroke)
            }
            h.dashstyle = g["stroke-dasharray"] ? "dash" : "solid";
            h.joinstyle = g["stroke-linejoin"];
            h.endcap = g["stroke-linecap"] || "round";
            h.miterlimit = g["stroke-miterlimit"] || 8;
            c = parseFloat(g["stroke-width"] || 1) * 0.75;
            a = g["stroke-opacity"] || 1;
            if (Ext.isNumber(c) && c < 1) {
                h.weight = 1;
                h.opacity = a * c
            } else {
                h.weight = c;
                h.opacity = a
            }
        }
        if (f) {
            d.appendChild(h)
        }
    },
    setClip: function (b, e) {
        var d = this, a = b.clipEl, c = String(e["clip-rect"]).split(d.separatorRe);
        if (!a) {
            a = b.clipEl = d.el.insertFirst(Ext.getDoc().dom.createElement("div"));
            a.addCls(Ext.baseCSSPrefix + "vml-sprite")
        }
        if (c.length == 4) {
            c[2] = +c[2] + (+c[0]);
            c[3] = +c[3] + (+c[1]);
            a.setStyle("clip", Ext.String.format("rect({1}px {2}px {3}px {0}px)", c[0], c[1], c[2], c[3]));
            a.setSize(d.el.width, d.el.height)
        } else {
            a.setStyle("clip", "")
        }
    },
    setTextAttributes: function (h, c) {
        var g = this, a = h.vml, e = a.textpath.style, f = g.span.style, j = g.zoom, k = {
            fontSize: "font-size",
            fontWeight: "font-weight",
            fontStyle: "font-style"
        }, b, d;
        if (h.dirtyFont) {
            if (c.font) {
                e.font = f.font = c.font
            }
            if (c["font-family"]) {
                e.fontFamily = '"' + c["font-family"].split(",")[0].replace(g.fontFamilyRe, "") + '"';
                f.fontFamily = c["font-family"]
            }
            for (b in k) {
                d = c[k[b]];
                if (d) {
                    e[b] = f[b] = d
                }
            }
            g.setText(h, c.text);
            if (a.textpath.string) {
                g.span.innerHTML = String(a.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br/>")
            }
            a.W = g.span.offsetWidth;
            a.H = g.span.offsetHeight + 2;
            if (c["text-anchor"] == "middle") {
                e["v-text-align"] = "center"
            } else {
                if (c["text-anchor"] == "end") {
                    e["v-text-align"] = "right";
                    a.bbx = -Math.round(a.W / 2)
                } else {
                    e["v-text-align"] = "left";
                    a.bbx = Math.round(a.W / 2)
                }
            }
        }
        a.X = c.x;
        a.Y = c.y;
        a.path.v = Ext.String.format("m{0},{1}l{2},{1}", Math.round(a.X * j), Math.round(a.Y * j), Math.round(a.X * j) + 1);
        h.bbox.plain = null;
        h.bbox.transform = null;
        h.dirtyFont = false
    },
    setText: function (a, b) {
        a.vml.textpath.string = Ext.htmlDecode(b)
    },
    hide: function () {
        this.el.hide()
    },
    show: function () {
        this.el.show()
    },
    hidePrim: function (a) {
        a.el.addCls(Ext.baseCSSPrefix + "hide-visibility")
    },
    showPrim: function (a) {
        a.el.removeCls(Ext.baseCSSPrefix + "hide-visibility")
    },
    setSize: function (b, a) {
        var c = this;
        b = b || c.width;
        a = a || c.height;
        c.width = b;
        c.height = a;
        if (c.el) {
            if (b != undefined) {
                c.el.setWidth(b)
            }
            if (a != undefined) {
                c.el.setHeight(a)
            }
        }
        c.callParent(arguments)
    },
    applyViewBox: function () {
        var f = this, g = f.viewBox, e = f.width, b = f.height, c, a, d;
        f.callParent();
        if (g && (e || b)) {
            c = f.items.items;
            a = c.length;
            for (d = 0; d < a; d++) {
                f.applyTransformations(c[d])
            }
        }
    },
    onAdd: function (a) {
        this.callParent(arguments);
        if (this.el) {
            this.renderItem(a)
        }
    },
    onRemove: function (a) {
        if (a.el) {
            a.el.destroy();
            delete a.el
        }
        this.callParent(arguments)
    },
    render: function (a) {
        var c = this, f = Ext.getDoc().dom, b;
        if (!c.createNode) {
            try {
                if (!f.namespaces.rvml) {
                    f.namespaces.add("rvml", "urn:schemas-microsoft-com:vml")
                }
                c.createNode = function (e) {
                    return f.createElement("<rvml:" + e + ' class="rvml">')
                }
            } catch (d) {
                c.createNode = function (e) {
                    return f.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
                }
            }
        }
        if (!c.el) {
            b = f.createElement("div");
            c.el = Ext.get(b);
            c.el.addCls(c.baseVmlCls);
            c.span = f.createElement("span");
            Ext.get(c.span).addCls(c.measureSpanCls);
            b.appendChild(c.span);
            c.el.setSize(c.width || 0, c.height || 0);
            a.appendChild(b);
            c.el.on({
                scope: c,
                mouseup: c.onMouseUp,
                mousedown: c.onMouseDown,
                mouseover: c.onMouseOver,
                mouseout: c.onMouseOut,
                mousemove: c.onMouseMove,
                mouseenter: c.onMouseEnter,
                mouseleave: c.onMouseLeave,
                click: c.onClick,
                dblclick: c.onDblClick
            })
        }
        c.renderAll()
    },
    renderAll: function () {
        this.items.each(this.renderItem, this)
    },
    redraw: function (a) {
        a.dirty = true;
        this.renderItem(a)
    },
    renderItem: function (a) {
        if (!this.el) {
            return
        }
        if (!a.el) {
            this.createSpriteElement(a)
        }
        if (a.dirty) {
            this.applyAttrs(a);
            if (a.dirtyTransform) {
                this.applyTransformations(a)
            }
        }
    },
    rotationCompensation: function (d, c, a) {
        var b = new Ext.draw.Matrix();
        b.rotate(-d, 0.5, 0.5);
        return {x: b.x(c, a), y: b.y(c, a)}
    },
    transform: function (m, t) {
        var s = this, a = s.getBBox(m, true), o = new Ext.draw.Matrix(), j = m.transformations, l = j.length, p = 0, h = 0, c = 1, b = 1, d = m.el, q = d.dom, n = q.style, e = m.skew, r = s.viewBoxShift, k, f, g;
        for (; p < l; p++) {
            k = j[p];
            f = k.type;
            if (f == "translate") {
                o.translate(k.x, k.y)
            } else {
                if (f == "rotate") {
                    o.rotate(k.degrees, k.x, k.y);
                    h += k.degrees
                } else {
                    if (f == "scale") {
                        o.scale(k.x, k.y, k.centerX, k.centerY);
                        c *= k.x;
                        b *= k.y
                    }
                }
            }
        }
        m.matrix = o.clone();
        if (t) {
            return
        }
        if (r) {
            o.prepend(r.scale, 0, 0, r.scale, r.dx * r.scale, r.dy * r.scale)
        }
        if (m.type != "image" && e) {
            e.origin = "0,0";
            e.matrix = o.toString();
            g = o.offset();
            if (g[0] > 32767) {
                g[0] = 32767
            } else {
                if (g[0] < -32768) {
                    g[0] = -32768
                }
            }
            if (g[1] > 32767) {
                g[1] = 32767
            } else {
                if (g[1] < -32768) {
                    g[1] = -32768
                }
            }
            e.offset = g
        } else {
            n.filter = o.toFilter();
            n.left = Math.min(o.x(a.x, a.y), o.x(a.x + a.width, a.y), o.x(a.x, a.y + a.height), o.x(a.x + a.width, a.y + a.height)) + "px";
            n.top = Math.min(o.y(a.x, a.y), o.y(a.x + a.width, a.y), o.y(a.x, a.y + a.height), o.y(a.x + a.width, a.y + a.height)) + "px"
        }
    },
    createItem: function (a) {
        return Ext.create("Ext.draw.Sprite", a)
    },
    getRegion: function () {
        return this.el.getRegion()
    },
    addCls: function (a, b) {
        if (a && a.el) {
            a.el.addCls(b)
        }
    },
    removeCls: function (a, b) {
        if (a && a.el) {
            a.el.removeCls(b)
        }
    },
    addGradient: function (f) {
        var d = this.gradientsColl || (this.gradientsColl = Ext.create("Ext.util.MixedCollection")), a = [], h = Ext.create("Ext.util.MixedCollection"), k, e, b, g, j, c;
        h.addAll(f.stops);
        h.sortByKey("ASC", function (m, l) {
            m = parseInt(m, 10);
            l = parseInt(l, 10);
            return m > l ? 1 : (m < l ? -1 : 0)
        });
        k = h.keys;
        e = h.items;
        b = k.length;
        for (c = 0; c < b; c++) {
            g = k[c];
            j = e[c];
            a.push(g + "% " + j.color)
        }
        d.add(f.id, {colors: a.join(","), angle: f.angle})
    },
    destroy: function () {
        var a = this;
        a.callParent(arguments);
        if (a.el) {
            a.el.destroy()
        }
        delete a.el
    }
});