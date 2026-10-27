/** Tiny self-playing UI bits: a toggle, a slider and a button (pure CSS loops) */
export default function UiPlayground() {
  return (
    <div className="ui-playground" aria-hidden="true">
      <div className="ui-row">
        <span className="ui-toggle"><span className="ui-toggle-knob" /></span>
        <span className="ui-slider"><span className="ui-slider-fill" /></span>
      </div>
      <div className="ui-row">
        <span className="ui-button">Send</span>
        <span className="ui-skeleton">
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}
