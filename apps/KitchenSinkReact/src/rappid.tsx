import * as React from 'react';

import {StencilService} from './services/stencil-service';
import {ToolbarService} from './services/toolbar-service';
import {InspectorService} from './services/inspector-service';
import {HaloService} from './services/halo-service';
import {KeyboardService} from './services/keyboard-service';
import RappidService from './services/kitchensink-service';

import {ThemePicker} from './components/theme-picker';
import {sampleGraphs} from './config/sample-graphs';

interface Props {
}

interface State {
}

class Rappid extends React.Component<Props, State> {

    private rappid: RappidService;
    private elementRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {

        this.rappid = new RappidService(
            this.elementRef.current,
            new StencilService(),
            new ToolbarService(),
            new InspectorService(),
            new HaloService(),
            new KeyboardService()
        );

        this.rappid.startRappid();

        const themePicker = new ThemePicker({ mainView: this.rappid });
        themePicker.render().$el.appendTo(document.body);

        this.rappid.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));
    }

    render() {

        return (
            <div ref={this.elementRef} className="joint-app joint-theme-modern">
                <div className="app-header">
                    <div className="app-title">
                        <h1>Rappid</h1>
                    </div>
                    <div className="toolbar-container"/>
                </div>
                <div className="app-body">
                    <div className="stencil-container"/>
                    <div className="paper-container"/>
                    <div className="inspector-container"/>
                    <div className="navigator-container"/>
                </div>
            </div>
        );
    }
}

export default Rappid;
