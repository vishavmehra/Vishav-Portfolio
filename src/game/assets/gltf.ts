import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { LoadingManager } from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { beginAsset, reportAssetProgress, settleAsset } from '@/game/loading/loadingState'

/** Reports a failed load by URL, so a missing GLB settles instead of stalling the loading screen. */
const manager = new LoadingManager()
manager.onError = settleAsset

/**
 * The single entry point for loading glTF/GLB assets (docs/10 §4).
 *
 * Every GLB goes through this hook so the game has one loader configuration and
 * one cache. R3F's useLoader caches by URL, suspends while fetching, and throws to
 * the nearest error boundary on failure (see AssetBoundary).
 *
 * It also feeds the initial loading screen: the request is registered on render,
 * bytes are reported as they arrive, and the asset counts as settled once the
 * component using it commits — whichever component that is.
 *
 * No decoders are configured: no shipped asset is Draco/Meshopt/KTX2-compressed
 * yet. When one is, they are wired here in the extensions callback and no caller
 * changes.
 */
export function useGLTF(url: string): GLTF {
  beginAsset(url)
  const gltf = useLoader(
    GLTFLoader,
    url,
    (loader) => {
      loader.manager = manager
    },
    (event) => reportAssetProgress(url, event.loaded, event.total),
  )
  useEffect(() => settleAsset(url), [url])
  return gltf
}
