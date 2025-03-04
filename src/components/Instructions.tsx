export default function Instructions() {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:col-span-1 animate-fade-in">
      <h2 className="text-xl font-medium mb-4 text-boba-brown">How to Play</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="bg-secondary rounded-full p-1 mt-0.5">1</span>
          <span>Use the Pomodoro timer for focused work sessions</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="bg-secondary rounded-full p-1 mt-0.5 ">2</div>
          <span>Tap the boba cup to brew tea during breaks</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-secondary rounded-full p-1 mt-0.5">3</span>
          <span>Complete focus sessions to earn bonus boba</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-secondary rounded-full p-1 mt-0.5">4</span>
          <span>Spend your boba on upgrades in the shop</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-secondary rounded-full p-1 mt-0.5">5</span>
          <span>Hire staff to brew boba even while you focus</span>
        </li>
      </ul>
    </div>
  );
}
