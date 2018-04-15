import * as React from 'react';

interface TrustpilotProps {
  templateId?: string;
  businessunit?: string;
  locale?: string;
  height?: string;
  width?: string;
  reviewHref?: string;
}

const defaultProps: TrustpilotProps = {
  templateId: '56278e9abfbbba0bdcd568bc',
  businessunit: "5ad1c7ce618f9c0001ba722d",
  locale: 'en-US',
  height: "52px",
  width: "100%",
  reviewHref: "https://www.trustpilot.com/review/alexvish.github.io"

};

export const TRUSTPILOT_SCRIPT_ID = 'trustpilot-script';

/*

<!-- TrustBox script -->
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
<!-- End Trustbox script -->

<div
  className="trustpilot-widget"
  data-locale="en-US"
  data-template-id="56278e9abfbbba0bdcd568bc"
  data-businessunit-id="5ad1c7ce618f9c0001ba722d"
  data-style-height="52px"
  data-style-width="100%">

<a href="https://www.trustpilot.com/review/alexvish.github.io" target="_blank">Trustpilot</a>

</div>

*/

class Trustpilot extends React.Component<TrustpilotProps> {
  constructor(props:TrustpilotProps, context?:any) {
    super(props, context);
  }
  componentDidMount() {
    let el = document.getElementById(TRUSTPILOT_SCRIPT_ID) as HTMLScriptElement | undefined;
    if (!el) {
      el = document.createElement('script');
      el.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      el.async = true;
      el.id=TRUSTPILOT_SCRIPT_ID;
      document.body.appendChild(el);
    }
  }

  render() {
    const props = defaultProps;
    return (
      <div
        className="trustpilot-widget"
        data-locale={props.locale}
        data-template-id={props.templateId}
        data-businessunit-id={props.businessunit}
        data-style-height={props.height}
        data-style-width={props.width}
      >
        <a href={props.reviewHref} target="_blank">Trustpilot</a>
      </div>
    );
  }
}

export default Trustpilot;