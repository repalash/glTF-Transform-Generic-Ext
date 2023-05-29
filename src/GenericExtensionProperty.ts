import {
    ExtensionProperty,
    Graph,
    Property,
    PropertyType,
    Texture,
    TextureInfo
} from '@gltf-transform/core'

// https://github.com/donmccurdy/glTF-Transform/blob/main/packages/extensions/src/khr-materials-transmission/transmission.ts
export class GenericExtensionProperty extends ExtensionProperty<any> {
    readonly extensionName: string
    readonly parentTypes: string[] = [PropertyType.MATERIAL, PropertyType.MESH, PropertyType.NODE, PropertyType.SCENE]
    readonly propertyType: string = 'GenericExtension'
    textures: Record<string, [TextureInfo, Texture|null]> = {}

    addTexture(key: string, texInfo: TextureInfo, texture: Texture | null, channels = 0x1111) {
        this.setRef(key, texture, {channels})
        this.textures[key] = [texInfo, texture]
    }

    // todo: get defaults for textures?

    // todo: is this needed anymore? after https://github.com/donmccurdy/glTF-Transform/pull/437
    public dispose(): void {
        Object.values(this.textures).forEach(([texInfo, _]) => {
            texInfo?.dispose()
        })
        super.dispose()
    }


    constructor(graph: Graph<Property>, name: string, extensionName: string) {
        super(graph, name)
        this.extensionName = extensionName
    }

    protected init(): void {return}
}
