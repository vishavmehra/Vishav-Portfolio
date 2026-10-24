import { GameCanvas } from '@/game/GameCanvas'
import { ExitHud } from '@/ui/exit/ExitHud'
import { InteractButton } from '@/ui/controls/InteractButton'
import { DestinationWindow } from '@/ui/destination/DestinationWindow'
import { MovementJoystick } from '@/ui/controls/MovementJoystick'
import { CompassHUD } from '@/ui/hud/CompassHUD'
import { ControlsTutorial } from '@/ui/hud/ControlsTutorial'
import { TimeOfDayControl } from '@/ui/hud/TimeOfDayControl'
import { InteractionPrompt } from '@/ui/interaction/InteractionPrompt'
import { LoadingScreen } from '@/ui/loading/LoadingScreen'
import { WhenEntered } from '@/ui/loading/WhenEntered'

export default function Page() {
  return (
    <main className="fixed inset-0">
      <GameCanvas />
      {/* The world is on screen from the first frame now, so the HUD waits for the
          visitor to cross the threshold rather than sitting on top of the title. */}
      <WhenEntered>
        <CompassHUD />
        <TimeOfDayControl />
        <InteractionPrompt />
        <MovementJoystick />
        <InteractButton />
        <ControlsTutorial />
        <ExitHud />
        <DestinationWindow />
      </WhenEntered>
      <LoadingScreen />
    </main>
  )
}
