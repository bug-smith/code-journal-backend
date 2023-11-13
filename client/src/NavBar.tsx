type Props = {
  onEntries: () => void;
};
export function NavBar({ onEntries }: Props) {
  return (
    <header className="header purple-background">
      <div className="container">
        <div className="row">
          <div className="column-full d-flex align-center">
            <h1 className="white-text">Code Journal</h1>
            <h3>
              <button
                type="button"
                onClick={onEntries}
                className="entries-link white-text">
                Entries
              </button>
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}
