Ext.define("Ext.data.amf.Encoder", {
    alias: "data.amf.Encoder",
    config: {format: 3},
    bytes: [],
    constructor: function (a) {
        this.initConfig(a);
        this.clear()
    },
    clear: function () {
        this.bytes = []
    },
    applyFormat: function (b) {
        var a = {
            0: {
                writeUndefined: this.write0Undefined,
                writeNull: this.write0Null,
                writeBoolean: this.write0Boolean,
                writeNumber: this.write0Number,
                writeString: this.write0String,
                writeXml: this.write0Xml,
                writeDate: this.write0Date,
                writeArray: this.write0Array,
                writeGenericObject: this.write0GenericObject
            },
            3: {
                writeUndefined: this.write3Undefined,
                writeNull: this.write3Null,
                writeBoolean: this.write3Boolean,
                writeNumber: this.write3Number,
                writeString: this.write3String,
                writeXml: this.write3Xml,
                writeDate: this.write3Date,
                writeArray: this.write3Array,
                writeGenericObject: this.write3GenericObject
            }
        }[b];
        if (a) {
            Ext.apply(this, a);
            return b
        } else {
            return
        }
    },
    writeObject: function (b) {
        var a = typeof(b);
        if (a === "undefined") {
            this.writeUndefined()
        } else {
            if (b === null) {
                this.writeNull()
            } else {
                if (Ext.isBoolean(b)) {
                    this.writeBoolean(b)
                } else {
                    if (Ext.isString(b)) {
                        this.writeString(b)
                    } else {
                        if (a === "number" || b instanceof Number) {
                            this.writeNumber(b)
                        } else {
                            if (a === "object") {
                                if (b instanceof Date) {
                                    this.writeDate(b)
                                } else {
                                    if (Ext.isArray(b)) {
                                        this.writeArray(b)
                                    } else {
                                        if (this.isXmlDocument(b)) {
                                            this.writeXml(b)
                                        } else {
                                            this.writeGenericObject(b)
                                        }
                                    }
                                }
                            } else {
                            }
                        }
                    }
                }
            }
        }
    },
    write3Undefined: function () {
        this.writeByte(0)
    },
    write0Undefined: function () {
        this.writeByte(6)
    },
    write3Null: function () {
        this.writeByte(1)
    },
    write0Null: function () {
        this.writeByte(5)
    },
    write3Boolean: function (a) {
        if (a) {
            this.writeByte(3)
        } else {
            this.writeByte(2)
        }
    },
    write0Boolean: function (a) {
        this.writeByte(1);
        if (a) {
            this.writeByte(1)
        } else {
            this.writeByte(0)
        }
    },
    encode29Int: function (d) {
        var e = [], a = d, c, b;
        if (a == 0) {
            return [0]
        }
        if (a > 2097151) {
            c = a & 255;
            e.unshift(c);
            a = a >> 8
        }
        while (a > 0) {
            c = a & 127;
            e.unshift(c);
            a = a >> 7
        }
        for (b = 0; b < e.length - 1; b++) {
            e[b] = e[b] | 128
        }
        return e
    },
    write3Number: function (c) {
        var d;
        var a = 536870911, b = -268435455;
        if (c instanceof Number) {
            c = c.valueOf()
        }
        if (c % 1 === 0 && c >= b && c <= a) {
            c = c & a;
            d = this.encode29Int(c);
            d.unshift(4);
            this.writeBytes(d)
        } else {
            d = this.encodeDouble(c);
            d.unshift(5);
            this.writeBytes(d)
        }
    },
    write0Number: function (a) {
        var b;
        if (a instanceof Number) {
            a = a.valueOf()
        }
        b = this.encodeDouble(a);
        b.unshift(0);
        this.writeBytes(b)
    },
    encodeUtf8Char: function (h) {
        var f = [], g, a, e, d;
        if (h <= 127) {
            f.push(h)
        } else {
            if (h <= 2047) {
                a = 2
            } else {
                if (h <= 65535) {
                    a = 3
                } else {
                    a = 4
                }
            }
            d = 128;
            for (e = 1; e < a; e++) {
                g = (h & 63) | 128;
                f.unshift(g);
                h = h >> 6;
                d = (d >> 1) | 128
            }
            g = h | d;
            f.unshift(g)
        }
        return f
    },
    encodeUtf8String: function (d) {
        var a, c = [];
        for (a = 0; a < d.length; a++) {
            var b = this.encodeUtf8Char(d.charCodeAt(a));
            Ext.Array.push(c, b)
        }
        return c
    },
    encode3Utf8StringLen: function (c) {
        var a = c.length, b = [];
        if (a <= 268435455) {
            a = a << 1;
            a = a | 1;
            b = this.encode29Int(a)
        } else {
        }
        return b
    },
    write3String: function (b) {
        if (b == "") {
            this.writeByte(6);
            this.writeByte(1)
        } else {
            var c = this.encodeUtf8String(b);
            var a = this.encode3Utf8StringLen(c);
            this.writeByte(6);
            this.writeBytes(a);
            this.writeBytes(c)
        }
    },
    encodeXInt: function (c, d) {
        var b = [], a;
        for (a = 0; a < d; a++) {
            b.unshift(c & 255);
            c = c >> 8
        }
        return b
    },
    write0String: function (c) {
        if (c == "") {
            this.writeByte(2);
            this.writeBytes([0, 0])
        } else {
            var d = this.encodeUtf8String(c);
            var b;
            var a;
            if (d.length <= 65535) {
                b = 2;
                a = this.encodeXInt(d.length, 2)
            } else {
                b = 12;
                a = this.encodeXInt(d.length, 4)
            }
            this.writeByte(b);
            this.writeBytes(a);
            this.writeBytes(d)
        }
    },
    write3XmlWithType: function (c, a) {
        var e = this.convertXmlToString(c);
        if (e == "") {
            this.writeByte(a);
            this.writeByte(1)
        } else {
            var d = this.encodeUtf8String(e);
            var b = this.encode3Utf8StringLen(d);
            this.writeByte(a);
            this.writeBytes(b);
            this.writeBytes(d)
        }
    },
    write3XmlDocument: function (a) {
        this.write3XmlWithType(a, 7)
    },
    write3Xml: function (a) {
        this.write3XmlWithType(a, 11)
    },
    write0Xml: function (b) {
        var d = this.convertXmlToString(b);
        this.writeByte(15);
        var c = this.encodeUtf8String(d);
        var a = this.encodeXInt(c.length, 4);
        this.writeBytes(a);
        this.writeBytes(c)
    },
    write3Date: function (a) {
        this.writeByte(8);
        this.writeBytes(this.encode29Int(1));
        this.writeBytes(this.encodeDouble(new Number(a)))
    },
    write0Date: function (a) {
        this.writeByte(11);
        this.writeBytes(this.encodeDouble(new Number(a)));
        this.writeBytes([0, 0])
    },
    write3Array: function (b) {
        this.writeByte(9);
        var a = b.length;
        a = a << 1;
        a = a | 1;
        this.writeBytes(this.encode29Int(a));
        this.writeByte(1);
        Ext.each(b, function (c) {
            this.writeObject(c)
        }, this)
    },
    write0ObjectProperty: function (b, d) {
        if (!(b instanceof String) && (typeof(b) !== "string")) {
            b = b + ""
        }
        var c = this.encodeUtf8String(b);
        var a;
        a = this.encodeXInt(c.length, 2);
        this.writeBytes(a);
        this.writeBytes(c);
        this.writeObject(d)
    },
    write0Array: function (a) {
        var b;
        this.writeByte(8);
        var c = 0;
        for (b in a) {
            c++
        }
        this.writeBytes(this.encodeXInt(c, 4));
        for (b in a) {
            Ext.Array.push(this.write0ObjectProperty(b, a[b]))
        }
        this.writeBytes([0, 0, 9])
    },
    write0StrictArray: function (b) {
        this.writeByte(10);
        var a = b.length;
        this.writeBytes(this.encodeXInt(a, 4));
        Ext.each(b, function (c) {
            this.writeObject(c)
        }, this)
    },
    write3ByteArray: function (b) {
        this.writeByte(12);
        var a = b.length;
        a = a << 1;
        a = a | 1;
        this.writeBytes(this.encode29Int(a));
        this.writeBytes(b)
    },
    write3GenericObject: function (d) {
        var b;
        this.writeByte(10);
        var c = 11;
        this.writeByte(c);
        this.writeByte(1);
        for (b in d) {
            var a = new String(b).valueOf();
            if (a == "") {
            }
            var e = (this.encodeUtf8String(b));
            this.writeBytes(this.encode3Utf8StringLen(b));
            this.writeBytes(e);
            this.writeObject(d[b])
        }
        this.writeByte(1)
    },
    write0GenericObject: function (d) {
        var c, a, b;
        c = !!d.$flexType;
        a = c ? 16 : 3;
        this.writeByte(a);
        if (c) {
            this.write0ShortUtf8String(d.$flexType)
        }
        for (b in d) {
            if (b != "$flexType") {
                Ext.Array.push(this.write0ObjectProperty(b, d[b]))
            }
        }
        this.writeBytes([0, 0, 9])
    },
    writeByte: function (a) {
        Ext.Array.push(this.bytes, a)
    },
    writeBytes: function (a) {
        var c;
        Ext.Array.push(this.bytes, a)
    },
    convertXmlToString: function (a) {
        var b;
        if (window.XMLSerializer) {
            b = new window.XMLSerializer().serializeToString(a)
        } else {
            b = a.xml
        }
        return b
    },
    isXmlDocument: function (a) {
        if (window.DOMParser) {
            if (Ext.isDefined(a.doctype)) {
                return true
            }
        }
        if (Ext.isString(a.xml)) {
            return true
        }
        return false
    },
    encodeDouble: function (o) {
        var b = 11, a = 52;
        var g = (1 << (b - 1)) - 1, r, k, h, m, d, q, n, c = [];
        var j = [127, 240, 0, 0, 0, 0, 0, 0], p = [255, 240, 0, 0, 0, 0, 0, 0], l = [255, 248, 0, 0, 0, 0, 0, 0];
        if (isNaN(o)) {
            c = l
        } else {
            if (o === Infinity) {
                c = j
            } else {
                if (o == -Infinity) {
                    c = p
                } else {
                    if (o === 0) {
                        k = 0;
                        h = 0;
                        r = (1 / o === -Infinity) ? 1 : 0
                    } else {
                        r = o < 0;
                        o = Math.abs(o);
                        if (o >= Math.pow(2, 1 - g)) {
                            m = Math.min(Math.floor(Math.log(o) / Math.LN2), g);
                            k = m + g;
                            h = Math.round(o * Math.pow(2, a - m) - Math.pow(2, a))
                        } else {
                            k = 0;
                            h = Math.round(o / Math.pow(2, 1 - g - a))
                        }
                    }
                    q = [];
                    for (d = a; d; d -= 1) {
                        q.push(h % 2 ? 1 : 0);
                        h = Math.floor(h / 2)
                    }
                    for (d = b; d; d -= 1) {
                        q.push(k % 2 ? 1 : 0);
                        k = Math.floor(k / 2)
                    }
                    q.push(r ? 1 : 0);
                    q.reverse();
                    n = q.join("");
                    c = [];
                    while (n.length) {
                        c.push(parseInt(n.substring(0, 8), 2));
                        n = n.substring(8)
                    }
                }
            }
        }
        return c
    },
    write0ShortUtf8String: function (c) {
        var b = this.encodeUtf8String(c), a;
        a = this.encodeXInt(b.length, 2);
        this.writeBytes(a);
        this.writeBytes(b)
    },
    writeAmfPacket: function (c, b) {
        var a;
        this.writeBytes([0, 0]);
        this.writeBytes(this.encodeXInt(c.length, 2));
        for (a in c) {
            this.writeAmfHeader(c[a].name, c[a].mustUnderstand, c[a].value)
        }
        this.writeBytes(this.encodeXInt(b.length, 2));
        for (a in b) {
            this.writeAmfMessage(b[a].targetUri, b[a].responseUri, b[a].body)
        }
    },
    writeAmfHeader: function (d, b, c) {
        this.write0ShortUtf8String(d);
        var a = b ? 1 : 0;
        this.writeByte(a);
        this.writeBytes(this.encodeXInt(-1, 4));
        this.writeObject(c)
    },
    writeAmfMessage: function (c, b, a) {
        this.write0ShortUtf8String(c);
        this.write0ShortUtf8String(b);
        this.writeBytes(this.encodeXInt(-1, 4));
        this.write0StrictArray(a)
    }
});
Ext.define("Ext.data.amf.Packet", function () {
    var f = Math.pow(2, -52), b = Math.pow(2, 8), g = 0, c, a, d, e;
    return {
        typeMap: {
            0: {
                0: "readDouble",
                1: "readBoolean",
                2: "readAmf0String",
                3: "readAmf0Object",
                5: "readNull",
                6: "readUndefined",
                7: "readReference",
                8: "readEcmaArray",
                10: "readStrictArray",
                11: "readAmf0Date",
                12: "readLongString",
                13: "readUnsupported",
                15: "readAmf0Xml",
                16: "readTypedObject"
            },
            3: {
                0: "readUndefined",
                1: "readNull",
                2: "readFalse",
                3: "readTrue",
                4: "readUInt29",
                5: "readDouble",
                6: "readAmf3String",
                7: "readAmf3Xml",
                8: "readAmf3Date",
                9: "readAmf3Array",
                10: "readAmf3Object",
                11: "readAmf3Xml",
                12: "readByteArray"
            }
        }, decode: function (i) {
            var l = this, m = l.headers = [], k = l.messages = [], j, h;
            g = 0;
            c = l.bytes = i;
            a = l.strings = [];
            d = l.objects = [];
            e = l.traits = [];
            l.version = l.readUInt(2);
            for (j = l.readUInt(2); j--;) {
                m.push({
                    name: l.readAmf0String(),
                    mustUnderstand: l.readBoolean(),
                    byteLength: l.readUInt(4),
                    value: l.readValue()
                });
                a = l.strings = [];
                d = l.objects = [];
                e = l.traits = []
            }
            for (h = l.readUInt(2); h--;) {
                k.push({
                    targetURI: l.readAmf0String(),
                    responseURI: l.readAmf0String(),
                    byteLength: l.readUInt(4),
                    body: l.readValue()
                });
                a = l.strings = [];
                d = l.objects = [];
                e = l.traits = []
            }
            g = 0;
            c = a = d = e = l.bytes = l.strings = l.objects = l.traits = null;
            return l
        }, decodeValue: function (h) {
            var i = this;
            c = i.bytes = h;
            g = 0;
            i.version = 3;
            a = i.strings = [];
            d = i.objects = [];
            e = i.traits = [];
            return i.readValue()
        }, parseXml: function (h) {
            var i;
            if (window.DOMParser) {
                i = (new DOMParser()).parseFromString(h, "text/xml")
            } else {
                i = new ActiveXObject("Microsoft.XMLDOM");
                i.loadXML(h)
            }
            return i
        }, readAmf0Date: function () {
            var h = new Date(this.readDouble());
            g += 2;
            return h
        }, readAmf0Object: function (j) {
            var i = this, h;
            j = j || {};
            d.push(j);
            while ((h = i.readAmf0String()) || c[g] !== 9) {
                j[h] = i.readValue()
            }
            g++;
            return j
        }, readAmf0String: function () {
            return this.readUtf8(this.readUInt(2))
        }, readAmf0Xml: function () {
            return this.parseXml(this.readLongString())
        }, readAmf3Array: function () {
            var l = this, n = l.readUInt29(), k, j, m, h;
            if (n & 1) {
                k = (n >> 1);
                j = l.readAmf3String();
                if (j) {
                    m = {};
                    d.push(m);
                    do {
                        m[j] = l.readValue()
                    } while ((j = l.readAmf3String()));
                    for (h = 0; h < k; h++) {
                        m[h] = l.readValue()
                    }
                } else {
                    m = [];
                    d.push(m);
                    for (h = 0; h < k; h++) {
                        m.push(l.readValue())
                    }
                }
            } else {
                m = d[n >> 1]
            }
            return m
        }, readAmf3Date: function () {
            var i = this, j = i.readUInt29(), h;
            if (j & 1) {
                h = new Date(i.readDouble());
                d.push(h)
            } else {
                h = d[j >> 1]
            }
            return h
        }, readAmf3Object: function () {
            var r = this, n = r.readUInt29(), k = [], t, p, q, j, h, m, s, o, l;
            if (n & 1) {
                t = (n & 7);
                if (t === 3) {
                    q = r.readAmf3String();
                    j = !!(n & 8);
                    p = (n >> 4);
                    for (l = 0; l < p; l++) {
                        k.push(r.readAmf3String())
                    }
                    h = {className: q, dynamic: j, members: k};
                    e.push(h)
                } else {
                    if ((n & 3) === 1) {
                        h = e[n >> 2];
                        q = h.className;
                        j = h.dynamic;
                        k = h.members;
                        p = k.length
                    } else {
                        if (t === 7) {
                        }
                    }
                }
                if (q) {
                    o = Ext.ClassManager.getByAlias("amf." + q);
                    m = o ? new o() : {$className: q}
                } else {
                    m = {}
                }
                d.push(m);
                for (l = 0; l < p; l++) {
                    m[k[l]] = r.readValue()
                }
                if (j) {
                    while ((s = r.readAmf3String())) {
                        m[s] = r.readValue()
                    }
                }
                if ((!o) && this.converters[q]) {
                    m = this.converters[q](m)
                }
            } else {
                m = d[n >> 1]
            }
            return m
        }, readAmf3String: function () {
            var h = this, j = h.readUInt29(), i;
            if (j & 1) {
                i = h.readUtf8(j >> 1);
                if (i) {
                    a.push(i)
                }
                return i
            } else {
                return a[j >> 1]
            }
        }, readAmf3Xml: function () {
            var h = this, j = h.readUInt29(), i;
            if (j & 1) {
                i = h.parseXml(h.readUtf8(j >> 1));
                d.push(i)
            } else {
                i = d[j >> 1]
            }
            return i
        }, readBoolean: function () {
            return !!c[g++]
        }, readByteArray: function () {
            var j = this.readUInt29(), i, h;
            if (j & 1) {
                h = g + (j >> 1);
                i = Array.prototype.slice.call(c, g, h);
                d.push(i);
                g = h
            } else {
                i = d[j >> 1]
            }
            return i
        }, readDouble: function () {
            var l = c[g++], h = c[g++], k = (l >> 7) ? -1 : 1, o = (((l & 127) << 4) | (h >> 4)), j = (h & 15), m = o ? 1 : 0, n = 6;
            while (n--) {
                j = (j * b) + c[g++]
            }
            if (!o) {
                if (!j) {
                    return 0
                }
                o = 1
            }
            if (o === 2047) {
                return j ? NaN : (Infinity * k)
            }
            return k * Math.pow(2, o - 1023) * (m + f * j)
        }, readEcmaArray: function () {
            g += 4;
            return this.readAmf0Object()
        }, readFalse: function () {
            return false
        }, readLongString: function () {
            return this.readUtf8(this.readUInt(4))
        }, readNull: function () {
            return null
        }, readReference: function () {
            return d[this.readUInt(2)]
        }, readStrictArray: function () {
            var j = this, i = j.readUInt(4), h = [];
            d.push(h);
            while (i--) {
                h.push(j.readValue())
            }
            return h
        }, readTrue: Ext.returnTrue, readTypedObject: function () {
            var l = this, k = l.readAmf0String(), i, h, j;
            i = Ext.ClassManager.getByAlias("amf." + k);
            h = i ? new i() : {$className: k};
            j = l.readAmf0Object(h);
            if ((!i) && this.converters[k]) {
                j = this.converters[k](h)
            }
            return j
        }, readUInt: function (k) {
            var j = 1, h;
            h = c[g++];
            for (; j < k; ++j) {
                h = (h << 8) | c[g++]
            }
            return h
        }, readUInt29: function () {
            var i = c[g++], h;
            if (i & 128) {
                h = c[g++];
                i = ((i & 127) << 7) | (h & 127);
                if (h & 128) {
                    h = c[g++];
                    i = (i << 7) | (h & 127);
                    if (h & 128) {
                        h = c[g++];
                        i = (i << 8) | h
                    }
                }
            }
            return i
        }, readUndefined: Ext.emptyFn, readUnsupported: Ext.emptyFn, readUtf8: function (r) {
            var l = g + r, o = [], j = 0, p = 65535, k = 1, s = [], n = 0, m, h, q;
            m = [o];
            while (g < l) {
                q = c[g++];
                if (q > 127) {
                    if (q > 239) {
                        h = 4;
                        q = (q & 7)
                    } else {
                        if (q > 223) {
                            h = 3;
                            q = (q & 15)
                        } else {
                            h = 2;
                            q = (q & 31)
                        }
                    }
                    while (--h) {
                        q = ((q << 6) | (c[g++] & 63))
                    }
                }
                o.push(q);
                if (++j === p) {
                    m.push(o = []);
                    j = 0;
                    k++
                }
            }
            for (; n < k; n++) {
                s.push(String.fromCharCode.apply(String, m[n]))
            }
            return s.join("")
        }, readValue: function () {
            var i = this, h = c[g++];
            if (h === 17) {
                i.version = 3;
                h = c[g++]
            }
            return i[i.typeMap[i.version][h]]()
        }, converters: {
            "flex.messaging.io.ArrayCollection": function (h) {
                return h.source || []
            }
        }
    }
});
Ext.define("Ext.data.amf.Reader", {
    extend: "Ext.data.reader.Json",
    alias: "reader.amf",
    requires: ["Ext.data.amf.Packet"],
    messageIndex: 0,
    read: function (b) {
        var e = this, a = b.responseBytes, f, d, c;
        if (!a) {
            throw"AMF Reader cannot process the response because it does not contain binary data. Make sure the Proxy's 'binary' config is true."
        }
        f = new Ext.data.amf.Packet();
        f.decode(a);
        d = f.messages;
        if (d.length) {
            c = e.readRecords(d[e.messageIndex].body)
        } else {
            c = e.nullResultSet;
            if (f.invalid) {
                c.success = false
            }
        }
        return c
    }
});
Ext.define("Ext.data.amf.Proxy", {
    extend: "Ext.data.proxy.Ajax",
    alias: "proxy.amf",
    requires: ["Ext.data.amf.Reader"],
    binary: true,
    reader: "amf"
});
Ext.define("Ext.data.amf.RemotingMessage", {
    alias: "data.amf.remotingmessage",
    config: {
        $flexType: "flex.messaging.messages.RemotingMessage",
        body: [],
        clientId: "",
        destination: "",
        headers: [],
        messageId: "",
        operation: "",
        source: "",
        timestamp: [],
        timeToLive: []
    },
    constructor: function (a) {
        this.initConfig(a)
    },
    encodeMessage: function () {
        var a = Ext.create("Ext.data.amf.XmlEncoder"), b;
        b = Ext.copyTo({}, this, "$flexType,body,clientId,destination,headers,messageId,operation,source,timestamp,timeToLive", true);
        a.writeObject(b);
        return a.body
    }
});
Ext.define("Ext.data.amf.XmlDecoder", {
    alias: "data.amf.xmldecoder", statics: {
        readXml: function (a) {
            var b;
            if (window.DOMParser) {
                b = (new DOMParser()).parseFromString(a, "text/xml")
            } else {
                b = new ActiveXObject("Microsoft.XMLDOM");
                b.loadXML(a)
            }
            return b
        }, readByteArray: function (d) {
            var a = [], f, b, e;
            e = d.firstChild.nodeValue;
            for (b = 0; b < e.length; b = b + 2) {
                f = e.substr(b, 2);
                a.push(parseInt(f, 16))
            }
            return a
        }, readAMF3Value: function (a) {
            var b;
            b = Ext.create("Ext.data.amf.Packet");
            return b.decodeValue(a)
        }, decodeTidFromFlexUID: function (a) {
            var b;
            b = a.substr(0, 8);
            return parseInt(b, 16)
        }
    }, constructor: function (a) {
        this.initConfig(a);
        this.clear()
    }, clear: function () {
        this.objectReferences = [];
        this.traitsReferences = [];
        this.stringReferences = []
    }, readAmfxMessage: function (b) {
        var e, d, a, c, f = {};
        this.clear();
        e = Ext.data.amf.XmlDecoder.readXml(b);
        d = e.getElementsByTagName("amfx")[0];
        a = d.getElementsByTagName("body")[0];
        f.targetURI = a.getAttribute("targetURI");
        f.responseURI = a.getAttribute("responseURI");
        for (c = 0; c < a.childNodes.length; c++) {
            if (a.childNodes.item(c).nodeType != 1) {
                continue
            }
            f.message = this.readValue(a.childNodes.item(c));
            break
        }
        return f
    }, readValue: function (a) {
        var b;
        if (typeof a.normalize === "function") {
            a.normalize()
        }
        if (a.tagName == "null") {
            return null
        } else {
            if (a.tagName == "true") {
                return true
            } else {
                if (a.tagName == "false") {
                    return false
                } else {
                    if (a.tagName == "string") {
                        return this.readString(a)
                    } else {
                        if (a.tagName == "int") {
                            return parseInt(a.firstChild.nodeValue)
                        } else {
                            if (a.tagName == "double") {
                                return parseFloat(a.firstChild.nodeValue)
                            } else {
                                if (a.tagName == "date") {
                                    b = new Date(parseFloat(a.firstChild.nodeValue));
                                    this.objectReferences.push(b);
                                    return b
                                } else {
                                    if (a.tagName == "dictionary") {
                                        return this.readDictionary(a)
                                    } else {
                                        if (a.tagName == "array") {
                                            return this.readArray(a)
                                        } else {
                                            if (a.tagName == "ref") {
                                                return this.readObjectRef(a)
                                            } else {
                                                if (a.tagName == "object") {
                                                    return this.readObject(a)
                                                } else {
                                                    if (a.tagName == "xml") {
                                                        return Ext.data.amf.XmlDecoder.readXml(a.firstChild.nodeValue)
                                                    } else {
                                                        if (a.tagName == "bytearray") {
                                                            return Ext.data.amf.XmlDecoder.readAMF3Value(Ext.data.amf.XmlDecoder.readByteArray(a))
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null
    }, readString: function (a) {
        var b;
        if (a.getAttributeNode("id")) {
            return this.stringReferences[parseInt(a.getAttribute("id"))]
        }
        b = (a.firstChild ? a.firstChild.nodeValue : "") || "";
        this.stringReferences.push(b);
        return b
    }, readTraits: function (b) {
        var c = [], a, d;
        if (b === null) {
            return null
        }
        if (b.getAttribute("externalizable") == "true") {
            return null
        }
        if (b.getAttributeNode("id")) {
            return this.traitsReferences[parseInt(b.getAttributeNode("id").value)]
        }
        d = b.childNodes;
        for (a = 0; a < d.length; a++) {
            if (d.item(a).nodeType != 1) {
                continue
            }
            c.push(this.readValue(d.item(a)))
        }
        this.traitsReferences.push(c);
        return c
    }, readObjectRef: function (a) {
        var b;
        b = parseInt(a.getAttribute("id"));
        return this.objectReferences[b]
    }, readObject: function (c) {
        var e, l = [], k, f, d, b, m, a, g = null, h;
        h = c.getAttribute("type");
        if (h) {
            g = Ext.ClassManager.getByAlias("amfx." + h)
        }
        e = g ? new g() : (h ? {$className: h} : {});
        if ((!g) && this.converters[h]) {
            e = this.converters[h](this, c);
            return e
        }
        k = c.getElementsByTagName("traits")[0];
        l = this.readTraits(k);
        this.objectReferences.push(e);
        d = 0;
        for (f = 0; f < c.childNodes.length; f++) {
            b = c.childNodes.item(f);
            if (b.nodeType != 1) {
                continue
            }
            if (b.tagName == "traits") {
                continue
            }
            m = l[d];
            a = this.readValue(b);
            d = d + 1;
            e[m] = a
        }
        return e
    }, readArray: function (e) {
        var k = [], c, h, g, f, a, d, m, b, o;
        this.objectReferences.push(k);
        m = parseInt(e.getAttributeNode("length").value);
        h = 0;
        for (f = 0; f < e.childNodes.length; f++) {
            c = e.childNodes.item(f);
            if (c.nodeType != 1) {
                continue
            }
            if (c.tagName == "item") {
                a = c.getAttributeNode("name").value;
                b = c.childNodes;
                for (g = 0; g < b.length; g++) {
                    o = b.item(g);
                    if (o.nodeType != 1) {
                        continue
                    }
                    d = this.readValue(o);
                    break
                }
                k[a] = d
            } else {
                k[h] = this.readValue(c);
                h++
            }
        }
        return k
    }, readDictionary: function (e) {
        var h = {}, d, f, c, b, g, a;
        a = parseInt(e.getAttribute("length"));
        this.objectReferences.push(h);
        d = null;
        f = null;
        b = 0;
        for (c = 0; c < e.childNodes.length; c++) {
            g = e.childNodes.item(c);
            if (g.nodeType != 1) {
                continue
            }
            if (!d) {
                d = this.readValue(g);
                continue
            }
            f = this.readValue(g);
            b = b + 1;
            h[d] = f;
            d = null;
            f = null
        }
        return h
    }, convertObjectWithSourceField: function (b) {
        var a, d, c;
        for (a = 0; a < b.childNodes.length; a++) {
            d = b.childNodes.item(a);
            if (d.tagName == "bytearray") {
                c = this.readValue(d);
                this.objectReferences.push(c);
                return c
            }
        }
        return null
    }, converters: {
        "flex.messaging.io.ArrayCollection": function (b, a) {
            return b.convertObjectWithSourceField(a)
        }, "mx.collections.ArrayList": function (b, a) {
            return b.convertObjectWithSourceField(a)
        }, "mx.collections.ArrayCollection": function (b, a) {
            return b.convertObjectWithSourceField(a)
        }
    }
});
Ext.define("Ext.data.amf.XmlEncoder", {
    alias: "data.amf.xmlencoder", body: "", statics: {
        generateFlexUID: function (e) {
            var d = "", c, a, b;
            if (e === undefined) {
                e = Ext.Number.randomInt(0, 4294967295)
            }
            b = (e + 4294967296).toString(16).toUpperCase();
            d = b.substr(b.length - 8, 8);
            for (a = 0; a < 3; a++) {
                d += "-";
                for (c = 0; c < 4; c++) {
                    d += Ext.Number.randomInt(0, 15).toString(16).toUpperCase()
                }
            }
            d += "-";
            b = new Number(new Date()).valueOf().toString(16).toUpperCase();
            a = 0;
            if (b.length < 8) {
                for (c = 0; c < b.length - 8; c++) {
                    a++;
                    d += "0"
                }
            }
            d += b.substr(-(8 - a));
            for (c = 0; c < 4; c++) {
                d += Ext.Number.randomInt(0, 15).toString(16).toUpperCase()
            }
            return d
        }
    }, constructor: function (a) {
        this.initConfig(a);
        this.clear()
    }, clear: function () {
        this.body = ""
    }, encodeUndefined: function () {
        return this.encodeNull()
    }, writeUndefined: function () {
        this.write(this.encodeUndefined())
    }, encodeNull: function () {
        return "<null />"
    }, writeNull: function () {
        this.write(this.encodeNull())
    }, encodeBoolean: function (b) {
        var a;
        if (b) {
            a = "<true />"
        } else {
            a = "<false />"
        }
        return a
    }, writeBoolean: function (a) {
        this.write(this.encodeBoolean(a))
    }, encodeString: function (b) {
        var a;
        if (b === "") {
            a = "<string />"
        } else {
            a = "<string>" + b + "</string>"
        }
        return a
    }, writeString: function (a) {
        this.write(this.encodeString(a))
    }, encodeInt: function (a) {
        return "<int>" + a.toString() + "</int>"
    }, writeInt: function (a) {
        this.write(this.encodeInt(a))
    }, encodeDouble: function (a) {
        return "<double>" + a.toString() + "</double>"
    }, writeDouble: function (a) {
        this.write(this.encodeDouble(a))
    }, encodeNumber: function (b) {
        var a = 536870911, c = -268435455;
        if (b instanceof Number) {
            b = b.valueOf()
        }
        if (b % 1 === 0 && b >= c && b <= a) {
            return this.encodeInt(b)
        } else {
            return this.encodeDouble(b)
        }
    }, writeNumber: function (a) {
        this.write(this.encodeNumber(a))
    }, encodeDate: function (a) {
        return "<date>" + (new Number(a)).toString() + "</date>"
    }, writeDate: function (a) {
        this.write(this.encodeDate(a))
    }, encodeEcmaElement: function (a, b) {
        var c = '<item name="' + a.toString() + '">' + this.encodeObject(b) + "</item>";
        return c
    }, encodeArray: function (g) {
        var e = [], a, d = [], c = g.length, b, f;
        for (b in g) {
            if (Ext.isNumeric(b) && (b % 1 == 0)) {
                e[b] = this.encodeObject(g[b])
            } else {
                d.push(this.encodeEcmaElement(b, g[b]))
            }
        }
        a = e.length;
        for (b = 0; b < e.length; b++) {
            if (e[b] === undefined) {
                a = b;
                break
            }
        }
        if (a < e.length) {
            for (b = firstNonOrdinals; b < e.length; b++) {
                if (e[b] !== undefined) {
                    d.push(this.encodeEcmaElement(b, e[b]))
                }
            }
            e = e.slice(0, a)
        }
        f = '<array length="' + e.length + '"';
        if (d.length > 0) {
            f += ' ecma="true"'
        }
        f += ">";
        for (b = 0; b < e.length; b++) {
            f += e[b]
        }
        for (b in d) {
            f += d[b]
        }
        f += "</array>";
        return f
    }, writeArray: function (a) {
        this.write(this.encodeArray(a))
    }, encodeXml: function (a) {
        var b = this.convertXmlToString(a);
        return "<xml><![CDATA[" + b + "]]></xml>"
    }, writeXml: function (a) {
        this.write(this.encodeXml(a))
    }, encodeGenericObject: function (d) {
        var c = [], a = [], f = null, b, e;
        for (b in d) {
            if (b == "$flexType") {
                f = d[b]
            } else {
                c.push(this.encodeString(new String(b)));
                a.push(this.encodeObject(d[b]))
            }
        }
        if (f) {
            e = '<object type="' + f + '">'
        } else {
            e = "<object>"
        }
        if (c.length > 0) {
            e += "<traits>";
            e += c.join("");
            e += "</traits>"
        } else {
            e += "<traits />"
        }
        e += a.join("");
        e += "</object>";
        return e
    }, writeGenericObject: function (a) {
        this.write(this.encodeGenericObject(a))
    }, encodeByteArray: function (d) {
        var c, a, b;
        if (d.length > 0) {
            c = "<bytearray>";
            for (a = 0; a < d.length; a++) {
                b = d[a].toString(16).toUpperCase();
                if (d[a] < 16) {
                    b = "0" + b
                }
                c += b
            }
            c += "</bytearray>"
        } else {
            c = "<bytearray />"
        }
        return c
    }, writeByteArray: function (a) {
        this.write(this.encodeByteArray(a))
    }, encodeObject: function (b) {
        var a = typeof(b);
        if (a === "undefined") {
            return this.encodeUndefined()
        } else {
            if (b === null) {
                return this.encodeNull()
            } else {
                if (Ext.isBoolean(b)) {
                    return this.encodeBoolean(b)
                } else {
                    if (Ext.isString(b)) {
                        return this.encodeString(b)
                    } else {
                        if (a === "number" || b instanceof Number) {
                            return this.encodeNumber(b)
                        } else {
                            if (a === "object") {
                                if (b instanceof Date) {
                                    return this.encodeDate(b)
                                } else {
                                    if (Ext.isArray(b)) {
                                        return this.encodeArray(b)
                                    } else {
                                        if (this.isXmlDocument(b)) {
                                            return this.encodeXml(b)
                                        } else {
                                            return this.encodeGenericObject(b)
                                        }
                                    }
                                }
                            } else {
                            }
                        }
                    }
                }
            }
        }
        return null
    }, writeObject: function (a) {
        this.write(this.encodeObject(a))
    }, encodeAmfxRemotingPacket: function (a) {
        var c, b;
        b = '<amfx ver="3" xmlns="http://www.macromedia.com/2005/amfx"><body>';
        b += a.encodeMessage();
        b += "</body></amfx>";
        return b
    }, writeAmfxRemotingPacket: function (a) {
        this.write(this.encodeAmfxRemotingPacket(a))
    }, convertXmlToString: function (a) {
        var b;
        if (window.XMLSerializer) {
            b = new window.XMLSerializer().serializeToString(a)
        } else {
            b = a.xml
        }
        return b
    }, isXmlDocument: function (a) {
        if (window.DOMParser) {
            if (Ext.isDefined(a.doctype)) {
                return true
            }
        }
        if (Ext.isString(a.xml)) {
            return true
        }
        return false
    }, write: function (a) {
        this.body += a
    }
});
Ext.define("Ext.direct.AmfRemotingProvider", {
    alias: "direct.amfremotingprovider",
    extend: "Ext.direct.Provider",
    requires: ["Ext.util.MixedCollection", "Ext.util.DelayedTask", "Ext.direct.Transaction", "Ext.direct.RemotingMethod", "Ext.data.amf.XmlEncoder", "Ext.data.amf.XmlDecoder", "Ext.data.amf.Encoder", "Ext.data.amf.Packet", "Ext.data.amf.RemotingMessage", "Ext.direct.ExceptionEvent"],
    binary: false,
    maxRetries: 1,
    timeout: undefined,
    constructor: function (a) {
        var b = this;
        b.callParent(arguments);
        b.addEvents("beforecall", "call");
        b.namespace = (Ext.isString(b.namespace)) ? Ext.ns(b.namespace) : b.namespace || window;
        b.transactions = new Ext.util.MixedCollection();
        b.callBuffer = []
    },
    initAPI: function () {
        var g = this.actions, e = this.namespace, f, b, c, d, a, h;
        for (f in g) {
            if (g.hasOwnProperty(f)) {
                b = e[f];
                if (!b) {
                    b = e[f] = {}
                }
                c = g[f];
                for (d = 0, a = c.length; d < a; ++d) {
                    h = new Ext.direct.RemotingMethod(c[d]);
                    b[h.name] = this.createHandler(f, h)
                }
            }
        }
    },
    createHandler: function (c, d) {
        var b = this, a;
        if (!d.formHandler) {
            a = function () {
                b.configureRequest(c, d, Array.prototype.slice.call(arguments, 0))
            }
        } else {
            a = function (f, g, e) {
                b.configureFormRequest(c, d, f, g, e)
            }
        }
        a.directCfg = {action: c, method: d};
        return a
    },
    isConnected: function () {
        return !!this.connected
    },
    connect: function () {
        var a = this;
        if (a.url) {
            a.clientId = Ext.data.amf.XmlEncoder.generateFlexUID();
            a.initAPI();
            a.connected = true;
            a.fireEvent("connect", a);
            a.DSId = null
        } else {
            if (!a.url) {
            }
        }
    },
    disconnect: function () {
        var a = this;
        if (a.connected) {
            a.connected = false;
            a.fireEvent("disconnect", a)
        }
    },
    runCallback: function (e, b) {
        var d = !!b.status, c = d ? "success" : "failure", f, a;
        if (e && e.callback) {
            f = e.callback;
            a = Ext.isDefined(b.result) ? b.result : b.data;
            if (Ext.isFunction(f)) {
                f(a, b, d)
            } else {
                Ext.callback(f[c], f.scope, [a, b, d]);
                Ext.callback(f.callback, f.scope, [a, b, d])
            }
        }
    },
    onData: function (k, h, c) {
        var f = this, d = 0, e, j, a, b, g;
        if (h) {
            j = f.createEvents(c);
            for (e = j.length; d < e; ++d) {
                a = j[d];
                b = f.getTransaction(a);
                f.fireEvent("data", f, a);
                if (b) {
                    f.runCallback(b, a, true);
                    Ext.direct.Manager.removeTransaction(b)
                }
            }
        } else {
            g = [].concat(k.transaction);
            for (e = g.length; d < e; ++d) {
                b = f.getTransaction(g[d]);
                if (b && b.retryCount < f.maxRetries) {
                    b.retry()
                } else {
                    a = new Ext.direct.ExceptionEvent({
                        data: null,
                        transaction: b,
                        code: Ext.direct.Manager.exceptions.TRANSPORT,
                        message: "Unable to connect to the server.",
                        xhr: c
                    });
                    f.fireEvent("data", f, a);
                    if (b) {
                        f.runCallback(b, a, false);
                        Ext.direct.Manager.removeTransaction(b)
                    }
                }
            }
        }
    },
    getTransaction: function (a) {
        return a && a.tid ? Ext.direct.Manager.getTransaction(a.tid) : null
    },
    configureRequest: function (d, a, f) {
        var g = this, c = a.getCallData(f), e = c.data, h = c.callback, i = c.scope, b;
        b = new Ext.direct.Transaction({
            provider: g,
            args: f,
            action: d,
            method: a.name,
            data: e,
            callback: i && Ext.isFunction(h) ? Ext.Function.bind(h, i) : h
        });
        if (g.fireEvent("beforecall", g, b, a) !== false) {
            Ext.direct.Manager.addTransaction(b);
            g.queueTransaction(b);
            g.fireEvent("call", g, b, a)
        }
    },
    getCallData: function (a) {
        if (this.binary) {
            return {targetUri: a.action + "." + a.method, responseUri: "/" + a.id, body: a.data || []}
        } else {
            return new Ext.data.amf.RemotingMessage({
                body: a.data || [],
                clientId: this.clientId,
                destination: a.action,
                headers: {DSEndpoint: this.endpoint, DSId: this.DSId || "nil"},
                messageId: Ext.data.amf.XmlEncoder.generateFlexUID(a.id),
                operation: a.method,
                timestamp: 0,
                timeToLive: 0
            })
        }
    },
    sendRequest: function (d) {
        var j = this, c = {
            url: j.url,
            callback: j.onData,
            scope: j,
            transaction: d,
            timeout: j.timeout
        }, a, e = 0, g, b, k, h = [], f = [];
        if (Ext.isArray(d)) {
            for (g = d.length; e < g; ++e) {
                h.push(j.getCallData(d[e]))
            }
        } else {
            h.push(j.getCallData(d))
        }
        if (j.binary) {
            k = new Ext.data.amf.Encoder({format: 0});
            k.writeAmfPacket(f, h);
            c.binaryData = k.bytes;
            c.binary = true;
            c.headers = {"Content-Type": "application/x-amf"}
        } else {
            k = new Ext.data.amf.XmlEncoder();
            k.writeAmfxRemotingPacket(h[0]);
            c.xmlData = k.body
        }
        Ext.Ajax.request(c)
    },
    queueTransaction: function (c) {
        var b = this, a = false;
        if (c.form) {
            b.sendFormRequest(c);
            return
        }
        b.callBuffer.push(c);
        if (a) {
            if (!b.callTask) {
                b.callTask = new Ext.util.DelayedTask(b.combineAndSend, b)
            }
            b.callTask.delay(Ext.isNumber(a) ? a : 10)
        } else {
            b.combineAndSend()
        }
    },
    combineAndSend: function () {
        var b = this.callBuffer, a = b.length;
        if (a > 0) {
            this.sendRequest(a == 1 ? b[0] : b);
            this.callBuffer = []
        }
    },
    configureFormRequest: function (c, e, b, d, a) {
    },
    sendFormRequest: function (a) {
    },
    createEvents: function (c) {
        var d = null, g = [], k = [], a, f = 0, h, b;
        try {
            if (this.binary) {
                b = new Ext.data.amf.Packet();
                d = b.decode(c.responseBytes)
            } else {
                b = new Ext.data.amf.XmlDecoder();
                d = b.readAmfxMessage(c.responseText)
            }
        } catch (j) {
            a = new Ext.direct.ExceptionEvent({
                data: j,
                xhr: c,
                code: Ext.direct.Manager.exceptions.PARSE,
                message: "Error parsing AMF response: \n\n " + d
            });
            return [a]
        }
        if (this.binary) {
            for (f = 0; f < d.messages.length; f++) {
                k.push(this.createEvent(d.messages[f]))
            }
        } else {
            k.push(this.createEvent(d))
        }
        return k
    },
    createEvent: function (c) {
        var b = c.targetURI.split("/"), g, e, f, a, d = this;
        if (d.binary) {
            g = b[1];
            a = 2
        } else {
            g = Ext.data.amf.XmlDecoder.decodeTidFromFlexUID(c.message.correlationId);
            a = 1
        }
        if (b[a] == "onStatus") {
            f = {tid: g, data: (d.binary ? c.body : c.message)};
            e = Ext.create("direct.exception", f)
        } else {
            if (b[a] == "onResult") {
                f = {tid: g, data: (d.binary ? c.body : c.message.body)};
                e = Ext.create("direct.rpc", f)
            } else {
            }
        }
        return e
    }
});