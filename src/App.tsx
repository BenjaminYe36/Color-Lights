import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {Button, Col, Row, Slider, Tooltip} from "antd";
import {PoweroffOutlined} from "@ant-design/icons";

interface AppStates {
    backgroundColor: string[]; // background color array
    curIndex: number; // current index of background color shown
    isOn: boolean; // state that reflects on or off of the flashing
    freq: number; // flashing frequency in Hz
    intervalId: any; // intervalId returned by setInterval
}

class App extends Component<{}, AppStates> {

    constructor(props: any) {
        super(props);
        this.state = {
            backgroundColor: ['#ffffff', '#f5222d', '#fadb14', '#13c2c2', '#eb2f96', '#52c41a', '#1890ff'],
            curIndex: 0,
            isOn: false,
            freq: 11,
            intervalId: 0,
        };
    }

    componentDidMount() {
        document.body.style.backgroundColor = this.state.backgroundColor[this.state.curIndex];
    }

    getTooltipTitle = () => {
        if (this.state.isOn) {
            return (<span>Turn off</span>);
        } else {
            return (<span>Turn on</span>);
        }
    }

    changeColor = () => {
        let nextIdx = 0;
        if (this.state.curIndex < this.state.backgroundColor.length - 1) {
            nextIdx = this.state.curIndex + 1;
        } // circle back to 0 idx otherwise
        this.setState({
            curIndex: nextIdx,
        });
        document.body.style.backgroundColor = this.state.backgroundColor[nextIdx];
    }

    handleClick = () => {
        let newState = !this.state.isOn;
        this.setState({
            isOn: newState,
        });
        if (newState) { // from off -> on case
            let intervalId = setInterval(this.changeColor, 1000 / this.state.freq);
            this.setState({
                intervalId: intervalId,
            });
        } else { // from on -> off case
            clearInterval(this.state.intervalId);
            this.setState({
                intervalId: 0,
                curIndex: 0,
            });
            document.body.style.backgroundColor = this.state.backgroundColor[0];
        }
    }

    handleSlide = (value: number) => {
        if (this.state.isOn) { // need to clear old interval and create new ones with new frequency
            clearInterval(this.state.intervalId);
            let intervalId = setInterval(this.changeColor, 1000 / value);
            this.setState({
                intervalId: intervalId,
            });
        }
        this.setState({
            freq: value,
        });
    }

    render() {
        return (
            <div>
                <Row justify="center" style={{position: 'absolute', bottom: '100px', width: '100%'}}>
                    <Col span={6}>
                        <span style={{textAlign: 'center'}}>Flash Frequency (in Hz):</span>
                        <Slider
                            min={1}
                            max={30}
                            value={this.state.freq}
                            onChange={this.handleSlide}
                        />
                    </Col>
                </Row>
                <div id="footer">
                    <Tooltip title={this.getTooltipTitle()}>
                        <Button type="primary"
                                shape="circle"
                                icon={<PoweroffOutlined/>}
                                size="large"
                                onClick={this.handleClick}/>
                    </Tooltip>
                </div>
            </div>
        );
    }
}

export default App;
