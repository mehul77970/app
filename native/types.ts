export type HardwareDecoder = 'vaapi' | 'vaapi-copy' | 'nvdec' | 'nvdec-copy' | 'drm' | 'drm-copy' | 'vulkan' | 'vulkan-copy'
export type GPUApi = 'auto' | 'opengl' | 'vulkan' | 'd3d11'

export interface Settings {
  HardwareDecoder: HardwareDecoder
  GPUApi: GPUApi
}
