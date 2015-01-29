#!/usr/bin/env node

var Chunk = require("./cnk.js"),
    fs = require("fs"),
    path = require("path");

function usage() {
    console.log("Usage: ./cnktool.js <mode> <inPath> [<outPath>]");
}
    
var mode = process.argv[2],
    inPath = process.argv[3],
    outPath;
    

if (inPath) {
    if (!fs.existsSync(inPath)) {
        throw "inPath does not exist";
    }
    var chunk = Chunk.read(inPath);
    
    switch (mode) {
        case "info":

            console.log("File:              ", path.basename(inPath));
            console.log("Type:              ", chunk.type);
            console.log("Version:           ", chunk.version);
            if (chunk.tiles) {
                console.log("Tiles:             ", chunk.tiles.length);
            }
            if (chunk.textures) {
                console.log("Textures:          ", chunk.textures.length);
            }
            if (chunk.heightMaps) {
                console.log("Height Map:        ", "4 * " + chunk.vertsPerSide + "x" + chunk.vertsPerSide);
            }
            console.log("Indices:           ", chunk.indices.length);
            console.log("Vertices:          ", chunk.vertices.length);
            console.log("Render Batches:    ", chunk.renderBatches.length);
            for (var i=0;i<chunk.renderBatches.length;i++) {
                var batch = chunk.renderBatches[i];
                if (batch.indexCount > 0) {
                    console.log("                   ", "#" + i + ": Indices(" + batch.indexOffset + "-" + (batch.indexOffset+batch.indexCount-1) + ") Vertices(" + batch.vertexOffset + "-" + (batch.vertexOffset+batch.vertexCount-1) + ")");
                }
            }
            console.log("Optimized Draw:    ", chunk.optimizedDraw.length);
            console.log("Shorts:            ", chunk.unknownShorts.length);
            console.log("Vectors:           ", chunk.unknownVectors.length);
            console.log("Tile Occluder Info:", chunk.tileOccluderInfo.length);

            break;
        case "json":
            if (!outPath) {
                outPath = process.argv[4];
                var ext = path.extname(inPath);
                var outFileName = path.basename(inPath) + ".json";
                if (outPath) {
                    if (fs.existsSync(outPath)) {
                        if (fs.statSync(outPath).isDirectory()) {
                            outPath += outFileName;
                        } else {
                            throw "File already exists: " + outPath;
                        }
                    }
                } else {
                    outPath = path.join(path.dirname(inPath), outFileName);
                }
            }
            console.log("Writing data to file:", outPath);
            fs.writeFileSync(outPath, JSON.stringify(chunk, null, 4));
            break;
        case "textures":
            var outPath = process.argv[4];
            if (!outPath) {
                usage();
                break;
            }
            if (!fs.existsSync(outPath)) {
                throw "outPath does not exist";
            }
            console.log("Extracting textures from " + inPath);
            var base = path.basename(inPath).split(".")[0];
            for (var i=0;i<chunk.textures.length;i++) {
                var texturePath = path.join(outPath, base + "_colornx_" + i + ".dds");
                console.log("Writing colornx map to " + texturePath);
                fs.writeFileSync(texturePath, chunk.textures[i].colorNxMap);
            }
            for (var i=0;i<chunk.textures.length;i++) {
                var texturePath = path.join(outPath, base + "_specny_" + i + ".dds");
                console.log("Writing specny map to " + texturePath);
                fs.writeFileSync(texturePath, chunk.textures[i].specNyMap);
            }
            break;
        case "geometry":
        case "geometryabs":
            var outPath = process.argv[4];
            if (!outPath) {
                usage();
                break;
            }
            console.log("Extracting geometry from " + inPath);
            var base = path.basename(inPath, path.extname(inPath));
            var geoPath = path.join(outPath, base + ".obj");

            var vertices = [],
                uvs = [],
                faces = [];

            var obj = [];
            var chunkName = path.basename(inPath, path.extname(inPath));

            var mtl = [
                "newmtl " + chunkName,
                "Ka 1.000000 1.000000 1.000000",
                "Kd 1.000000 1.000000 1.000000",
                "Ks 0.000000 0.000000 0.000000",
                "illum 1",
                "map_Ka " + chunkName + ".jpg",
                "map_Kd " + chunkName + ".jpg"
            ].join("\n");
            var mtlPath = path.join(outPath, base + ".mtl");
            fs.writeFileSync(mtlPath, mtl);

            obj.push("mtllib " + chunkName + ".mtl");
            obj.push("o " + chunkName);
            obj.push("g " + chunkName);

            var chunkNameParts = chunkName.split("_"),
                chunkX = +chunkNameParts[2],
                chunkY = +chunkNameParts[1];

            for (var i=0;i<4;i++) {
                var vertexOffset = chunk.renderBatches[i].vertexOffset,
                    vertexCount = chunk.renderBatches[i].vertexCount;
                for (var j=0;j<vertexCount;j++) {

                    var k = vertexOffset + j,
                        x = chunk.vertices[k].x += (i >> 1) * 64,
                        y = chunk.vertices[k].y += (i % 2) * 64;
                    uvs.push([y / 128, 1 - x / 128]);
                    if (mode == "geometryabs") {
                        x += chunkX * 32;
                        y += chunkY * 32;
                    }
                    vertices.push([
                        x,
                        chunk.vertices[k].heightNear / 64,
                        y
                    ]);
                    
                }
            }

            for (var i=0;i<4;i++) {
                var indexOffset = chunk.renderBatches[i].indexOffset,
                    indexCount = chunk.renderBatches[i].indexCount,
                    vertexOffset = chunk.renderBatches[i].vertexOffset;
                for (var j=0;j<indexCount;j+=3) {
                    var v0 = chunk.indices[j + indexOffset] + vertexOffset,
                        v1 = chunk.indices[j + indexOffset + 1] + vertexOffset,
                        v2 = chunk.indices[j + indexOffset + 2] + vertexOffset;
                    faces.push([v2, v1, v0]);
                }
            }

            for (var i=0,l=vertices.length;i<l;i++) {
                obj.push(
                    "v " + vertices[i][0] + " " + vertices[i][1] + " " + vertices[i][2]
                );
            }
            for (var i=0,l=uvs.length;i<l;i++) {
                obj.push(
                    "vt " + uvs[i][0] + " " + uvs[i][1]
                );
            }
            obj.push("usemtl " + chunkName);
            for (var i=0,l=faces.length;i<l;i++) {
                obj.push(
                    "f " + (faces[i][0]+1) + "/"  + (faces[i][0]+1) +  
                    " " + (faces[i][1]+1) + "/"  + (faces[i][1]+1) +
                    " " + (faces[i][2]+1) + "/"  + (faces[i][2]+1) 
                );
            }

            fs.writeFileSync(geoPath, obj.join("\n"));
            break;
        case "normalmaps":
            var outPath = process.argv[4];
            if (!outPath) {
                usage();
                break;
            }
            if (!fs.existsSync(outPath)) {
                throw "outPath does not exist";
            }
            console.log("Extracting normal maps from " + inPath);
            for (var i=0;i<chunk.textureCount;i++) {
                var base = path.basename(inPath, ".cnk");
                
                var texturePath = path.join(outPath, base + "_specny_" + i + ".dds");
                console.log("Writing specny map to " + texturePath);
                fs.writeFileSync(texturePath, chunk.textures[i].specNyMap);
            }
            break;
        case "heightmap":
            var outPath = process.argv[4];
            if (!outPath) {
                usage();
                break;
            }
            if (!fs.existsSync(outPath)) {
                throw "outPath does not exist";
            }
            //console.log("Extracting height map from " + inPath);
            var Canvas = require("canvas"),
                Image = Canvas.Image,
                canvas = new Canvas(chunk.vertsPerSide, chunk.vertsPerSide),
                ctx = canvas.getContext("2d"),
                imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            for (var i=0;i<chunk.heightMaps.length;i++) {
                var base = path.basename(inPath, ".cnk");
                var heightmap = chunk.heightMaps[i];
                var heightmapPath = path.join(outPath, base + "_heightmap_" + i + ".png");
                var n = chunk.vertsPerSide*chunk.vertsPerSide;

                for (var j=0;j<n;j++) {
                    var height = heightmap[j][0] + 4096;
                    //console.log(height);
                    //console.log(height);
                    //imgData.data[j*4] = Math.min(255, heightmap[j][0] / 0xFFFF * 255);
                    imgData.data[j*4] = height >> 8;
                    imgData.data[j*4+1] = height & 0xFF;
                    imgData.data[j*4+2] = 0;
                    imgData.data[j*4+3] = 255;
                }
                ctx.putImageData(imgData, 0, 0);
                console.log("Writing height map to " + heightmapPath);
                fs.writeFileSync(heightmapPath, canvas.toBuffer());
            }

            break;
        case "equalize":
            var outPath = process.argv[4];
            if (!outPath) {
                usage();
                break;
            }
            console.log("Equalizing farHeight and nearHeight in " + inPath);
            for (var i=0;i<chunk.vertexCount;i++) {
                chunk.vertices[i].farHeight = chunk.vertices[i].nearHeight;
            }
            console.log("Writing updated chunk data to " + outPath);
            Chunk.write(chunk, outPath);
            break;
        default: 
            console.log("Unknown mode:", mode);
            usage();
    }
} else {
    usage();
}
