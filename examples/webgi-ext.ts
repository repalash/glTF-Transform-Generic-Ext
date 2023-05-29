import {GenericExtension} from '../src'
import {TextureChannel} from '@gltf-transform/core'

export class BumpMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_bumpmap'
    readonly extensionName = BumpMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        bumpTexture: TextureChannel.R,
    }
}
export class LightMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_lightmap'
    readonly extensionName = LightMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        lightMapTexture: TextureChannel.R | TextureChannel.G | TextureChannel.B,
    }
}
export class AlphaMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_alphamap'
    readonly extensionName = AlphaMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        alphaTexture: TextureChannel.G,
    }
}

export class TriplanarMappingMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_triplanar'
    readonly extensionName = TriplanarMappingMaterialExtension.EXTENSION_NAME
}

