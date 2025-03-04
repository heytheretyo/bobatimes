export default function Footer() {
  return (
    <footer className="mt-12 text-center text-xs text-muted-foreground animate-fade-in">
      <p>BobaTimes — Productivity meets idle fun</p>
      <p className="mt-2">
        {" "}
        made by{" "}
        <a
          href="https://nowheretyo.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          @heytheretyo
        </a>
      </p>
    </footer>
  );
}
