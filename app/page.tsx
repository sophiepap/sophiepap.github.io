// "use client";

// import { useState } from "react";
// import RoomScene from "@/components/room/RoomScene";
// import OverlayUI from "@/components/ui/OverlayUI";

// export default function HomePage() {
//   const [activeTarget, setActiveTarget] = useState<string | null>(null);

//   return (
//     <main className="room-page">
//       <RoomScene
//         activeTarget={activeTarget}
//         onTargetChange={setActiveTarget}
//       />
//       <OverlayUI
//         activeTarget={activeTarget}
//         onClose={() => setActiveTarget(null)}
//       />
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import OverlayUI from "@/components/ui/OverlayUI";

const RoomScene = dynamic(
  () => import("@/components/room/RoomScene"),
  {
    ssr: false,
    loading: () => (
      <div className="room-loading">
        Loading room...
      </div>
    ),
  }
);

export default function HomePage() {
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  return (
    <main className="room-page">
      <RoomScene
        activeTarget={activeTarget}
        onTargetChange={setActiveTarget}
      />

      <OverlayUI
        activeTarget={activeTarget}
        onClose={() => setActiveTarget(null)}
      />
    </main>
  );
}