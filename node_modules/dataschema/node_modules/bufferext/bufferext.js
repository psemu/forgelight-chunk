
if (!Buffer.prototype.readUInt24LE) {
    Buffer.prototype.readUInt24LE = function(offset, noAssert) {
        var value = this.readUInt8(offset, noAssert) +
                    (this.readUInt8(offset + 1, noAssert) << 8) + 
                    (this.readUInt8(offset + 2, noAssert) << 16);
        return value;
    };
}

if (!Buffer.prototype.writeUInt24LE) {
    Buffer.prototype.readUInt24LE = function(value, offset, noAssert) {
        this.writeUInt8(value & 0xFF, offset, noAssert);
        this.writeUInt8((value >> 8) & 0xFF, offset + 1, noAssert); 
        this.writeUInt8((value >> 16) & 0xFF, offset + 2, noAssert);
    };
}

if (!Buffer.prototype.readUInt24BE) {
    Buffer.prototype.readUInt24BE = function(offset, noAssert) {
        var value = (this.readUInt8(offset, noAssert) << 16) +
                    (this.readUInt8(offset + 1, noAssert) << 8) + 
                    this.readUInt8(offset + 2, noAssert);
        return value;
    };
}

if (!Buffer.prototype.writeUInt24BE) {
    Buffer.prototype.writeUInt24BE = function(value, offset, noAssert) {
        this.writeUInt8((value >> 16) & 0xFF, offset, noAssert);
        this.writeUInt8((value >> 8) & 0xFF, offset + 1, noAssert); 
        this.writeUInt8(value & 0xFF, offset + 2, noAssert);
    };
}

if (!Buffer.prototype.readPrefixedStringLE) {
    Buffer.prototype.readPrefixedStringLE = function(offset, encoding, noAssert) {
        var length = this.readUInt32LE(offset, noAssert),
            value = this.toString(encoding || "utf8", offset + 4, offset + 4 + length);
        return value;
    };
}

if (!Buffer.prototype.writePrefixedStringLE) {
    Buffer.prototype.writePrefixedStringLE = function(string, offset, encoding) {
        this.writeUInt32LE(string.length, offset);
        this.write(string, offset + 4, string.length, encoding || "utf8");
    };
}

if (!Buffer.prototype.readPrefixedStringBE) {
    Buffer.prototype.readPrefixedStringBE = function(offset, encoding, noAssert) {
        var length = this.readUInt32BE(offset, noAssert),
            value = this.toString(encoding || "utf8", offset + 4, offset + 4 + length);
        return value;
    };
}

if (!Buffer.prototype.writePrefixedStringBE) {
    Buffer.prototype.writePrefixedStringBE = function(string, offset, encoding) {
        this.writeUInt32BE(string.length, offset);
        this.write(string, offset + 4, string.length, encoding || "utf8");
    };
}

if (!Buffer.prototype.readNullTerminatedString) {
    Buffer.prototype.readNullTerminatedString = function(offset) {
        var value = "";
        for (var i=offset;i<this.length;i++) {
            if (this[i] === 0) {
                break;
            }
            value += String.fromCharCode(this[i]);
        }
        return value;
    };
}

if (!Buffer.prototype.writeNullTerminatedString) {
    Buffer.prototype.writeNullTerminatedString = function(string, offset) {
        for (var i=0;i<string.length;i++) {
            this[offset + i] = string.charCodeAt(i);
        }
        this[offset + string.length] = 0; 
    };
}

if (!Buffer.prototype.readBoolean) {
    Buffer.prototype.readBoolean = function(offset, noAssert) {
        var value = this.readUInt8(offset);
        return !!value;
    };
}

if (!Buffer.prototype.writeBoolean) {
    Buffer.prototype.writeBoolean = function(value, offset, noAssert) {
        this.writeUInt8(value ? 1 : 0, offset);
    };
}

if (!Buffer.prototype.readBytes) {
    Buffer.prototype.readBytes = function(offset, length) {
        var dst = new Buffer(length);
        this.copy(dst, 0, offset, offset + length);
        return dst;
    };
}


if (!Buffer.prototype.writeBytes) {
    Buffer.prototype.writeBytes = function(bytes, offset, length) {
        if (typeof length == "undefined") {
            length = bytes.length;
        }
        bytes.copy(this, offset, 0, length);
    };
}


if (!Buffer.prototype.readUInt64String) {
    Buffer.prototype.readUInt64String = function(offset, noAssert) {
        var str = "0x";
        for (var j=7;j>=0;j--) {
            str += ("0" + this.readUInt8(offset+j, noAssert).toString(16)).substr(-2);
        }
        return str;
    };
}

if (!Buffer.prototype.readInt64String) {
    Buffer.prototype.readInt64String = Buffer.prototype.readUInt64String;
}


if (!Buffer.prototype.writeUInt64String) {
    Buffer.prototype.writeUInt64String = function(value, offset, noAssert) {
        for (var j=0;j<8;j++) {
            this.writeUInt8(parseInt(value.substr(2 + (7 - j) * 2, 2), 16), offset + j, noAssert);
        }
    };
}

if (!Buffer.prototype.writeInt64String) {
    Buffer.prototype.writeInt64String = Buffer.prototype.writeUInt64String;
}


if (!Buffer.prototype.readFloat16LE) {
    Buffer.prototype.readFloat16LE = function(offset, noAssert) {
        var v = this.readUInt16LE(offset, noAssert);
        var sign = (v >> 15) ? -1 : 1;
        var expo = (v >> 10) & 0x1F;
        var mantissa = v & 0x3FF;
        var fraction = mantissa / 1024;
        return sign * Math.pow(2, expo - 15) * (1 + fraction);
    };
}

