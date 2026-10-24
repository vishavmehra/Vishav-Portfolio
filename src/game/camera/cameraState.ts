import { CAMERA_YAW } from '@/game/config'

/**
 * The heading the camera currently views the world from, written by FollowCamera
 * each frame and read by PlayerController so movement stays camera-relative.
 *
 * `yaw` places the camera at (sin yaw, cos yaw) from the player on the ground
 * plane, so it looks along (-sin yaw, -cos yaw). Pitch is deliberately absent:
 * ground movement never depends on how far up or down the camera is looking.
 *
 * A mutable module object, not React state (CLAUDE.md §29), like playerPosition.
 */
export const cameraView = { yaw: CAMERA_YAW }
