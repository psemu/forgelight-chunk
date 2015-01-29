var fs = require("fs"),
    DataSchema = require("dataschema");

function parseHeightMaps(data, offset) {
    var startOffset = offset,
        dataLength = data.readUInt32LE(offset),
        maps = [],
        n = dataLength / 4,
        i, j;

    offset += 4;
    for (i=0;i<4;i++) {
        maps[i] = [];
        for (j=0;j<n;j++) {
            maps[i][j] = [
                data.readInt16LE(offset),
                data.readUInt8(offset+2),
                data.readUInt8(offset+3)
            ];
            offset += 4;
        }
    }
    return {
        value: {
            dataLength: dataLength,
            maps: maps
        },
        length: offset - startOffset
    };
}

function packHeightMaps(value) {

}

var chunkHeaderSchema = [
    { name: "type",                 type: "fixedlengthstring", length: 4 },
    { name: "version",              type: "uint32" }
];

var chunkSchema = [
    { name: "type",                 type: "fixedlengthstring", length: 4 },
    { name: "version",              type: "uint32" },
    { name: "tiles",                type: "array", fields: [
        { name: "x",                    type: "int32" },
        { name: "y",                    type: "int32" },
        { name: "unknownInt1",          type: "int32" },
        { name: "unknownInt2",          type: "int32" },
        { name: "ecos",                 type: "array", fields: [
            { name: "id",                   type: "uint32" },
            { name: "floras",                   type: "array", fields: [
                { name: "layers",                   type: "array", fields: [
                    { name: "unknown1",                   type: "uint32" },
                    { name: "unknown2",                   type: "uint32" }
                ]}
            ]}
        ]},
        { name: "index",                type: "uint32" },
        { name: "unknownInt3",          type: "uint32" },
        { name: "imageData",            type: "byteswithlength" },
        { name: "layerTextures",        type: "array", elementType: "uint8" }
    ]},
    { name: "unknownInt1",          type: "int32" },
    { name: "unknownArray1",        type: "array", fields: [
        { name: "height",               type: "int16" },
        { name: "unknownByte1",         type: "uint8" },
        { name: "unknownByte2",         type: "uint8" }
    ]},
    { name: "offset1",              type: "debugoffset" },
    { name: "indices",              type: "array", elementType: "uint16" },
    { name: "vertices",             type: "array", fields: [
        { name: "x",                    type: "int16" },
        { name: "y",                    type: "int16" },
        { name: "heightFar",            type: "int16" },
        { name: "heightNear",           type: "int16" },
        { name: "color1",               type: "uint32" },
        { name: "color2",               type: "uint32" }
    ]},
    { name: "renderBatches",        type: "array", fields: [
        { name: "indexOffset",          type: "uint32" },
        { name: "indexCount",           type: "uint32" },
        { name: "vertexOffset",         type: "uint32" },
        { name: "vertexCount",          type: "uint32" }
    ]},
    { name: "optimizedDraw",        type: "array", fields: [
        { name: "data",                 type: "bytes", length: 320 }
    ]},
    { name: "unknownShorts",        type: "array", elementType: "uint16" },
    { name: "unknownVectors",       type: "array", elementType: "floatvector3" },
    { name: "tileOccluderInfo",     type: "array", fields: [
        { name: "data",                 type: "bytes", length: 64 }
    ]}
];

var chunkLodSchema = [
    { name: "type",                 type: "fixedlengthstring", length: 4 },
    { name: "version",              type: "uint32" },
    { name: "textures",             type: "array", fields: [
        { name: "colorNxMap",           type: "byteswithlength" },
        { name: "specNyMap",            type: "byteswithlength" },
        { name: "extraData1",           type: "byteswithlength" },
        { name: "extraData2",           type: "byteswithlength" },
        { name: "extraData3",           type: "byteswithlength" },
        { name: "extraData4",           type: "byteswithlength" }
    ]},
    { name: "vertsPerSide",         type: "uint32" },
    { name: "heightMaps",           type: "custom", parser: parseHeightMaps, packer: packHeightMaps },
    { name: "indices",              type: "array", elementType: "uint16" },
    { name: "vertices",             type: "array", fields: [
        { name: "x",                    type: "uint16" },
        { name: "y",                    type: "uint16" },
        { name: "heightFar",            type: "int16" },
        { name: "heightNear",           type: "int16" },
        { name: "color",                type: "uint32" }
    ]},
    { name: "renderBatches",        type: "array", fields: [
        { name: "indexOffset",          type: "uint32" },
        { name: "indexCount",           type: "uint32" },
        { name: "vertexOffset",         type: "uint32" },
        { name: "vertexCount",          type: "uint32" },
    ]},
    { name: "optimizedDraw",        type: "array", fields: [
        { name: "data",                 type: "bytes", length: 320 }
    ]},
    { name: "unknownShorts",        type: "array", elementType: "uint16" },
    { name: "unknownVectors",       type: "array", elementType: "floatvector3" },
    { name: "tileOccluderInfo",     type: "array", fields: [
        { name: "data",                 type: "bytes", length: 64 }
    ]}
];

