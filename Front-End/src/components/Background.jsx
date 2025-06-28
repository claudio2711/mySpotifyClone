export default function Background() {
  return (
    <div
      /* occupa l’intero viewport, resta dietro a tutto (-z-10)               */
      /* e mantiene l’immagine fissa mentre scrolli (bg-fixed)               */
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/sfondo2.png')" }}
    />
  );
}
