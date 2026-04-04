'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { Archetype } from '@/types/atlas'
import { archetypeParams } from '@/lib/morphControl'

interface AthleteBodyProps {
  archetype: Archetype
  onCanvasReady?: (dataUrl: string) => void
  onHoverChange?: (hovered: boolean) => void
}

const ARCHETYPE_SCALE: Record<Archetype, THREE.Vector3> = {
  power:     new THREE.Vector3(1.12, 1.0,  1.08),
  endurance: new THREE.Vector3(0.88, 1.04, 0.9),
  technical: new THREE.Vector3(0.93, 0.98, 0.93),
  hybrid:    new THREE.Vector3(1.0,  1.0,  1.0),
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateScale(target: THREE.Object3D, toScale: THREE.Vector3, duration = 600) {
  const from = target.scale.clone()
  const start = performance.now()
  const tick = () => {
    const t = easeInOutCubic(Math.min((performance.now() - start) / duration, 1))
    target.scale.lerpVectors(from, toScale, t)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function applyArchetype(root: THREE.Object3D, archetype: Archetype, animate: boolean) {
  const color = new THREE.Color(archetypeParams[archetype].color)
  const targetScale = ARCHETYPE_SCALE[archetype]

  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material
      if (Array.isArray(mat)) {
        mat.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) m.color.set(color)
        })
      } else if (mat instanceof THREE.MeshStandardMaterial) {
        mat.color.set(color)
        mat.roughness = 0.85
        mat.metalness = 0.0
        mat.needsUpdate = true
      }
    }
  })

  if (animate) {
    animateScale(root, targetScale)
  } else {
    root.scale.copy(targetScale)
  }
}

function buildScanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0,    'rgba(80, 200, 255, 0)')
  grad.addColorStop(0.50, 'rgba(80, 200, 255, 0.03)')
  grad.addColorStop(0.82, 'rgba(100, 215, 255, 0.28)')
  grad.addColorStop(0.96, 'rgba(160, 235, 255, 0.75)')
  grad.addColorStop(1,    'rgba(220, 248, 255, 0.95)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 4, 128)
  return new THREE.CanvasTexture(canvas)
}

export function AthleteBody({ archetype, onCanvasReady, onHoverChange }: AthleteBodyProps) {
  const mountRef     = useRef<HTMLDivElement>(null)
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef     = useRef<number>(0)
  const modelRootRef = useRef<THREE.Object3D | null>(null)
  const archetypeRef = useRef<Archetype>(archetype)
  const scanMeshRef  = useRef<THREE.Mesh | null>(null)
  const boundsRef    = useRef<{ top: number; bottom: number } | null>(null)
  const scanStartRef = useRef<number>(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth  || 320
    const h = mount.clientHeight || 480

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ffffff')

    // Camera
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 100)
    camera.position.set(0, 0.9, 3.8)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const dir = new THREE.DirectionalLight(0xffffff, 1.2)
    dir.position.set(-2, 4, 2)
    dir.castShadow = true
    dir.shadow.mapSize.set(512, 512)
    scene.add(dir)

    // Ground shadow
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.07 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.01
    ground.receiveShadow = true
    scene.add(ground)

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping  = true
    controls.dampingFactor  = 0.06
    controls.autoRotate     = true
    controls.autoRotateSpeed = 1.2
    controls.enableZoom     = true
    controls.enablePan      = false
    controls.minDistance    = 1.0
    controls.maxDistance    = 10
    controls.target.set(0, 0.9, 0)
    controls.update()

    // Scan wave mesh (billboard, faces camera each frame)
    const scanMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.55),
      new THREE.MeshBasicMaterial({
        map: buildScanTexture(),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    )
    scene.add(scanMesh)
    scanMeshRef.current = scanMesh
    scanStartRef.current = Date.now()

    // Load GLTF
    const loader = new GLTFLoader()
    loader.load(
      '/body.gltf',
      (gltf) => {
        const root = gltf.scene

        // Fit to scene
        const box = new THREE.Box3().setFromObject(root)
        const center = box.getCenter(new THREE.Vector3())
        const size   = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fitScale = 1.8 / maxDim
        root.scale.setScalar(fitScale)
        root.position.sub(center.multiplyScalar(fitScale))
        root.position.y += size.y * fitScale * 0.5

        // Recompute bounding box after transform for scan & camera
        const box2   = new THREE.Box3().setFromObject(root)
        const size2  = box2.getSize(new THREE.Vector3())
        const ctr2   = box2.getCenter(new THREE.Vector3())

        boundsRef.current = { top: box2.max.y, bottom: box2.min.y }

        // Fit camera
        const fov     = camera.fov * (Math.PI / 180)
        const aspect  = w / h
        const vFit    = (size2.y / 2) / Math.tan(fov / 2)
        const hFit    = (Math.max(size2.x, size2.z) / 2) / (Math.tan(fov / 2) * aspect)
        const fitDist = Math.max(vFit, hFit) * 1.3

        camera.position.set(0, ctr2.y, fitDist)
        controls.target.set(0, ctr2.y, 0)
        controls.minDistance = fitDist * 0.45
        controls.maxDistance = fitDist * 3.5
        controls.update()

        // Resize scan mesh to match model width
        const scanWidth = Math.max(size2.x, size2.z) * 1.4
        ;(scanMesh.geometry as THREE.BufferGeometry).dispose()
        scanMesh.geometry = new THREE.PlaneGeometry(scanWidth, 0.55)

        root.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (!(child.material instanceof THREE.MeshStandardMaterial)) {
              child.material = new THREE.MeshStandardMaterial({
                color: '#f0f0f0',
                roughness: 0.85,
                metalness: 0.0,
              })
            }
          }
        })

        scene.add(root)
        modelRootRef.current = root
        applyArchetype(root, archetypeRef.current, false)

        setTimeout(() => {
          if (onCanvasReady) onCanvasReady(renderer.domElement.toDataURL('image/png'))
        }, 400)
      },
      undefined,
      (err) => console.error('GLTF load error', err)
    )

    // Animation loop
    const SCAN_PERIOD = 3200 // ms per sweep
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      controls.update()

      // Animate scan wave
      if (boundsRef.current) {
        const { top, bottom } = boundsRef.current
        const t = ((Date.now() - scanStartRef.current) % SCAN_PERIOD) / SCAN_PERIOD
        scanMesh.position.y = top - t * (top - bottom)
        scanMesh.lookAt(camera.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Hover callbacks for UI cards
    const onEnter = () => onHoverChange?.(true)
    const onLeave = () => onHoverChange?.(false)
    mount.addEventListener('mouseenter', onEnter)
    mount.addEventListener('mouseleave', onLeave)

    // Resize
    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      controls.dispose()
      mount.removeEventListener('mouseenter', onEnter)
      mount.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Archetype morph
  useEffect(() => {
    archetypeRef.current = archetype
    if (modelRootRef.current) applyArchetype(modelRootRef.current, archetype, true)
  }, [archetype])

  return <div ref={mountRef} className="w-full h-full" />
}