var chunkLodV2Schema = [
    { name: "type",                 type: "fixedlengthstring", length: 4 },
    { name: "version",              type: "uint32" },
    { name: "textures",             type: "array", fields: [
        { name: "colorNxMap",           type: "byteswithlength" },
        { name: "specNyMap",            type: "byteswithlength" },
        { name: "extraData1",           type: "byteswithlength" },
        { name: "extraData2",           type: "byteswithlength" },
        { name: "extraData3",           type: "byteswithlength" },
        { name: "extraData4",           type: "byteswithlength" }
    ]},
    { name: "vertsPerSide",         type: "uint32" },
    { name: "heightMaps",           type: "custom", parser: parseHeightMaps, packer: packHeightMaps },
    { name: "indices",              type: "array", elementType: "uint16" },
    { name: "vertices",             type: "array", fields: [
        { name: "x",                    type: "uint16" },
        { name: "y",                    type: "uint16" },
        { name: "heightFar",            type: "int16" },
        { name: "heightNear",           type: "int16" },
        { name: "color",                type: "uint32" }
    ]},
    { name: "renderBatches",        type: "array", fields: [
        { name: "unknown",              type: "uint32" },
        { name: "indexOffset",          type: "uint32" },
        { name: "indexCount",           type: "uint32" },
        { name: "vertexOffset",         type: "uint32" },
        { name: "vertexCount",          type: "uint32" },
    ]},
    { name: "optimizedDraw",        type: "array", fields: [
        { name: "data",                 type: "bytes", length: 320 }
    ]},
    { name: "unknownShorts",        type: "array", elementType: "uint16" },
    { name: "unknownVectors",       type: "array", elementType: "floatvector3" },
    { name: "tileOccluderInfo",     type: "array", fields: [
        { name: "data",                 type: "bytes", length: 64 }
    ]}
];

function readChunk(data, offset) {
    offset = offset || 0;

    var header = DataSchema.parse(chunkHeaderSchema, data, offset).result;

    if (header.version > 2) {
        throw "Unsupported CNK version: " + header.version;
    }
    if (header.type == "CNK0") {
        var chunk = DataSchema.parse(chunkSchema, data, offset);
    } else {
        if (header.version == 1) {
            var chunk = DataSchema.parse(chunkLodSchema, data, offset);
        } else if (header.version == 2) {
            var chunk = DataSchema.parse(chunkLodV2Schema, data, offset);
        }
    }
    return chunk.result;
}

