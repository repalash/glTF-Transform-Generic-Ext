import {Extension, TextureInfo} from '@gltf-transform/core'
import type {ReaderContext, WriterContext} from '@gltf-transform/core'
import {GenericExtensionProperty} from './GenericExtensionProperty'

// see transmission extension for reference: https://github.com/donmccurdy/glTF-Transform/blob/main/packages/extensions/src/khr-materials-transmission/materials-transmission.ts
export abstract class GenericExtension extends Extension {
    abstract readonly extensionName: string

    textureChannels: Record<string, number> = {}

    read(context: ReaderContext): this {
        const jsonDoc = context.jsonDoc
        // console.log(jsonDoc)
        const materialDefs = jsonDoc.json.materials || []
        const textureDefs = jsonDoc.json.textures || []
        materialDefs.forEach((materialDef, materialIndex) => {
            if (materialDef.extensions && materialDef.extensions[this.extensionName]) {
                const paramsExt = new GenericExtensionProperty(this.document.getGraph(), '', this.extensionName)
                context.materials[materialIndex].setExtension(this.extensionName, paramsExt)
                const paramsExtDef = materialDef.extensions[this.extensionName] as Record<string, any>
                const paramsExtDef2 = {...paramsExtDef}

                for (const [key, value] of Object.entries(paramsExtDef2)) {
                    if (typeof value?.index === 'number') { // this is a texture...
                        const textureInfoDef = value
                        const source = textureDefs[textureInfoDef.index]?.source
                        if (typeof source !== 'number') {
                            console.warn('GLTF Pipeline: source texture not found for texture info', textureInfoDef)
                            continue
                        }
                        const texture = context.textures[source]
                        const texInfo = new TextureInfo(this.document.getGraph())
                        const channels = this.textureChannels[key] ?? 0x1111
                        paramsExt.addTexture(key, texInfo, texture, channels)
                        context.setTextureInfo(texInfo, textureInfoDef)
                        delete paramsExtDef2[key]
                    }
                }

                paramsExt.setExtras(paramsExtDef2)
                // console.log({...paramsExtDef})
            }
        })
        const meshDefs = jsonDoc.json.meshes || []
        meshDefs.forEach((meshDef, meshIndex) => {
            if (meshDef.extensions && meshDef.extensions[this.extensionName]) {
                const paramsExt = new GenericExtensionProperty(this.document.getGraph(), '', this.extensionName)
                context.meshes[meshIndex].setExtension(this.extensionName, paramsExt)
                const paramsExtDef = meshDef.extensions[this.extensionName] as Record<string, any>
                paramsExt.setExtras(paramsExtDef)
            }
        })
        const nodeDefs = jsonDoc.json.nodes || []
        nodeDefs.forEach((nodeDef, nodeIndex) => {
            if (nodeDef.extensions && nodeDef.extensions[this.extensionName]) {
                const paramsExt = new GenericExtensionProperty(this.document.getGraph(), '', this.extensionName)
                context.nodes[nodeIndex].setExtension(this.extensionName, paramsExt)
                const paramsExtDef = nodeDef.extensions[this.extensionName] as Record<string, any>
                paramsExt.setExtras(paramsExtDef)
                // console.log(paramsExtDef)
            }
        })
        const sceneDefs = jsonDoc.json.scenes || []
        sceneDefs.forEach((sceneDef, sceneIndex) => {
            if (sceneDef.extensions && sceneDef.extensions[this.extensionName]) {
                const paramsExt = new GenericExtensionProperty(this.document.getGraph(), '', this.extensionName)
                context.scenes[sceneIndex].setExtension(this.extensionName, paramsExt)
                const paramsExtDef = sceneDef.extensions[this.extensionName] as Record<string, any>
                paramsExt.setExtras(paramsExtDef)
                // console.log(paramsExtDef)
            }
        })

        return this
    }

    write(context: WriterContext): this {
        const jsonDoc = context.jsonDoc
        this.document.getRoot()
            .listMaterials()
            .forEach((material) => {
                const paramsExt = material.getExtension<GenericExtensionProperty>(this.extensionName)
                // console.log(paramsExt)
                if (paramsExt) {
                    const materialIndex = context.materialIndexMap.get(material)!
                    const materialDef = jsonDoc.json.materials![materialIndex]
                    materialDef.extensions = materialDef.extensions || {}
                    const extensionDef = paramsExt.getExtras()
                    const extensionDef2 = {...extensionDef}

                    // console.log(paramsExt.textures)
                    for (const [key, value] of Object.entries(paramsExt.textures)) {
                        const textureInfo = value[0]
                        const textureLink = value[1]
                        const texture = textureLink

                        if (texture)
                            extensionDef2[key] = context.createTextureInfoDef(texture, textureInfo)

                        // console.log(texture)

                    }
                    // console.log(extensionDef2)

                    materialDef.extensions[this.extensionName] = extensionDef2
                }
            })
        this.document.getRoot()
            .listMeshes()
            .forEach((mesh) => {
                const paramsExt = mesh.getExtension<GenericExtensionProperty>(this.extensionName)
                if (paramsExt) {
                    const meshIndex = context.meshIndexMap.get(mesh)!
                    const meshDef = jsonDoc.json.meshes![meshIndex]
                    meshDef.extensions = meshDef.extensions || {}
                    meshDef.extensions[this.extensionName] = paramsExt.getExtras()
                }
            })
        this.document.getRoot()
            .listNodes()
            .forEach((node) => {
                const paramsExt = node.getExtension<GenericExtensionProperty>(this.extensionName)
                if (paramsExt) {
                    const nodeIndex = context.nodeIndexMap.get(node)!
                    const nodeDef = jsonDoc.json.nodes![nodeIndex]
                    nodeDef.extensions = nodeDef.extensions || {}
                    nodeDef.extensions[this.extensionName] = paramsExt.getExtras()
                }
            })
        this.document.getRoot()
            .listScenes()
            .forEach((scene) => {
                const paramsExt = scene.getExtension<GenericExtensionProperty>(this.extensionName)
                if (paramsExt) {
                    const sceneIndex = context.jsonDoc.json.scene || 0 // todo: get proper scene index, if working with multiple scenes, this will do the default one.
                    const sceneDef = jsonDoc.json.scenes![sceneIndex]
                    if (!sceneDef) return
                    sceneDef.extensions = sceneDef.extensions || {}
                    sceneDef.extensions[this.extensionName] = paramsExt.getExtras()
                }
            })

        return this
    }

}

