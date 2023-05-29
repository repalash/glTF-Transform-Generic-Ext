# Generic Extension for glTF-Transform

This is a generic extension for [glTF-Transform](https://gltf-transform.donmccurdy.com/), which can be used as a template for creating new extensions for glTF-Transform.

It can be used to automatically create extensions with arbitrary properties. It works by putting the properties in extras when reading the extension from the glTF and then restoring them when writing the glTF. With this, there is no need for defining fully typed extension classes and extension properties for simple custom extensions.

## Usage

```typescript
import {GenericExtension} from 'gltf-transform-generic-ext'
import {TextureChannel} from '@gltf-transform/core'

// Extension with no texture
class TriplanarMappingMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_triplanar'
    readonly extensionName = TriplanarMappingMaterialExtension.EXTENSION_NAME
}

// Extension with a texture using the R channel
class BumpMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_bumpmap'
    readonly extensionName = BumpMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        bumpTexture: TextureChannel.R,
    }
}

// Extension with a texture using the R, G and B channels
class LightMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_lightmap'
    readonly extensionName = LightMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        lightMapTexture: TextureChannel.R | TextureChannel.G | TextureChannel.B,
    }
}

// Extension with a texture using the G channel
class AlphaMapMaterialExtension extends GenericExtension {
    public static readonly EXTENSION_NAME = 'WEBGI_materials_alphamap'
    readonly extensionName = AlphaMapMaterialExtension.EXTENSION_NAME
    textureChannels: Record<string, number> = {
        alphaTexture: TextureChannel.G,
    }
}

```

## License
MIT

## References
Generated with [rollup-library-starter](https://github.com/repalash/rollup-library-starter)