function writeChunk(chunk) {
    var buffer,
        texture, textureBuffer, indexBuffer,
        heightBuffer,
        dataLength, offset,
        i, n;


    dataLength = 4;
    for (i=0,n=chunk.textureCount;i<n;i++) {
        texture = chunk.textures[i];
        dataLength += 4 + texture.colorNxMap.length;
        dataLength += 4 + texture.specNyMap.length;
        for (j=0;j<4;j++) {
            dataLength += 4 + texture.extraData[j].length;
        }
    }
    textureBuffer = new Buffer(dataLength);
    offset = 0;
    textureBuffer.writeUInt32LE(chunk.textureCount, offset);
    offset += 4;
    for (i=0,n=chunk.textureCount;i<n;i++) {
        texture = chunk.textures[i];
        textureBuffer.writeUInt32LE(texture.colorNxMap.length, offset);
        texture.colorNxMap.copy(textureBuffer, offset+4);
        offset += 4 + texture.colorNxMap.length;
        
        textureBuffer.writeUInt32LE(texture.specNyMap.length, offset);
        texture.specNyMap.copy(textureBuffer, offset+4);
        offset += 4 + texture.specNyMap.length;
        
        for (j=0;j<4;j++) {
            textureBuffer.writeUInt32LE(chunk.textures[i].extraData[j].length, offset);
            chunk.textures[i].extraData[j].copy(textureBuffer, offset + 4);
            offset += 4 + chunk.textures[i].extraData[j].length;
        }
    }
    
    heightBuffer = new Buffer(4 + 4 + 4 * chunk.heightDataLength);
    offset = 0;
    heightBuffer.writeUInt32LE(chunk.vertsPerSide, offset);
    offset += 4;
    heightBuffer.writeUInt32LE(chunk.heightDataLength, offset);
    offset += 4;
    for (i=0;i<4;i++) {
        heightMap = chunk.heightMaps[i];
        for (j=0,n=chunk.vertsPerSide*chunk.vertsPerSide;j<n;j++) {
            heightBuffer.writeInt16LE(heightMap[j][0], offset);
            heightBuffer.writeUInt8(heightMap[j][1], offset + 2);
            heightBuffer.writeUInt8(heightMap[j][2], offset + 3);
            offset += 4;
        }
    }
    
    indexBuffer = new Buffer(4 + chunk.numIndices * 2);
    offset = 0;
    indexBuffer.writeUInt32LE(chunk.numIndices, offset);
    offset += 4;
    for (i=0;i<chunk.numIndices;i++) {
        indexBuffer.writeUInt16LE(chunk.indices[i], offset);
        offset += 2;
    }

    vertexBuffer = new Buffer(4 + chunk.numVertices * 12);
    offset = 0;
    vertexBuffer.writeUInt32LE(chunk.numVertices, offset);
    offset += 4;
    for (i=0;i<chunk.numVertices;i++) {
        vertexBuffer.writeInt16LE(chunk.vertices[i].x, offset);
        vertexBuffer.writeInt16LE(chunk.vertices[i].y, offset+2);
        vertexBuffer.writeInt16LE(chunk.vertices[i].heightFar, offset+4);
        vertexBuffer.writeInt16LE(chunk.vertices[i].heightNear, offset+6);
        vertexBuffer.writeUInt32LE(chunk.vertices[i].color, offset+8);
        offset += 12;
    }
    
    renderBatchBuffer = new Buffer(4 + chunk.numBatches * 16);
    offset = 0;
    renderBatchBuffer.writeUInt32LE(chunk.numBatches, offset);
    offset += 4;
    for (i=0;i<chunk.numBatches;i++) {
        renderBatchBuffer.writeUInt32LE(chunk.renderBatches[i].indexOffset, offset);
        renderBatchBuffer.writeUInt32LE(chunk.renderBatches[i].indexCount, offset+4);
        renderBatchBuffer.writeUInt32LE(chunk.renderBatches[i].vertexOffset, offset+8);
        renderBatchBuffer.writeUInt32LE(chunk.renderBatches[i].vertexCount, offset+12);
        offset += 16;
    }

    optimizedDrawBuffer = new Buffer(4 + chunk.numOptimizedDraw * 320);
    offset = 0;
    optimizedDrawBuffer.writeUInt32LE(chunk.numOptimizedDraw, offset);
    offset += 4;
    for (i=0;i<chunk.numOptimizedDraw;i++) {
        chunk.optimizedDraw[i].copy(optimizedDrawBuffer, offset, 0, 320);
        offset += 320;
    }

    shortsBuffer = new Buffer(4 + chunk.numShorts * 2);
    offset = 0;
    shortsBuffer.writeUInt32LE(chunk.numShorts, offset);
    offset += 4;
    for (i=0;i<chunk.numShorts;i++) {
        shortsBuffer.writeUInt16LE(chunk.ushorts[i], offset);
        offset += 2;
    }

    vectorBuffer = new Buffer(4 + chunk.numVectors * 12);
    offset = 0;
    vectorBuffer.writeUInt32LE(chunk.numVectors, offset);
    offset += 4;
    for (i=0;i<chunk.numVectors;i++) {
        vectorBuffer.writeFloatLE(chunk.vectors[i].x, offset);
        vectorBuffer.writeFloatLE(chunk.vectors[i].y, offset+4);
        vectorBuffer.writeFloatLE(chunk.vectors[i].z, offset+8);
        offset += 12;
    }
    
    tileOccluderBuffer = new Buffer(4 + chunk.numTileOccluderInfo * 64);
    offset = 0;
    tileOccluderBuffer.writeUInt32LE(chunk.numTileOccluderInfo, offset);
    offset += 4;
    for (i=0;i<chunk.numTileOccluderInfo;i++) {
        chunk.tileOccluderInfo[i].copy(tileOccluderBuffer, offset, 0, 64);
        offset += 64;
    }
    
    buffer = Buffer.concat([
        textureBuffer, heightBuffer, indexBuffer, vertexBuffer, renderBatchBuffer, 
        optimizedDrawBuffer, shortsBuffer, vectorBuffer, tileOccluderBuffer
    ]);
    return buffer;
}

function write(chunk, outPath) {
    var data = writeChunk(chunk);
    fs.writeFileSync(outPath, data);
}

function read(inPath) {
    if (!fs.existsSync(inPath)) {
        throw "read(): inPath does not exist";
    }
    data = fs.readFileSync(inPath);
    return readChunk(data, 0);
}

exports.read = read;
exports.write = write;

